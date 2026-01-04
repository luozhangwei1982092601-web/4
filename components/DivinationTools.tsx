
import React, { useState } from 'react';
import { CloudMoon, HeartHandshake, ScrollText, Calculator, ChevronRight, X } from 'lucide-react';
import { Translation } from '../utils/translations';
import { consultDivination } from '../services/geminiService';
import { Language } from '../types';

interface DivinationToolsProps {
  language: Language;
  t: Translation;
}

type ToolType = 'dream' | 'match' | 'sticks' | 'number';

export const DivinationTools: React.FC<DivinationToolsProps> = ({ language, t }) => {
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form States
  const [dreamInput, setDreamInput] = useState('');
  const [matchInput, setMatchInput] = useState({ p1: '', p2: '' });
  const [stickInput, setStickInput] = useState('');
  const [numberInput, setNumberInput] = useState('');

  const tools = [
    { id: 'dream' as ToolType, icon: CloudMoon, title: t.tools.dream.title, desc: t.tools.dream.desc, color: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
    { id: 'match' as ToolType, icon: HeartHandshake, title: t.tools.match.title, desc: t.tools.match.desc, color: 'bg-pink-50 text-pink-900 border-pink-200' },
    { id: 'sticks' as ToolType, icon: ScrollText, title: t.tools.sticks.title, desc: t.tools.sticks.desc, color: 'bg-amber-50 text-amber-900 border-amber-200' },
    { id: 'number' as ToolType, icon: Calculator, title: t.tools.number.title, desc: t.tools.number.desc, color: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
  ];

  const handleConsult = async () => {
    if (!activeTool) return;
    setIsLoading(true);
    setResult('');

    let inputData;
    if (activeTool === 'dream') inputData = { dream: dreamInput };
    if (activeTool === 'match') inputData = matchInput;
    if (activeTool === 'sticks') inputData = { question: stickInput };
    if (activeTool === 'number') inputData = { number: numberInput };

    try {
      const res = await consultDivination(activeTool, inputData, language);
      setResult(res);
    } catch (e) {
      setResult(t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeTool = () => {
    setActiveTool(null);
    setResult('');
    setDreamInput('');
    setMatchInput({ p1: '', p2: '' });
    setStickInput('');
    setNumberInput('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-serif text-amber-900">{t.tools.title}</h2>
        <p className="text-amber-800/60">{t.tools.subtitle}</p>
      </div>

      {/* Grid of Tools */}
      {!activeTool && (
        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex items-start space-x-4 ${tool.color}`}
            >
              <div className="p-3 bg-white/50 rounded-xl">
                <tool.icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold font-serif-sc text-xl mb-1">{tool.title}</h3>
                <p className="text-sm opacity-80">{tool.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 opacity-40 self-center" />
            </button>
          ))}
        </div>
      )}

      {/* Active Tool View */}
      {activeTool && (
        <div className="bg-[#fcfaf5] p-6 md:p-8 rounded-2xl shadow-xl border border-amber-200 relative">
          <button 
            onClick={closeTool}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-amber-100 text-amber-900/50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-2 rounded-lg ${tools.find(t => t.id === activeTool)?.color}`}>
               {React.createElement(tools.find(t => t.id === activeTool)?.icon || Calculator, { className: "w-6 h-6" })}
            </div>
            <h3 className="text-2xl font-bold font-serif-sc text-amber-900">
              {tools.find(t => t.id === activeTool)?.title}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {/* Dream Input */}
              {activeTool === 'dream' && (
                <div>
                   <label className="block text-sm font-bold text-amber-900 mb-2">{t.tools.dream.input}</label>
                   <textarea 
                     rows={5}
                     value={dreamInput}
                     onChange={(e) => setDreamInput(e.target.value)}
                     className="w-full bg-white border border-amber-300 rounded-lg p-3 outline-none focus:ring-1 focus:ring-indigo-800"
                     placeholder="e.g., I was flying over a mountain..."
                   />
                </div>
              )}

              {/* Match Input */}
              {activeTool === 'match' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-amber-900 mb-2">{t.tools.match.p1}</label>
                    <input 
                      type="text"
                      value={matchInput.p1}
                      onChange={(e) => setMatchInput({...matchInput, p1: e.target.value})}
                      className="w-full bg-white border border-amber-300 rounded-lg p-3 outline-none focus:ring-1 focus:ring-pink-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-amber-900 mb-2">{t.tools.match.p2}</label>
                    <input 
                      type="text"
                      value={matchInput.p2}
                      onChange={(e) => setMatchInput({...matchInput, p2: e.target.value})}
                      className="w-full bg-white border border-amber-300 rounded-lg p-3 outline-none focus:ring-1 focus:ring-pink-800"
                    />
                  </div>
                </div>
              )}

              {/* Sticks Input */}
              {activeTool === 'sticks' && (
                <div>
                   <label className="block text-sm font-bold text-amber-900 mb-2">{t.tools.sticks.input}</label>
                   <textarea 
                     rows={3}
                     value={stickInput}
                     onChange={(e) => setStickInput(e.target.value)}
                     className="w-full bg-white border border-amber-300 rounded-lg p-3 outline-none focus:ring-1 focus:ring-amber-800"
                   />
                </div>
              )}

              {/* Number Input */}
              {activeTool === 'number' && (
                <div>
                   <label className="block text-sm font-bold text-amber-900 mb-2">{t.tools.number.input}</label>
                   <input 
                     type="text"
                     value={numberInput}
                     onChange={(e) => setNumberInput(e.target.value)}
                     className="w-full bg-white border border-amber-300 rounded-lg p-3 outline-none focus:ring-1 focus:ring-emerald-800 text-lg tracking-widest"
                     placeholder="13800138000"
                   />
                </div>
              )}

              <button 
                onClick={handleConsult}
                disabled={isLoading}
                className="w-full py-3 bg-amber-900 text-white rounded-lg font-bold hover:bg-amber-800 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Consulting...' : 
                  activeTool === 'dream' ? t.tools.dream.btn :
                  activeTool === 'match' ? t.tools.match.btn :
                  activeTool === 'sticks' ? t.tools.sticks.btn :
                  t.tools.number.btn
                }
              </button>
            </div>

            {/* Result Area */}
            <div className="bg-white/50 rounded-xl p-6 border border-amber-100 min-h-[300px] flex flex-col">
              {result ? (
                 <div className="prose prose-amber max-w-none text-slate-800 font-serif-sc leading-relaxed whitespace-pre-wrap flex-1 overflow-y-auto custom-scrollbar">
                    {result}
                 </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-amber-900/20">
                   <div className="w-16 h-16 border-2 border-dashed border-current rounded-full flex items-center justify-center mb-2">
                     ?
                   </div>
                   <p className="text-sm font-serif-sc">Awaiting your question...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
