const Input = ({ id, type, placeholder, icon, value, onChange, disabled }) => (
  <div className="relative mb-6">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300/70">
      {icon}
    </span>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full pl-12 pr-4 py-3 bg-white/5 rounded-lg border-b-2 border-cyan-400/50 focus:border-cyan-300 focus:outline-none focus:ring-0 text-white placeholder-sky-300/70 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);

export default Input;
