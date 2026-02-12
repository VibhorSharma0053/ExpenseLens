const Button = ({ type = "submit", children, disabled = false, onClick }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-md"
  >
    {children}
  </button>
);

export default Button;
