import {
  leadSubmissionSchema,
  surveySubmissionSchema,
  type LeadSubmission,
  type SubmissionReceipt,
  type SurveySubmission,
} from "@autovend/contracts";

/* Stub submission adapter — Phase 1 stand-in for POST /api/v1/leads|surveys.
 * It validates with the exact contract schemas the real API will use, honors
 * the Idempotency-Key semantics, and simulates latency/failure so the forms
 * are built against reality. Deleted when the endpoints flip to HTTP
 * (ROADMAP Phase 2: "every flip deletes the fixture it replaces"). */

export interface SubmitOptions {
  idempotencyKey: string;
}

export interface SubmissionApi {
  submitLead(input: LeadSubmission, opts: SubmitOptions): Promise<SubmissionReceipt>;
  submitSurvey(input: SurveySubmission, opts: SubmitOptions): Promise<SubmissionReceipt>;
}

export interface StubOptions {
  delayMs?: number;
  failRate?: number;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function makeRef(prefix: "L" | "S"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export function createStubSubmissionApi(options: StubOptions = {}): SubmissionApi {
  const { delayMs = 650, failRate = 0 } = options;
  const seen = new Map<string, SubmissionReceipt>();

  async function accept(prefix: "L" | "S", key: string): Promise<SubmissionReceipt> {
    await sleep(delayMs);
    if (Math.random() < failRate) {
      throw new Error("The submission service is unavailable. Nothing was saved — try again.");
    }
    const replay = seen.get(key);
    if (replay) return replay;
    const receipt: SubmissionReceipt = {
      id: makeRef(prefix),
      receivedAt: new Date().toISOString(),
    };
    seen.set(key, receipt);
    return receipt;
  }

  return {
    async submitLead(input, opts) {
      leadSubmissionSchema.parse(input);
      return accept("L", opts.idempotencyKey);
    },
    async submitSurvey(input, opts) {
      surveySubmissionSchema.parse(input);
      return accept("S", opts.idempotencyKey);
    },
  };
}
