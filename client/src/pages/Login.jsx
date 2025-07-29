import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "../utils/constant";
import { showSuccessToast, showErrorToast } from "../utils/toastUtil";
import { useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      showSuccessToast("Login successful");
      if (data.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/welcome");
      }
    } catch (err) {
      console.log(err);
      showErrorToast(err?.response?.data?.message || "Login failed");
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
        <h2 className="text-2xl font-semibold text-center text-[#00FFFF]">
          Admin Login
        </h2>
        <div className="relative w-full rounded-md p-[2px] bg-gradient-to-r from-[#00FFFF] to-[#39FF14]">
          <div className="bg-black rounded-md">
            <Input
              type="email"
              placeholder="Email"
              className="w-full text-white placeholder:text-white/50 border-none focus:ring-0 focus:outline-none rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="relative w-full rounded-md p-[2px] bg-gradient-to-r from-[#00FFFF] to-[#39FF14]">
          <div className="bg-black rounded-md">
            <Input
              type="password"
              placeholder="Password"
              className="w-full text-white placeholder:text-white/50 border-none focus:ring-0 focus:outline-none rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-[#00FFFF] to-[#39FF14] hover:opacity-90 text-black font-bold"
        >
          Login
        </Button>

        <p className="text-center text-sm text-white/60">
          Don't have an account?{" "}
          <a href="/signup" className="text-[#39FF14]">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
