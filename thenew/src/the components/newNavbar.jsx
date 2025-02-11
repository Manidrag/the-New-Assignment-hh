import { useEffect, useState } from "react";
import { FiSearch, FiMic, FiTrash2, FiEdit, FiVolume2, FiPlus, FiX, FiUser } from "react-icons/fi";
import { FaRegCopy } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
export function NotesDashboard() {
 
 
  const [user, setUser] = useState({ name: "Username", isSignedIn: false});
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
        });
    }

  }
  ,[]); 


  return (
    <div className="flex h-screen bg-gray-100 ">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 shadow-md sm:translate-x-0  transition-transform -translate-x-full">
        <h2 className="text-xl font-bold">AI Notes</h2>
        <nav className="mt-4">
          <NavLink to="/Signin" className="block py-2 px-3 rounded-lg bg-purple-100">Login</NavLink>
          <NavLink to="SignUp" className="block py-2 px-3 mt-2 rounded-lg">Signup</NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Navbar */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 shadow-md rounded-lg">
          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 border rounded-lg" />
          </div>
          <button className="bg-gray-200 px-3 py-1 rounded-lg">Sort</button>
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center px-3 py-1 border rounded-lg">
              <FiUser className="text-gray-600 mr-2" /> {user.name}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg p-2">
                <NavLink to="#" className="block px-4 py-2 hover:bg-gray-100"> Login</NavLink>
                <NavLink to="#" className="block px-4 py-2 hover:bg-gray-100">Signup</NavLink>
              </div>
            )}
          </div>
        </div>

       
        <div className="grid grid-cols-2 gap-4">    <Outlet />
        </div>
      </main>
    </div>
  );
}
