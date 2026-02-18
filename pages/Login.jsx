import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authUser } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authUser({ email, password });
      localStorage.setItem("token", data.token);
      toast.success("Welcome 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-xl w-full max-w-md
          shadow-[0_0_40px_rgba(45,212,191,0.3)]"
      >
        <h2 className="text-3xl text-teal-400 font-bold text-center mb-6">
          Sign In / Sign Up
        </h2>

        <input
          type="email"
          placeholder="Email"
          required
          className="w-full mb-4 px-4 py-3 rounded bg-slate-900 text-white
            border border-slate-700 focus:ring-2 focus:ring-teal-400 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          className="w-full mb-6 px-4 py-3 rounded bg-slate-900 text-white
            border border-slate-700 focus:ring-2 focus:ring-teal-400 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-teal-400 text-slate-900 font-semibold py-3 rounded
            shadow-[0_0_20px_rgba(45,212,191,0.7)]
            hover:shadow-[0_0_35px_rgba(45,212,191,1)]
            transition"
        >
          {loading ? "Please wait..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
