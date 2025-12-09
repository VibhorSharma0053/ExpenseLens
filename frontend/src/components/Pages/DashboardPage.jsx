import FileUploadComponent from "../FileUploadComponent";
import useAuth from "../useAuth";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-white">
        Welcome back, {user?.fullName || user?.email}!
      </h1>
      
      {/* This is the File Upload component from the LLD */}
      <FileUploadComponent />

      {/* Placeholder for future charts and data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/20 backdrop-blur-lg border border-sky-500/30 rounded-2xl shadow-xl p-6 min-h-[300px]">
          <h3 className="text-2xl font-semibold text-cyan-300 mb-4">Spending by Category</h3>
          <p className="text-sky-200">Your category pie chart will go here.</p>
        </div>
        <div className="bg-black/20 backdrop-blur-lg border border-sky-500/30 rounded-2xl shadow-xl p-6 min-h-[300px]">
          <h3 className="text-2xl font-semibold text-cyan-300 mb-4">Monthly Trend</h3>
          <p className="text-sky-200">Your monthly spending bar chart will go here.</p>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;