const fs = require('fs');

const files = [
  'src/App.tsx',
  'src/components/Sidebar.tsx',
  'src/components/Header.tsx',
  'src/components/Dashboard.tsx',
  'src/components/WorksheetGenerator.tsx',
  'src/components/LayoutScanner.tsx',
];

const replacements = [
  [/bg-\[\#0F172A\]/g, 'bg-slate-50 dark:bg-[#0F172A]'],
  
  [/bg-slate-900\/50/g, 'bg-white/50 dark:bg-slate-900/50'],
  [/bg-slate-900\/40/g, 'bg-white/40 dark:bg-slate-900/40'],
  [/bg-slate-900\/30/g, 'bg-slate-50/30 dark:bg-slate-900/30'],
  [/bg-slate-800\/50/g, 'bg-slate-100/50 dark:bg-slate-800/50'],
  [/bg-slate-800\/40/g, 'bg-slate-50/40 dark:bg-slate-800/40'],
  [/bg-slate-800\/30/g, 'bg-slate-100/30 dark:bg-slate-800/30'],
  [/bg-slate-800\/20/g, 'bg-slate-50/20 dark:bg-slate-800/20'],

  [/\bbg-slate-900\b/g, 'bg-white dark:bg-slate-900'],
  [/\bbg-slate-800\b/g, 'bg-slate-50 dark:bg-slate-800'],
  
  [/border-slate-700\/50/g, 'border-slate-300/50 dark:border-slate-700/50'],
  [/\bborder-slate-800\b/g, 'border-slate-200 dark:border-slate-800'],
  [/\bborder-slate-700\b/g, 'border-slate-300 dark:border-slate-700'],
  
  [/\btext-slate-100\b/g, 'text-slate-900 dark:text-slate-100'],
  [/\btext-slate-200\b/g, 'text-slate-800 dark:text-slate-200'],
  [/\btext-slate-300\b/g, 'text-slate-700 dark:text-slate-300'],
  [/\btext-slate-400\b/g, 'text-slate-600 dark:text-slate-400'],
  [/\btext-slate-500\b/g, 'text-slate-500 dark:text-slate-500'],
  
  [/hover:bg-slate-800\b/g, 'hover:bg-slate-100 dark:hover:bg-slate-800'],
  [/hover:bg-slate-700\b/g, 'hover:bg-slate-200 dark:hover:bg-slate-700'],
  [/hover:text-slate-200\b/g, 'hover:text-slate-800 dark:hover:text-slate-200'],
  
  [/shadow-slate-900\/50/g, 'shadow-slate-200/50 dark:shadow-slate-900/50'],
  [/shadow-slate-900\/20/g, 'shadow-slate-200/20 dark:shadow-slate-900/20'],
  
  [/indigo-/g, 'primary-'],
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [regex, replacement] of replacements) {
      content = content.replace(regex, replacement);
    }
    fs.writeFileSync(file, content);
    console.log(`Processed ${file}`);
  }
}
