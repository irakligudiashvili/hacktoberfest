import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/dashboard">
      <div className="flex items-center">
        <img src="/consensus-logo.png" alt="logo" className="w-[30px]" />
        <div className="text-lg font-semibold text-foreground">CONSENSUS</div>
      </div>
    </Link>
  );
}
