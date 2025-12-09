import useAuth from "../useAuth";
import AuthCard from "../UI/AuthCard";
import Input from "../UI/Input";
import MailIcon from "../Icons/MailIcon";
import LockIcon from "../Icons/LockIcon";
import Button from "../UI/Button";

const LoginPage = ({ onNavigate }) => {
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    // In a real app, you'd handle loading/error states
    if (login(email, password)) {
      // AuthProvider will update state, and App will re-render
    } else {
      // Show login error
    }
  };

  return (
    <AuthCard title="Login">
      <form onSubmit={handleSubmit}>
        <Input 
          id="email" 
          type="email" 
          placeholder="Email" 
          icon={<MailIcon className="w-5 h-5" />} 
        />
        <Input 
          id="password" 
          type="password" 
          placeholder="Password" 
          icon={<LockIcon className="w-5 h-5" />} 
        />
        <Button>Login</Button>
      </form>
      <p className="text-center text-sky-200 mt-6">
        Don't have an account?{' '}
        <button
          onClick={() => onNavigate('signup')}
          className="font-semibold text-cyan-300 hover:text-cyan-200"
        >
          Sign Up
        </button>
      </p>
    </AuthCard>
  );
};
export default LoginPage;