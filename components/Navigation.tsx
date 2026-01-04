
import React from 'react';
import { Scroll, Eye, Music, LayoutGrid } from 'lucide-react';
import { Translation } from '../utils/translations';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  t: Translation;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange, t }) => {
  const navItems = [
    { id: 'destiny', label: t.nav.destiny, icon: Scroll },
    { id: 'face', label: t.nav.face, icon: Eye },
    { id: 'tools', label: t.nav.tools, icon: LayoutGrid },
    { id: 'music', label: t.nav.music, icon: Music },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#FDFBF7] border-t border-amber-200 p-2 md:relative md:border-t-0 md:bg-transparent md:w-72 md:h-screen md:flex md:flex-col md:border-r md:border-amber-200/50 z-30">
      <div className="hidden md:block p-8 border-b border-amber-100/50 mb-4 bg-amber-50/30">
        <h1 className="text-4xl font-bold text-red-900 font-serif-sc tracking-tight">{t.app.title}</h1>
        <div className="mt-4 pt-4 border-t border-amber-200/50">
           <p className="text-sm text-amber-900 font-serif-sc leading-relaxed italic opacity-80">
             {t.app.couplet}
           </p>
        </div>
      </div>
      
      <div className="flex justify-around md:flex-col md:space-y-4 md:px-4">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col md:flex-row items-center md:space-x-4 p-3 md:p-4 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'text-red-900 bg-amber-100/80 shadow-sm border border-amber-200' 
                  : 'text-amber-900/60 hover:text-red-800 hover:bg-amber-50'
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-red-900/10' : 'group-hover:bg-amber-100'}`}>
                <item.icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
              </div>
              <span className={`text-xs md:text-base md:font-medium font-serif-sc mt-1 md:mt-0 tracking-wide`}>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="hidden md:flex flex-1 items-end p-8 opacity-40">
        <img src="https://www.transparenttextures.com/patterns/oriental-tiles.png" className="absolute bottom-0 left-0 w-full h-32 opacity-10 pointer-events-none" alt="" />
        <p className="text-xs text-amber-900 font-serif-sc">© Eastern Culture Fortune</p>
      </div>
    </div>
  );
};
