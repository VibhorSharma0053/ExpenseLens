import React, { useState, useEffect } from 'react';
import { FileText, TrendingUp, PieChart, Shield, Zap, Eye, ChevronRight, Menu, X, Upload, BarChart3, Sparkles } from 'lucide-react';

// Navbar Component
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-2xl shadow-teal-500/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Eye className="w-10 h-10 text-[#00C4B4] relative transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#00C4B4] via-[#5EE0D9] to-[#00C4B4] bg-clip-text text-transparent">
              ExpenseLens
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-[#00C4B4] transition-all duration-300 hover:scale-110">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-[#00C4B4] transition-all duration-300 hover:scale-110">How It Works</a>
            <a href="#testimonials" className="text-gray-300 hover:text-[#00C4B4] transition-all duration-300 hover:scale-110">Testimonials</a>
            <button className="px-6 py-2.5 bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] rounded-full text-white font-semibold hover:shadow-2xl hover:shadow-[#00C4B4]/50 transform hover:scale-105 transition-all duration-300">
              Get Started
            </button>
          </div>

          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-[#00C4B4]/20">
          <div className="px-4 py-6 space-y-4">
            <a href="#features" className="block text-gray-300 hover:text-[#00C4B4] transition-colors">Features</a>
            <a href="#how-it-works" className="block text-gray-300 hover:text-[#00C4B4] transition-colors">How It Works</a>
            <a href="#testimonials" className="block text-gray-300 hover:text-[#00C4B4] transition-colors">Testimonials</a>
            <button className="w-full px-6 py-2.5 bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] rounded-full text-white font-semibold">
              Get Started
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
        animationDelay: `${delay}s`
      }}
    >
      {children}
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00C4B4] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#5EE0D9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#FFF0F5] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
          }`}>
            <div className="inline-flex items-center space-x-2 bg-[#00C4B4]/10 backdrop-blur-lg border border-[#00C4B4]/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#00C4B4]" />
              <span className="text-sm text-[#5EE0D9]">Track, Analyze, Optimize</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#00C4B4] via-[#5EE0D9] to-[#00C4B4] bg-clip-text text-transparent">
                Transform Your
              </span>
              <br />
              <span className="text-white">Spending Habits</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Upload your PhonePe payment history and unlock powerful insights. 
              Visualize your spending, discover patterns, and take control of your finances like never before.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group px-8 py-4 bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] rounded-full text-white font-semibold hover:shadow-2xl hover:shadow-[#00C4B4]/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Upload PDF Now</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="px-8 py-4 bg-white/5 backdrop-blur-lg border border-[#C2F0E7]/30 rounded-full text-white font-semibold hover:bg-[#C2F0E7]/10 hover:border-[#00C4B4]/50 transform hover:scale-105 transition-all duration-300">
                Watch Demo
              </button>
            </div>

            <div className="mt-12 flex items-center space-x-8">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] bg-clip-text text-transparent">10K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="w-px h-12 bg-[#C2F0E7]/20"></div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] bg-clip-text text-transparent">1M+</div>
                <div className="text-sm text-gray-400">Transactions Analyzed</div>
              </div>
            </div>
          </div>

          <div className={`relative transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
          }`}>
            <div className="relative">
              <FloatingElement delay={0}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00C4B4] to-[#5EE0D9] rounded-3xl transform rotate-6 opacity-20 blur-2xl"></div>
              </FloatingElement>
              
              <div className="relative bg-slate-800/50 backdrop-blur-xl border border-[#00C4B4]/20 rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <FloatingElement delay={0.5}>
                    <div className="bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#00C4B4]/20">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-white font-semibold">Monthly Spending</span>
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-white">₹45,234</div>
                      <div className="text-sm text-[#C2F0E7] mt-2">↑ 12% from last month</div>
                    </div>
                  </FloatingElement>

                  <FloatingElement delay={1}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700/50 rounded-xl p-4 border border-[#00C4B4]/10 hover:border-[#00C4B4]/30 hover:bg-[#00C4B4]/5 transition-all duration-300">
                        <PieChart className="w-8 h-8 text-[#00C4B4] mb-2" />
                        <div className="text-sm text-gray-400">Categories</div>
                        <div className="text-xl font-bold text-white">12</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-xl p-4 border border-[#5EE0D9]/10 hover:border-[#5EE0D9]/30 hover:bg-[#5EE0D9]/5 transition-all duration-300">
                        <BarChart3 className="w-8 h-8 text-[#5EE0D9] mb-2" />
                        <div className="text-sm text-gray-400">Transactions</div>
                        <div className="text-xl font-bold text-white">284</div>
                      </div>
                    </div>
                  </FloatingElement>

                  <FloatingElement delay={1.5}>
                    <div className="bg-slate-700/30 rounded-xl p-4 border border-[#C2F0E7]/10">
                      <div className="text-sm text-gray-400 mb-3">Top Categories</div>
                      <div className="space-y-2">
                        {['Food & Dining', 'Shopping', 'Transport'].map((cat, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-white text-sm">{cat}</span>
                            <div className="w-24 h-2 bg-slate-600 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9]"
                                style={{ width: `${100 - idx * 25}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
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
const FeatureCard = ({ icon: Icon, title, description, delay, accentColor }) => {
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
      className={`group relative bg-slate-800/50 backdrop-blur-lg border border-[#C2F0E7]/20 rounded-2xl p-8 hover:border-[#00C4B4]/50 hover:bg-slate-800/70 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-[#00C4B4]/0 to-[#5EE0D9]/0 group-hover:from-[#00C4B4]/10 group-hover:to-[#5EE0D9]/5 rounded-2xl transition-all duration-500`}></div>
      
      <div className="relative">
        <div className={`w-16 h-16 bg-gradient-to-br ${accentColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#00C4B4] transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-400 leading-relaxed">
          {description}
        </p>
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
      description: "Simply drag and drop your PhonePe payment history PDF. Our advanced parser extracts every transaction with precision.",
      accentColor: "from-[#00C4B4] to-[#5EE0D9]"
    },
    {
      icon: PieChart,
      title: "Visual Analytics",
      description: "Beautiful charts and graphs that transform raw data into actionable insights. See where your money really goes.",
      accentColor: "from-[#5EE0D9] to-[#00C4B4]"
    },
    {
      icon: TrendingUp,
      title: "Trend Analysis",
      description: "Track spending patterns over time. Identify trends, spot anomalies, and make data-driven financial decisions.",
      accentColor: "from-[#00C4B4] to-[#5EE0D9]"
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your data is encrypted and secure. We never store your actual payment credentials, only anonymized transaction data.",
      accentColor: "from-[#5EE0D9] to-[#C2F0E7]"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process thousands of transactions in seconds. Get instant insights without any waiting around.",
      accentColor: "from-[#00C4B4] to-[#5EE0D9]"
    },
    {
      icon: BarChart3,
      title: "Smart Categories",
      description: "Automatic categorization of expenses. We intelligently group your spending for better understanding.",
      accentColor: "from-[#5EE0D9] to-[#00C4B4]"
    }
  ];

  return (
    <section id="features" className="relative py-32 bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-[#00C4B4]/10 backdrop-blur-lg border border-[#00C4B4]/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#00C4B4]" />
            <span className="text-sm text-[#5EE0D9]">Powerful Features</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#00C4B4] via-[#5EE0D9] to-[#00C4B4] bg-clip-text text-transparent">
              Everything You Need
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive tools to help you understand, analyze, and optimize your spending habits
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

// CTA Section Component
const CTASection = () => {
  return (
    <section className="relative py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00C4B4] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5EE0D9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#FFF0F5] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Ready to Take Control?
        </h2>
        
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Join thousands of users who have transformed their financial lives with ExpenseLens
        </p>

        <button className="group px-10 py-5 bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] rounded-full text-white text-lg font-bold hover:shadow-2xl hover:shadow-[#00C4B4]/50 transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-3">
          <span>Start Analyzing Now</span>
          <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>

        <p className="text-gray-400 mt-6">No credit card required • Free forever</p>
      </div>
    </section>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
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
            linear-gradient(to right, rgba(0, 196, 180, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 196, 180, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
      
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
};

export default LandingPage;