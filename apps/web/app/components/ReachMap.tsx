import { useState } from "react";
import type { RegionView } from "@autovend/contracts";

/* US reach map — ported from prototype/map.jsx; regions come in as a prop so
 * the component is data-source agnostic (demo data now, public API later). */

const US_PATH =
  "M 110 130 L 130 115 L 165 110 L 195 120 L 220 135 L 240 130 L 260 145 L 280 145 L 300 155 L 330 155 L 360 165 L 380 165 L 400 155 L 420 155 L 445 145 L 475 135 L 510 130 L 545 130 L 580 135 L 610 130 L 640 125 L 670 130 L 700 135 L 735 130 L 765 130 L 800 130 L 830 135 L 855 145 L 875 165 L 885 195 L 895 225 L 905 250 L 905 275 L 895 300 L 880 320 L 870 345 L 855 365 L 830 380 L 805 400 L 790 420 L 800 445 L 815 470 L 815 495 L 800 510 L 785 510 L 770 500 L 760 510 L 750 525 L 735 530 L 720 525 L 700 520 L 680 510 L 660 500 L 640 490 L 615 480 L 595 480 L 575 485 L 555 480 L 535 470 L 515 460 L 490 455 L 470 450 L 445 445 L 420 445 L 395 450 L 370 450 L 345 445 L 320 440 L 300 430 L 285 415 L 270 400 L 255 385 L 240 370 L 225 360 L 210 350 L 200 335 L 195 315 L 190 295 L 180 275 L 170 260 L 165 240 L 160 220 L 150 200 L 140 180 L 125 160 L 115 145 Z";

export function ReachMap({
  regions,
  compact = false,
  onSelect,
  selected,
}: {
  regions: RegionView[];
  compact?: boolean;
  onSelect?: (region: RegionView) => void;
  selected?: RegionView | null;
}) {
  const [hover, setHover] = useState<RegionView | null>(null);
  const active = regions.filter((r) => r.status === "active");
  const expansion = regions.filter((r) => r.status === "expansion");

  return (
    <div className="map-wrap" style={{ padding: compact ? 16 : 32 }}>
      {!compact && (
        <div className="meta-row" style={{ marginBottom: 16 }}>
          <span>
            <span className="dot" /> {active.length} active hubs
          </span>
          <span>
            <span className="dot idle" /> {expansion.length} expansion zones
          </span>
          <span style={{ marginLeft: "auto" }}>NO GRANULAR ADDRESSES · REGIONAL ONLY</span>
        </div>
      )}
      <svg
        viewBox="0 0 1000 600"
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="AutoVend US reach map"
      >
        <defs>
          <radialGradient id="dens" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
            <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <pattern
            id="hatch"
            patternUnits="userSpaceOnUse"
            width="6"
            height="6"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="6"
              stroke="var(--ink-4)"
              strokeWidth="0.6"
              opacity="0.4"
            />
          </pattern>
        </defs>

        <path d={US_PATH} fill="var(--bg-sunken)" stroke="var(--rule-2)" strokeWidth="1" />

        {active.map((r) => (
          <circle
            key={"d" + r.id}
            cx={r.mapX}
            cy={r.mapY}
            r={28 + r.density * 50}
            fill="url(#dens)"
            pointerEvents="none"
          />
        ))}

        {expansion.map((r) => (
          <g
            key={"e" + r.id}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHover(r)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onSelect?.(r)}
          >
            <circle
              cx={r.mapX}
              cy={r.mapY}
              r="22"
              fill="url(#hatch)"
              stroke="var(--ink-4)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          </g>
        ))}

        {active.map((r) => {
          const isSel = selected?.id === r.id;
          const isHover = hover?.id === r.id;
          return (
            <g
              key={"h" + r.id}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHover(r)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect?.(r)}
            >
              <circle
                cx={r.mapX}
                cy={r.mapY}
                r={isSel || isHover ? 9 : 6}
                fill="var(--accent)"
                stroke="var(--bg)"
                strokeWidth="2"
              />
              {(isSel || isHover) && (
                <g>
                  <rect
                    x={r.mapX + 12}
                    y={r.mapY - 22}
                    width={r.name.length * 7 + 24}
                    height="20"
                    rx="4"
                    fill="var(--ink)"
                  />
                  <text
                    x={r.mapX + 18}
                    y={r.mapY - 8}
                    fill="var(--bg)"
                    style={{ font: "11px var(--font-mono)", letterSpacing: ".03em" }}
                  >
                    {r.name.toUpperCase()} · {r.state}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {hover && hover.status === "expansion" && (
          <g>
            <rect
              x={hover.mapX + 12}
              y={hover.mapY - 22}
              width={hover.name.length * 7 + 80}
              height="20"
              rx="4"
              fill="var(--ink)"
            />
            <text
              x={hover.mapX + 18}
              y={hover.mapY - 8}
              fill="var(--bg)"
              style={{ font: "11px var(--font-mono)", letterSpacing: ".03em" }}
            >
              {hover.name.toUpperCase()} · COMING SOON
            </text>
          </g>
        )}

        <g
          transform="translate(40, 540)"
          style={{ font: "10px var(--font-mono)", fill: "var(--ink-3)", letterSpacing: ".05em" }}
        >
          <text>N ↑</text>
        </g>
      </svg>
      {!compact && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span className="meta">FIG · 01 — REGIONAL DENSITY · DEMO DATA · NOT TO SCALE</span>
          <span className="meta">UPDATED · MAY 03 2026</span>
        </div>
      )}
    </div>
  );
}
