import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUploadPDF } from '../hooks/useData'; // Assuming this hook exists
import Sidebar from '../components/Sidebar'; // Assuming this exists
import TopHeader from '../components/TopHeader'; // Assuming this exists
import { 
  Upload, FileText, CheckCircle, XCircle, Loader, Shield, Zap, Info, AlertTriangle 
} from 'lucide-react';

// --- Theme Constants ---
const THEME = {
  primary: '#6739B7', // Deep Royal Purple
  secondary: '#9575CD', // Soft Lavender
  success: '#00C853', // Emerald Green
  danger: '#FF5252', // Coral Red
  warning: '#FFC107', // Sunshine Yellow
  background: '#F5F5FA', // Light Purple Grey
  gradient_primary: 'from-[#6739B7] to-[#9575CD]',
  gradient_success: 'from-[#00C853] to-[#69F0AE]',
  gradient_danger: 'from-[#FF5252] to-[#FF8A80]',
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
          ? 'border-[#6739B7] bg-purple-50 scale-105' 
          : 'border-purple-100 bg-white hover:border-[#9575CD] hover:bg-purple-50/30'
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
          <div className={`absolute inset-0 bg-gradient-to-r ${THEME.gradient_primary} rounded-full blur-2xl opacity-20 animate-pulse`}></div>
          <div className={`relative w-24 h-24 bg-gradient-to-br ${THEME.gradient_primary} rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-200`}>
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
          <p className="text-sm text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full inline-block">
            Supported format: PDF • Max size: 10MB
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4 text-[#00C853]" />
            <span>Secure & Encrypted</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Zap className="w-4 h-4 text-[#FF9800]" />
            <span>Duplicate Detection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Processing Status Component
const ProcessingStatus = ({ fileName, progress }) => {
  const getStage = (progress) => {
    if (progress < 25) return { id: 'uploading', label: 'Uploading file' };
    if (progress < 50) return { id: 'parsing', label: 'Parsing PDF' };
    if (progress < 75) return { id: 'detecting', label: 'Detecting duplicates' };
    return { id: 'saving', label: 'Saving new transactions' };
  };

  const currentStage = getStage(progress);

  return (
    <div className="bg-white rounded-2xl p-8 border border-purple-100 shadow-lg shadow-purple-500/5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${THEME.gradient_primary} rounded-xl flex items-center justify-center shadow-md`}>
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{fileName}</p>
            <p className="text-sm text-gray-500">{currentStage.label}...</p>
          </div>
        </div>
        <Loader className="w-6 h-6 text-[#6739B7] animate-spin" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">Progress</span>
          <span className="font-bold text-[#6739B7]">{progress}%</span>
        </div>
        
        <div className="h-3 w-full bg-purple-50 rounded-full overflow-hidden border border-purple-100">
          <div 
            className={`h-full bg-gradient-to-r ${THEME.gradient_primary} transition-all duration-300 rounded-full`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Success Result Component
const SuccessResult = ({ result, onNewUpload }) => {
  const navigate = useNavigate();
  
  const transactionsAdded = result?.transactions_added ?? result?.transactionsCount ?? 0;
  const transactionsSkipped = result?.transactions_skipped ?? 0;
  const transactionsFailed = result?.transactions_failed ?? 0;
  const message = result?.message ?? `Successfully extracted ${transactionsAdded} transactions`;
  
  const hasSkipped = transactionsSkipped > 0;
  const hasFailed = transactionsFailed > 0;

  return (
    <div className="bg-white rounded-2xl p-8 border border-green-100 shadow-xl shadow-green-500/10 relative overflow-hidden">
       {/* Decorative Top Border */}
       <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${THEME.gradient_success}`}></div>

      <div className="text-center relative z-10">
        <div className={`w-20 h-20 bg-gradient-to-br ${THEME.gradient_success} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200`}>
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h3>
        
        <p className="text-gray-600 mb-6 font-medium">
          {message}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Added */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="text-3xl font-bold text-green-600">
              {transactionsAdded}
            </div>
            <div className="text-sm font-bold text-green-700 mt-1">Added</div>
          </div>

          {/* Skipped (Duplicates) */}
          <div className={`${hasSkipped ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'} rounded-xl p-4 border`}>
            <div className={`text-3xl font-bold ${hasSkipped ? 'text-orange-500' : 'text-gray-400'}`}>
              {transactionsSkipped}
            </div>
            <div className={`text-sm font-bold mt-1 ${hasSkipped ? 'text-orange-600' : 'text-gray-500'}`}>
              Duplicates
            </div>
          </div>

          {/* Failed */}
          <div className={`${hasFailed ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'} rounded-xl p-4 border`}>
            <div className={`text-3xl font-bold ${hasFailed ? 'text-red-500' : 'text-gray-400'}`}>
              {transactionsFailed}
            </div>
            <div className={`text-sm font-bold mt-1 ${hasFailed ? 'text-red-600' : 'text-gray-500'}`}>
              Failed
            </div>
          </div>
        </div>

        {/* Duplicate Warning */}
        {hasSkipped && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3 text-left">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-orange-800">
                {transactionsSkipped} duplicate transaction{transactionsSkipped > 1 ? 's' : ''} detected
              </p>
              <p className="text-xs text-orange-700 mt-1">
                Skipped to prevent duplicates in your database.
              </p>
            </div>
          </div>
        )}

        {/* Failed Warning */}
        {hasFailed && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-left">
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-800">
                {transactionsFailed} transaction{transactionsFailed > 1 ? 's' : ''} failed
              </p>
              <p className="text-xs text-red-700 mt-1">
                Could not save due to validation errors.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className={`px-6 py-3 bg-gradient-to-r ${THEME.gradient_primary} text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:-translate-y-0.5`}
          >
            View Dashboard
          </button>
          <button 
            onClick={onNewUpload} 
            className="px-6 py-3 bg-white border-2 border-[#6739B7] text-[#6739B7] rounded-xl font-bold hover:bg-purple-50 transition-all"
          >
            Upload Another
          </button>
        </div>
      </div>
    </div>
  );
};

// Error Result Component
const ErrorResult = ({ message, onRetry }) => {
  return (
    <div className="bg-white rounded-2xl p-8 border border-red-100 shadow-xl shadow-red-500/10 relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${THEME.gradient_danger}`}></div>
      <div className="text-center pt-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Failed</h3>
        <p className="text-gray-600 mb-6 font-medium">{message}</p>
        <button 
          onClick={onRetry} 
          className={`px-6 py-3 bg-gradient-to-r ${THEME.gradient_primary} text-white rounded-xl font-bold hover:shadow-lg transition-all`}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

// Upload Guidelines Component
const UploadGuidelines = () => {
  const guidelines = [
    { 
      icon: FileText, 
      title: 'PDF Format Only', 
      description: 'Only PhonePe payment history PDFs are supported', 
      color: 'bg-purple-100 text-[#6739B7]' 
    },
    { 
      icon: Shield, 
      title: 'Auto Duplicate Detection', 
      description: 'Duplicate transactions are automatically detected and skipped', 
      color: 'bg-green-100 text-[#00C853]' 
    },
    { 
      icon: Zap, 
      title: 'Instant Analysis', 
      description: 'Get insights within seconds of uploading', 
      color: 'bg-orange-100 text-[#FF9800]' 
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <Info className="w-5 h-5 text-[#6739B7]" />
        <h3 className="text-lg font-bold text-gray-900">Upload Guidelines</h3>
      </div>
      <div className="space-y-4">
        {guidelines.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-purple-50 hover:shadow-sm transition-all duration-300 group cursor-default">
            <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 mb-1">{item.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Upload Page Component
const UploadPage = () => {
  const { uploadPDF, uploading, progress, result, error, reset } = useUploadPDF();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    const response = await uploadPDF(file);
    if (!response.success) {
      console.error('Upload failed:', response.error);
    }
  };

  const handleNewUpload = () => {
    reset();
    setSelectedFile(null);
  };

  const uploadState = uploading ? 'processing' : result ? 'success' : error ? 'error' : 'idle';

  return (
    <div className="min-h-screen bg-[#F5F5FA] font-sans transition-colors duration-300">
      <Sidebar />
      <div className="ml-72 transition-all duration-300">
        <TopHeader title="Upload PDF" subtitle="Import your PhonePe payment history" />
        
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              {uploadState === 'idle' && (
                <FileUploadZone onFileSelect={handleFileSelect} isProcessing={false} />
              )}
              {uploadState === 'processing' && selectedFile && (
                <ProcessingStatus fileName={selectedFile.name} progress={progress} />
              )}
              {uploadState === 'success' && result && (
                <SuccessResult result={result} onNewUpload={handleNewUpload} />
              )}
              {uploadState === 'error' && (
                <ErrorResult 
                  message={error || "Unable to process the PDF file. Please try again."} 
                  onRetry={handleNewUpload} 
                />
              )}
            </div>
            <div>
              <UploadGuidelines />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;