
import React, { useState } from 'react';
import { AudienceType } from '../types';
import { Copy, Check, Share2, Mail, MessageCircle, Twitter, Smartphone, X } from 'lucide-react';

interface ResultCardProps {
  content: string;
  audience: AudienceType;
  isDevotional?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ content, audience, isDevotional }) => {
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
    return text + `\n\n✨ *Gerado pelo App Bíblia Viva* ✨\n🙏 Edificando vidas com IA.`;
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
      case 'email': url = `mailto:?subject=Mensagem Bíblica&body=${encodedText}`; break;
    }
    if (url) {
      window.open(url, '_blank');
      setShowShareMenu(false);
    }
  };

  const styles = isDevotional ? {
    container: "bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-xl shadow-indigo-100/30",
    heading: "text-indigo-800 font-black border-b border-indigo-100/50 pb-2 mb-4 mt-6 uppercase tracking-tight text-sm",
    strong: "text-indigo-900 font-black",
    text: "text-slate-800 font-serif leading-relaxed"
  } : audience === AudienceType.CHILD ? {
    container: "bg-yellow-50 border-yellow-200 shadow-lg shadow-yellow-100/50",
    heading: "text-yellow-700 font-bold mb-4 mt-6 font-hand text-xl",
    strong: "text-yellow-900 font-bold",
    text: "text-slate-800 font-hand text-xl leading-snug"
  } : audience === AudienceType.TEEN ? {
    container: "bg-purple-50 border-purple-200 shadow-lg shadow-purple-100/50",
    heading: "text-purple-700 font-black mb-4 mt-6 uppercase tracking-tighter italic",
    strong: "text-purple-900 font-bold",
    text: "text-slate-800 font-sans text-base leading-relaxed"
  } : {
    container: "bg-white border-slate-200 shadow-xl shadow-slate-200/50",
    heading: "text-blue-900 font-bold border-b border-slate-100 pb-2 mb-4 mt-6 text-base",
    strong: "text-slate-900 font-bold",
    text: "text-slate-800 font-serif text-base leading-relaxed"
  };

  const renderContent = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => {
      if (!line.trim()) return <div key={index} className="h-4"></div>;
      if (line.startsWith('**') && (line.includes('Passagem') || line.includes('Público') || line.includes('Explicação') || line.includes('Aplicação') || line.includes('Versículo') || line.includes('Reflexão') || line.includes('Oração') || line.includes('Desafio'))) {
        return <h3 key={index} className={styles.heading}>{line.replace(/\*\*/g, '')}</h3>;
      }
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={index} className={`mb-3 ${styles.text}`}>
          {parts.map((part, pIdx) => part.startsWith('**') ? <strong key={pIdx} className={styles.strong}>{part.slice(2, -2)}</strong> : part)}
        </p>
      );
    });
  };

  return (
    <div className={`w-full rounded-[2.5rem] border p-6 md:p-10 relative animate-fade-in ${styles.container}`}>
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button onClick={() => handleCopy()} className="p-3 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white active:scale-90 transition-all border border-slate-100">
          {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} className="text-slate-400" />}
        </button>
        <button onClick={() => setShowShareMenu(true)} className="p-3 bg-brand-600 rounded-full shadow-lg hover:bg-brand-700 active:scale-90 transition-all text-white">
          <Share2 size={20} />
        </button>
      </div>

      <div className="prose prose-slate max-w-none">
        {renderContent(content)}
      </div>

      {/* Share Modal / Bottom Sheet */}
      {showShareMenu && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowShareMenu(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-t-[2rem] md:rounded-[2rem] p-6 shadow-2xl animate-fade-in transform translate-y-0 transition-transform">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-black text-slate-900 uppercase tracking-tight">Compartilhar</h4>
              <button onClick={() => setShowShareMenu(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-4 w-full p-4 bg-green-50 text-green-700 rounded-2xl font-bold hover:bg-green-100 transition-colors">
                <MessageCircle size={24} /> WhatsApp
              </button>
              <button onClick={() => handleShare('twitter')} className="flex items-center gap-4 w-full p-4 bg-sky-50 text-sky-700 rounded-2xl font-bold hover:bg-sky-100 transition-colors">
                <Twitter size={24} /> Twitter / X
              </button>
              <button onClick={() => handleCopy(true)} className="flex items-center gap-4 w-full p-4 bg-brand-50 text-brand-700 rounded-2xl font-bold hover:bg-brand-100 transition-colors">
                <Smartphone size={24} /> Copiar para Status/Stories ✨
              </button>
              <button onClick={() => handleShare('email')} className="flex items-center gap-4 w-full p-4 bg-slate-50 text-slate-700 rounded-2xl font-bold hover:bg-slate-100 transition-colors">
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
