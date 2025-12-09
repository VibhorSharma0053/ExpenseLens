import { useState } from "react";
import { AuthProvider } from "./components/AuthContext";
import Layout from "./components/UI/Layout";
import AuthConsumer from "./components/AuthConsumer";
import LandingPage from "./components/Pages/LandingPage";

const App = () => {
  const [page, setPage] = useState('login'); // 'login', 'signup', or 'dashboard'
  
  return (
    <LandingPage/>
  );
};

export default App;