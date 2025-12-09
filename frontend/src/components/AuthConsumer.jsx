import DashboardPage from "./Pages/DashboardPage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignUpPage";
import useAuth from "./useAuth";

const AuthConsumer = ({ setPage, page }) => {
  const { isAuthenticated } = useAuth();

  // If user is authenticated, always show dashboard
  if (isAuthenticated) {
    return <DashboardPage />;
  }

  // If not authenticated, show login or signup
  switch (page) {
    case 'login':
      return <LoginPage onNavigate={setPage} />;
    case 'signup':
      return <SignupPage onNavigate={setPage} />;
    default:
      return <LoginPage onNavigate={setPage} />;
  }
};
export default AuthConsumer;