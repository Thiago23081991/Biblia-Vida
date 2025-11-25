import React from 'react';
import ReactMarkdown from 'react-markdown';
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
          icon: "text-yellow-600"
        };
      case AudienceType.TEEN:
        return {
          container: "bg-purple-50 border-purple-200 font-sans text-base text-slate-800",
          heading: "text-purple-700 font-bold tracking-tight",
          icon: "text-purple-600"
        };
      case AudienceType.ADULT:
        return {
          container: "bg-white border-slate-200 shadow-sm font-serif text-base text-slate-800 leading-relaxed",
          heading: "text-blue-900 font-semibold border-b border-blue-100 pb-1 mb-2",
          icon: "text-blue-800"
        };
      default:
        return {
          container: "bg-white",
          heading: "",
          icon: ""
        };
    }
  };

  const styles = getStyles();

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

      <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:mb-2 prose-p:my-2 prose-strong:text-current">
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className={`text-xl mb-4 ${styles.heading}`} {...props} />,
            h2: ({node, ...props}) => <h2 className={`text-lg mt-4 mb-2 ${styles.heading}`} {...props} />,
            strong: ({node, ...props}) => <strong className="font-extrabold opacity-90" {...props} />,
            p: ({node, ...props}) => <p className="mb-4" {...props} />
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ResultCard;
