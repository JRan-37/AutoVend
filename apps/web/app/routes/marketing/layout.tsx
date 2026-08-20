import { Outlet } from "react-router";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { DevTweaks } from "../../components/DevTweaks";

export default function MarketingLayout() {
  return (
    <>
      <a href="#main" className="sr">
        Skip to main content
      </a>
      <Header />
      <div id="main">
        <Outlet />
      </div>
      <Footer />
      {import.meta.env.DEV && <DevTweaks />}
    </>
  );
}
