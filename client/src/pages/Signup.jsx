import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-xl shadow-lg space-y-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-center text-[#39FF14]">Admin Signup</h2>

        <Input
          type="text"
          placeholder="Username"
          className="bg-black/40 text-white placeholder:text-white/50 border border-[#39FF14]"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <Input
          type="email"
          placeholder="Email"
          className="bg-black/40 text-white placeholder:text-white/50 border border-[#00FFFF]"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <Input
          type="password"
          placeholder="Password"
          className="bg-black/40 text-white placeholder:text-white/50 border border-[#39FF14]"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="w-full px-4 py-2 rounded bg-black/40 text-white border border-[#00FFFF]"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button onClick={handleSignup} className="w-full bg-[#39FF14] hover:bg-[#2cff10] text-black font-bold">
          Signup
        </Button>

        <p className="text-center text-sm text-white/60">
          Already have an account? <a href="/login" className="text-[#00FFFF]">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
