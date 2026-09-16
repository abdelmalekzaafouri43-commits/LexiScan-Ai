import React, { useState, useEffect, useRef } from 'react';
import { 
  GripVertical, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Copy, 
  Edit3, 
  Check, 
  X, 
  ArrowUpDown, 
  Sparkles, 
  FileText, 
  Layers, 
  Move,
  CornerDownRight,
  RotateCcw,
  Image as ImageIcon,
  Palette
} from 'lucide-react';
import { 
  WorksheetDocument, 
  WorksheetSection, 
  WorksheetQuestion, 
  parseWorksheetText, 
  serializeWorksheetDocument 
} from '../utils/worksheetParser';
import { WorksheetVisual } from '../types/worksheetVisuals';
import { WorksheetVisualBlock } from './WorksheetVisualBlock';
import { VisualsManagerModal } from './VisualsManagerModal';

interface WorksheetDndBuilderProps {
  worksheetText: string;
  onChange: (updatedText: string) => void;
  topic?: string;
  gradeLevel?: string;
  visuals?: WorksheetVisual[];
  onUpdateVisuals?: (visuals: WorksheetVisual[]) => void;
}

export function WorksheetDndBuilder({
  worksheetText,
  onChange,
  topic = '',
  gradeLevel = '',
  visuals = [],
  onUpdateVisuals,
}: WorksheetDndBuilderProps) {
  const [doc, setDoc] = useState<WorksheetDocument>(() => parseWorksheetText(worksheetText));
  const [autoRenumber, setAutoRenumber] = useState(true);
  const [isVisualModalOpen, setIsVisualModalOpen] = useState(false);

  // Dragging state
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [dragOverSectionIndex, setDragOverSectionIndex] = useState<number | null>(null);

  const [draggedQuestion, setDraggedQuestion] = useState<{ sectionIndex: number; questionIndex: number } | null>(null);
  const [dragOverQuestion, setDragOverQuestion] = useState<{ 
    sectionIndex: number; 
    questionIndex: number; 
    position: 'before' | 'after' 
  } | null>(null);
  const [dragOverSectionDropTarget, setDragOverSectionDropTarget] = useState<number | null>(null);

  // Editing state
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingQuestionText, setEditingQuestionText] = useState('');

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState('');
  const [editingSectionInstruction, setEditingSectionInstruction] = useState('');

  // Synchronize internal document if worksheetText changes externally
  const lastSerializedText = useRef(worksheetText);

  useEffect(() => {
    if (worksheetText !== lastSerializedText.current) {
      const parsed = parseWorksheetText(worksheetText);
      setDoc(parsed);
      lastSerializedText.current = worksheetText;
    }
  }, [worksheetText]);

  const commitDocChange = (newDoc: WorksheetDocument) => {
    setDoc(newDoc);
    const serialized = serializeWorksheetDocument(newDoc, autoRenumber);
    lastSerializedText.current = serialized;
    onChange(serialized);
  };

  // ==========================================
  // SECTION REORDERING & ACTIONS
  // ==========================================

  const moveSection = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= doc.sections.length || fromIdx === toIdx) return;
    const newSections = [...doc.sections];
    const [moved] = newSections.splice(fromIdx, 1);
    newSections.splice(toIdx, 0, moved);

    const updatedDoc: WorksheetDocument = {
      ...doc,
      sections: newSections
    };
    commitDocChange(updatedDoc);
  };

  const handleSectionDragStart = (e: React.DragEvent, index: number) => {
    e.stopPropagation();
    setDraggedSectionIndex(index);
    setDraggedQuestion(null);
    e.dataTransfer.setData('text/plain', `section:${index}`);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSectionDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedSectionIndex !== null && draggedSectionIndex !== index) {
      setDragOverSectionIndex(index);
    }
  };

  const handleSectionDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedSectionIndex !== null && draggedSectionIndex !== dropIndex) {
      moveSection(draggedSectionIndex, dropIndex);
    }
    setDraggedSectionIndex(null);
    setDragOverSectionIndex(null);
  };

  const deleteSection = (sectionIndex: number) => {
    const newSections = doc.sections.filter((_, idx) => idx !== sectionIndex);
    commitDocChange({ ...doc, sections: newSections });
  };

  const addSection = () => {
    const newIndex = doc.sections.length;
    const letter = String.fromCharCode(65 + newIndex);
    const newSection: WorksheetSection = {
      id: `section-new-${Date.now().toString(36)}`,
      sectionCode: `SECTION ${letter}`,
      title: 'Custom Learning Activity',
      instruction: 'Complete the following practice exercises below.',
      questions: [
        {
          id: `q-${newIndex}-0-${Date.now().toString(36)}`,
          type: 'question',
          content: '1. Write your exercise question prompt here:\n   _________________________________________________________________________________________',
          originalIndex: 1
        }
      ]
    };

    commitDocChange({
      ...doc,
      sections: [...doc.sections, newSection]
    });
  };

  // ==========================================
  // QUESTION REORDERING & ACTIONS
  // ==========================================

  const moveQuestion = (
    fromSecIdx: number, 
    fromQIdx: number, 
    toSecIdx: number, 
    toQIdx: number
  ) => {
    const newSections = doc.sections.map(s => ({
      ...s,
      questions: [...s.questions]
    }));

    const sourceQuestions = newSections[fromSecIdx].questions;
    const [movedQ] = sourceQuestions.splice(fromQIdx, 1);

    if (fromSecIdx === toSecIdx) {
      sourceQuestions.splice(toQIdx, 0, movedQ);
    } else {
      newSections[toSecIdx].questions.splice(toQIdx, 0, movedQ);
    }

    commitDocChange({ ...doc, sections: newSections });
  };

  const handleQuestionDragStart = (e: React.DragEvent, secIdx: number, qIdx: number) => {
    e.stopPropagation();
    setDraggedQuestion({ sectionIndex: secIdx, questionIndex: qIdx });
    setDraggedSectionIndex(null);
    e.dataTransfer.setData('text/plain', `question:${secIdx}:${qIdx}`);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleQuestionDragOver = (
    e: React.DragEvent, 
    secIdx: number, 
    qIdx: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedQuestion) return;

    const targetRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = targetRect.top + targetRect.height / 2;
    const position = e.clientY < midY ? 'before' : 'after';

    setDragOverQuestion({ sectionIndex: secIdx, questionIndex: qIdx, position });
  };

  const handleQuestionDrop = (
    e: React.DragEvent, 
    targetSecIdx: number, 
    targetQIdx: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedQuestion) return;

    const fromSecIdx = draggedQuestion.sectionIndex;
    const fromQIdx = draggedQuestion.questionIndex;

    const position = dragOverQuestion?.position || 'before';
    let targetIndex = position === 'after' ? targetQIdx + 1 : targetQIdx;

    // Adjust for moving within same array if target is after source
    if (fromSecIdx === targetSecIdx && fromQIdx < targetIndex) {
      targetIndex -= 1;
    }

    moveQuestion(fromSecIdx, fromQIdx, targetSecIdx, targetIndex);

    setDraggedQuestion(null);
    setDragOverQuestion(null);
    setDragOverSectionDropTarget(null);
  };

  const handleDropIntoEmptySection = (e: React.DragEvent, targetSecIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedQuestion) return;

    const fromSecIdx = draggedQuestion.sectionIndex;
    const fromQIdx = draggedQuestion.questionIndex;

    moveQuestion(fromSecIdx, fromQIdx, targetSecIdx, 0);

    setDraggedQuestion(null);
    setDragOverQuestion(null);
    setDragOverSectionDropTarget(null);
  };

  const addQuestion = (secIdx: number) => {
    const targetSec = doc.sections[secIdx];
    const newQNumber = targetSec.questions.length + 1;
    const newQ: WorksheetQuestion = {
      id: `q-${secIdx}-${Date.now().toString(36)}`,
      type: 'question',
      content: `${newQNumber}. Enter your new question or vocabulary prompt here:\n   _________________________________________________________________________________________`,
      originalIndex: newQNumber
    };

    const newSections = doc.sections.map((s, idx) => {
      if (idx !== secIdx) return s;
      return {
        ...s,
        questions: [...s.questions, newQ]
      };
    });

    commitDocChange({ ...doc, sections: newSections });
  };

  const duplicateQuestion = (secIdx: number, qIdx: number) => {
    const targetSec = doc.sections[secIdx];
    const sourceQ = targetSec.questions[qIdx];
    const cloned: WorksheetQuestion = {
      id: `q-dup-${Date.now().toString(36)}`,
      type: sourceQ.type,
      content: sourceQ.content,
      originalIndex: targetSec.questions.length + 1
    };

    const newSections = doc.sections.map((s, idx) => {
      if (idx !== secIdx) return s;
      const updatedQs = [...s.questions];
      updatedQs.splice(qIdx + 1, 0, cloned);
      return { ...s, questions: updatedQs };
    });

    commitDocChange({ ...doc, sections: newSections });
  };

  const deleteQuestion = (secIdx: number, qIdx: number) => {
    const newSections = doc.sections.map((s, idx) => {
      if (idx !== secIdx) return s;
      return {
        ...s,
        questions: s.questions.filter((_, qIndex) => qIndex !== qIdx)
      };
    });

    commitDocChange({ ...doc, sections: newSections });
  };

  const saveQuestionEdit = (secIdx: number, qIdx: number) => {
    const newSections = doc.sections.map((s, idx) => {
      if (idx !== secIdx) return s;
      const updatedQs = [...s.questions];
      updatedQs[qIdx] = {
        ...updatedQs[qIdx],
        content: editingQuestionText
      };
      return { ...s, questions: updatedQs };
    });

    commitDocChange({ ...doc, sections: newSections });
    setEditingQuestionId(null);
  };

  const saveSectionEdit = (secIdx: number) => {
    const newSections = doc.sections.map((s, idx) => {
      if (idx !== secIdx) return s;
      return {
        ...s,
        title: editingSectionTitle || s.title,
        instruction: editingSectionInstruction
      };
    });

    commitDocChange({ ...doc, sections: newSections });
    setEditingSectionId(null);
  };

  const totalQuestionsCount = doc.sections.reduce((acc, s) => acc + s.questions.length, 0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Builder Top Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <Move className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Drag-and-Drop Layout Builder
              </h4>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                {doc.sections.length} Sections • {totalQuestionsCount} Items
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Drag sections or questions to reorder your worksheet. Changes sync instantly with print & PDF output.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <input
              type="checkbox"
              checked={autoRenumber}
              onChange={(e) => {
                setAutoRenumber(e.target.checked);
                commitDocChange(doc);
              }}
              className="rounded text-primary-600 focus:ring-primary-500 w-3.5 h-3.5"
            />
            <span>Auto-renumber (A/B/C & 1/2/3)</span>
          </label>

          <button
            type="button"
            onClick={() => setIsVisualModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold shadow-2xs transition-all hover:scale-[1.02]"
            title="Add or manage educational illustrations and visual matching sets"
          >
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            <span>Illustrations & Visuals</span>
            {visuals.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[10px] font-bold">
                {visuals.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={addSection}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-xs shadow-primary-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Section</span>
          </button>
        </div>
      </div>

      {/* Visuals Banner Area if Visuals are present */}
      {visuals.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Worksheet Visuals & Illustrations ({visuals.length})
            </span>
            <button
              type="button"
              onClick={() => setIsVisualModalOpen(true)}
              className="text-xs text-indigo-600 hover:underline font-semibold"
            >
              Add another illustration
            </button>
          </div>
          <div className="space-y-4">
            {visuals.map((visual, vIdx) => (
              <WorksheetVisualBlock
                key={visual.id || vIdx}
                visual={visual}
                isEditable={true}
                onUpdateVisual={(updated) => {
                  if (onUpdateVisuals) {
                    const newVisuals = [...visuals];
                    newVisuals[vIdx] = updated;
                    onUpdateVisuals(newVisuals);
                  }
                }}
                onRemoveVisual={() => {
                  if (onUpdateVisuals) {
                    const newVisuals = visuals.filter((_, idx) => idx !== vIdx);
                    onUpdateVisuals(newVisuals);
                  }
                }}
                onOpenLibrary={() => setIsVisualModalOpen(true)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Visuals Manager Modal */}
      <VisualsManagerModal
        isOpen={isVisualModalOpen}
        onClose={() => setIsVisualModalOpen(false)}
        currentTopic={topic}
        onSelectVisual={(newVisual) => {
          if (onUpdateVisuals) {
            onUpdateVisuals([...visuals, newVisual]);
          }
        }}
      />

      {/* Sections Container */}
      <div className="space-y-6">
        {doc.sections.length === 0 ? (
          <div className="text-center p-12 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No sections found in this worksheet</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">Click below to add your first structured section.</p>
            <button
              onClick={addSection}
              className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Section A
            </button>
          </div>
        ) : (
          doc.sections.map((section, secIdx) => {
            const isDraggingThisSection = draggedSectionIndex === secIdx;
            const isSectionDragOver = dragOverSectionIndex === secIdx;
            const isEditingThisSection = editingSectionId === section.id;
            const letter = autoRenumber ? String.fromCharCode(65 + secIdx) : (section.sectionCode.replace(/^SECTION\s*/i, '') || String.fromCharCode(65 + secIdx));

            return (
              <div
                key={section.id}
                onDragOver={(e) => handleSectionDragOver(e, secIdx)}
                onDrop={(e) => handleSectionDrop(e, secIdx)}
                className={`transition-all duration-200 rounded-2xl ${
                  isSectionDragOver ? 'ring-2 ring-primary-500 ring-offset-2 scale-[1.01]' : ''
                } ${isDraggingThisSection ? 'opacity-40' : 'opacity-100'}`}
              >
                {/* Section Drop Indicator Line */}
                {isSectionDragOver && draggedSectionIndex !== null && (
                  <div className="h-1.5 w-full bg-primary-500 rounded-full mb-3 shadow-sm animate-pulse" />
                )}

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700">
                  
                  {/* Section Header */}
                  <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Section Drag Handle */}
                      <div
                        draggable
                        onDragStart={(e) => handleSectionDragStart(e, secIdx)}
                        className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
                        title="Drag to reorder section"
                      >
                        <GripVertical className="w-5 h-5" />
                      </div>

                      {/* Section Badge */}
                      <span className="px-2.5 py-1 rounded-lg bg-primary-100 dark:bg-primary-950/60 text-primary-800 dark:text-primary-300 font-bold text-xs uppercase tracking-wide border border-primary-200 dark:border-primary-800/50 shrink-0">
                        SECTION {letter}
                      </span>

                      {/* Section Title */}
                      {isEditingThisSection ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingSectionTitle}
                            onChange={(e) => setEditingSectionTitle(e.target.value)}
                            className="bg-white dark:bg-slate-900 border border-primary-500 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-white flex-1 focus:outline-none"
                            placeholder="Section Title"
                          />
                          <button
                            onClick={() => saveSectionEdit(secIdx)}
                            className="p-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-500"
                            title="Save Title"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingSectionId(null)}
                            className="p-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {section.title}
                          </h5>
                          <button
                            onClick={() => {
                              setEditingSectionId(section.id);
                              setEditingSectionTitle(section.title);
                              setEditingSectionInstruction(section.instruction);
                            }}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded hover:bg-slate-200/50 transition-colors"
                            title="Edit section title & instructions"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Section Controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Reorder Up/Down */}
                      <button
                        type="button"
                        onClick={() => moveSection(secIdx, secIdx - 1)}
                        disabled={secIdx === 0}
                        className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move Section Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(secIdx, secIdx + 1)}
                        disabled={secIdx === doc.sections.length - 1}
                        className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move Section Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

                      {/* Add Question to Section */}
                      <button
                        type="button"
                        onClick={() => addQuestion(secIdx)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold shadow-2xs transition-colors"
                        title="Add item or question to this section"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Item</span>
                      </button>

                      {/* Delete Section */}
                      <button
                        type="button"
                        onClick={() => deleteSection(secIdx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete entire section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Section Instruction / Intro */}
                  {section.instruction && !isEditingThisSection && (
                    <div className="px-6 py-2.5 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 italic">
                      {section.instruction}
                    </div>
                  )}

                  {isEditingThisSection && (
                    <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Section Instructions / Task Directions:
                      </label>
                      <textarea
                        rows={2}
                        value={editingSectionInstruction}
                        onChange={(e) => setEditingSectionInstruction(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                        placeholder="e.g. Read the following dialogue and answer the questions..."
                      />
                    </div>
                  )}

                  {/* Questions List Inside Section */}
                  <div 
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverSectionDropTarget(secIdx);
                    }}
                    onDrop={(e) => {
                      if (section.questions.length === 0) {
                        handleDropIntoEmptySection(e, secIdx);
                      }
                    }}
                    className={`p-4 space-y-3 min-h-[70px] ${
                      section.questions.length === 0 ? 'bg-slate-50/40 dark:bg-slate-950/30' : ''
                    }`}
                  >
                    {section.questions.length === 0 ? (
                      <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Section has no items. Drag questions here from other sections or click "Add Item".
                        </p>
                      </div>
                    ) : (
                      section.questions.map((question, qIdx) => {
                        const isDraggingThisQ = 
                          draggedQuestion?.sectionIndex === secIdx && 
                          draggedQuestion?.questionIndex === qIdx;
                        
                        const isQDragOver = 
                          dragOverQuestion?.sectionIndex === secIdx && 
                          dragOverQuestion?.questionIndex === qIdx;

                        const isEditingThisQ = editingQuestionId === question.id;
                        const qNumber = qIdx + 1;

                        return (
                          <div
                            key={question.id}
                            onDragOver={(e) => handleQuestionDragOver(e, secIdx, qIdx)}
                            onDrop={(e) => handleQuestionDrop(e, secIdx, qIdx)}
                            className={`transition-all duration-150 relative ${
                              isDraggingThisQ ? 'opacity-40' : 'opacity-100'
                            }`}
                          >
                            {/* Drop insertion line indicator */}
                            {isQDragOver && dragOverQuestion?.position === 'before' && (
                              <div className="h-1.5 w-full bg-primary-500 rounded-full mb-2 shadow-xs animate-pulse" />
                            )}

                            <div 
                              className={`bg-slate-50 dark:bg-slate-800/90 border rounded-xl p-3.5 shadow-2xs transition-all ${
                                isQDragOver 
                                  ? 'border-primary-500 shadow-md ring-1 ring-primary-500/20' 
                                  : 'border-slate-200/90 dark:border-slate-700/80 hover:border-primary-300 dark:hover:border-primary-500/50'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {/* Question Drag Handle */}
                                <div
                                  draggable
                                  onDragStart={(e) => handleQuestionDragStart(e, secIdx, qIdx)}
                                  className="cursor-grab active:cursor-grabbing p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors shrink-0 mt-0.5"
                                  title="Drag to reorder question"
                                >
                                  <GripVertical className="w-4 h-4" />
                                </div>

                                {/* Question Item Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
                                      Item #{qNumber}
                                    </span>
                                    {/Word Bank:/i.test(question.content) && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                                        Word Bank
                                      </span>
                                    )}
                                    {/^\[.*\]\s*\d+\./.test(question.content) && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                                        Matching Grid
                                      </span>
                                    )}
                                    {(/underlined/i.test(question.content) || /refers? to/i.test(question.content)) && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                                        Reference Inquiry
                                      </span>
                                    )}
                                    {(/^If you were/i.test(question.content) || /what would you do/i.test(question.content)) && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40">
                                        Hypothetical Scenario
                                      </span>
                                    )}
                                    {/\([a-z\s]+\)\s*_{3,}/i.test(question.content) && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
                                        Verb / Word Form
                                      </span>
                                    )}
                                  </div>

                                  {isEditingThisQ ? (
                                    <div className="space-y-2 mt-2">
                                      <textarea
                                        rows={3}
                                        value={editingQuestionText}
                                        onChange={(e) => setEditingQuestionText(e.target.value)}
                                        className="w-full bg-white dark:bg-slate-900 border border-primary-500 rounded-lg p-2.5 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                      />
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => saveQuestionEdit(secIdx, qIdx)}
                                          className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                                        >
                                          <Check className="w-3.5 h-3.5" />
                                          Save Item
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setEditingQuestionId(null)}
                                          className="px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-normal">
                                      {question.content}
                                    </pre>
                                  )}
                                </div>

                                {/* Question Action Buttons */}
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => moveQuestion(secIdx, qIdx, secIdx, qIdx - 1)}
                                    disabled={qIdx === 0}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                                    title="Move Item Up"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveQuestion(secIdx, qIdx, secIdx, qIdx + 1)}
                                    disabled={qIdx === section.questions.length - 1}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                                    title="Move Item Down"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingQuestionId(question.id);
                                      setEditingQuestionText(question.content);
                                    }}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
                                    title="Edit Question Text"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => duplicateQuestion(secIdx, qIdx)}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
                                    title="Duplicate Question"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => deleteQuestion(secIdx, qIdx)}
                                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                    title="Delete Question"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Drop insertion line indicator */}
                            {isQDragOver && dragOverQuestion?.position === 'after' && (
                              <div className="h-1.5 w-full bg-primary-500 rounded-full mt-2 shadow-xs animate-pulse" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={addSection}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-2xs transition-colors"
        >
          <Plus className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span>Add Another Section</span>
        </button>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Tip: Grab the <GripVertical className="w-3.5 h-3.5 inline mx-0.5 text-slate-400" /> icons to drag items between sections.
        </p>
      </div>

    </div>
  );
}
