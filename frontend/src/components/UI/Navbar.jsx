import useAuth from "../useAuth";
import LogOutIcon from "../Icons/LogOutIcon";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 sm:p-6 bg-black/20 backdrop-blur-md border-b border-sky-500/30 shadow-lg sticky top-0 z-50">
      <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
        ExpenseLens
      </div>
      {isAuthenticated && (
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sky-200 hover:text-white transition-colors duration-200"
        >
          <LogOutIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      )}
    </nav>
  );
};
export default Navbar;