
import React, { useState, useEffect } from 'react';
import { getOfflineItems, deleteOfflineItem, clearAllOffline } from '../services/offlineStorage';
import { OfflineItem } from '../types';
import { Trash2, BookOpen, Coffee, Sparkles, WifiOff, Clock, Search, ChevronRight, AlertTriangle } from 'lucide-react';

interface OfflineViewProps {
  onSelectItem: (item: OfflineItem) => void;
}

const OfflineView: React.FC<OfflineViewProps> = ({ onSelectItem }) => {
  const [items, setItems] = useState<OfflineItem[]>([]);
  const [filter, setFilter] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setItems(getOfflineItems());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteOfflineItem(id);
    setItems(getOfflineItems());
  };

  const handleClearAll = () => {
    clearAllOffline();
    setItems([]);
    setConfirmClear(false);
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(filter.toLowerCase()) || 
    item.content.toLowerCase().includes(filter.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bible': return <BookOpen size={16} />;
      case 'devotional': return <Coffee size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'bible': return 'Capítulo';
      case 'devotional': return 'Devocional';
      default: return 'Estudo';
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-4xl mx-auto">
      
      {/* Header Offline */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 md:p-10 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-slate-800 p-2 rounded-xl text-slate-400">
              <WifiOff size={24} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Biblioteca Offline</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-serif font-black text-white mb-2">Seus Downloads</h2>
          <p className="text-slate-400 text-sm md:text-base max-w-lg">
            Acesse seus capítulos e devocionais salvos sem precisar de internet. Tudo disponível instantaneamente.
          </p>
        </div>
        <WifiOff className="absolute -right-6 -bottom-6 text-slate-800 opacity-50 w-48 h-48 -rotate-12 pointer-events-none" />
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar nos seus downloads..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full h-14 bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 text-white focus:border-brand-400 outline-none transition-colors"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        </div>
        
        {items.length > 0 && (
          <div className="flex-shrink-0">
             {!confirmClear ? (
               <button 
                 onClick={() => setConfirmClear(true)}
                 className="w-full md:w-auto h-14 px-6 bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl font-bold hover:text-red-400 hover:border-red-900/50 transition-colors flex items-center justify-center gap-2"
               >
                 <Trash2 size={18} /> Limpar Tudo
               </button>
             ) : (
               <div className="flex gap-2">
                 <button 
                   onClick={handleClearAll}
                   className="h-14 px-6 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors flex items-center gap-2 animate-fade-in"
                 >
                   <AlertTriangle size={18} /> Confirmar
                 </button>
                 <button 
                   onClick={() => setConfirmClear(false)}
                   className="h-14 px-4 bg-slate-800 text-slate-400 rounded-2xl font-bold hover:bg-slate-700 transition-colors"
                 >
                   Cancelar
                 </button>
               </div>
             )}
          </div>
        )}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
              <BookOpen size={24} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Sua biblioteca está vazia</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              Quando estiver lendo um capítulo ou devocional, clique no ícone de <span className="text-brand-400 font-bold">Download</span> para salvar aqui.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group bg-slate-900 border border-slate-800 hover:border-brand-400/50 rounded-3xl p-5 cursor-pointer transition-all active:scale-[0.98] relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`
                  flex items-center gap-2 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest
                  ${item.type === 'bible' ? 'bg-brand-400/10 text-brand-400' : 'bg-blue-500/10 text-blue-400'}
                `}>
                  {getTypeIcon(item.type)}
                  {getTypeLabel(item.type)}
                </div>
                
                <button 
                  onClick={(e) => handleDelete(e, item.id)}
                  className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-brand-400 transition-colors line-clamp-1">
                {item.title}
              </h3>
              
              <p className="text-slate-500 text-xs mb-4 line-clamp-2 leading-relaxed">
                {item.content.replace(/\*|#/g, '')}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 uppercase">
                  <Clock size={12} />
                  {new Date(item.timestamp).toLocaleDateString()}
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-brand-400 group-hover:text-black transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OfflineView;
