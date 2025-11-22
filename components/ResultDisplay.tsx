import React from 'react';
import { ProcessingStatus } from '../types';

interface ResultDisplayProps {
  content: string;
  status: ProcessingStatus;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, status, onReset }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    // Ideally show a toast here, but for now we keep it simple
  };

  if (status === ProcessingStatus.Idle || (status === ProcessingStatus.Uploading && !content)) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${status === ProcessingStatus.Processing ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`} />
            <h3 className="font-semibold text-gray-900">Humanized Output</h3>
        </div>
        <div className="flex gap-2">
             <button 
                onClick={copyToClipboard}
                disabled={status === ProcessingStatus.Processing || !content}
                className="text-xs font-medium text-gray-600 hover:text-primary-600 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
             >
                Copy Text
             </button>
             <button 
                onClick={onReset}
                className="text-xs font-medium text-red-600 hover:text-red-700 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-red-50 transition-colors"
             >
                Start Over
             </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-white">
        {status === ProcessingStatus.Processing && !content ? (
           <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="text-sm animate-pulse">Analyzing document & writing...</p>
           </div>
        ) : (
            <div className="prose prose-blue max-w-none prose-p:leading-relaxed prose-headings:text-gray-800 text-gray-700 whitespace-pre-wrap">
                {content}
                {status === ProcessingStatus.Processing && (
                   <span className="inline-block w-2 h-4 bg-primary-500 ml-1 animate-pulse align-middle"></span>
                )}
            </div>
        )}
      </div>
    </div>
  );
};