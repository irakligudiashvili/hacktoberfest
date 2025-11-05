interface HealthStatusOrbProps {
  status: "optimal" | "suboptimal" | "critical" | "none";
  size?: number; // optional size in pixels
}

const HealthStatusOrb = ({ status, size = 192 }: HealthStatusOrbProps) => {
  const getGradient = () => {
    switch (status) {
      case "optimal":
        return "bg-gradient-to-br from-blue-400 via-cyan-300 to-purple-400";
      case "suboptimal":
        return "bg-gradient-to-br from-green-400 via-emerald-300 to-teal-400";
      case "critical":
        return "bg-gradient-to-br from-red-400 via-orange-300 to-pink-400";
      case "none":
        return "bg-gradient-to-br from-muted via-muted/80 to-muted/60";
      default:
        return "bg-gradient-to-br from-gray-400 via-gray-300 to-gray-500";
    }
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className={`rounded-full ${getGradient()} shadow-2xl ${
          status !== "none" ? "animate-pulse" : ""
        }`}
        style={{
          width: size,
          height: size,
          animation:
            status !== "none" ? "float 3s ease-in-out infinite" : "none",
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.15), inset 0 0 40px rgba(255, 255, 255, 0.3)",
        }}
      >
        <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm" />
      </div>

      {status !== "none" && (
        <div
          className={`absolute inset-0 rounded-full blur-2xl opacity-50 ${getGradient()}`}
          style={{
            width: size,
            height: size,
            transform: "scale(0.8)",
          }}
        />
      )}
    </div>
  );
};

export default HealthStatusOrb;
