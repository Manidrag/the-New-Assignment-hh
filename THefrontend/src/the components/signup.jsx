
import { useState } from "react";
import { Link } from "react-router-dom";

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [name,setName]=useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://the-backend-by8h.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password,name}),
      });
      const data = await res.json();
      setLoading(false);
      if (data.message === "user created") {
        alert("User created successfully!");
        window.location.href = "/signin";
      } else {
        alert(data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return ( <div className="min-h-screen flex flex-col">
    {/* Header */}
    <header className="py-12 text-center px-4">
      <h2 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
        AI Notes
      </h2>
      <p className="mt-9 text-lg md:text-xl text-white/90">
        This is a demo project. Do not put sensitive information.
      </p>
    </header>
    <div className="flex items-center justify-center flex-grow">
      <div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-900">Sign In</h2>
          <div>
            <label htmlFor="Name" className="block mb-2 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="Name"
              id="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Input Name"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Your Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
    </div>
   
  );
}