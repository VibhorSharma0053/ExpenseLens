const AuthCard = ({ title, children }) => (
  <div className="w-full max-w-md mx-auto bg-black/20 backdrop-blur-lg border border-sky-500/30 rounded-2xl shadow-xl overflow-hidden mt-10 sm:mt-20">
    <div className="p-8 sm:p-10">
      <h2 className="text-center text-3xl font-bold text-white mb-8">
        {title}
      </h2>
      {children}
    </div>
  </div>
);
export default AuthCard;