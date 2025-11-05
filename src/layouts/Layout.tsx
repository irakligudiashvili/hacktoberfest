import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => (
  <>
    <Outlet />
    <Navbar />
  </>
);

export default Layout;
