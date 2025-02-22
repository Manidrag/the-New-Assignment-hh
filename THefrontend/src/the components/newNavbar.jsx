import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

export function NotesDashboard() {
  const [user, setUser] = useState({ name: "Username", isSignedIn: false });
  const location = useLocation();
 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://the-backend-by8h.onrender.com/home", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser({ name: data.name, isSignedIn: true });
        })
        .catch((err) => console.error(err));
    }
  }, []);

  // Check if current route is for authentication
  const isAuthRoute =
    location.pathname.toLowerCase() === "/signin" ||
    location.pathname.toLowerCase() === "/signup";

  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-700 to-purple-700 flex flex-col">
        {/* AI Notes Heading at the top */}
        <header className="py-8 text-center">
          <h1 className="text-4xl font-bold text-white">AI Notes</h1>
        </header>
        {/* Full-screen authentication view */}
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }

  // Default dashboard view (non-auth routes)
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex flex-col">
      {/* Header */}
      <header className="py-12 text-center px-4">
        <h2 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          AI Notes
        </h2>
        <p className="mt-4 text-lg md:text-xl text-white/90">
          This is a demo project. Do not put sensitive information.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="max-w-5xl w-full">
          <div className="flex flex-col md:flex-row gap-10 justify-center">
            {/* Sign In Card */}
            <div className="w-full md:w-96 bg-white/90 backdrop-blur-none md:backdrop-blur-md p-10 border border-white/30 rounded-2xl shadow-2xl transform transition duration-500 hover:scale-105">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Sign In
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Welcome back! Sign in to access your notes and stay organized.
              </p>
              <NavLink
                to="/signin"
                className="block text-center py-3 px-4 text-white bg-blue-600 rounded-lg font-medium text-base hover:bg-blue-700 transition-colors duration-300"
              >
                Sign In
              </NavLink>
            </div>
            {/* Sign Up Card */}
            <div className="w-full md:w-96 bg-white/90 backdrop-blur-none md:backdrop-blur-md p-10 border border-white/30 rounded-2xl shadow-2xl transform transition duration-500 hover:scale-105">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Sign Up
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                New here? Create an account to start managing your notes.
              </p>
              <NavLink
                to="/signup"
                className="block text-center py-3 px-4 text-white bg-green-600 rounded-lg font-medium text-base hover:bg-green-700 transition-colors duration-300"
              >
                Sign Up
              </NavLink>
            </div>
          </div>

          {/* Additional Content */}
          <div className="mt-12 bg-white/80 backdrop-blur-none md:backdrop-blur-md p-8 rounded-2xl shadow-lg">
            <h4 className="text-xl font-bold text-gray-800 mb-3">
              About AI Notes
            </h4>
            <p className="text-gray-700 text-sm md:text-base">
              AI Notes is a simple, elegant note-taking app designed with modern UI and responsive components. Whether you're on a mobile device or a desktop, enjoy a seamless experience with quick access to your notes. Explore the features, manage your ideas, and stay organized—all with a touch of style.
            </p>
          </div>
        </div>

        
       
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-white text-sm">
        &copy; {new Date().getFullYear()} AI Notes. All rights reserved.
      </footer>
    </div>
  );
}
