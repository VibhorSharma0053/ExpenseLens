import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader,
  X,
  Eye,
  Bell,
  Settings,
  LogOut,
  User,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Trash2,
  Clock,
  File,
  Zap,
  Shield,
  ChevronRight,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';

// --- NEW Sidebar Component ---
const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', id: 'dashboard' },
    { icon: PieChart, label: 'Analytics', id: 'analytics' },
    { icon: Upload, label: 'Upload PDF', id: 'upload' },
    { icon: Calendar, label: 'History', id: 'history' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-teal-100 flex flex-col z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-teal-400 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="bg-gradient-to-br from-teal-400 to-teal-300 p-2 rounded-xl relative">
               <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400">
            ExpenseLens
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
              activePage === item.id
                ? 'bg-teal-50 text-teal-600 font-semibold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-teal-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${activePage === item.id ? 'text-teal-500' : 'text-gray-400 group-hover:text-teal-500'}`} />
              <span>{item.label}</span>
            </div>
            {activePage === item.id && <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-teal-50">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 cursor-pointer transition-colors group">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-300 rounded-full flex items-center justify-center shadow-md shadow-teal-200">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-gray-900 truncate">John Doe</div>
            <div className="text-xs text-gray-500 truncate">john@expenselens.com</div>
          </div>
          <LogOut className="w-4 h-4 text-gray-400 group-hover:text-teal-500" />
        </div>
      </div>
    </div>
  );
};

// Top Header Component
const TopHeader = () => {
  return (
    <div className="bg-white border-b border-[#C2F0E7] px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload PDF</h1>
          <p className="text-sm text-gray-500 mt-1">Import your PhonePe payment history</p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-[#C2F0E7] rounded-full transition-all duration-300 relative">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#00C4B4] rounded-full"></span>
          </button>

          <button className="px-6 py-2 bg-white border-2 border-[#00C4B4] text-[#00C4B4] hover:bg-[#00C4B4] hover:text-white rounded-full font-medium flex items-center space-x-2 transition-all duration-300 transform hover:scale-105">
            <Calendar className="w-4 h-4" />
            <span>View History</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// File Upload Zone Component
const FileUploadZone = ({ onFileSelect, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-4 border-dashed rounded-3xl p-12 transition-all duration-300 ${
        isDragging 
          ? 'border-[#00C4B4] bg-[#C2F0E7]/30 scale-105' 
          : 'border-[#C2F0E7] bg-white hover:border-[#5EE0D9] hover:bg-gray-50'
      } ${isProcessing ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
      onClick={() => !isProcessing && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-[#00C4B4] to-[#5EE0D9] rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
            <Upload className="w-12 h-12 text-white" />
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Drop your PDF here
          </h3>
          <p className="text-gray-500 mb-4">
            or click to browse from your device
          </p>
          <p className="text-sm text-gray-400">
            Supported format: PDF • Max size: 10MB
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4 text-[#00C4B4]" />
            <span>Secure & Encrypted</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Zap className="w-4 h-4 text-[#00C4B4]" />
            <span>Lightning Fast</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Processing Status Component
const ProcessingStatus = ({ fileName, progress, stage }) => {
  const stages = [
    { id: 'uploading', label: 'Uploading file', icon: Upload },
    { id: 'parsing', label: 'Parsing PDF', icon: FileText },
    { id: 'extracting', label: 'Extracting transactions', icon: Zap },
    { id: 'saving', label: 'Saving to database', icon: CheckCircle },
  ];

  return (
    <div className="bg-white rounded-2xl p-8 border-2 border-[#C2F0E7] shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#00C4B4] to-[#5EE0D9] rounded-xl flex items-center justify-center animate-pulse">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{fileName}</h4>
            <p className="text-sm text-gray-500">Processing your payment history</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-[#00C4B4]">{progress}%</div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
        <div
          className="absolute h-full bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Stages */}
      <div className="space-y-4">
        {stages.map((item, index) => {
          const isActive = item.id === stage;
          const isCompleted = stages.findIndex(s => s.id === stage) > index;
          
          return (
            <div
              key={item.id}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                isActive ? 'bg-[#C2F0E7]' : isCompleted ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                isCompleted 
                  ? 'bg-[#00C4B4]' 
                  : isActive 
                  ? 'bg-gradient-to-br from-[#00C4B4] to-[#5EE0D9]' 
                  : 'bg-gray-200'
              }`}>
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                )}
              </div>
              <span className={`text-sm font-medium ${
                isActive ? 'text-[#00C4B4]' : isCompleted ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <Loader className="w-4 h-4 text-[#00C4B4] animate-spin ml-auto" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Success Result Component
const SuccessResult = ({ fileName, transactionsCount, onNewUpload }) => {
  const stats = [
    { label: 'Transactions Found', value: transactionsCount, icon: FileText },
    { label: 'Categories Detected', value: 8, icon: PieChart },
    { label: 'Processing Time', value: '3.2s', icon: Clock },
  ];

  return (
    <div className="bg-white rounded-2xl p-8 border-2 border-[#00C4B4] shadow-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#00C4B4] to-[#5EE0D9] rounded-full mb-4 animate-bounce">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h3>
        <p className="text-gray-500">Your payment history has been processed</p>
      </div>

      <div className="bg-gradient-to-br from-[#C2F0E7] to-white rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#00C4B4]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{fileName}</p>
            <p className="text-xs text-gray-500">Processed successfully</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-3 bg-white rounded-lg">
              <stat.icon className="w-5 h-5 text-[#00C4B4] mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <button className="w-full px-6 py-3 bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-[#00C4B4]/30 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>View Dashboard</span>
          <ChevronRight className="w-5 h-5" />
        </button>
        <button 
          onClick={onNewUpload}
          className="w-full px-6 py-3 bg-white border-2 border-[#C2F0E7] text-gray-700 hover:border-[#00C4B4] hover:text-[#00C4B4] rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
        >
          Upload Another PDF
        </button>
      </div>
    </div>
  );
};

// Error Component
const ErrorResult = ({ message, onRetry }) => {
  return (
    <div className="bg-white rounded-2xl p-8 border-2 border-rose-200 shadow-xl">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FFF0F5] rounded-full mb-4">
          <XCircle className="w-10 h-10 text-rose-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Failed</h3>
        <p className="text-gray-500">{message}</p>
      </div>

      <div className="bg-[#FFF0F5] rounded-xl p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Common Issues:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• File size exceeds 10MB</li>
              <li>• PDF is corrupted or password protected</li>
              <li>• File format is not supported</li>
              <li>• Network connection interrupted</li>
            </ul>
          </div>
        </div>
      </div>

      <button 
        onClick={onRetry}
        className="w-full px-6 py-3 bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-[#00C4B4]/30 transition-all duration-300 transform hover:scale-105"
      >
        Try Again
      </button>
    </div>
  );
};

// Upload History Item Component
const UploadHistoryItem = ({ file, onDelete }) => {
  const statusColors = {
    success: 'text-[#00C4B4] bg-[#C2F0E7]',
    processing: 'text-[#5EE0D9] bg-[#C2F0E7]',
    failed: 'text-rose-400 bg-[#FFF0F5]'
  };

  const statusIcons = {
    success: CheckCircle,
    processing: Loader,
    failed: XCircle
  };

  const StatusIcon = statusIcons[file.status];

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-[#C2F0E7] hover:border-[#00C4B4] hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center space-x-4 flex-1">
        <div className="w-12 h-12 bg-[#FFF0F5] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <FileText className="w-6 h-6 text-rose-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{file.name}</p>
          <div className="flex items-center space-x-3 mt-1">
            <span className="text-xs text-gray-500">{file.date}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{file.size}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{file.transactions} transactions</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${statusColors[file.status]}`}>
          <StatusIcon className={`w-4 h-4 ${file.status === 'processing' ? 'animate-spin' : ''}`} />
          <span className="text-xs font-semibold capitalize">{file.status}</span>
        </div>

        <button 
          onClick={() => onDelete(file.id)}
          className="p-2 hover:bg-[#FFF0F5] rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4 text-rose-400" />
        </button>
      </div>
    </div>
  );
};

// Guidelines Component
const UploadGuidelines = () => {
  const guidelines = [
    {
      icon: FileText,
      title: 'PDF Format Only',
      description: 'Only PhonePe payment history PDFs are supported',
      color: 'from-[#00C4B4] to-[#5EE0D9]'
    },
    {
      icon: Shield,
      title: 'Secure Processing',
      description: 'Your data is encrypted and never shared with third parties',
      color: 'from-[#5EE0D9] to-[#00C4B4]'
    },
    {
      icon: Zap,
      title: 'Instant Analysis',
      description: 'Get insights within seconds of uploading your file',
      color: 'from-[#00C4B4] to-[#5EE0D9]'
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#C2F0E7] to-white rounded-2xl p-6 border-2 border-[#C2F0E7]">
      <div className="flex items-center space-x-2 mb-4">
        <Info className="w-5 h-5 text-[#00C4B4]" />
        <h3 className="text-lg font-bold text-gray-900">Upload Guidelines</h3>
      </div>

      <div className="space-y-4">
        {guidelines.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-xl hover:shadow-md transition-all duration-300">
            <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <item.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">{item.title}</p>
              <p className="text-xs text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white rounded-xl border border-[#C2F0E7]">
        <p className="text-xs text-gray-500 mb-2">
          <strong className="text-gray-700">Note:</strong> Make sure your PDF is not password protected and contains transaction data. Files larger than 10MB may take longer to process.
        </p>
      </div>
    </div>
  );
};

// Main Upload Component
const UploadPage = () => {
  const [activePage, setActivePage] = useState('upload');
  const [uploadState, setUploadState] = useState('idle'); // idle, processing, success, error
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('uploading');
  const [uploadHistory, setUploadHistory] = useState([
    { id: 1, name: 'phonepe_history_nov_2024.pdf', date: '2 hours ago', size: '2.4 MB', transactions: 156, status: 'success' },
    { id: 2, name: 'phonepe_history_oct_2024.pdf', date: 'Yesterday', size: '3.1 MB', transactions: 184, status: 'success' },
    { id: 3, name: 'phonepe_history_sep_2024.pdf', date: '3 days ago', size: '2.8 MB', transactions: 142, status: 'success' },
  ]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setUploadState('processing');
    simulateUpload();
  };

  const simulateUpload = () => {
    const stages = ['uploading', 'parsing', 'extracting', 'saving'];
    let currentProgress = 0;
    let stageIndex = 0;

    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);

      if (currentProgress === 25 || currentProgress === 50 || currentProgress === 75) {
        stageIndex++;
        setCurrentStage(stages[stageIndex]);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadState('success');
        }, 500);
      }
    }, 150);
  };

  const handleNewUpload = () => {
    setUploadState('idle');
    setSelectedFile(null);
    setProgress(0);
    setCurrentStage('uploading');
  };

  const handleRetry = () => {
    setUploadState('idle');
    setProgress(0);
    setCurrentStage('uploading');
  };

  const handleDeleteHistory = (id) => {
    setUploadHistory(uploadHistory.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      {/* Updated margin-left to ml-72 to fit the wider sidebar */}
      <div className="ml-72">
        <TopHeader />
        
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              {uploadState === 'idle' && (
                <FileUploadZone 
                  onFileSelect={handleFileSelect} 
                  isProcessing={false}
                />
              )}

              {uploadState === 'processing' && selectedFile && (
                <ProcessingStatus 
                  fileName={selectedFile.name}
                  progress={progress}
                  stage={currentStage}
                />
              )}

              {uploadState === 'success' && selectedFile && (
                <SuccessResult 
                  fileName={selectedFile.name}
                  transactionsCount={156}
                  onNewUpload={handleNewUpload}
                />
              )}

              {uploadState === 'error' && (
                <ErrorResult 
                  message="Unable to process the PDF file. Please try again."
                  onRetry={handleRetry}
                />
              )}
            </div>

            <div>
              <UploadGuidelines />
            </div>
          </div>

          {/* Upload History */}
          <div className="bg-white rounded-2xl p-6 border-2 border-[#C2F0E7]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Upload History</h3>
                <p className="text-sm text-gray-500">Recent PDF uploads</p>
              </div>
              <button className="text-[#00C4B4] text-sm font-semibold hover:text-[#5EE0D9] transition-colors flex items-center space-x-1">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {uploadHistory.map((file) => (
                <UploadHistoryItem 
                  key={file.id}
                  file={file}
                  onDelete={handleDeleteHistory}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;