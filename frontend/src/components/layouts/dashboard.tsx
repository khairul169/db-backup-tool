import { Outlet } from "react-router-dom";
import Sidebar from "../containers/sidebar";
import { Suspense } from "react";

const DashboardLayout = () => {
  return (
    <div className="h-screen overflow-hidden flex items-stretch">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-primary-50/50 p-4 sm:p-8">
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default DashboardLayout;
