import React, { useState } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Palette, 
  RefreshCw, 
  Edit3, 
  Maximize2, 
  Minimize2,
  Image as ImageIcon
} from 'lucide-react';
import { WorksheetVisual, VisualStyle } from '../types/worksheetVisuals';

interface WorksheetVisualBlockProps {
  visual: WorksheetVisual;
  isEditable?: boolean;
  onUpdateVisual?: (updated: WorksheetVisual) => void;
  onRemoveVisual?: () => void;
  onOpenLibrary?: () => void;
}

export const WorksheetVisualBlock: React.FC<WorksheetVisualBlockProps> = ({
  visual,
  isEditable = false,
  onUpdateVisual,
  onRemoveVisual,
  onOpenLibrary,
}) => {
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [tempCaption, setTempCaption] = useState(visual.caption || '');

  const toggleStyle = () => {
    if (!onUpdateVisual) return;
    const newStyle: VisualStyle = visual.style === 'line_art' ? 'vector_accent' : 'line_art';
    onUpdateVisual({
      ...visual,
      style: newStyle,
    });
  };

  const cycleSize = () => {
    if (!onUpdateVisual) return;
    const sizeMap: Record<string, 'sm' | 'md' | 'lg' | 'full'> = {
      sm: 'md',
      md: 'lg',
      lg: 'full',
      full: 'sm',
    };
    onUpdateVisual({
      ...visual,
      size: sizeMap[visual.size || 'md'],
    });
  };

  const handleSaveCaption = () => {
    if (!onUpdateVisual) return;
    onUpdateVisual({
      ...visual,
      caption: tempCaption,
    });
    setIsEditingCaption(false);
  };

  const sizeClasses = {
    sm: 'max-w-xs h-32',
    md: 'max-w-md h-44',
    lg: 'max-w-xl h-56',
    full: 'w-full h-56',
  }[visual.size || 'md'];

  // Case 1: Matching Bank (4 items A, B, C, D)
  if (visual.placement === 'matching_bank' && visual.matchingItems && visual.matchingItems.length > 0) {
    return (
      <div className="my-4 p-3 bg-white border border-slate-300 rounded-xl shadow-2xs print:border-slate-800 print:p-2 print:shadow-none">
        {/* Controls in edit mode */}
        {isEditable && (
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-200 print:hidden text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
              Visual Matching Exercise Bank (4 Items)
            </span>
            <div className="flex items-center gap-1.5">
              {onOpenLibrary && (
                <button
                  type="button"
                  onClick={onOpenLibrary}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors"
                >
                  Change Visual Set
                </button>
              )}
              {onRemoveVisual && (
                <button
                  type="button"
                  onClick={onRemoveVisual}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Remove Visual Bank"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 4-Item Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 print:grid-cols-4 print:gap-2">
          {visual.matchingItems.map((item) => (
            <div
              key={item.letter}
              className="border border-slate-300 rounded-lg p-2 bg-slate-50/50 print:bg-white print:border-slate-800 flex flex-col items-center justify-between text-center"
            >
              <span className="w-6 h-6 rounded-full border border-slate-800 bg-white text-slate-900 text-xs font-bold flex items-center justify-center mb-1">
                [{item.letter}]
              </span>
              <div
                className="h-20 w-20 [&>svg]:w-full [&>svg]:h-full flex items-center justify-center my-1 print:h-16 print:w-16"
                dangerouslySetInnerHTML={{ __html: item.svgContent || '' }}
              />
              <span className="text-[11px] font-semibold text-slate-800 line-clamp-1 print:text-[10px]">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {visual.caption && (
          <p className="text-center text-[11px] italic text-slate-500 mt-2 print:text-slate-800 print:text-[10px]">
            {visual.caption}
          </p>
        )}
      </div>
    );
  }

  // Case 2: Standard Banner or Section Visual Illustration
  return (
    <div className="my-3.5 flex flex-col items-center justify-center">
      <div className="relative group w-full flex flex-col items-center">
        
        {/* Editor Overlay Controls (Hidden in Print) */}
        {isEditable && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-xs border border-slate-300 shadow-md rounded-lg p-1 flex items-center gap-1 z-10 print:hidden text-xs">
            <button
              type="button"
              onClick={cycleSize}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 font-medium text-[11px] flex items-center gap-1"
              title="Toggle Size (SM / MD / LG / FULL)"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="uppercase text-[10px] font-bold">{visual.size || 'md'}</span>
            </button>
            <button
              type="button"
              onClick={toggleStyle}
              className="p-1 hover:bg-slate-100 rounded text-slate-700"
              title="Switch between Line Art and Vector Color"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
            </button>
            {onOpenLibrary && (
              <button
                type="button"
                onClick={onOpenLibrary}
                className="p-1 hover:bg-slate-100 rounded text-slate-700"
                title="Replace from Visual Library"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
            {onRemoveVisual && (
              <button
                type="button"
                onClick={onRemoveVisual}
                className="p-1 hover:bg-red-50 text-red-600 rounded"
                title="Remove Illustration"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* SVG Container */}
        <div
          className={`${sizeClasses} mx-auto flex items-center justify-center p-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs print:border-slate-800 print:shadow-none print:p-1 [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-full`}
          dangerouslySetInnerHTML={{ __html: visual.svgContent || '' }}
        />

        {/* Caption */}
        {isEditingCaption && isEditable ? (
          <div className="mt-1.5 flex items-center gap-1.5 w-full max-w-md print:hidden">
            <input
              type="text"
              value={tempCaption}
              onChange={(e) => setTempCaption(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Illustration caption..."
            />
            <button
              type="button"
              onClick={handleSaveCaption}
              className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-semibold"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditingCaption(false)}
              className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        ) : (
          visual.caption && (
            <div 
              onClick={() => isEditable && setIsEditingCaption(true)}
              className={`mt-1.5 text-center text-xs italic text-slate-500 print:text-slate-800 print:text-[10px] ${
                isEditable ? 'cursor-pointer hover:text-indigo-600' : ''
              }`}
            >
              {visual.caption}
              {isEditable && <Edit3 className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-100 text-slate-400" />}
            </div>
          )
        )}
      </div>
    </div>
  );
};
