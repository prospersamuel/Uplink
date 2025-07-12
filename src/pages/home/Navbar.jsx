import { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useApp } from "../../context/Appcontext";
import { CiMenuFries } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogIn } from "react-icons/fi";
import logo from '../../assets/logo.png'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { toggleTheme, theme, openLogin } = useApp();
  const [hoveredLink, setHoveredLink] = useState(null);

  const navLinks = [
    { label: "Features", path: "#features" },
    { label: "How It Works", path: "#howitworks" },
    { label: "Pricing", path: "#pricing" },
    { label: "Policies", path: "#policies" },
    { label: "FAQ", path: "#faq" },
    { label: "Contact Us", path: "#contact" },
  ];

  return (
    <header className="w-full fixed top-0 z-50 bg-white/20 dark:bg-slate-900/20 backdrop-blur-xl shadow-sm border-b border-white/10 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* App Name */}
        <a
          href="#"
          className="text-2xl animate-slide-in-left font-extrabold text-neutral-900 dark:text-white tracking-tight"
        >
          <img src={logo} width={50} alt="logo" />
          {/* Up<span className="text-primary">Link</span> */}
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map(({ label, path }) => (
            <motion.div
              key={path}
              onHoverStart={() => setHoveredLink(path)}
              onHoverEnd={() => setHoveredLink(null)}
              className="relative"
            >
              <a
                href={path}
                className={`text-neutral-800 dark:text-neutral-300 font-medium transition-colors ${
                  hoveredLink === path ? "text-primary dark:text-primary" : ""
                }`}
              >
                {label}
              </a>
              {hoveredLink === path && (
                <motion.div
                  layoutId="navHover"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.div>
          ))}
          {/* Login button */}
          {/* Desktop Login Button */}
          <motion.button
            onClick={() => {
              openLogin();
              setMenuOpen(false);
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-cyan-500 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all text-lg"
          >
            Login <FiLogIn size={14} />
          </motion.button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-4 p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-slate-700 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="text-2xl font-extrabold">
            <CiMenuFries />
          </span>
        </button>
      </div>

      {/* Mobile Nav Menu */}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden top-0 px-4 pb-4 space-y-2 bg-neutral-100 absolute flex justify-center items-center flex-col w-[100%] h-[100vh] dark:bg-slate-900 backdrop-blur-md"
          >
            <button
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-slate-700 transition"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>
            <button
              className="absolute top-3 font-extrabold right-3"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="text-5xl">×</span>
            </button>
            {navLinks.map((link, i) => (
              <a
                href={link.path}
                key={i}
                onClick={() => setMenuOpen(false)}
                className="block text-3xl font-semibold transition text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-slate-700"
              >
                {link.label}
              </a>
            ))}

            <motion.button
              onClick={() => {
                openLogin();
                setMenuOpen(false);
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-cyan-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all text-lg"
            >
              Login <FiLogIn size={14} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
