import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", { email, password });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        toast.success("Login successful");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error("Invalid server response");
      }

    } catch (err) {
      // Proper error handling
      if (err.response) {
        // Server responded with error
        toast.error(err.response.data?.message);
      } else if (err.request) {
        // Server not responding
        toast.error("Server not responding. Try again later.");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200 px-4">

    <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-200 p-8">

      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-2">
        Welcome Back
      </h2>

      <p className="text-center text-gray-500 mb-6">
        Login to manage your attendance & tasks
      </p>

      <form onSubmit={handleLogin} className="space-y-5">

        <div>
          <label className="block text-sm mb-1 text-gray-600">
            Email
          </label>
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-600">
            Password
          </label>
          <input
            type="password"
            required
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg shadow-sm transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  </div>
);
}