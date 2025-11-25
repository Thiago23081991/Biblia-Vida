import React from 'react';
import { AudienceType } from '../types';
import { Share2, Copy, Check } from 'lucide-react';

interface ResultCardProps {
  content: string;
  audience: AudienceType;
}

const ResultCard: React.FC<ResultCardProps> = ({ content, audience }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStyles = () => {
    switch (audience) {
      case AudienceType.CHILD:
        return {
          container: "bg-yellow-50 border-yellow-200 font-hand text-lg text-slate-800",
          heading: "text-yellow-700",
          strong: "text-yellow-900",
        };
      case AudienceType.TEEN:
        return {
          container: "bg-purple-50 border-purple-200 font-sans text-base text-slate-800",
          heading: "text-purple-700 font-bold tracking-tight",
          strong: "text-purple-900",
        };
      case AudienceType.ADULT:
        return {
          container: "bg-white border-slate-200 shadow-sm font-serif text-base text-slate-800 leading-relaxed",
          heading: "text-blue-900 font-semibold border-b border-blue-100 pb-1 mb-2 mt-4",
          strong: "text-slate-900",
        };
      default:
        return {
          container: "bg-white",
          heading: "font-bold mt-4",
          strong: "font-bold",
        };
    }
  };

  const styles = getStyles();

  // Simple parser to handle Markdown-like syntax from Gemini without heavy dependencies
  // Handles: **bold**, ## Headers, and newlines
  const renderContent = (text: string) => {
    if (!text) return null;

    return text.split('\n').map((line, index) => {
      // Handle empty lines as spacers
      if (!line.trim()) {
        return <div key={index} className="h-2"></div>;
      }

      // Handle Headers (##)
      if (line.startsWith('## ') || line.startsWith('**📖') || line.startsWith('**🎯') || line.startsWith('**💬') || line.startsWith('**💡')) {
        const cleanLine = line.replace(/##\s?|\*\*/g, '');
        return <h3 key={index} className={`text-lg ${styles.heading}`}>{cleanLine}</h3>;
      }

      // Handle regular paragraphs with **bold** parsing
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
      
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={handleCopy}
          className={`p-2 rounded-full transition-colors ${audience === AudienceType.CHILD ? 'hover:bg-yellow-200' : audience === AudienceType.TEEN ? 'hover:bg-purple-200' : 'hover:bg-slate-100'}`}
          title="Copiar texto"
        >
          {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="opacity-50" />}
        </button>
      </div>

      <div className="prose prose-slate max-w-none">
        {renderContent(content)}
      </div>
    </div>
  );
};

export default ResultCard;