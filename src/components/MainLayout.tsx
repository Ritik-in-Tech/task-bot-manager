import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { logout } from "../slices/authSlice";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/bot-status", label: "Bot Status" },
  { to: "/task-allocation", label: "Task Allocation" },
  { to: "/task-queue", label: "Task Queue" },
  { to: "/analytics", label: "Analytics" },
  { to: "/map", label: "Map" },
];

const HamburgerIcon = () => (
  <svg
    width={28}
    height={28}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (drawerOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [drawerOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
    setDrawerOpen(false);
  };

  const handleLinkClick = () => {
    setDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen min-h-screen w-48 bg-sidebar border-r border-sidebar-border p-4 gap-4 justify-between z-20">
        <div>
          <span className="font-bold text-xl mb-6 block text-sidebar-primary">
            WarehouseBot
          </span>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded px-3 py-2 text-left text-sidebar-foreground hover:bg-sidebar-accent transition ${
                    isActive || pathname === link.to
                      ? "bg-sidebar-accent font-semibold"
                      : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex flex-col items-center gap-2 mt-8 border-t border-sidebar-border pt-4">
          <span className="text-sm text-sidebar-primary font-semibold">
            {auth.user?.username || "-"}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleLogout}
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </aside>

      <nav className="flex md:hidden w-full bg-sidebar border-b border-sidebar-border px-2 py-1 items-center sticky top-0 z-40">
        <div className="flex flex-row justify-between w-full items-center">
          <span className="font-bold text-lg text-sidebar-primary pl-1">
            WarehouseBot
          </span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            className="p-1"
          >
            <HamburgerIcon />
          </Button>
        </div>

        {drawerOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 transition-all"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border shadow-lg z-50 flex flex-col justify-between animate-in slide-in-from-left duration-200 max-w-[95vw]">
              <div className="flex flex-col gap-4 p-5 pt-7 pb-5">
                <nav className="flex flex-col gap-2 mt-2">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={handleLinkClick}
                      className={({ isActive }) =>
                        `rounded px-4 py-3 text-lg text-left text-sidebar-foreground hover:bg-sidebar-accent transition ${
                          isActive || pathname === link.to
                            ? "bg-sidebar-accent font-semibold"
                            : ""
                        }`
                      }
                      style={{ minHeight: 48 }}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>
              </div>
              <div className="flex flex-col items-center gap-2 mb-5 border-t border-sidebar-border pt-4 px-5">
                <span className="text-sm text-sidebar-primary font-semibold">
                  {auth.user?.username || "-"}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            </div>
          </>
        )}
      </nav>
      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 transition-all md:ml-48 w-full min-h-[calc(100vh-60px)] md:min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-7xl"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default MainLayout;
