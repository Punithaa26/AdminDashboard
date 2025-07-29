import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      if (data.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/welcome");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-xl shadow-lg space-y-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-center text-[#00FFFF]">Admin Login</h2>

        <Input
          type="email"
          placeholder="Email"
          className="bg-black/40 text-white placeholder:text-white/50 border border-[#00FFFF]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          className="bg-black/40 text-white placeholder:text-white/50 border border-[#00FFFF]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button onClick={handleLogin} className="w-full bg-[#00FFFF] hover:bg-[#00e6e6] text-black font-bold">
          Login
        </Button>

        <p className="text-center text-sm text-white/60">
          Don't have an account? <a href="/signup" className="text-[#39FF14]">Signup</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
