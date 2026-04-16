import { LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

const AuthButton = ({
  variant = "primary",
  redirectTo = "/",
  className = "",
  showIcon = true,
}) => {
  const { user, logout, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (user) {
      // LOGOUT
      try {
        await logout();
        toast.success("Logged out successfully");
        navigate(redirectTo);
      } catch (err) {
        toast.error("Failed to logout");
      }
    } else {
      // LOGIN
      navigate("/login");
    }
  };

  const baseStyle =
    "px-4 py-2.5 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full",
    ghost: "text-red-400 hover:text-red-500 hover:bg-red-500/10",
    danger:
      "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      <div className="flex items-center gap-1.5">
        {showIcon &&
          (user ? <LogOut size={18} /> : <LogIn size={18} />)}

        {isLoading
          ? user
            ? "Logging out..."
            : "Loading..."
          : user
          ? "Logout"
          : "Login"}
      </div>
    </button>
  );
};

export default AuthButton;
