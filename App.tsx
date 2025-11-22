import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { OptionsPanel } from './components/OptionsPanel';
import { ResultDisplay } from './components/ResultDisplay';
import { FileData, HumanizationConfig, ProcessingStatus, Tone } from './types';
import { humanizeDocumentStream } from './services/geminiService';

export default function App() {
  const [file, setFile] = useState<FileData | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.Idle);
  const [result, setResult] = useState<string>('');
  const [config, setConfig] = useState<HumanizationConfig>({
    tone: Tone.Casual,
    simplifyComplexTerms: true,
    improveFlow: true,
    targetAudience: '',
  });

  const handleFileSelect = (uploadedFile: FileData) => {
    setFile(uploadedFile);
    setStatus(ProcessingStatus.Idle);
    setResult('');
  };

  const handleStartProcessing = async () => {
    if (!file) return;

    setStatus(ProcessingStatus.Processing);
    setResult('');

    try {
      await humanizeDocumentStream(
        file.data,
        file.mimeType,
        config,
        (chunk) => {
           setResult(chunk);
        }
      );
      setStatus(ProcessingStatus.Complete);
    } catch (error) {
      console.error(error);
      setStatus(ProcessingStatus.Error);
      alert("Failed to process document. Please try again.");
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus(ProcessingStatus.Idle);
    setResult('');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Status Banner or Intro */}
            {!file && (
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Transform your docs</h2>
                <p className="text-gray-600 mt-2">Upload any document and let our AI rewrite it to sound more natural and human.</p>
              </div>
            )}

            {/* File Uploader */}
            <div className={`${status !== ProcessingStatus.Idle && status !== ProcessingStatus.Error ? 'hidden lg:block lg:opacity-50 lg:pointer-events-none' : ''}`}>
               {file ? (
                 <div className="bg-white p-4 rounded-xl border border-primary-200 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                       <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                         </svg>
                       </div>
                       <div className="min-w-0">
                         <p className="font-medium text-gray-900 truncate">{file.name}</p>
                         <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                       </div>
                    </div>
                    <button onClick={handleReset} className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                 </div>
               ) : (
                 <FileUpload onFileSelected={handleFileSelect} />
               )}
            </div>

            {/* Controls */}
            <OptionsPanel 
                config={config} 
                setConfig={setConfig} 
                disabled={status === ProcessingStatus.Processing}
            />

            {/* Action Button */}
            <button
              onClick={handleStartProcessing}
              disabled={!file || status === ProcessingStatus.Processing}
              className={`
                w-full py-3.5 px-6 rounded-xl font-semibold text-white shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-0.5
                ${!file || status === ProcessingStatus.Processing
                  ? 'bg-gray-300 shadow-none cursor-not-allowed text-gray-500 translate-y-0' 
                  : 'bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500'}
              `}
            >
              {status === ProcessingStatus.Processing ? 'Humanizing...' : 'Humanize Document'}
            </button>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8 min-h-[600px]">
            {status === ProcessingStatus.Idle ? (
              <div className="h-full rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 bg-white/50">
                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-300">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                   </svg>
                 </div>
                 <p className="font-medium">Output will appear here</p>
              </div>
            ) : (
              <ResultDisplay content={result} status={status} onReset={handleReset} />
            )}
          </div>

        </div>
      </main>
    </div>
  );
}