import React from "react";

import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import Header from "../../components/Header";
import SideBar from "../../components/SlideBar";

const AdminLayout = () => {
  return (
    <div>
      <Header />
      <div className="flex pt-16 overflow-hidden bg-white">
        <SideBar />
        <div
          className="fixed inset-0 z-10 hidden bg-gray-900 opacity-50"
          id="sidebarBackdrop"
        ></div>

        <div
          id="main-content"
          className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64"
        >
          <Outlet />
        </div>
      </div>
      <div>
        <Toaster />
      </div>
    </div>
  );
};

export default AdminLayout;