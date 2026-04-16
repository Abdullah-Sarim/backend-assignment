import React from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/authComponents/AuthLayout";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const navigate = useNavigate();

  const { login, isLoading, error } = useAuthStore();

  const [showPassword, setShowPassword] = React.useState(false);
  const [emailTouched, setEmailTouched] = React.useState(false);

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  /* ---------------- EMAIL VALIDATION ---------------- */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const isEmailValid = emailRegex.test(formData.email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailValid) {
      setEmailTouched(true);
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch {
      // error handled by store
    }
  };

  const ringClasses = (errorState, success) =>
    errorState
      ? "ring-red-500/70 focus-within:ring-red-500"
      : success
      ? "ring-green-500/70 focus-within:ring-green-500"
      : "ring-white/10 focus-within:ring-indigo-500/60";

  const iconColor = (errorState, success) =>
    errorState ? "text-red-400" : success ? "text-green-400" : "text-white/60";

  const handleDemoLogin = async (email, password) => {
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      // error handled by store
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[380px] bg-[#0b0b1a]/80 border border-white/10 rounded-2xl px-8 py-10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
      >
        <h1 className="text-white text-3xl font-semibold text-center">
          Login
        </h1>
        <p className="text-gray-400 text-sm text-center mt-2">
          Please sign in to continue
        </p>

        {/* EMAIL */}
        <div
          className={`mt-8 flex items-center gap-3 h-12 px-5 rounded-full bg-white/5 ring-1 transition
            ${ringClasses(emailTouched && !isEmailValid, isEmailValid)}`}
        >
          <Mail
            size={16}
            className={iconColor(emailTouched && !isEmailValid, isEmailValid)}
          />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => setEmailTouched(true)}
            className="w-full bg-transparent text-white placeholder-white/50 outline-none"
            required
          />
        </div>

        {emailTouched && !isEmailValid && (
          <p className="text-red-400 text-xs mt-2 ml-2">
            Please enter a valid email address
          </p>
        )}

        {/* PASSWORD */}
        <div
          className={`mt-4 flex items-center gap-3 h-12 px-5 rounded-full bg-white/5 ring-1 transition
            ${ringClasses(!!error, false)}`}
        >
          <Lock size={16} className={iconColor(!!error, false)} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-transparent text-white placeholder-white/50 outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-indigo-400"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-xs mt-3 text-center">
            {error}
          </p>
        )}

        {/* FORGOT PASSWORD */}
        <div className="mt-4 text-left">
          <Link
            to="/forgot-password"
            className="text-sm text-indigo-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* SUBMIT */}
        <button
          disabled={isLoading}
          className={`mt-6 w-full h-12 rounded-full text-white font-medium transition
            ${
              isLoading
                ? "bg-indigo-600/40 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* DEMO ACCOUNTS */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-gray-400 text-xs text-center mb-3">Demo Accounts</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleDemoLogin("user@demo.com", "user123")}
              className="flex-1 py-2 px-3 text-xs bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition"
            >
              User Login
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("admin@demo.com", "admin123")}
              className="flex-1 py-2 px-3 text-xs bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600/30 transition"
            >
              Admin Login
            </button>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-5">
          Don't have an account?
          <Link
            to="/signup"
            className="text-indigo-400 hover:underline ml-1"
          >
            click here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
