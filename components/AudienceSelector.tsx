import React from 'react';
import { AudienceType } from '../types';
import { Baby, Zap, BookOpen } from 'lucide-react';

interface AudienceSelectorProps {
  selected: AudienceType;
  onChange: (audience: AudienceType) => void;
}

const AudienceSelector: React.FC<AudienceSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <button
        onClick={() => onChange(AudienceType.CHILD)}
        className={`relative overflow-hidden p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 group
          ${selected === AudienceType.CHILD 
            ? 'border-yellow-400 bg-yellow-50 text-yellow-800 shadow-md scale-[1.02]' 
            : 'border-slate-200 bg-white text-slate-500 hover:border-yellow-200 hover:bg-yellow-50/50'
          }`}
      >
        <div className={`p-3 rounded-full ${selected === AudienceType.CHILD ? 'bg-yellow-400 text-white' : 'bg-slate-100 text-slate-400'}`}>
          <Baby size={24} />
        </div>
        <div className="text-center">
          <h3 className="font-bold font-hand text-lg">Crianças</h3>
          <p className="text-xs opacity-80">4-10 anos</p>
        </div>
      </button>

      <button
        onClick={() => onChange(AudienceType.TEEN)}
        className={`relative overflow-hidden p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 group
          ${selected === AudienceType.TEEN 
            ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-md scale-[1.02]' 
            : 'border-slate-200 bg-white text-slate-500 hover:border-purple-200 hover:bg-purple-50/50'
          }`}
      >
        <div className={`p-3 rounded-full ${selected === AudienceType.TEEN ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
          <Zap size={24} />
        </div>
        <div className="text-center">
          <h3 className="font-bold font-sans text-lg">Adolescentes</h3>
          <p className="text-xs opacity-80">11-17 anos</p>
        </div>
      </button>

      <button
        onClick={() => onChange(AudienceType.ADULT)}
        className={`relative overflow-hidden p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 group
          ${selected === AudienceType.ADULT 
            ? 'border-blue-800 bg-blue-50 text-blue-900 shadow-md scale-[1.02]' 
            : 'border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:bg-blue-50/50'
          }`}
      >
        <div className={`p-3 rounded-full ${selected === AudienceType.ADULT ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-400'}`}>
          <BookOpen size={24} />
        </div>
        <div className="text-center">
          <h3 className="font-bold font-serif text-lg">Adultos</h3>
          <p className="text-xs opacity-80">18+ anos</p>
        </div>
      </button>
    </div>
  );
};

export default AudienceSelector;
