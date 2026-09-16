import React from 'react';
import { FileText, ScanLine, Users, Clock, ArrowRight, Sparkles, Plus, Compass } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

function AnimatedBorderCard({ children, className = "" }: { children: React.ReactNode, className?: string, key?: React.Key }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-[1px] group ${className}`}>
      {/* Outer animated conic gradients */}
      <div className="absolute -inset-[200%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_70%,#6366f1_100%)] opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -inset-[200%] animate-[spin_4s_linear_infinite_reverse] bg-[conic-gradient(from_270deg_at_50%_50%,transparent_70%,#10b981_100%)] opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
      
      {/* Inner card content */}
      <div className="relative h-full w-full bg-white dark:bg-slate-900 rounded-[15px] p-6 flex flex-col z-10 shadow-sm dark:shadow-xl border border-slate-200/80 dark:border-transparent">
        {children}
      </div>
    </div>
  );
}

export function Dashboard({ 
  onNavigate, 
  onOpenTour 
}: { 
  onNavigate: (tab: any) => void;
  onOpenTour?: () => void;
}) {
  const metrics: MetricCardProps[] = [
    { title: 'Total Worksheets', value: '124', change: '+12% this month', icon: <FileText className="w-5 h-5" />, trend: 'up' },
    { title: 'Layouts Scanned', value: '48', change: '+5% this month', icon: <ScanLine className="w-5 h-5" />, trend: 'up' },
    { title: 'Active Students', value: '890', change: '+22 new this week', icon: <Users className="w-5 h-5" />, trend: 'up' },
    { title: 'Time Saved', value: '34h', change: 'vs. manual creation', icon: <Clock className="w-5 h-5" />, trend: 'up' },
  ];

  const recentActivity = [
    { title: 'Ordering at a Restaurant', type: 'Worksheet', date: '2 hours ago', grade: 'Beginner (A1)' },
    { title: 'Public Transit Schedule', type: 'Scanned Layout', date: '5 hours ago', grade: 'Intermediate (B1)' },
    { title: 'Doctor\'s Appointment', type: 'Worksheet', date: 'Yesterday', grade: 'Advanced (C1)' },
    { title: 'Daily Routine Verbs', type: 'Worksheet', date: '2 days ago', grade: 'Beginner (A2)' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto pb-24">
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            Welcome back all <Sparkles className="w-6 h-6 text-primary-500 dark:text-primary-400" />
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm lg:text-base">Here's what's happening with your classroom materials today.</p>
        </div>
        <div className="flex items-center gap-3">
          {onOpenTour && (
            <button 
              onClick={onOpenTour}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-all text-xs sm:text-sm shadow-xs"
              title="Tour the Generator and Scanner"
            >
              <Compass className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span>Get Started Tour</span>
            </button>
          )}
          <button 
            onClick={() => onNavigate('generator')}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-primary-500/20 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            New Worksheet
          </button>
        </div>
      </div>

      {/* Metrics Grid with Animated Borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric, idx) => (
          <AnimatedBorderCard key={idx}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-primary-50 dark:bg-slate-800 rounded-xl text-primary-600 dark:text-primary-400">
                {metric.icon}
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-transparent rounded-full">
                {metric.change}
              </span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">{metric.title}</h3>
            <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{metric.value}</p>
          </AnimatedBorderCard>
        ))}
      </div>

      {/* Two Column Layout for Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity (Takes up 2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-slate-100">Recent Materials</h3>
            <button 
              onClick={() => onNavigate('saved')}
              className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div 
                key={idx} 
                onClick={() => onNavigate('generator')}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50/70 hover:bg-slate-100/90 dark:bg-slate-800/40 dark:hover:bg-slate-800 transition-all border border-slate-200/60 dark:border-slate-800/80 group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.type === 'Worksheet' ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'}`}>
                    {activity.type === 'Worksheet' ? <FileText className="w-5 h-5" /> : <ScanLine className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-slate-200 font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors text-sm sm:text-base">{activity.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activity.grade} • {activity.type}</p>
                  </div>
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{activity.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions (Takes up 1 col) */}
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Quick Actions</h3>
          <div className="space-y-3.5 flex-1">
            <button 
              onClick={() => onNavigate('generator')}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-50/80 hover:bg-primary-50/70 border border-slate-200 hover:border-primary-300 dark:bg-slate-800/40 dark:hover:bg-slate-800 dark:border-slate-700/80 dark:hover:border-primary-500/50 transition-all text-left group shadow-2xs"
            >
              <div className="p-3 bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400 rounded-xl group-hover:scale-105 transition-transform flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-slate-900 dark:text-slate-100 font-semibold text-sm group-hover:text-primary-700 dark:group-hover:text-primary-300">Generate Worksheet</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Create printable ESL materials with AI</p>
              </div>
            </button>

            <button 
              onClick={() => onNavigate('scanner')}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-50/80 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 dark:bg-slate-800/40 dark:hover:bg-slate-800 dark:border-slate-700/80 dark:hover:border-emerald-500/50 transition-all text-left group shadow-2xs"
            >
              <div className="p-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-xl group-hover:scale-105 transition-transform flex-shrink-0">
                <ScanLine className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-slate-900 dark:text-slate-100 font-semibold text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-300">Scan External Layout</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Detect headers, questions & blanks</p>
              </div>
            </button>

            {onOpenTour && (
              <button 
                onClick={onOpenTour}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-50/80 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 dark:bg-slate-800/40 dark:hover:bg-slate-800 dark:border-slate-700/80 dark:hover:border-amber-500/50 transition-all text-left group shadow-2xs"
              >
                <div className="p-3 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 rounded-xl group-hover:scale-105 transition-transform flex-shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-slate-900 dark:text-slate-100 font-semibold text-sm group-hover:text-amber-700 dark:group-hover:text-amber-300">Get Started Tour</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">5-step interactive feature tour</p>
                </div>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
