const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#05050f]">
      
      {/* TOP GLOW */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-indigo-700/40 rounded-full blur-[160px]" />

      {/* RIGHT GLOW */}
      <div className="absolute right-[-150px] bottom-[100px] w-[500px] h-[300px] bg-purple-600/30 rounded-full blur-[140px]" />

      {/* LEFT SUBTLE GLOW */}
      <div className="absolute left-[-120px] bottom-[200px] w-[350px] h-[220px] bg-indigo-500/20 rounded-full blur-[120px]" />

      {/* CONTENT */}
      <div className="relative z-10 flex items-center justify-center w-full px-4">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
