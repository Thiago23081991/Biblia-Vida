import React, { useState } from 'react';
import { studyThemes } from '../data/studyThemes';
import { ChevronRight } from 'lucide-react';

interface StudySelectorProps {
  onSelectTopic: (topic: string) => void;
}

const StudySelector: React.FC<StudySelectorProps> = ({ onSelectTopic }) => {
  const [activeCategory, setActiveCategory] = useState<string>(studyThemes[0].id);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const currentCategory = studyThemes.find(c => c.id === activeCategory);

  const handleTopicClick = (topic: string) => {
    setSelectedTopic(topic);
    onSelectTopic(topic);
  };

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[400px] animate-fade-in">
      
      {/* Sidebar - Categories */}
      <div className="w-full md:w-1/3 bg-white border-b md:border-b-0 md:border-r border-slate-200 overflow-y-auto">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categorias</h3>
        </div>
        <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible">
          {studyThemes.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 md:flex-shrink w-auto flex items-center gap-3 p-4 text-left transition-colors relative
                  ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 hidden md:block"></div>
                )}
                <div className={`p-2 rounded-lg ${isActive ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                  <Icon size={18} />
                </div>
                <span className={`font-medium whitespace-nowrap md:whitespace-normal ${isActive ? 'font-bold' : ''}`}>
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content - Topics */}
      <div className="w-full md:w-2/3 bg-slate-50/50 flex flex-col">
        {currentCategory && (
          <>
            <div className={`p-4 border-b border-slate-200 flex justify-between items-center ${currentCategory.color.split(' ')[0]} bg-opacity-20`}>
              <h3 className={`font-bold text-lg ${currentCategory.color.split(' ')[1]}`}>
                {currentCategory.name}
              </h3>
              <span className="text-xs font-medium px-2 py-1 bg-white/50 rounded-full text-slate-500">
                {currentCategory.topics.length} temas
              </span>
            </div>
            
            <div className="p-4 overflow-y-auto flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
              {currentCategory.topics.map((topic, idx) => {
                const isSelected = selectedTopic === topic.title;
                return (
                  <button
                    key={idx}
                    onClick={() => handleTopicClick(topic.title)}
                    className={`text-left p-3 rounded-xl border transition-all flex items-center justify-between group
                      ${isSelected 
                        ? 'bg-brand-600 border-brand-600 text-white shadow-md' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-brand-300 hover:shadow-sm'
                      }
                    `}
                  >
                    <div>
                      <div className="font-semibold">{topic.title}</div>
                      {topic.ref && (
                        <div className={`text-xs mt-1 ${isSelected ? 'text-brand-100' : 'text-slate-400'}`}>
                          {topic.ref}
                        </div>
                      )}
                    </div>
                    <ChevronRight size={16} className={`transform transition-transform ${isSelected ? 'translate-x-1' : 'opacity-0 group-hover:opacity-50'}`} />
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudySelector;