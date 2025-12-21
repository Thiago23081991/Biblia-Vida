
import React, { useState } from 'react';
import { AudienceType } from '../types';
import { Copy, Check, Share2, Mail, MessageCircle, Twitter, Smartphone } from 'lucide-react';

interface ResultCardProps {
  content: string;
  audience: AudienceType;
  isDevotional?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ content, audience, isDevotional }) => {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Formata o texto para ser amigável em redes sociais (com emojis e espaçamento)
  const getSocialFormattedText = () => {
    let text = content
      .replace(/\*\*📖 Passagem:\*\*/g, '📖 *Passagem:*')
      .replace(/\*\*🎯 Público:\*\*/g, '🎯 *Público:*')
      .replace(/\*\*💬 Explicação:\*\*/g, '💬 *Reflexão:*')
      .replace(/\*\*💡 Aplicação:\*\*/g, '💡 *Ação:*')
      .replace(/\*\*🌟 Versículo Chave:\*\*/g, '🌟 *Versículo:*')
      .replace(/\*\*💭 Reflexão:\*\*/g, '💭 *Meditação:*')
      .replace(/\*\*🙏 Oração:\*\*/g, '🙏 *Oração:*')
      .replace(/\*\*🚀 Desafio do Dia:\*\*/g, '🚀 *Desafio:*')
      .replace(/\*\*/g, '*'); // Converte negrito MD para negrito WhatsApp

    const footer = `\n\n✨ *Gerado pelo App Bíblia Viva* ✨\n🙏 Edificando vidas através da IA.`;
    return text + footer;
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
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text.substring(0, 240) + '...')}`;
        break;
      case 'email':
        url = `mailto:?subject=Uma mensagem bíblica para você&body=${encodedText}`;
        break;
    }

    if (url) {
      window.open(url, '_blank');
      setShowShareMenu(false);
    }
  };

  const getStyles = () => {
    if (isDevotional) {
      return {
        container: "bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-xl shadow-indigo-100/50 font-serif text-base text-slate-800 leading-relaxed",
        heading: "text-indigo-700 font-bold border-b border-indigo-100 pb-1 mb-2 mt-4 flex items-center gap-2",
        strong: "text-indigo-900",
        buttonHover: "hover:bg-indigo-100 text-indigo-600",
      };
    }
    switch (audience) {
      case AudienceType.CHILD:
        return {
          container: "bg-yellow-50 border-yellow-200 font-hand text-lg text-slate-800",
          heading: "text-yellow-700",
          strong: "text-yellow-900",
          buttonHover: "hover:bg-yellow-200 text-yellow-800",
        };
      case AudienceType.TEEN:
        return {
          container: "bg-purple-50 border-purple-200 font-sans text-base text-slate-800",
          heading: "text-purple-700 font-bold tracking-tight",
          strong: "text-purple-900",
          buttonHover: "hover:bg-purple-200 text-purple-900",
        };
      case AudienceType.ADULT:
        return {
          container: "bg-white border-slate-200 shadow-sm font-serif text-base text-slate-800 leading-relaxed",
          heading: "text-blue-900 font-semibold border-b border-blue-100 pb-1 mb-2 mt-4",
          strong: "text-slate-900",
          buttonHover: "hover:bg-slate-100 text-slate-600",
        };
      default:
        return { container: "bg-white", heading: "font-bold mt-4", strong: "font-bold", buttonHover: "hover:bg-slate-100" };
    }
  };

  const styles = getStyles();

  const renderContent = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => {
      if (!line.trim()) return <div key={index} className="h-2"></div>;
      if (line.startsWith('## ') || line.startsWith('**📖') || line.startsWith('**🎯') || line.startsWith('**💬') || line.startsWith('**💡') || line.startsWith('**🌟') || line.startsWith('**💭') || line.startsWith('**🙏') || line.startsWith('**🚀')) {
        const cleanLine = line.replace(/##\s?|\*\*/g, '');
        return <h3 key={index} className={`text-lg ${styles.heading}`}>{cleanLine}</h3>;
      }
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={index} className="mb-2">
          {parts.map((part, partIndex) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={partIndex} className={`font-bold ${styles.strong}`}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className={`w-full rounded-3xl border p-6 md:p-10 mt-6 relative animate-fade-in ${styles.container}`}>
      {/* Visual Badge for screenshots */}
      <div className="absolute -top-3 left-8 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-tighter">
        <Smartphone size={10} /> Compartilhável
      </div>
      
      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button 
          onClick={() => handleCopy()}
          className={`p-2 rounded-full transition-colors ${styles.buttonHover}`}
          title="Copiar texto simples"
        >
          {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} className="opacity-60" />}
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowShareMenu(!showShareMenu)}
            className={`p-2 rounded-full transition-colors ${showShareMenu ? 'bg-black/5' : ''} ${styles.buttonHover}`}
            title="Compartilhar"
          >
            <Share2 size={20} className="opacity-60" />
          </button>

          {showShareMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in z-20">
              <div className="p-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2">Compartilhar Direto</p>
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center gap-3 w-full p-3 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 rounded-xl transition-colors text-left"
                >
                  <MessageCircle size={18} className="text-green-500" />
                  <span className="font-semibold">WhatsApp</span>
                </button>
                <button 
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-3 w-full p-3 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-xl transition-colors text-left"
                >
                  <Twitter size={18} className="text-sky-400" />
                  <span className="font-semibold">Twitter / X</span>
                </button>
                
                <div className="h-px bg-slate-100 my-1"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2">Layout Otimizado</p>
                
                <button 
                  onClick={() => handleCopy(true)}
                  className="flex items-center gap-3 w-full p-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors text-left"
                >
                  <Smartphone size={18} className="text-indigo-500" />
                  <div>
                    <span className="font-semibold block">Copiar p/ Status/Stories</span>
                    <span className="text-[10px] opacity-60">Formatação com Emojis ✨</span>
                  </div>
                </button>

                <button 
                  onClick={() => handleShare('email')}
                  className="flex items-center gap-3 w-full p-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors text-left"
                >
                  <Mail size={18} className="text-slate-400" />
                  <span className="font-semibold">E-mail</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="prose prose-slate max-w-none pt-2">
        {renderContent(content)}
      </div>

      {/* Footer card brand */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between opacity-40">
        <div className="flex items-center gap-1.5">
          <Smartphone size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Bíblia Viva & Adaptada</span>
        </div>
        <span className="text-[10px] font-medium italic">NVI - Nova Versão Internacional</span>
      </div>

      {showShareMenu && (
        <div className="fixed inset-0 z-0 cursor-default" onClick={() => setShowShareMenu(false)}></div>
      )}
    </div>
  );
};

export default ResultCard;
