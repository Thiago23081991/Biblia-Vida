import React, { useState } from 'react';
import { AudienceType } from '../types';
import { Copy, Check, Share2, Mail, MessageCircle, Twitter } from 'lucide-react';

interface ResultCardProps {
  content: string;
  audience: AudienceType;
}

const ResultCard: React.FC<ResultCardProps> = ({ content, audience }) => {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'email') => {
    const appUrl = window.location.href;
    const footer = `\n\n— Gerado por Bíblia Viva & Adaptada: ${appUrl}`;
    
    // Preparar texto (Truncar para Twitter se necessário)
    const textFull = encodeURIComponent(content + footer);
    const textShort = encodeURIComponent(content.substring(0, 240) + '...' + footer);
    
    let url = '';

    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${textFull}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${textShort}`;
        break;
      case 'email':
        url = `mailto:?subject=Uma mensagem bíblica especial para você&body=${textFull}`;
        break;
    }

    if (url) {
      window.open(url, '_blank');
      setShowShareMenu(false);
    }
  };

  const getStyles = () => {
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
        return {
          container: "bg-white",
          heading: "font-bold mt-4",
          strong: "font-bold",
          buttonHover: "hover:bg-slate-100",
        };
    }
  };

  const styles = getStyles();

  // Simple parser to handle Markdown-like syntax from Gemini without heavy dependencies
  const renderContent = (text: string) => {
    if (!text) return null;

    return text.split('\n').map((line, index) => {
      if (!line.trim()) {
        return <div key={index} className="h-2"></div>;
      }

      if (line.startsWith('## ') || line.startsWith('**📖') || line.startsWith('**🎯') || line.startsWith('**💬') || line.startsWith('**💡')) {
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
    <div className={`w-full rounded-2xl border p-6 md:p-8 mt-6 relative animate-fade-in ${styles.container}`}>
      
      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        
        {/* Copy Button */}
        <button 
          onClick={handleCopy}
          className={`p-2 rounded-full transition-colors ${styles.buttonHover}`}
          title="Copiar texto"
        >
          {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} className="opacity-60" />}
        </button>

        {/* Share Button & Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowShareMenu(!showShareMenu)}
            className={`p-2 rounded-full transition-colors ${showShareMenu ? 'bg-black/5' : ''} ${styles.buttonHover}`}
            title="Compartilhar"
          >
            <Share2 size={20} className="opacity-60" />
          </button>

          {showShareMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in z-20">
              <div className="p-1">
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center gap-3 w-full p-2.5 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors text-left"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </button>
                <button 
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-3 w-full p-2.5 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg transition-colors text-left"
                >
                  <Twitter size={16} />
                  <span>Twitter / X</span>
                </button>
                <button 
                  onClick={() => handleShare('email')}
                  className="flex items-center gap-3 w-full p-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors text-left"
                >
                  <Mail size={16} />
                  <span>E-mail</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="prose prose-slate max-w-none pt-2">
        {renderContent(content)}
      </div>

      {/* Backdrop to close menu when clicking outside */}
      {showShareMenu && (
        <div 
          className="fixed inset-0 z-0 cursor-default" 
          onClick={() => setShowShareMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default ResultCard;