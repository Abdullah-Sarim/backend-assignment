import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/authComponents/AuthLayout";
import { useAuthStore } from "../store/authStore";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /* ---------------- EMAIL VALIDATION ---------------- */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const isEmailValid = emailRegex.test(formData.email);

  /* ---------------- PASSWORD ---------------- */
  const passwordMatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  const passwordMismatch =
    formData.confirmPassword && formData.password !== formData.confirmPassword;

  const passwordTooShort = formData.password && formData.password.length < 6;

  const getStrength = (password) => {
    if (password.length < 6) return "weak";
    if (/[A-Z]/.test(password) && /\d/.test(password)) return "strong";
    return "medium";
  };

  const strength = getStrength(formData.password);

  const strengthColor = {
    weak: "bg-red-500",
    medium: "bg-yellow-400",
    strong: "bg-green-500",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailValid || !passwordMatch || passwordTooShort) {
      setEmailTouched(true);
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.name, formData.role);
      navigate("/dashboard");
    } catch {
      // error handled in store
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

  const canSubmit = isEmailValid && passwordMatch && !isLoading;

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[380px] bg-[#0b0b1a]/80 border border-white/10 rounded-2xl px-8 py-10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
      >
        <h1 className="text-white text-3xl font-semibold text-center">
          Sign up
        </h1>
        <p className="text-gray-400 text-sm text-center mt-2">
          Create your account
        </p>

        {/* NAME */}
        <div className="mt-8 flex items-center gap-3 h-12 px-5 rounded-full bg-white/5 ring-1 ring-white/10">
          <User size={16} className="text-white/60" />
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full bg-transparent text-white placeholder-white/50 outline-none"
            required
          />
        </div>

        {/* EMAIL */}
        <div
          className={`mt-4 flex items-center gap-3 h-12 px-5 rounded-full bg-white/5 ring-1 transition
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
            ${ringClasses(passwordMismatch, passwordMatch)}`}
        >
          <Lock
            size={16}
            className={iconColor(passwordMismatch, passwordMatch)}
          />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
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

        {passwordTooShort && (
          <p className="text-red-400 text-xs mt-2 ml-2">
            Password must be at least 6 characters
          </p>
        )}

        {/* STRENGTH */}
        {formData.password && (
          <div className="mt-2">
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${strengthColor[strength]}`}
                style={{
                  width:
                    strength === "weak"
                      ? "33%"
                      : strength === "medium"
                      ? "66%"
                      : "100%",
                }}
              />
            </div>
          </div>
        )}

        {/* CONFIRM PASSWORD */}
        <div
          className={`mt-4 flex items-center gap-3 h-12 px-5 rounded-full bg-white/5 ring-1 transition
            ${ringClasses(passwordMismatch, passwordMatch)}`}
        >
          <Lock
            size={16}
            className={iconColor(passwordMismatch, passwordMatch)}
          />
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full bg-transparent text-white placeholder-white/50 outline-none"
            required
          />
        </div>

        {passwordMismatch && (
          <p className="text-red-400 text-xs mt-2 ml-2">
            Passwords do not match
          </p>
        )}

        {error && (
          <p className="text-red-400 text-xs mt-3 text-center">
            {error}
          </p>
        )}

        {/* SUBMIT */}
        <button
          disabled={!canSubmit}
          className={`mt-6 w-full h-12 rounded-full text-white font-medium transition
            ${
              canSubmit
                ? "bg-indigo-600 hover:bg-indigo-500"
                : "bg-indigo-600/40 cursor-not-allowed"
            }`}
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-center text-gray-400 text-sm mt-5">
          Already have an account?
          <Link
            to="/login"
            className="text-indigo-400 hover:underline ml-1"
          >
            click here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
