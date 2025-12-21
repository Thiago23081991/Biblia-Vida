
import React from 'react';
import { AudienceType } from '../types';
import { Baby, Zap, BookOpen } from 'lucide-react';

interface AudienceSelectorProps {
  selected: AudienceType;
  onChange: (audience: AudienceType) => void;
}

const AudienceSelector: React.FC<AudienceSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      <button
        onClick={() => onChange(AudienceType.CHILD)}
        className={`relative overflow-hidden p-3 md:p-4 rounded-2xl border-2 transition-all duration-300 flex sm:flex-col items-center justify-start sm:justify-center gap-4 sm:gap-2 group
          ${selected === AudienceType.CHILD 
            ? 'border-yellow-400 bg-yellow-50 text-yellow-800 shadow-md scale-[1.02]' 
            : 'border-slate-200 bg-white text-slate-500 hover:border-yellow-200'
          }`}
      >
        <div className={`p-3 rounded-xl ${selected === AudienceType.CHILD ? 'bg-yellow-400 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
          <Baby size={22} />
        </div>
        <div className="text-left sm:text-center">
          <h3 className="font-bold font-hand text-lg leading-none">Crianças</h3>
          <p className="text-[10px] mt-1 opacity-70">Linguagem Lúdica</p>
        </div>
      </button>

      <button
        onClick={() => onChange(AudienceType.TEEN)}
        className={`relative overflow-hidden p-3 md:p-4 rounded-2xl border-2 transition-all duration-300 flex sm:flex-col items-center justify-start sm:justify-center gap-4 sm:gap-2 group
          ${selected === AudienceType.TEEN 
            ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-md scale-[1.02]' 
            : 'border-slate-200 bg-white text-slate-500 hover:border-purple-200'
          }`}
      >
        <div className={`p-3 rounded-xl ${selected === AudienceType.TEEN ? 'bg-purple-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
          <Zap size={22} />
        </div>
        <div className="text-left sm:text-center">
          <h3 className="font-bold font-sans text-lg leading-none">Jovens</h3>
          <p className="text-[10px] mt-1 opacity-70">Dilemas Reais</p>
        </div>
      </button>

      <button
        onClick={() => onChange(AudienceType.ADULT)}
        className={`relative overflow-hidden p-3 md:p-4 rounded-2xl border-2 transition-all duration-300 flex sm:flex-col items-center justify-start sm:justify-center gap-4 sm:gap-2 group
          ${selected === AudienceType.ADULT 
            ? 'border-blue-800 bg-blue-50 text-blue-900 shadow-md scale-[1.02]' 
            : 'border-slate-200 bg-white text-slate-500 hover:border-blue-200'
          }`}
      >
        <div className={`p-3 rounded-xl ${selected === AudienceType.ADULT ? 'bg-blue-800 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
          <BookOpen size={22} />
        </div>
        <div className="text-left sm:text-center">
          <h3 className="font-bold font-serif text-lg leading-none">Adultos</h3>
          <p className="text-[10px] mt-1 opacity-70">Exegese Profunda</p>
        </div>
      </button>
    </div>
  );
};

export default AudienceSelector;
