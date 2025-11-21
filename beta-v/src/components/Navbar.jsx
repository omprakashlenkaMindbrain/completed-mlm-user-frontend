import { AnimatePresence, motion } from "framer-motion";
import {
  CreditCard,
  FileText,
  LogIn,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/bmpl.jpg";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {

  const PRIMARY_NAVY="#1B436D"

  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth(); 

  const navLinksAfterLogin = [
    { name: "KYC", path: "/kyc", icon: FileText },
    { name: "Plans", path: "/plans", icon: CreditCard },
    //  { name: "Wallet", path: "/wallet", icon: Wallet },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const navLinks = isLoggedIn ? navLinksAfterLogin : [];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const handleMobileLinkClick = () => setIsOpen(false);

  return (
    <nav
      className="w-full shadow-md transition-all duration-300"
      style={{
        // 1. PRIMARY COLOR for Background (Dark Blue)
        background: `linear-gradient(90deg, ${PRIMARY_NAVY}, ${PRIMARY_NAVY}CC)`,
        borderBottomLeftRadius: "12px",
        borderBottomRightRadius: "12px",
        overflow: "hidden",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 py-3 flex justify-between items-center relative">
        {/* Logo Section */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <motion.img
            whileHover={{ rotate: 10, scale: 1.05 }}
            src={Logo}
            alt="BMPL Logo"
            className="w-12 h-12 object-contain rounded-full border-2 bg-white shadow-sm"
            style={{ 
                // 2. SECONDARY COLOR for Logo Border (Yellow/Orange)
                borderColor: "#FFC300" 
            }}
          />
          <motion.span
            whileHover={{ scale: 1.1 }}
            className="font-bold text-2xl tracking-wide text-white"
            style={{ textShadow: "0 0 10px rgba(255,255,255,0.3)" }}
          >
            BMPL
          </motion.span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 relative">
          {navLinks.map(({ name, path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <motion.div
                key={name}
                className="relative cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  to={path}
                  className="flex items-center gap-2 font-semibold text-white transition-all duration-300"
                  style={{ 
                    // Hover/Active Text Color: SECONDARY COLOR (Yellow/Orange)
                    color: isActive ? "#FFC300" : "white",
                    "&:hover": { color: "#FFC300" } 
                  }}
                >
                  <Icon size={18} />
                  {name}
                </Link>

                {isActive && (
                  <motion.span
                    layoutId="underline"
                    className="absolute left-0 -bottom-1 h-1 bg-gradient-to-r rounded-full"
                    style={{ 
                        width: "100%", 
                        // Active Underline: Gradient with SECONDARY COLOR (Yellow/Orange)
                        background: "linear-gradient(90deg, #FFC300, white, #FFC300)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </motion.div>
            );
          })}

          {/* Auth Buttons */}
          {isLoggedIn ? (
            <motion.button
              onClick={handleLogout}
              whileHover={{
                scale: 1.05,
              }}
              className="ml-4 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md flex items-center gap-2 transition"
              style={{
                backgroundColor: "#FFC300", 
                color:"#1A3B7A",
                cursor:"pointer"
              }}
            >
              <LogOut size={18} />
              Logout
            </motion.button>
          ) : (
            <Link
              to="/login"
              className="ml-4 px-5 py-2.5 rounded-xl font-semibold shadow-md flex items-center gap-2 transition hover:opacity-90"
              style={{
                // SECONDARY COLOR for Login Button BG (Yellow/Orange)
                backgroundColor: "#FFC300",
                // PRIMARY COLOR for Login Button Text (Dark Blue)
                color: "#1A3B7A" 
              }}
            >
              <LogIn size={18} />
              Login
            </Link>
          )}
        </div>

        {/* ✅ Mobile Menu Toggle */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ✅ Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{
                // Mobile Menu BG: Gradient from PRIMARY to ACCENT
                background: "linear-gradient(to bottom, #1A3B7A, #00A389)" 
            }}
          >
            <div className="flex flex-col gap-4 px-6 py-4 font-medium">
              {navLinks.map(({ name, path, icon: Icon }) => (
                <Link
                  key={name}
                  to={path}
                  onClick={handleMobileLinkClick}
                  className="text-white flex items-center gap-2 transition-colors"
                  style={{
                    // Hover Text Color: SECONDARY COLOR (Yellow/Orange)
                    "&:hover": { color: "#FFC300" } 
                  }}
                >
                  <Icon size={18} />
                  {name}
                </Link>
              ))}

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl font-semibold shadow-md w-full flex items-center justify-center gap-2 hover:opacity-90"
                  style={{
                    // SECONDARY COLOR for Mobile Logout BG (Yellow/Orange)
                    backgroundColor: "#FFC300",
                    // PRIMARY COLOR for Mobile Logout Text (Dark Blue)
                    color: "#1A3B7A"
                  }}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={handleMobileLinkClick}
                  className="px-5 py-2.5 rounded-xl font-semibold shadow-md w-full flex items-center justify-center gap-2 hover:opacity-90"
                  style={{
                    // ACCENT COLOR for Mobile Login BG (Teal/Cyan)
                    backgroundColor: "#00A389",
                    // Text Color: White
                    color: "white" 
                  }}
                >
                  <LogIn size={18} />
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;