import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUploadPDF } from '../hooks/useData';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import { 
  Upload, FileText, CheckCircle, XCircle, Loader, Shield, Zap, Info 
} from 'lucide-react';

// ... Keep your FileUploadZone, ProcessingStatus, SuccessResult, ErrorResult, UploadGuidelines components exactly as they were ...
// (I am omitting them here for brevity, but paste them back in when you assemble the file)

const FileUploadZone = ({ onFileSelect, isProcessing }) => {
    // ... paste your existing FileUploadZone code here ...
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = React.useRef(null);
  
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

const ProcessingStatus = ({ fileName, progress }) => {
    const getStage = (progress) => {
      if (progress < 25) return { id: 'uploading', label: 'Uploading file' };
      if (progress < 50) return { id: 'parsing', label: 'Parsing PDF' };
      if (progress < 75) return { id: 'extracting', label: 'Extracting transactions' };
      return { id: 'saving', label: 'Saving to database' };
    };
  
    const currentStage = getStage(progress);
  
    return (
      <div className="bg-white rounded-2xl p-8 border-2 border-[#C2F0E7] shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00C4B4] to-[#5EE0D9] rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{fileName}</p>
              <p className="text-sm text-gray-500">{currentStage.label}...</p>
            </div>
          </div>
          <Loader className="w-6 h-6 text-[#00C4B4] animate-spin" />
        </div>
  
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-bold text-[#00C4B4]">{progress}%</span>
          </div>
          
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
};

const SuccessResult = ({ transactionsCount, onNewUpload }) => {
    const navigate = useNavigate();
    return (
      <div className="bg-white rounded-2xl p-8 border-2 border-[#00C4B4] shadow-lg">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#00C4B4] to-[#5EE0D9] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h3>
          <p className="text-gray-600 mb-6">
            Successfully extracted <span className="font-bold text-[#00C4B4]">{transactionsCount} transactions</span>
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] text-white rounded-full font-semibold hover:shadow-xl transition-all">
              View Dashboard
            </button>
            <button onClick={onNewUpload} className="px-6 py-3 bg-white border-2 border-[#00C4B4] text-[#00C4B4] rounded-full font-semibold hover:bg-[#00C4B4] hover:text-white transition-all">
              Upload Another
            </button>
          </div>
        </div>
      </div>
    );
};

const ErrorResult = ({ message, onRetry }) => {
    return (
      <div className="bg-white rounded-2xl p-8 border-2 border-rose-400 shadow-lg">
        <div className="text-center">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-rose-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Failed</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <button onClick={onRetry} className="px-6 py-3 bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] text-white rounded-full font-semibold hover:shadow-xl transition-all">
            Try Again
          </button>
        </div>
      </div>
    );
};

const UploadGuidelines = () => {
    const guidelines = [
        { icon: FileText, title: 'PDF Format Only', description: 'Only PhonePe payment history PDFs are supported', color: 'from-[#00C4B4] to-[#5EE0D9]' },
        { icon: Shield, title: 'Secure Processing', description: 'Your data is encrypted and never shared', color: 'from-[#5EE0D9] to-[#00C4B4]' },
        { icon: Zap, title: 'Instant Analysis', description: 'Get insights within seconds of uploading', color: 'from-[#00C4B4] to-[#5EE0D9]' },
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
      </div>
    );
};

const UploadPage = () => {
  const { uploadPDF, uploading, progress, result, error, reset } = useUploadPDF();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    const response = await uploadPDF(file);
    if (!response.success) console.error('Upload failed:', response.error);
  };

  const handleNewUpload = () => {
    reset();
    setSelectedFile(null);
  };

  const uploadState = uploading ? 'processing' : result ? 'success' : error ? 'error' : 'idle';

  return (
    <div className="min-h-screen bg-gray-50">
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
                <SuccessResult transactionsCount={result.transactions_added} onNewUpload={handleNewUpload} />
              )}
              {uploadState === 'error' && (
                <ErrorResult message={error || "Unable to process the PDF file. Please try again."} onRetry={reset} />
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