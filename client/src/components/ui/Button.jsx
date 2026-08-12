const Button = ({
  children,
  onClick,
  className = "",
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-medium ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;