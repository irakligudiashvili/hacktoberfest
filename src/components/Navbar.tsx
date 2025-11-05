import { CircleDashed, LayoutGrid } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="fixed bottom-0 bg-white shadow-lg w-full z-50">
      <div className="max-w-xl px-20 mx-auto py-5 flex items-center justify-between">
        <NavLink
          to="/action"
          className={({ isActive }) =>
            `transition-colors ${isActive ? "text-blue-600" : "text-gray-400"}`
          }
        >
          <LayoutGrid className="w-6 h-6" />
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `transition-colors ${isActive ? "text-blue-600" : "text-gray-400"}`
          }
        >
          <CircleDashed className="w-6 h-6" />
        </NavLink>
      </div>
    </header>
  );
};

export default Navbar;
