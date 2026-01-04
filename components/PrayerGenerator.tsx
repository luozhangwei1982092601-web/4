
import React, { useState, useEffect } from 'react';
import { FortuneInput, Gender, BloodType, Language, FortuneType } from '../types';
import { calculateFortune } from '../services/geminiService';
import { Translation } from '../utils/translations';
import { Moon, Sparkles, Star } from 'lucide-react';

interface FortuneCalculatorProps {
  language: Language;
  t: Translation;
}

interface Pillar {
  stem: string;
  branch: string;
  naYin?: string;
}

interface NameAnalysis {
  score: number;
  verdict: string;
}

interface ChartData {
  chart: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  };
  nameAnalysis?: NameAnalysis;
}

export const FortuneCalculator: React.FC<FortuneCalculatorProps> = ({ language, t }) => {
  const [formData, setFormData] = useState<FortuneInput>({
    surname: '',
    name: '',
    gender: Gender.MALE,
    bloodType: BloodType.O,
    birthDate: '1990-01-01',
    birthTime: '',
    birthLocation: '', // Initialize birthLocation
    type: 'full_report'
  });
  const [result, setResult] = useState<string>('');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lunarDateStr, setLunarDateStr] = useState<string>('');

  // Auto-calculate Lunar Date string when Gregorian date changes
  useEffect(() => {
    try {
      if (formData.birthDate) {
        const date = new Date(formData.birthDate);
        if (!isNaN(date.getTime())) {
          // Use Intl to format to Chinese Lunar Calendar
          const lunar = new Intl.DateTimeFormat('zh-CN', { 
            calendar: 'chinese', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }).format(date);
          setLunarDateStr(lunar);
        }
      }
    } catch (e) {
      console.log("Lunar calendar not supported by browser", e);
      setLunarDateStr('');
    }
  }, [formData.birthDate]);

  const handleCalculate = async () => {
    if (!formData.surname || !formData.name) return;

    setIsLoading(true);
    setResult('');
    setChartData(null);

    try {
      // Pass the client-side calculated lunar string to the service
      const payload = { ...formData, lunarDate: lunarDateStr };
      const fullPrediction = await calculateFortune(payload, language);
      
      // Parse JSON Chart if present
      let cleanText = fullPrediction;
      const jsonMatch = fullPrediction.match(/```json\n([\s\S]*?)\n```/);
      
      if (jsonMatch) {
        try {
          const jsonStr = jsonMatch[1];
          const data = JSON.parse(jsonStr);
          if (data.chart) {
            setChartData(data);
            // Remove the JSON block from the text display
            cleanText = fullPrediction.replace(jsonMatch[0], '').trim();
          }
        } catch (e) {
          console.error("Failed to parse Bazi JSON", e);
        }
      }

      setResult(cleanText);
    } catch (error) {
      setResult(t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 border-green-600 bg-green-50';
    if (score >= 80) return 'text-amber-600 border-amber-600 bg-amber-50';
    if (score >= 70) return 'text-blue-600 border-blue-600 bg-blue-50';
    return 'text-red-600 border-red-600 bg-red-50';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-4xl md:text-5xl font-serif-sc font-bold text-red-900 tracking-wide drop-shadow-sm">{t.destiny.title}</h2>
        <div className="h-1 w-32 bg-amber-500 mx-auto rounded-full"></div>
        <p className="text-amber-900/70 font-medium text-lg font-serif-sc">
          {t.destiny.subtitle}
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          <div className="bg-[#fcfaf5] p-6 md:p-8 rounded-none shadow-xl shadow-amber-900/10 border-4 border-double border-amber-200 relative flex-1">
            
            {/* Disclaimer */}
            <div className="bg-amber-100/50 border border-amber-200 rounded-md p-3 mb-6 flex items-start space-x-3">
               <Sparkles className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
               <p className="text-xs text-amber-800 leading-relaxed font-serif-sc">
                 {t.destiny.disclaimer}
               </p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-amber-900 font-serif-sc">{t.destiny.form.surname}</label>
                  <input 
                    type="text" 
                    value={formData.surname}
                    onChange={e => setFormData({...formData, surname: e.target.value})}
                    className="w-full bg-white border border-amber-300 rounded-sm p-2 focus:ring-1 focus:ring-red-800 focus:border-red-800 outline-none text-amber-900 shadow-inner"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-amber-900 font-serif-sc">{t.destiny.form.name}</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white border border-amber-300 rounded-sm p-2 focus:ring-1 focus:ring-red-800 focus:border-red-800 outline-none text-amber-900 shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-amber-900 font-serif-sc">{t.destiny.form.gender}</label>
                <div className="flex bg-white rounded-sm p-1 border border-amber-300">
                  <button 
                    onClick={() => setFormData({...formData, gender: Gender.MALE})}
                    className={`flex-1 py-1.5 rounded-sm text-sm font-medium transition-all font-serif-sc ${formData.gender === Gender.MALE ? 'bg-amber-100 text-red-900 font-bold shadow-sm' : 'text-amber-900/50 hover:bg-amber-50'}`}
                  >
                    {t.destiny.form.male}
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, gender: Gender.FEMALE})}
                    className={`flex-1 py-1.5 rounded-sm text-sm font-medium transition-all font-serif-sc ${formData.gender === Gender.FEMALE ? 'bg-amber-100 text-red-900 font-bold shadow-sm' : 'text-amber-900/50 hover:bg-amber-50'}`}
                  >
                    {t.destiny.form.female}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-amber-900 font-serif-sc">{t.destiny.form.bloodType}</label>
                <select 
                  value={formData.bloodType}
                  onChange={e => setFormData({...formData, bloodType: e.target.value as BloodType})}
                  className="w-full bg-white border border-amber-300 rounded-sm p-2 text-amber-900 focus:ring-1 focus:ring-red-800 outline-none font-sans"
                >
                  {Object.values(BloodType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-amber-900 font-serif-sc">{t.destiny.form.birthday}</label>
                  <input 
                    type="date" 
                    value={formData.birthDate}
                    onChange={e => setFormData({...formData, birthDate: e.target.value})}
                    className="w-full bg-white border border-amber-300 rounded-sm p-2 text-amber-900 focus:ring-1 focus:ring-red-800 outline-none font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-amber-900 font-serif-sc">{t.destiny.form.birthTime}</label>
                  <input 
                    type="time" 
                    value={formData.birthTime}
                    onChange={e => setFormData({...formData, birthTime: e.target.value})}
                    className="w-full bg-white border border-amber-300 rounded-sm p-2 text-amber-900 focus:ring-1 focus:ring-red-800 outline-none font-sans"
                  />
                </div>
              </div>

              {/* Birth Location Input */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-amber-900 font-serif-sc">{t.destiny.form.birthLocation}</label>
                <input 
                  type="text" 
                  value={formData.birthLocation}
                  onChange={e => setFormData({...formData, birthLocation: e.target.value})}
                  placeholder={language === 'zh' ? "例如：北京 / 上海" : "e.g. Beijing / New York"}
                  className="w-full bg-white border border-amber-300 rounded-sm p-2 text-amber-900 focus:ring-1 focus:ring-red-800 outline-none font-sans placeholder-amber-900/30"
                />
              </div>

              {/* Lunar Date Preview */}
              {lunarDateStr && (
                <div className="flex items-center space-x-2 text-xs text-amber-800/70 mt-1 bg-amber-50 p-2 rounded border border-amber-100">
                  <Moon className="w-3 h-3 text-amber-600" />
                  <span className="font-serif-sc">{t.destiny.form.lunarPreview}: {lunarDateStr}</span>
                </div>
              )}

            </div>

            <div className="mt-8 pt-6 border-t border-amber-200">
              <button
                onClick={handleCalculate}
                disabled={isLoading || !formData.surname || !formData.name}
                className="w-full bg-gradient-to-b from-[#e8f5e9] to-[#c8e6c9] border border-[#a5d6a7] text-[#2e7d32] font-serif-sc font-bold py-3 rounded shadow-sm hover:shadow-md hover:from-[#dcedc8] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
              >
                 <span>{isLoading ? t.destiny.form.calculating : t.destiny.form.calculate}</span>
              </button>
            </div>
            
            {/* Decorative Corner Ornaments */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-amber-400"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-amber-400"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-amber-400"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-amber-400"></div>
          </div>
        </div>

        {/* Result Section */}
        <div className="lg:col-span-7 bg-[#fffcf5] p-8 md:p-10 rounded-sm shadow-2xl border border-amber-100 min-h-[500px] relative overflow-hidden">
           {/* Background Pattern */}
           <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/oriental-tiles.png')]"></div>
           <div className="absolute inset-0 pointer-events-none border-8 border-double border-amber-100/50"></div>
           
           {!result && !isLoading && (
             <div className="h-full flex flex-col items-center justify-center text-amber-900/20 space-y-6">
                <div className="w-32 h-32 rounded-full border-4 border-current flex items-center justify-center relative">
                   <div className="absolute inset-2 border-2 border-current rounded-full border-dashed animate-spin-slow"></div>
                   <span className="text-6xl font-serif-sc font-bold">
                      命
                   </span>
                </div>
                <p className="font-serif-sc text-xl tracking-widest">{t.destiny.resultTitle}</p>
             </div>
           )}

           {isLoading && (
             <div className="h-full flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-amber-100 border-t-red-900 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="font-serif-sc text-red-900 text-lg">運</span>
                  </div>
                </div>
                <p className="text-amber-900 font-serif-sc animate-pulse text-lg">{t.destiny.form.calculating}</p>
             </div>
           )}

           {result && (
             <div className="relative z-10 flex flex-col h-full">
                <div className="text-center border-b-2 border-red-900/10 pb-4 mb-6">
                  <h3 className="font-serif-sc text-3xl text-red-900">{t.destiny.resultTitle}</h3>
                  <div className="text-xs text-amber-800/40 mt-2 font-mono uppercase tracking-widest">Eastern Culture Confidential Report</div>
                </div>

                {/* Name Score & Bazi Chart */}
                {chartData && (
                  <div className="mb-8 space-y-6">
                    {/* Name Score Card */}
                    {chartData.nameAnalysis && (
                      <div className="bg-white/60 p-4 rounded border border-amber-200 flex items-center justify-between shadow-sm">
                        <div className="flex-1">
                          <h4 className="text-amber-900 font-bold font-serif-sc text-lg mb-1">{t.destiny.nameAnalysis.title}</h4>
                          <div className="text-sm text-amber-800/80 font-serif-sc">
                            {t.destiny.form.surname}{t.destiny.form.name}: {formData.surname}{formData.name}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-xs text-amber-500 uppercase tracking-widest font-serif-sc">{t.destiny.nameAnalysis.verdict}</div>
                            <div className="text-lg font-bold text-amber-800 font-serif-sc">{chartData.nameAnalysis.verdict}</div>
                          </div>
                          <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-bold ${getScoreColor(chartData.nameAnalysis.score)}`}>
                            {chartData.nameAnalysis.score}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bazi Chart */}
                    <div className="overflow-x-auto">
                      <h4 className="text-center text-amber-900 font-bold mb-3 font-serif-sc border-b border-amber-200 w-24 mx-auto pb-1">{t.destiny.chart.title}</h4>
                      <div className="grid grid-cols-4 gap-2 md:gap-4 min-w-[300px]">
                        {[
                          { label: t.destiny.chart.year, data: chartData.chart.year },
                          { label: t.destiny.chart.month, data: chartData.chart.month },
                          { label: t.destiny.chart.day, data: chartData.chart.day },
                          { label: t.destiny.chart.hour, data: chartData.chart.hour }
                        ].map((col, idx) => (
                          <div key={idx} className="flex flex-col border-2 border-amber-200/60 bg-[#FDFBF7] p-2 text-center rounded-sm">
                            <div className="text-xs text-amber-800/60 font-serif-sc mb-2 border-b border-amber-100 pb-1">{col.label}</div>
                            <div className="flex-1 flex flex-col justify-center space-y-2">
                               <div className="text-2xl md:text-3xl font-serif text-amber-600 font-bold">{col.data.stem}</div>
                               <div className="text-2xl md:text-3xl font-serif text-amber-800 font-bold">{col.data.branch}</div>
                               {/* Display Na Yin if available */}
                               {col.data.naYin && (
                                 <div className="text-xs text-amber-700/80 font-serif-sc mt-1 pt-1 border-t border-amber-100/50">
                                   {col.data.naYin}
                                 </div>
                               )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="prose prose-amber prose-lg max-w-none text-slate-800 font-serif-sc leading-relaxed">
                    <div className="whitespace-pre-wrap">{result}</div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-amber-200 flex justify-between items-center opacity-70">
                  <div className="text-xs text-amber-900/50 font-serif-sc">
                    * Fate is in your hands, prediction is for reference only.
                  </div>
                  <div className="w-16 h-16 bg-red-900/10 text-red-900 rounded-full flex items-center justify-center font-serif-sc text-2xl border-2 border-red-900/20 stamp-effect transform rotate-12">
                    吉
                  </div>
                </div>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};