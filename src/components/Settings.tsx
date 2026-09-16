import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Check, Palette } from 'lucide-react';

export function Settings() {
  const { color, mode, setColor, setMode } = useTheme();

  const colors = [
    { 
      id: 'indigo', 
      name: 'Indigo Theme', 
      bg: 'bg-[#6366f1]',
      bgClass: 'bg-[#6366f1]', 
      desc: 'Balanced slate & indigo layout, clean educational look.'
    },
    { 
      id: 'sapphire', 
      name: 'Sapphire Theme', 
      bg: 'bg-[#3b82f6]',
      bgClass: 'bg-[#3b82f6]', 
      desc: 'Marine blue aesthetics, crisp, readable, and highly professional.'
    },
    { 
      id: 'emerald', 
      name: 'Emerald Theme', 
      bg: 'bg-[#10b981]',
      bgClass: 'bg-[#10b981]', 
      desc: 'Energetic mint tones, ideal for science, mathematics, or grading.'
    },
    { 
      id: 'violet', 
      name: 'Violet Theme', 
      bg: 'bg-[#8b5cf6]',
      bgClass: 'bg-[#8b5cf6]', 
      desc: 'Artistic creative violet gradients, excellent visual flair.'
    }
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Settings</h2>
        <p className="text-slate-600 dark:text-slate-400">Manage your application preferences and appearance.</p>
      </div>

      <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm space-y-8 shadow-sm">
        
        {/* Appearance Mode */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
            {mode === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Appearance Mode
          </h3>
          <div className="flex gap-4">
            <button 
              onClick={() => setMode('light')}
              className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all hover:scale-[1.01] ${mode === 'light' ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
            >
              <Sun className={`w-8 h-8 ${mode === 'light' ? 'text-primary-500' : 'text-slate-400'}`} />
              <span className={`font-medium ${mode === 'light' ? 'text-primary-700 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'}`}>Light Mode</span>
            </button>
            <button 
              onClick={() => setMode('dark')}
              className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all hover:scale-[1.01] ${mode === 'dark' ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
            >
              <Moon className={`w-8 h-8 ${mode === 'dark' ? 'text-primary-500' : 'text-slate-400'}`} />
              <span className={`font-medium ${mode === 'dark' ? 'text-primary-700 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'}`}>Dark Mode</span>
            </button>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700/50" />

        {/* Accent Color Customizer & Live Real-Time Sandbox */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
            <Palette className="w-5 h-5 text-primary-500" />
            Interactive Theme Customizer
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Configure your favorite workspace colors. Watch the interactive preview container on the right respond instantly as you switch.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Premium Color Swatches & Specs */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
                Select Accent Color
              </span>
              
              <div className="space-y-3.5">
                {colors.map((c) => {
                  const isSelected = color === c.id;
                  
                  // Color specific values for live swatch indicator styling
                  const themeColors: Record<string, string> = {
                    indigo: 'from-indigo-500 to-indigo-600 ring-indigo-500/20 text-indigo-500 bg-indigo-500/10',
                    sapphire: 'from-blue-500 to-blue-600 ring-blue-500/20 text-blue-500 bg-blue-500/10',
                    emerald: 'from-emerald-500 to-emerald-600 ring-emerald-500/20 text-emerald-500 bg-emerald-500/10',
                    violet: 'from-violet-500 to-violet-600 ring-violet-500/20 text-violet-500 bg-violet-500/10',
                  };

                  const themeGradient = themeColors[c.id] || themeColors.indigo;

                  return (
                    <button
                      key={c.id}
                      onClick={() => setColor(c.id as any)}
                      className={`w-full relative text-left p-4 rounded-xl border flex items-center gap-4 transition-all duration-300 hover:translate-x-1.5 hover:shadow-xs group ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/15 shadow-sm' 
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Premium 3D Circular Swatch Node */}
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${themeGradient} flex items-center justify-center shrink-0 ring-4 ring-offset-2 dark:ring-offset-slate-900 ${isSelected ? 'ring-primary-500/30' : 'ring-transparent'}`}>
                        {isSelected ? (
                          <Check className="w-5 h-5 text-white stroke-[3]" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full bg-white/40 group-hover:scale-125 transition-transform" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                            {c.name.split(' ')[0]}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${themeGradient.split(' ').slice(2).join(' ')}`}>
                            Active
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-normal">
                          {c.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: High-Fidelity Real-time Sandbox Preview Card */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/45 p-5 relative overflow-hidden flex flex-col justify-between h-full min-h-[280px]">
                
                {/* Background Refraction Blob tracking selected color */}
                <div className={`absolute top-[-20%] right-[-10%] w-[180px] h-[180px] rounded-full blur-2xl opacity-35 dark:opacity-20 transition-all duration-700 ${
                  color === 'indigo' ? 'bg-indigo-500' :
                  color === 'sapphire' ? 'bg-blue-500' :
                  color === 'emerald' ? 'bg-emerald-500' : 'bg-violet-500'
                }`} />

                {/* Simulated Header */}
                <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-3 z-10">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      color === 'indigo' ? 'bg-indigo-500' :
                      color === 'sapphire' ? 'bg-blue-500' :
                      color === 'emerald' ? 'bg-emerald-500' : 'bg-violet-500'
                    }`} />
                    <div className="w-24 h-2 bg-slate-300 dark:bg-slate-700 rounded-xs" />
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">LIVE APP PREVIEW</span>
                </div>

                {/* Simulated Main Content Layout Card */}
                <div className="my-5 p-4 rounded-xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 shadow-xs space-y-3.5 z-10">
                  
                  {/* Worksheet Header Wireframe */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="w-36 h-3.5 bg-slate-400 dark:bg-slate-600 rounded-xs" />
                      <div className="w-20 h-2 bg-slate-300 dark:bg-slate-700 rounded-xs" />
                    </div>
                    {/* Badge */}
                    <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full transition-all duration-300 ${
                      color === 'indigo' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/45 dark:text-indigo-400' :
                      color === 'sapphire' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/45 dark:text-blue-400' :
                      color === 'emerald' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/45 dark:text-emerald-400' :
                      'bg-violet-100 text-violet-700 dark:bg-violet-950/45 dark:text-violet-400'
                    }`}>
                      {color} theme
                    </span>
                  </div>

                  {/* Wireframe lines */}
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] text-white font-bold transition-all duration-300 ${
                        color === 'indigo' ? 'bg-indigo-500' :
                        color === 'sapphire' ? 'bg-blue-500' :
                        color === 'emerald' ? 'bg-emerald-500' : 'bg-violet-500'
                      }`}>1</div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-xs" />
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] text-white font-bold transition-all duration-300 ${
                        color === 'indigo' ? 'bg-indigo-500' :
                        color === 'sapphire' ? 'bg-blue-500' :
                        color === 'emerald' ? 'bg-emerald-500' : 'bg-violet-500'
                      }`}>2</div>
                      <div className="w-3/4 h-2 bg-slate-200 dark:bg-slate-800 rounded-xs" />
                    </div>
                  </div>

                  {/* Dynamic Primary CTA Button */}
                  <button className={`w-full py-2 rounded-lg font-bold text-xs text-white shadow-xs flex items-center justify-center gap-1.5 transition-all duration-300 ${
                    color === 'indigo' ? 'bg-indigo-600 hover:bg-indigo-700' :
                    color === 'sapphire' ? 'bg-blue-600 hover:bg-blue-700' :
                    color === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700' :
                    'bg-violet-600 hover:bg-violet-700'
                  }`}>
                    Interactive Accent Button
                  </button>
                </div>

                {/* Mini Status Footer info */}
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 border-t border-slate-200/40 dark:border-slate-800/40 pt-3 z-10">
                  <span>SYSTEM: REACTIVE</span>
                  <span className="uppercase tracking-wider">HEX: {
                    color === 'indigo' ? '#6366F1' :
                    color === 'sapphire' ? '#3B82F6' :
                    color === 'emerald' ? '#10B981' : '#8B5CF6'
                  }</span>
                </div>

              </div>
            </div>

          </div>
        </div>


      </div>
    </div>
  );
}
