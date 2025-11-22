import React from 'react';
import { HumanizationConfig, Tone } from '../types';

interface OptionsPanelProps {
  config: HumanizationConfig;
  setConfig: React.Dispatch<React.SetStateAction<HumanizationConfig>>;
  disabled?: boolean;
}

export const OptionsPanel: React.FC<OptionsPanelProps> = ({ config, setConfig, disabled }) => {
  const handleChange = (key: keyof HumanizationConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 h-full">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Humanization Settings</h3>
        <p className="text-sm text-gray-500 mb-4">Customize how your document is rewritten.</p>
        
        <label className="block text-sm font-medium text-gray-700 mb-2">Tone of Voice</label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Object.values(Tone).map((tone) => (
            <button
              key={tone}
              onClick={() => handleChange('tone', tone)}
              disabled={disabled}
              className={`px-3 py-2 text-sm rounded-lg border text-left transition-all
                ${config.tone === tone 
                  ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500' 
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
          <input 
            type="text" 
            value={config.targetAudience}
            onChange={(e) => handleChange('targetAudience', e.target.value)}
            placeholder="e.g. High School Students, C-Suite Execs..."
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow disabled:bg-gray-100 disabled:text-gray-400"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50">
          <span className="text-sm text-gray-700">Simplify Complex Terms</span>
          <button 
             onClick={() => handleChange('simplifyComplexTerms', !config.simplifyComplexTerms)}
             disabled={disabled}
             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.simplifyComplexTerms ? 'bg-primary-600' : 'bg-gray-200'} ${disabled ? 'opacity-50' : ''}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${config.simplifyComplexTerms ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50">
          <span className="text-sm text-gray-700">Improve Flow & Structure</span>
          <button 
             onClick={() => handleChange('improveFlow', !config.improveFlow)}
             disabled={disabled}
             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.improveFlow ? 'bg-primary-600' : 'bg-gray-200'} ${disabled ? 'opacity-50' : ''}`}
          >
             <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${config.improveFlow ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};