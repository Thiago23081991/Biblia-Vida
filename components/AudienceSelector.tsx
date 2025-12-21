
import React from 'react';
import { AudienceType } from '../types';
import { Baby, Zap, BookOpen } from 'lucide-react';

interface AudienceSelectorProps {
  selected: AudienceType;
  onChange: (audience: AudienceType) => void;
}

const AudienceSelector: React.FC<AudienceSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <button
        onClick={() => onChange(AudienceType.CHILD)}
        className={`relative overflow-hidden p-5 rounded-3xl border-2 transition-all duration-300 flex sm:flex-col items-center justify-start sm:justify-center gap-5 sm:gap-3 group
          ${selected === AudienceType.CHILD 
            ? 'border-brand-400 bg-brand-400/10 text-brand-400 shadow-lg scale-[1.03]' 
            : 'border-slate-800 bg-slate-900 text-slate-500 hover:border-slate-700'
          }`}
      >
        <div className={`p-4 rounded-2xl transition-all ${selected === AudienceType.CHILD ? 'bg-brand-400 text-black shadow-xl' : 'bg-slate-800 text-slate-600'}`}>
          <Baby size={24} />
        </div>
        <div className="text-left sm:text-center">
          <h3 className="font-black font-hand text-xl leading-none">Crianças</h3>
          <p className="text-[10px] mt-1 uppercase font-black tracking-widest opacity-60">Lúdico</p>
        </div>
      </button>

      <button
        onClick={() => onChange(AudienceType.TEEN)}
        className={`relative overflow-hidden p-5 rounded-3xl border-2 transition-all duration-300 flex sm:flex-col items-center justify-start sm:justify-center gap-5 sm:gap-3 group
          ${selected === AudienceType.TEEN 
            ? 'border-brand-400 bg-brand-400/10 text-brand-400 shadow-lg scale-[1.03]' 
            : 'border-slate-800 bg-slate-900 text-slate-500 hover:border-slate-700'
          }`}
      >
        <div className={`p-4 rounded-2xl transition-all ${selected === AudienceType.TEEN ? 'bg-brand-400 text-black shadow-xl' : 'bg-slate-800 text-slate-600'}`}>
          <Zap size={24} />
        </div>
        <div className="text-left sm:text-center">
          <h3 className="font-black font-sans text-xl leading-none uppercase">Jovens</h3>
          <p className="text-[10px] mt-1 uppercase font-black tracking-widest opacity-60">Conexão</p>
        </div>
      </button>

      <button
        onClick={() => onChange(AudienceType.ADULT)}
        className={`relative overflow-hidden p-5 rounded-3xl border-2 transition-all duration-300 flex sm:flex-col items-center justify-start sm:justify-center gap-5 sm:gap-3 group
          ${selected === AudienceType.ADULT 
            ? 'border-brand-400 bg-brand-400/10 text-brand-400 shadow-lg scale-[1.03]' 
            : 'border-slate-800 bg-slate-900 text-slate-500 hover:border-slate-700'
          }`}
      >
        <div className={`p-4 rounded-2xl transition-all ${selected === AudienceType.ADULT ? 'bg-brand-400 text-black shadow-xl' : 'bg-slate-800 text-slate-600'}`}>
          <BookOpen size={24} />
        </div>
        <div className="text-left sm:text-center">
          <h3 className="font-black font-serif text-xl leading-none uppercase">Adultos</h3>
          <p className="text-[10px] mt-1 uppercase font-black tracking-widest opacity-60">Exegese</p>
        </div>
      </button>
    </div>
  );
};

export default AudienceSelector;
