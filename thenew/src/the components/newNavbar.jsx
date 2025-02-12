import { useEffect, useState } from "react";
import { FiSearch, FiUser } from "react-icons/fi";
import { NavLink, Outlet } from "react-router-dom";

export function NotesDashboard() {
  const [user, setUser] = useState({ name: "Username", isSignedIn: false });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/Home", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser({ name: data.name, isSignedIn: true });
        })
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 shadow-md fixed top-0 left-0 h-screen overflow-y-auto transition-transform duration-300">
        <h2 className="text-xl font-bold text-center">AI Notes</h2>
        <nav className="mt-6 space-y-4">
          <NavLink
            to="/Signin"
            className="block py-2 px-3 rounded-lg bg-purple-100 text-center transition-colors hover:bg-purple-200"
          >
            Login
          </NavLink>
          <NavLink
            to="/SignUp"
            className="block py-2 px-3 rounded-lg bg-purple-100 text-center transition-colors hover:bg-purple-200"
          >
            Signup
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6 overflow-y-auto">
        {/* Navbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 bg-white p-4 shadow-md rounded-lg transition-all duration-300">
          <div className="relative w-full sm:w-1/2 mb-4 sm:mb-0">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-3 py-1 bg-gray-200 rounded-lg transition-colors hover:bg-gray-300">
              Sort
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center px-3 py-1 border rounded-lg transition-colors hover:bg-gray-200"
              >
                <FiUser className="text-gray-600 mr-2" /> {user.name}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 z-10 transition-all duration-300">
                  <NavLink
                    to="/Signin"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/SignUp"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Signup
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Outlet */}
        <div className="grid grid-cols-1 gap-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
