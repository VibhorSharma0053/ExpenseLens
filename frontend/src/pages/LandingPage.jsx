// src/pages/LandingPage.jsx
import React, { useState, useEffect } from "react";
import {
  FileText,
  TrendingUp,
  PieChart,
  Shield,
  Zap,
  Eye,
  ChevronRight,
  Menu,
  X,
  Upload,
  BarChart3,
  Sparkles,
  UserPlus,
  Search,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth";

// --- Theme Constants ---
const THEME = {
  primary: '#6739B7', // Deep Royal Purple
  secondary: '#9575CD', // Soft Lavender
  accent_green: '#00C853', // Emerald
  accent_blue: '#2979FF', // Electric Blue
  dark_purple: '#311B92', // Darker background
  text_gradient: 'from-[#6739B7] via-[#9575CD] to-[#6739B7]',
  button_gradient: 'from-[#6739B7] to-[#9575CD]',
};

// Navbar Component
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-2xl shadow-purple-500/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <div className="relative">
              <div className={`absolute inset-0 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300 ${
                scrolled ? "bg-gradient-to-r from-[#6739B7] to-[#9575CD]" : "bg-white/30"
              }`}></div>
              <Eye className={`w-10 h-10 relative transition-colors duration-300 ${
                scrolled ? "text-[#6739B7]" : "text-white"
              }`} />
            </div>
            <span className={`text-2xl font-bold transition-all duration-300 ${
              scrolled 
                ? "bg-gradient-to-r from-[#6739B7] via-[#9575CD] to-[#6739B7] bg-clip-text text-transparent"
                : "text-white drop-shadow-md"
            }`}>
              ExpenseLens
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['Features', 'How It Works'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className={`font-medium transition-all duration-300 hover:scale-110 ${
                  scrolled 
                    ? "text-gray-600 hover:text-[#6739B7]" 
                    : "text-white/90 hover:text-white"
                }`}
              >
                {item}
              </a>
            ))}

            {isAuthenticated && (
              <button
                onClick={() => navigate('/dashboard')}
                className={`font-medium transition-all duration-300 hover:scale-110 ${
                  scrolled 
                    ? "text-gray-600 hover:text-[#6739B7]" 
                    : "text-white/90 hover:text-white"
                }`}
              >
                Dashboard
              </button>
            )}
            <button 
              onClick={handleGetStarted}
              className={`px-6 py-2.5 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg ${
                scrolled
                  ? "bg-gradient-to-r from-[#6739B7] to-[#9575CD] text-white hover:shadow-[#6739B7]/50"
                  : "bg-white text-[#6739B7] hover:bg-gray-100 hover:shadow-white/20"
              }`}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden ${scrolled ? 'text-gray-800' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-purple-100 shadow-xl">
          <div className="px-4 py-6 space-y-4">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-600 hover:text-[#6739B7] transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-600 hover:text-[#6739B7] transition-colors font-medium"
            >
              How It Works
            </a>
            {isAuthenticated && (
              <button
                onClick={() => {
                  navigate('/dashboard');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-gray-600 hover:text-[#6739B7] transition-colors font-medium"
              >
                Dashboard
              </button>
            )}
            <button 
              onClick={() => {
                handleGetStarted();
                setMobileMenuOpen(false);
              }}
              className="w-full px-6 py-2.5 bg-gradient-to-r from-[#6739B7] to-[#9575CD] rounded-full text-white font-semibold"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// Floating Animation Component
const FloatingElement = ({ children, delay = 0, className = "" }) => {
  return (
    <div
      className={`animate-float ${className}`}
      style={{
        animation: `float 6s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleUploadClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleDemoClick = () => {
    document.getElementById('features')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#6739B7] via-[#512DA8] to-[#311B92]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#9575CD] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#E91E63] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#00C853] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div
            className={`transform transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-20 opacity-0"
            }`}
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#FFC107]" />
              <span className="text-sm text-white font-medium">
                Track, Analyze, Optimize
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
              <span className="bg-gradient-to-r from-white via-[#EDE7F6] to-[#D1C4E9] bg-clip-text text-transparent">
                Transform Your
              </span>
              <br />
              <span className="text-[#FFC107]">Spending Habits</span>
            </h1>

            <p className="text-xl text-[#D1C4E9] mb-8 leading-relaxed">
              Upload your PhonePe payment history and unlock powerful insights.
              Visualize your spending, discover patterns, and take control of
              your finances like never before.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleUploadClick}
                className="group px-8 py-4 bg-white text-[#6739B7] rounded-full font-bold hover:shadow-2xl hover:shadow-white/20 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>{isAuthenticated ? 'Upload PDF Now' : 'Get Started Free'}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={handleDemoClick}
                className="px-8 py-4 bg-[#6739B7]/50 backdrop-blur-lg border border-white/30 rounded-full text-white font-semibold hover:bg-[#6739B7]/70 hover:border-white/50 transform hover:scale-105 transition-all duration-300"
              >
                View Features
              </button>
            </div>

            <div className="mt-12 flex items-center space-x-8">
              <div>
                <div className="text-3xl font-bold text-white">
                  10K+
                </div>
                <div className="text-sm text-[#D1C4E9]">Active Users</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div>
                <div className="text-3xl font-bold text-white">
                  1M+
                </div>
                <div className="text-sm text-[#D1C4E9]">
                  Transactions Analyzed
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div
            className={`relative transform transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-20 opacity-0"
            }`}
          >
            <div className="relative">
              <FloatingElement delay={0}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E91E63] to-[#FF9800] rounded-3xl transform rotate-6 opacity-30 blur-2xl"></div>
              </FloatingElement>

              <div className="relative bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <FloatingElement delay={0.5}>
                    <div className={`bg-gradient-to-r ${THEME.button_gradient} rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/20`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-white font-semibold">
                          Monthly Spending
                        </span>
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-white">
                        ₹45,234
                      </div>
                      <div className="text-sm text-[#E1BEE7] mt-2">
                        ↑ 12% from last month
                      </div>
                    </div>
                  </FloatingElement>

                  <FloatingElement delay={1}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <PieChart className="w-8 h-8 text-[#E91E63] mb-2" />
                        <div className="text-sm text-gray-500">Categories</div>
                        <div className="text-xl font-bold text-[#6739B7]">12</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <BarChart3 className="w-8 h-8 text-[#00C853] mb-2" />
                        <div className="text-sm text-gray-500">
                          Transactions
                        </div>
                        <div className="text-xl font-bold text-[#6739B7]">284</div>
                      </div>
                    </div>
                  </FloatingElement>

                  <FloatingElement delay={1.5}>
                    <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm">
                      <div className="text-sm text-gray-500 mb-3 font-semibold">
                        Top Categories
                      </div>
                      <div className="space-y-2">
                        {["Food & Dining", "Shopping", "Transport"].map(
                          (cat, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between"
                            >
                              <span className="text-gray-700 text-sm font-medium">{cat}</span>
                              <div className="w-24 h-2 bg-purple-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${
                                    idx === 0 ? "from-[#FF9800] to-[#FFC107]" : 
                                    idx === 1 ? "from-[#E91E63] to-[#F48FB1]" :
                                    "from-[#00C853] to-[#69F0AE]"
                                  }`}
                                  style={{ width: `${100 - idx * 25}%` }}
                                ></div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </FloatingElement>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Feature Card Component
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay,
  accentColor,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`feature-${title}`);
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [title]);

  return (
    <div
      id={`feature-${title}`}
      className={`group relative bg-white border border-purple-100 rounded-2xl p-8 hover:border-[#6739B7]/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative">
        <div
          className={`w-16 h-16 bg-gradient-to-br ${accentColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#6739B7] transition-colors">
          {title}
        </h3>

        <p className="text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: FileText,
      title: "Easy PDF Upload",
      description:
        "Simply drag and drop your PhonePe payment history PDF. Our advanced parser extracts every transaction with precision.",
      accentColor: "from-[#6739B7] to-[#9575CD]", // Purple
    },
    {
      icon: PieChart,
      title: "Visual Analytics",
      description:
        "Beautiful charts and graphs that transform raw data into actionable insights. See where your money really goes.",
      accentColor: "from-[#E91E63] to-[#F48FB1]", // Pink/Red
    },
    {
      icon: TrendingUp,
      title: "Trend Analysis",
      description:
        "Track spending patterns over time. Identify trends, spot anomalies, and make data-driven financial decisions.",
      accentColor: "from-[#00C853] to-[#69F0AE]", // Green
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description:
        "Your data is encrypted and secure. We never store your actual payment credentials, only anonymized transaction data.",
      accentColor: "from-[#2979FF] to-[#82B1FF]", // Blue
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Process thousands of transactions in seconds. Get instant insights without any waiting around.",
      accentColor: "from-[#FF9800] to-[#FFC107]", // Orange/Yellow
    },
    {
      icon: BarChart3,
      title: "Smart Categories",
      description:
        "Automatic categorization of expenses. We intelligently group your spending for better understanding.",
      accentColor: "from-[#6739B7] to-[#2979FF]", // Purple to Blue
    },
  ];

  return (
    <section
      id="features"
      className="relative py-32 bg-[#F5F5FA] overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#6739B7]/20 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#6739B7]" />
            <span className="text-sm text-[#6739B7] font-semibold">Powerful Features</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Everything You Need
          </h2>

          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Comprehensive tools to help you understand, analyze, and optimize
            your spending habits
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
              accentColor={feature.accentColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// --- NEW COMPONENT: How It Works ---
const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Create an Account",
      desc: "Sign up in seconds using your email. It's free, secure, and requires no credit card.",
      icon: UserPlus,
      color: "from-[#6739B7] to-[#9575CD]" // Purple
    },
    {
      id: 2,
      title: "Upload Statement",
      desc: "Download your PhonePe transaction history as a PDF and drag it into our secure uploader.",
      icon: Upload,
      color: "from-[#E91E63] to-[#F48FB1]" // Pink
    },
    {
      id: 3,
      title: "Instant Processing",
      desc: "Our AI engine parses the PDF, removes duplicates, and categorizes every transaction automatically.",
      icon: Search,
      color: "from-[#FF9800] to-[#FFC107]" // Orange
    },
    {
      id: 4,
      title: "View Analytics",
      desc: "Get immediate access to your dashboard with charts, monthly trends, and spending breakdowns.",
      icon: CheckCircle2,
      color: "from-[#00C853] to-[#69F0AE]" // Green
    }
  ];

  return (
    <section id="how-it-works" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center space-x-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-[#6739B7]" />
            <span className="text-sm text-[#6739B7] font-semibold">Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            From PDF to Insights in Seconds
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            We've simplified the process so you can focus on saving money, not organizing data.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-100 to-transparent -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="group relative flex flex-col items-center text-center">
                
                {/* Step Number Circle */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} p-0.5 shadow-xl shadow-purple-500/10 mb-8 transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                  <div className="w-full h-full bg-white rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                    <step.icon className={`w-8 h-8 text-[#6739B7]`} />
                    <div className="absolute top-1 right-1 text-[10px] font-bold text-gray-300">0{step.id}</div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#6739B7] transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>

                {/* Mobile Connector Line */}
                {index !== steps.length - 1 && (
                  <div className="md:hidden absolute -bottom-8 left-1/2 w-0.5 h-8 bg-purple-100 -translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

// CTA Section Component
const CTASection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleStartClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="relative py-32 bg-[#F5F5FA] overflow-hidden border-t border-purple-50">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#9575CD] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E91E63] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Ready to Take Control?
        </h2>

        <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
          Join thousands of users who have transformed their financial lives
          with ExpenseLens
        </p>

        <button 
          onClick={handleStartClick}
          className={`group px-10 py-5 bg-gradient-to-r ${THEME.button_gradient} rounded-full text-white text-lg font-bold hover:shadow-2xl hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-3`}
        >
          <span>{isAuthenticated ? 'Go to Dashboard' : 'Start Analyzing Now'}</span>
          <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>

        <p className="text-gray-400 mt-6 font-medium">
          No credit card required • Free forever
        </p>
      </div>
    </section>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>

      <Navbar />
      <HeroSection />
      <FeaturesSection />
      {/* Inserted the How It Works Section Here */}
      <HowItWorks />
      <CTASection />
    </div>
  );
};

export default LandingPage;