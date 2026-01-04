
import React, { useState } from 'react';
import { Flame, Apple, Coffee, Flower, Sparkles, Trash2 } from 'lucide-react';
import { Translation } from '../utils/translations';
import { Language } from '../types';

interface VirtualShrineProps {
  language: Language;
  t: Translation;
}

interface Offering {
  id: string;
  type: 'fruit' | 'tea' | 'flower';
  x: number; // Random horizontal position
}

export const VirtualShrine: React.FC<VirtualShrineProps> = ({ t }) => {
  const [isIncenseLit, setIsIncenseLit] = useState(false);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [meritCount, setMeritCount] = useState(0);

  const playSound = () => {
    const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3");
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio interaction needed"));
  };

  const addOffering = (type: 'fruit' | 'tea' | 'flower') => {
    playSound();
    const newOffering: Offering = {
      id: Date.now().toString(),
      type,
      x: Math.random() * 80 + 10 // Random position between 10% and 90%
    };
    setOfferings(prev => [...prev, newOffering]);
    setMeritCount(prev => prev + 1);
  };

  const lightIncense = () => {
    if (!isIncenseLit) {
      playSound();
      setIsIncenseLit(true);
      setMeritCount(prev => prev + 3);
    }
  };

  const cleanAltar = () => {
    setOfferings([]);
    setIsIncenseLit(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <div className="text-center space-y-4 mb-6">
        <h2 className="text-4xl font-serif-sc text-amber-900 font-bold">{t.shrine.title}</h2>
        <p className="text-amber-800/60 font-serif-sc">{t.shrine.subtitle}</p>
      </div>

      {/* Main Shrine Area */}
      <div className="flex-1 bg-amber-950 rounded-t-3xl shadow-2xl relative overflow-hidden border-4 border-amber-900 flex flex-col items-center">
        
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-amber-900/20 to-amber-950/90 pointer-events-none"></div>

        {/* Buddha Statue */}
        <div className="relative z-10 mt-8 w-64 h-80 md:w-80 md:h-96">
           {/* Halo Effect */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-amber-400/20 blur-3xl animate-pulse"></div>
           <div className="w-full h-full bg-[url('https://picsum.photos/seed/buddha_golden/600/800')] bg-contain bg-center bg-no-repeat drop-shadow-2xl filter brightness-110 contrast-125 sepia-[0.3]"></div>
        </div>

        {/* Altar Table */}
        <div className="w-full h-48 bg-[#3d1c0b] mt-auto relative z-20 flex items-end justify-center perspective-1000 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t-8 border-[#5e2c12]">
            
            {/* Table Texture */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>

            {/* Incense Burner */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
               {isIncenseLit && (
                 <div className="relative -top-2">
                    {/* Smoke Particles */}
                    <div className="absolute bottom-0 left-[-5px] w-2 h-20 bg-gray-200/40 rounded-full blur-md animate-smoke-1"></div>
                    <div className="absolute bottom-0 left-[0px] w-2 h-24 bg-gray-200/30 rounded-full blur-md animate-smoke-2 delay-100"></div>
                    <div className="absolute bottom-0 left-[5px] w-2 h-16 bg-gray-200/40 rounded-full blur-md animate-smoke-3 delay-200"></div>
                    
                    {/* Glowing Tips */}
                    <div className="flex space-x-1">
                       <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse blur-[1px]"></div>
                       <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse blur-[1px]"></div>
                       <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse blur-[1px]"></div>
                    </div>
                 </div>
               )}
               {/* Burner Body */}
               <div className="w-16 h-12 bg-gradient-to-r from-amber-700 to-yellow-600 rounded-b-xl rounded-t-sm shadow-lg border-2 border-yellow-800 flex items-center justify-center">
                 <span className="text-yellow-900 text-xs font-bold font-serif">佛</span>
               </div>
               {/* Sticks Base */}
               <div className="flex space-x-1 -mt-10">
                  <div className={`w-0.5 h-8 bg-amber-900 ${isIncenseLit ? 'opacity-100' : 'opacity-0'}`}></div>
                  <div className={`w-0.5 h-10 bg-amber-900 ${isIncenseLit ? 'opacity-100' : 'opacity-0'}`}></div>
                  <div className={`w-0.5 h-8 bg-amber-900 ${isIncenseLit ? 'opacity-100' : 'opacity-0'}`}></div>
               </div>
            </div>

            {/* Offerings on Table */}
            <div className="absolute bottom-4 left-0 right-0 h-24 px-8 flex items-end justify-center pointer-events-none">
              {offerings.map((item) => (
                <div 
                  key={item.id} 
                  className="absolute bottom-2 transition-all animate-bounce-in drop-shadow-xl"
                  style={{ left: `${item.x}%`, zIndex: item.type === 'flower' ? 5 : 10 }}
                >
                   {item.type === 'fruit' && <Apple className="w-8 h-8 text-red-500 fill-red-500" />}
                   {item.type === 'tea' && <Coffee className="w-6 h-6 text-amber-200 fill-amber-900/80" />}
                   {item.type === 'flower' && <Flower className="w-10 h-10 text-pink-400 fill-pink-200" />}
                </div>
              ))}
            </div>

        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#FDFBF7] p-6 rounded-b-3xl border border-t-0 border-amber-200 shadow-lg">
         
         <div className="flex justify-between items-center mb-6 px-4">
            <div className="flex items-center space-x-2 bg-amber-100 px-4 py-1 rounded-full border border-amber-200">
               <Sparkles className="w-4 h-4 text-amber-600" />
               <span className="text-amber-900 font-bold font-serif-sc text-sm">{t.shrine.merit}: {meritCount}</span>
            </div>
            {offerings.length > 0 && (
               <button onClick={cleanAltar} className="text-xs text-amber-800/50 hover:text-red-700 flex items-center gap-1">
                 <Trash2 className="w-3 h-3" /> {t.shrine.clean}
               </button>
            )}
         </div>

         <div className="grid grid-cols-4 gap-4">
            <button 
               onClick={lightIncense}
               disabled={isIncenseLit}
               className={`flex flex-col items-center p-3 rounded-xl transition-all ${isIncenseLit ? 'bg-amber-100 opacity-50 cursor-default' : 'bg-white border border-amber-200 hover:bg-red-50 hover:border-red-200 hover:shadow-md'}`}
            >
               <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-2 text-red-600">
                  <Flame className={`w-6 h-6 ${!isIncenseLit ? 'animate-pulse' : ''}`} />
               </div>
               <span className="text-xs font-bold text-amber-900">{t.shrine.incense}</span>
            </button>

            <button 
               onClick={() => addOffering('fruit')}
               className="flex flex-col items-center p-3 rounded-xl bg-white border border-amber-200 hover:bg-green-50 hover:border-green-200 hover:shadow-md transition-all active:scale-95"
            >
               <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2 text-green-600">
                  <Apple className="w-6 h-6" />
               </div>
               <span className="text-xs font-bold text-amber-900">{t.shrine.fruit}</span>
            </button>

            <button 
               onClick={() => addOffering('tea')}
               className="flex flex-col items-center p-3 rounded-xl bg-white border border-amber-200 hover:bg-orange-50 hover:border-orange-200 hover:shadow-md transition-all active:scale-95"
            >
               <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-2 text-orange-600">
                  <Coffee className="w-6 h-6" />
               </div>
               <span className="text-xs font-bold text-amber-900">{t.shrine.tea}</span>
            </button>

            <button 
               onClick={() => addOffering('flower')}
               className="flex flex-col items-center p-3 rounded-xl bg-white border border-amber-200 hover:bg-pink-50 hover:border-pink-200 hover:shadow-md transition-all active:scale-95"
            >
               <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mb-2 text-pink-600">
                  <Flower className="w-6 h-6" />
               </div>
               <span className="text-xs font-bold text-amber-900">{t.shrine.flower}</span>
            </button>
         </div>
      </div>
      
      <style>{`
        @keyframes smoke-1 {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.6; }
          100% { transform: translateY(-40px) scale(2) translateX(-5px); opacity: 0; }
        }
        @keyframes smoke-2 {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          30% { opacity: 0.5; }
          100% { transform: translateY(-50px) scale(2.5) translateX(5px); opacity: 0; }
        }
        @keyframes smoke-3 {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          40% { opacity: 0.4; }
          100% { transform: translateY(-30px) scale(1.5) translateX(0px); opacity: 0; }
        }
        .animate-smoke-1 { animation: smoke-1 3s infinite ease-out; }
        .animate-smoke-2 { animation: smoke-2 4s infinite ease-out; }
        .animate-smoke-3 { animation: smoke-3 2.5s infinite ease-out; }
      `}</style>
    </div>
  );
};
