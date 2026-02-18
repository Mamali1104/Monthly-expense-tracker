import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await registerUser({ name, email, password });
      localStorage.setItem("token", data.token);
      toast.success("Account created 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
    w-full bg-slate-900 text-gray-200
    border border-slate-700 px-4 py-3 rounded-lg
    focus:ring-2 focus:ring-teal-400 outline-none
  `;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8
        shadow-[0_0_40px_rgba(45,212,191,0.25)]">

        <h2 className="text-3xl font-bold text-center text-teal-400 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Name"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-400 text-slate-900 font-semibold py-3 rounded-lg
              shadow-[0_0_20px_rgba(45,212,191,0.6)]
              hover:shadow-[0_0_35px_rgba(45,212,191,0.9)]
              transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
