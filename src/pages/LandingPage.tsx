import landingSvg from "../assets/landing page.svg";
import { Link } from "react-router-dom";
import { ROUTES } from "../utils/routes";

const LandingPage = () => {
  return (
    <div className="relative w-full">
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-white">
        <div className="font-bold text-xl text-black">QubitX</div>

        <div className="flex gap-6 text-black text-sm">
          <a href="#">Product</a>
          <a href="#">AI Tutor</a>
          <a href="#">How it works</a>
          <a href="#">Community</a>
          <a href="#">Institutions</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to={ROUTES.login} className="text-black text-sm hover:opacity-70 transition-opacity">
            Log in
          </Link>
          <Link
            to={ROUTES.signup}
            className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      <Link to={ROUTES.signup} className="block cursor-pointer">
        <img
          src={landingSvg}
          alt="QubitX landing page"
          className="w-full block"
        />
      </Link>
    </div>
  );
};

export default LandingPage;