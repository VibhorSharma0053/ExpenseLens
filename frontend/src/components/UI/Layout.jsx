import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-950 via-cyan-900 to-teal-950 text-sky-100 font-sans">
      <Navbar />
      <main className="p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
};
export default Layout;