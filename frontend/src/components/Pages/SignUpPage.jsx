import AuthCard from "../UI/AuthCard";
import Button from "../UI/Button";
import UserIcon from "../Icons/UserIcon";
import LockIcon from "../Icons/LockIcon";
import MailIcon from "../Icons/MailIcon";
import useAuth from "../useAuth";
import Input from "../UI/Input";

const SignupPage = ({ onNavigate }) => {
  const { signup } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    if (signup(fullName, email, password)) {
      // Show success message and navigate to login
      onNavigate('login');
    } else {
      // Show signup error
    }
  };

  return (
    <AuthCard title="Create Account">
      <form onSubmit={handleSubmit}>
        <Input 
          id="fullName" 
          type="text" 
          placeholder="Full Name" 
          icon={<UserIcon className="w-5 h-5" />} 
        />
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
        <Button>Sign Up</Button>
      </form>
      <p className="text-center text-sky-200 mt-6">
        Already have an account?{' '}
        <button
          onClick={() => onNavigate('login')}
          className="font-semibold text-cyan-300 hover:text-cyan-200"
        >
          Login
        </button>
      </p>
    </AuthCard>
  );
};
export default SignupPage;