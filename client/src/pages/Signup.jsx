import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "../utils/constant";
import { showSuccessToast, showErrorToast } from "../utils/toastUtil";
import { useEffect } from "react";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/signup`, form);
      showSuccessToast("Signup successfull");
      navigate("/login");
    } catch (err) {
      console.log(err);
      showErrorToast(err?.response?.data?.message || "Signup failed");
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user?.role) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/welcome");
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-xl shadow-lg space-y-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-center text-[#39FF14]">
          Admin Signup
        </h2>
        <div className="relative w-full rounded-md p-[2px] bg-gradient-to-r from-[#00FFFF] to-[#39FF14]">
          <div className="bg-black rounded-md">
            <Input
              type="text"
              placeholder="Username"
              className="w-full text-white placeholder:text-white/50 border-none focus:ring-0 focus:outline-none rounded-md"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
        </div>
        <div className="relative w-full rounded-md p-[2px] bg-gradient-to-r from-[#00FFFF] to-[#39FF14]">
          <div className="bg-black rounded-md">
            <Input
              type="email"
              placeholder="Email"
              className="bg-black/40 text-white placeholder:text-white/50 border border-[#00FFFF]"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>
        <div className="relative w-full rounded-md p-[2px] bg-gradient-to-r from-[#00FFFF] to-[#39FF14]">
          <div className="bg-black rounded-md">
            <Input
              type="password"
              placeholder="Password"
              className="bg-black/40 text-white placeholder:text-white/50 border border-[#39FF14]"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>
        <div className="relative w-full rounded-md p-[2px] bg-gradient-to-r from-[#00FFFF] to-[#39FF14]">
          <div className="bg-black rounded-md">
            <select
              className="w-full px-4 py-2 rounded bg-black/40 text-white border border-[#00FFFF]"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <Button
          onClick={handleSignup}
          className="w-full bg-gradient-to-r from-[#00FFFF] to-[#39FF14] hover:opacity-90 text-black font-bold"
        >
          Signup
        </Button>

        <p className="text-center text-sm text-white/60">
          Already have an account?{" "}
          <a href="/login" className="text-[#00FFFF]">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
