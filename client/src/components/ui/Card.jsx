const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 shadow-md bg-white ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;