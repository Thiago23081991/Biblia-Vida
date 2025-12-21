
import React, { useState } from 'react';
import { AudienceType } from '../types';
// Added Book to the lucide-react imports
import { Copy, Check, Share2, Mail, MessageCircle, Twitter, Smartphone, X, Loader2, FastForward, Rewind, Book } from 'lucide-react';

interface ResultCardProps {
  content: string;
  audience: AudienceType;
  isDevotional?: boolean;
  isReadingMode?: boolean;
  onNavigate?: (direction: 'prev' | 'next') => void;
  isLoading?: boolean;
  currentReference?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ content, audience, isDevotional, isReadingMode, onNavigate, isLoading, currentReference }) => {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const getSocialFormattedText = () => {
    let text = content
      .replace(/\*\*📖 Passagem:\*\*/g, '📖 *Passagem:*')
      .replace(/\*\*🎯 Público:\*\*/g, '🎯 *Público:*')
      .replace(/\*\*💬 Explicação:\*\*/g, '💬 *Explicação:*')
      .replace(/\*\*💡 Aplicação:\*\*/g, '💡 *Aplicação:*')
      .replace(/\*\*🌟 Versículo Chave:\*\*/g, '🌟 *Versículo:*')
      .replace(/\*\*💭 Reflexão:\*\*/g, '💭 *Reflexão:*')
      .replace(/\*\*🙏 Oração:\*\*/g, '🙏 *Oração:*')
      .replace(/\*\*🚀 Desafio do Dia:\*\*/g, '🚀 *Desafio:*')
      .replace(/\*\*/g, '*');
    return text + `\n\n✨ *Gerado pelo App Bíblia Atos* ✨`;
  };

  const handleCopy = (social = false) => {
    const textToCopy = social ? getSocialFormattedText() : content;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (social) setShowShareMenu(false);
  };

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'email') => {
    const text = getSocialFormattedText();
    const encodedText = encodeURIComponent(text);
    let url = '';
    switch (platform) {
      case 'whatsapp': url = `https://wa.me/?text=${encodedText}`; break;
      case 'twitter': url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text.substring(0, 240))}`; break;
      case 'email': url = `mailto:?subject=Mensagem Bíblica Atos&body=${encodedText}`; break;
    }
    if (url) {
      window.open(url, '_blank');
      setShowShareMenu(false);
    }
  };

  const isVerseRef = currentReference?.includes(':');

  const styles = isDevotional ? {
    container: "bg-slate-900 border-brand-400 shadow-2xl shadow-brand-400/5",
    heading: "text-brand-400 font-black border-b border-slate-800 pb-3 mb-6 mt-8 uppercase tracking-widest text-xs",
    strong: "text-white font-black",
    text: "text-slate-300 font-serif leading-relaxed"
  } : audience === AudienceType.CHILD ? {
    container: "bg-amber-400 border-black shadow-2xl shadow-amber-400/20",
    heading: "text-black font-bold mb-6 mt-8 font-hand text-2xl border-b border-black/10 pb-2",
    strong: "text-black font-black",
    text: "text-black font-hand text-2xl leading-snug"
  } : audience === AudienceType.TEEN ? {
    container: "bg-slate-900 border-slate-700 shadow-2xl",
    heading: "text-brand-400 font-black mb-6 mt-8 uppercase tracking-tighter italic text-sm",
    strong: "text-white font-bold",
    text: "text-slate-300 font-sans text-base leading-relaxed"
  } : {
    container: "bg-slate-900 border-slate-800 shadow-2xl",
    heading: "text-brand-400 font-black border-b border-slate-800 pb-3 mb-6 mt-8 text-xs uppercase tracking-widest",
    strong: "text-white font-bold",
    text: "text-slate-300 font-serif text-lg leading-relaxed"
  };

  const renderContent = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => {
      if (!line.trim()) return <div key={index} className="h-6"></div>;
      if (line.startsWith('**') && (line.includes('Passagem') || line.includes('Público') || line.includes('Explicação') || line.includes('Aplicação') || line.includes('Versículo') || line.includes('Reflexão') || line.includes('Oração') || line.includes('Desafio'))) {
        return <h3 key={index} className={styles.heading}>{line.replace(/\*\*/g, '')}</h3>;
      }
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={index} className={`mb-4 ${styles.text}`}>
          {parts.map((part, pIdx) => part.startsWith('**') ? <strong key={pIdx} className={styles.strong}>{part.slice(2, -2)}</strong> : part)}
        </p>
      );
    });
  };

  return (
    <div className={`w-full rounded-[2.5rem] border-2 p-6 md:p-12 relative animate-fade-in ${styles.container}`}>
      <div className="absolute top-5 right-5 flex gap-3 z-10">
        <button onClick={() => handleCopy()} className="p-3 bg-slate-800/80 backdrop-blur rounded-2xl shadow-sm hover:bg-slate-700 active:scale-90 transition-all border border-slate-700">
          {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} className="text-brand-400" />}
        </button>
        <button onClick={() => setShowShareMenu(true)} className="p-3 bg-brand-400 rounded-2xl shadow-lg hover:bg-brand-500 active:scale-90 transition-all text-black">
          <Share2 size={20} />
        </button>
      </div>

      <div className="prose prose-invert max-w-none min-h-[120px]">
        {renderContent(content)}
      </div>

      {isReadingMode && onNavigate && (
        <div className="mt-16 pt-10 border-t border-slate-800 flex flex-col items-center gap-6">
          <div className="flex w-full items-center justify-between gap-4">
            <button
              onClick={() => onNavigate('prev')}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-3 h-16 bg-slate-800 border-2 border-slate-700 rounded-2xl text-slate-300 font-black uppercase tracking-widest hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-20"
            >
              <Rewind size={22} />
              <span className="hidden sm:inline">Anterior</span>
            </button>
            
            {isLoading ? (
              <div className="bg-brand-400 text-black p-4 rounded-2xl animate-spin shadow-lg">
                <Loader2 size={24} />
              </div>
            ) : (
              <div className="px-6 py-2 bg-slate-950 rounded-full border border-slate-800">
                 <span className="text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">{currentReference}</span>
              </div>
            )}

            <button
              onClick={() => onNavigate('next')}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-3 h-16 bg-brand-400 text-black rounded-2xl font-black uppercase tracking-widest hover:bg-brand-500 active:scale-95 shadow-xl shadow-brand-400/20 transition-all disabled:opacity-20"
            >
              <span className="hidden sm:inline">Próximo</span>
              <FastForward size={22} />
            </button>
          </div>
          
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
            <Book size={12} /> Bíblia Atos • Navegação Contínua
          </p>
        </div>
      )}

      {/* Share Modal */}
      {showShareMenu && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => setShowShareMenu(false)}></div>
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-black text-white uppercase tracking-widest text-sm">Transbordar Palavra</h4>
              <button onClick={() => setShowShareMenu(false)} className="p-2 text-slate-400 hover:text-white rounded-full"><X size={24} /></button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-5 w-full p-5 bg-green-400/10 text-green-400 rounded-2xl font-black uppercase tracking-widest text-xs border border-green-400/20 hover:bg-green-400/20 transition-all">
                <MessageCircle size={24} /> WhatsApp
              </button>
              <button onClick={() => handleShare('twitter')} className="flex items-center gap-5 w-full p-5 bg-sky-400/10 text-sky-400 rounded-2xl font-black uppercase tracking-widest text-xs border border-sky-400/20 hover:bg-sky-400/20 transition-all">
                <Twitter size={24} /> Twitter / X
              </button>
              <button onClick={() => handleCopy(true)} className="flex items-center gap-5 w-full p-5 bg-brand-400/10 text-brand-400 rounded-2xl font-black uppercase tracking-widest text-xs border border-brand-400/20 hover:bg-brand-400/20 transition-all">
                <Smartphone size={24} /> Copiar para Status ✨
              </button>
              <button onClick={() => handleShare('email')} className="flex items-center gap-5 w-full p-5 bg-slate-800 text-slate-300 rounded-2xl font-black uppercase tracking-widest text-xs border border-slate-700 hover:bg-slate-700 transition-all">
                <Mail size={24} /> E-mail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
