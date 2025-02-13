import { useState } from "react";
import { Link } from "react-router-dom";

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://zyrr6w-3000.csb.app/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-900">Sign Up</h2>
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
  );
}
