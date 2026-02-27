import React from "react";
import { Link, useLocation } from "react-router";
import {
  BarChart3,
  Users,
  ClipboardList,
  Activity,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Building2,
  FolderKanban,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen, role } = useApp();
  const location = useLocation();
  console.log("Current role in Sidebar:", role);
  const navItems = [
    {
      icon: BarChart3,
      label: "Dashboard",
      path: "/dashboard",
      roles: ["department", "citizen", "operator", "admin"],
    },
    { icon: Building2, label: "Departments", path: "/departments", roles: ["admin"] },
    { icon: FolderKanban, label: "Categories", path: "/categories", roles: ["admin"] },
    {
      icon: Users,
      label: "Operators",
      path: "/operators",
      roles: ["department", "admin", "operator"],
    },
    {
      icon: ClipboardList,
      label: "Complaints",
      path: "/complaints",
      roles: ["department", "operator", "admin"],
    },
    { icon: ClipboardList, label: "My Complaints", path: "/complaints", roles: ["citizen"] },
    {
      icon: Activity,
      label: "Activity Log",
      path: "/activity",
      roles: ["department", "citizen", "operator", "admin"],
    },
    {
      icon: User,
      label: "Profile",
      path: "/profile",
      roles: ["department", "citizen", "operator", "admin"],
    },
  ];
  return (
    <div
      className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
    >
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            CP
          </div>
          {sidebarOpen && <span className="font-bold text-lg text-gray-900">CivicPulse</span>}
        </div>
      </div>

      {sidebarOpen && (
        <div className="px-6 py-4 border-b border-gray-200">
          <p className="text-xs text-gray-500">Logged in as</p>
          {role === "department" && (
            <p className="font-semibold text-gray-900 text-sm mt-1">Department Admin</p>
          )}
          {role === "citizen" && (
            <p className="font-semibold text-gray-900 text-sm mt-1">Citizen</p>
          )}
          {role === "operator" && (
            <p className="font-semibold text-gray-900 text-sm mt-1">Operator</p>
          )}
          {role === "admin" && (
            <p className="font-semibold text-gray-900 text-sm mt-1">System Admin</p>
          )}
        </div>
      )}

      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {navItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200 space-y-2">
        <button
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ${!sidebarOpen && "justify-center"}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
