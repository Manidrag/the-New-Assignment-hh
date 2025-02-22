import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaStar } from "react-icons/fa";

export function Sidebar({ showFavourites, setShowFavourites,newdata }) {
  return (
    <>
      {/* AI Notes Text (Mobile Only) */}
      <div className="md:hidden flex items-center justify-center h-16 bg-gray-800 text-white shadow-md">
        <span className="text-2xl font-semibold tracking-wider uppercase">
          AI <span className="text-purple-400">Notes</span>
        </span>
      </div>

      <motion.aside
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl overflow-y-auto z-20 md:relative md:h-auto md:block hidden"
      >
        {/* Logo and Brand */}
        <div className="flex items-center justify-center h-20 bg-gray-900 bg-opacity-20 border-b border-gray-700">
          <span className="text-2xl font-semibold tracking-wider uppercase">
            AI <span className="text-purple-400">Notes</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 px-2">
          <div className="space-y-2">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-200 ease-in-out
                ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md"
                    : "hover:bg-gray-700 hover:text-gray-200"
                }`
              }
              onClick={() => setShowFavourites(false)}
            >
              <FaHome className="h-5 w-5" />
              <span>Home</span>
            </NavLink>

            <button
              onClick={() => setShowFavourites(true)}
              className={`flex items-center space-x-3 py-3 px-4 w-full rounded-lg transition duration-200 ease-in-out text-left cursor-pointer
                ${
                  showFavourites
                    ? "bg-yellow-500 text-gray-900 shadow-md"
                    : "hover:bg-gray-700 hover:text-gray-200"
                }`}
            >
              <FaStar className="h-5 w-5" />
              <span>Favorites</span>
            </button>
          </div>
        </nav>

        {/* Optional: User Profile at the Bottom */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-700 md:relative">
          <div className="flex items-center space-x-4">
           
            <div>
              <h4 className="text-sm font-semibold">{localStorage.getItem("name")}</h4>
              <p className="text-xs text-gray-400">{newdata}</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}