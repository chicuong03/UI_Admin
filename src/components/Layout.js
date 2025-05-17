import React from "react";
import { Outlet } from "react-router-dom";
import SidebarNav from "./SidebarNav";

const Layout = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <SidebarNav />
            <main style={{ flexGrow: 1, padding: '20px', overflowX: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
