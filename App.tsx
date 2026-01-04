
import React, { useState, useRef } from 'react';
import { Navigation } from './components/Navigation';
import { FortuneCalculator } from './components/PrayerGenerator'; // Renamed export in component
import { FaceReader } from './components/ImageEditor'; // Renamed export in component
import { DivinationTools } from './components/DivinationTools';
import { AudioPlayer } from './components/AudioPlayer';
import { Language, Track } from './types';
import { translations } from './utils/translations';
import { Globe, Upload, Play, Disc } from 'lucide-react';
import { healingTracks } from './data/tracks';

function App() {
  const [currentTab, setCurrentTab] = useState('destiny');
  const [language, setLanguage] = useState<Language>('zh'); // Default to Chinese for this app type
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [userTracks, setUserTracks] = useState<Track[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[language];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newTrack: Track = {
      id: `user-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ""), 
      subtitle: t.music.userTrack,
      duration: "--:--",
      coverUrl: "https://picsum.photos/seed/user/400/400?grayscale",
      url: url
    };

    setUserTracks(prev => [newTrack, ...prev]);
    setCurrentTrack(newTrack);
  };

  const allTracks = [...userTracks, ...healingTracks];

  return (
    <div className="min-h-screen bg-[#F8F5F1] flex flex-col md:flex-row font-sans text-slate-900 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]">
      
      {/* Navigation */}
      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} t={t} />

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto h-screen pb-24 md:pb-0">
        
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#F8F5F1]/90 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-amber-200/40">
          <div className="md:hidden">
             <h1 className="font-bold text-amber-900 font-serif text-lg">{t.app.title}</h1>
          </div>
          
          <div className="flex-1 md:flex-none flex justify-end">
            <div className="flex items-center space-x-2 bg-white/50 px-3 py-1.5 rounded-full border border-amber-200">
              <Globe className="w-4 h-4 text-amber-600" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-sm font-medium text-amber-900 focus:outline-none cursor-pointer"
              >
                <option value="zh">繁體中文</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="ru">Русский</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-12 max-w-7xl mx-auto h-full">
          
          {currentTab === 'destiny' && (
             <FortuneCalculator language={language} t={t} />
          )}

          {currentTab === 'face' && (
            <FaceReader language={language} t={t} />
          )}

          {currentTab === 'tools' && (
            <DivinationTools language={language} t={t} />
          )}

          {currentTab === 'music' && (
            <div className="space-y-12 animate-in fade-in duration-500 slide-in-from-bottom-4">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-amber-200 pb-8">
                <div className="text-center md:text-left space-y-2">
                  <h2 className="text-4xl font-serif tracking-tight text-amber-900">{t.music.title}</h2>
                  <p className="text-amber-800/60">{t.music.subtitle}</p>
                </div>
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-amber-200 hover:bg-amber-50 text-amber-900 shadow-sm hover:shadow transition-all font-medium text-sm"
                >
                  <Upload className="w-4 h-4" />
                  {t.music.upload}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="audio/*" 
                  className="hidden" 
                />
              </div>

              {/* Player */}
              <div className="max-w-xl mx-auto">
                 <AudioPlayer 
                    audioUrl={currentTrack?.url}
                    t={t}
                    title={currentTrack?.title}
                    subtitle={currentTrack?.subtitle}
                    coverUrl={currentTrack?.coverUrl}
                 />
              </div>
              
              {/* Track Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {allTracks.map((track) => (
                   <div 
                      key={track.id} 
                      onClick={() => setCurrentTrack(track)}
                      className={`group bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-all border cursor-pointer flex items-center space-x-4 ${currentTrack?.id === track.id ? 'border-red-800 ring-1 ring-red-800/20' : 'border-amber-100'}`}
                    >
                      <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden relative flex-shrink-0">
                        <img 
                          src={track.coverUrl} 
                          alt="Cover" 
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${currentTrack?.id === track.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                           <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium truncate ${currentTrack?.id === track.id ? 'text-red-900' : 'text-amber-900'}`}>{track.title}</h3>
                        <p className="text-xs text-amber-800/50 mt-1">{track.subtitle}</p>
                      </div>
                      {currentTrack?.id === track.id && (
                        <Disc className="w-5 h-5 text-red-800 animate-spin-slow" />
                      )}
                   </div>
                 ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
