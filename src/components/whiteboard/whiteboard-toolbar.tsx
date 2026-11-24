"use client";

import { useState } from "react";
import {
  MousePointer,
  Pen,
  Eraser,
  Square,
  Circle,
  ArrowUpRight,
  Type,
  Undo2,
  Redo2,
  Trash2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type WhiteboardTool =
  | "select"
  | "pen"
  | "eraser"
  | "rectangle"
  | "circle"
  | "arrow"
  | "text";

export interface WhiteboardToolbarProps {
  activeTool: WhiteboardTool;
  setActiveTool: (tool: WhiteboardTool) => void;
  color: string;
  setColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}

const COLOR_PALETTE = [
  { name: "Deep Ink", value: "#0f172a" },
  { name: "Brand Violet", value: "#7c3aed" },
  { name: "Warm Amber", value: "#f58220" },
  { name: "Electric Blue", value: "#1b4397" },
  { name: "Emerald", value: "#10b981" },
  { name: "Rose", value: "#f43f5e" },
];

const STROKE_WIDTHS = [
  { label: "Fine", value: 2 },
  { label: "Medium", value: 4 },
  { label: "Bold", value: 7 },
];

export function WhiteboardToolbar({
  activeTool,
  setActiveTool,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
}: WhiteboardToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-30 select-none">
      <div className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full bg-white/95 dark:bg-[#0e1424]/95 backdrop-blur-md border border-slate-200/90 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        {/* 1. Select Tool */}
        <button
          type="button"
          onClick={() => setActiveTool("select")}
          title="Select & Move (V)"
          className={cn(
            "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-all",
            activeTool === "select"
              ? "bg-violet-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
          )}
        >
          <MousePointer className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        {/* 2. Freehand Pen */}
        <button
          type="button"
          onClick={() => setActiveTool("pen")}
          title="Pen (P)"
          className={cn(
            "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-all",
            activeTool === "pen"
              ? "bg-violet-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
          )}
        >
          <Pen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        {/* 3. Eraser */}
        <button
          type="button"
          onClick={() => setActiveTool("eraser")}
          title="Eraser (E)"
          className={cn(
            "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-all",
            activeTool === "eraser"
              ? "bg-violet-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
          )}
        >
          <Eraser className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10 mx-0.5" />

        {/* 4. Rectangle */}
        <button
          type="button"
          onClick={() => setActiveTool("rectangle")}
          title="Rectangle (R)"
          className={cn(
            "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-all",
            activeTool === "rectangle"
              ? "bg-violet-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
          )}
        >
          <Square className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        {/* 5. Circle */}
        <button
          type="button"
          onClick={() => setActiveTool("circle")}
          title="Circle (C)"
          className={cn(
            "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-all",
            activeTool === "circle"
              ? "bg-violet-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
          )}
        >
          <Circle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        {/* 6. Arrow */}
        <button
          type="button"
          onClick={() => setActiveTool("arrow")}
          title="Arrow (A)"
          className={cn(
            "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-all",
            activeTool === "arrow"
              ? "bg-violet-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
          )}
        >
          <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        {/* 7. Text */}
        <button
          type="button"
          onClick={() => setActiveTool("text")}
          title="Text (T)"
          className={cn(
            "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-all",
            activeTool === "text"
              ? "bg-violet-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
          )}
        >
          <Type className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10 mx-0.5" />

        {/* 8. Color Picker Swatch */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Stroke Color"
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            <span
              className="h-4 w-4 sm:h-4.5 sm:w-4.5 rounded-full border-2 border-white shadow-xs ring-1 ring-slate-300 dark:ring-white/30"
              style={{ backgroundColor: color }}
            />
          </button>

          {showColorPicker && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 p-2 rounded-xl bg-white dark:bg-[#131a2e] border border-slate-200 dark:border-white/10 shadow-xl flex flex-col gap-2 z-50">
              <div className="flex items-center gap-1.5">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => {
                      setColor(c.value);
                      setShowColorPicker(false);
                    }}
                    title={c.name}
                    className="h-6 w-6 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: c.value }}
                  >
                    {color === c.value && <Check className="h-3 w-3 text-white" />}
                  </button>
                ))}
              </div>

              {/* Stroke Width Selector */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/10">
                {STROKE_WIDTHS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setStrokeWidth(s.value)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-semibold transition-colors",
                      strokeWidth === s.value
                        ? "bg-violet-100 text-violet-700 dark:bg-violet-600/30 dark:text-violet-300"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10 mx-0.5" />

        {/* 9. Undo */}
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className={cn(
            "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-all",
            canUndo
              ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
              : "text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-50"
          )}
        >
          <Undo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        {/* 10. Redo */}
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className={cn(
            "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-all",
            canRedo
              ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
              : "text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-50"
          )}
        >
          <Redo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        {/* 11. Clear Canvas */}
        <button
          type="button"
          onClick={onClear}
          title="Clear Canvas"
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
        >
          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
}
