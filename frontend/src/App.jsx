import { useState } from "react";
import { AuthProvider } from "./components/AuthContext";
import Layout from "./components/UI/Layout";
import AuthConsumer from "./components/AuthConsumer";
import LandingPage from "./components/LandingPage/LandingPage";
import LoginPage from "./components/Pages/LoginPage";
import SignupPage from "./components/Pages/SignUpPage";
import Dashboard from "./components/DashboardPage/DashboardPage";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import Analytics from "./components/AnalyticsPage/AnalyticsPage";
import UploadPage from "./components/UploadPDFPage/UploadPage";
import HistoryPage from "./components/HistoryPage/HistoryPage";

const App = () => {
  const [page, setPage] = useState("login"); // 'login', 'signup', or 'dashboard'

  return (
    // <LandingPage/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/history" element={<HistoryPage />} />
        
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
