
import React, { useState, useRef } from 'react';
import { Upload, ScanFace, Plus, X, Trash2 } from 'lucide-react';
import { analyzePhysiognomy } from '../services/geminiService';
import { LoadingState, Language } from '../types';
import { Translation } from '../utils/translations';

interface FaceReaderProps {
  language: Language;
  t: Translation;
}

export const FaceReader: React.FC<FaceReaderProps> = ({ language, t }) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [status, setStatus] = useState<LoadingState>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const filePromises = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result) {
              resolve(reader.result as string);
            }
          };
          reader.readAsDataURL(file as Blob);
        });
      });

      const newImages = await Promise.all(filePromises);
      // Append new images to the existing selection
      setSelectedImages(prev => [...prev, ...newImages]);
      setAnalysis('');
      setStatus('idle');
      
      // Reset input so selecting the same file again works if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllImages = () => {
    setSelectedImages([]);
    setAnalysis('');
    setStatus('idle');
  }

  const handleAnalyze = async () => {
    if (selectedImages.length === 0) return;

    setStatus('loading');
    try {
      // Extract base64 data from data URLs
      const base64Images = selectedImages.map(img => img.split(',')[1]);
      
      const result = await analyzePhysiognomy(base64Images, language);
      setAnalysis(result);
      setStatus('success');
    } catch (error) {
      console.error(error);
      setAnalysis(t.common.error);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-serif text-amber-900">{t.face.title}</h2>
        <p className="text-amber-800/60">{t.face.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload & Input Section */}
        <div className="space-y-6">
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`min-h-[300px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group bg-white shadow-sm p-4 ${selectedImages.length > 0 ? 'border-amber-400' : 'border-amber-200 hover:border-amber-400 hover:bg-amber-50'}`}
          >
            {selectedImages.length > 0 ? (
              <div className="w-full h-full grid grid-cols-2 gap-2">
                {selectedImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group/img shadow-sm border border-amber-100">
                    <img src={img} alt={`Analysis Target ${idx + 1}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                      className="absolute top-1 right-1 bg-black/50 hover:bg-red-600 text-white rounded-full p-1 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {/* Add more button tile */}
                <div className="flex items-center justify-center bg-amber-50/50 rounded-xl aspect-square border-2 border-dashed border-amber-200 hover:bg-amber-100 hover:border-amber-400 transition-all group/add">
                   <div className="text-amber-800/50 group-hover/add:text-amber-800 flex flex-col items-center">
                      <Plus className="w-8 h-8 mb-1" />
                      <span className="text-xs font-bold uppercase">{t.face.add}</span>
                   </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-amber-800/40 p-6">
                <div className="w-20 h-20 rounded-full bg-amber-50 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-8 h-8" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wider">{t.face.upload}</span>
                <p className="text-xs mt-2 opacity-70">Supports: Face, Palm, multiple angles</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*"
              multiple // Allow multiple files
            />
          </div>

          <div className="flex space-x-3">
            <button 
              onClick={handleAnalyze}
              disabled={selectedImages.length === 0 || status === 'loading'}
              className="flex-1 py-4 bg-amber-900 text-white rounded-xl font-bold hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transition-all shadow-lg shadow-amber-900/20"
            >
              {status === 'loading' ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              ) : (
                <>
                  <ScanFace className="w-5 h-5" />
                  <span>{t.face.analyze} ({selectedImages.length})</span>
                </>
              )}
            </button>
            
            {selectedImages.length > 0 && (
              <button 
                onClick={clearAllImages}
                className="px-4 py-4 bg-white border border-amber-200 text-amber-800 rounded-xl hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors shadow-sm"
                title={t.face.clear}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Analysis Section */}
        <div className="bg-[#FDFBF7] p-8 rounded-3xl shadow-inner border border-amber-200 relative overflow-hidden flex flex-col min-h-[500px]">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <ScanFace className="w-32 h-32 text-amber-900" />
          </div>

          {!analysis ? (
             <div className="flex-1 flex flex-col items-center justify-center text-amber-900/30 text-center p-8">
               <p className="font-serif italic text-lg">{status === 'loading' ? t.face.analyzing : t.face.result}</p>
             </div>
          ) : (
             <div className="relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
               <h3 className="font-serif text-xl text-amber-900 mb-6 border-b border-amber-200 pb-2 flex items-center">
                 <span className="w-2 h-8 bg-red-800 mr-3 rounded-full"></span>
                 {t.face.result}
               </h3>
               <div className="prose prose-amber prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-serif-sc">
                 {analysis}
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
