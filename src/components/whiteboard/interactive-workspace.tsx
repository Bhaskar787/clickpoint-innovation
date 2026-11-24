"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DrawingCanvas } from "./drawing-canvas";
import { WhiteboardToolbar, WhiteboardTool } from "./whiteboard-toolbar";

// Collaborative team presence markers matching Reference 2
const COLLAB_PARTICIPANTS = [
  {
    id: "you",
    name: "You",
    color: "#3b82f6", // Vibrant Blue
    cursorAngle: -45,
    initialX: "8%",
    initialY: "14%",
    floatX: [0, 8, -6, 0],
    floatY: [0, -10, 6, 0],
    duration: 6,
  },
  {
    id: "developer",
    name: "Developer",
    color: "#0d9488", // Teal
    cursorAngle: 15,
    initialX: "6%",
    initialY: "72%",
    floatX: [0, -10, 8, 0],
    floatY: [0, 8, -6, 0],
    duration: 7,
  },
  {
    id: "designer",
    name: "Designer",
    color: "#9333ea", // Purple
    cursorAngle: -25,
    initialX: "84%",
    initialY: "18%",
    floatX: [0, 10, -8, 0],
    floatY: [0, -8, 10, 0],
    duration: 6.5,
  },
  {
    id: "pm",
    name: "PM",
    color: "#ec4899", // Pink
    cursorAngle: 35,
    initialX: "86%",
    initialY: "70%",
    floatX: [0, -8, 10, 0],
    floatY: [0, 12, -8, 0],
    duration: 7.5,
  },
  {
    id: "clickpoint",
    name: "ClickPoint",
    color: "#f58220", // Brand Warm Amber
    cursorAngle: 0,
    initialX: "48%",
    initialY: "90%",
    floatX: [0, 6, -6, 0],
    floatY: [0, -6, 6, 0],
    duration: 8,
  },
];

export function InteractiveWorkspace() {
  const [activeTool, setActiveTool] = useState<WhiteboardTool>("pen");
  const [color, setColor] = useState("#0f172a");
  const [strokeWidth, setStrokeWidth] = useState(3.5);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [undoTrigger, setUndoTrigger] = useState(0);
  const [redoTrigger, setRedoTrigger] = useState(0);
  const [clearTrigger, setClearTrigger] = useState(0);

  return (
    <div className="relative w-full h-full bg-white dark:bg-[#070b16] select-none overflow-hidden">
      {/* 1. Floating Top Whiteboard Toolbar */}
      <WhiteboardToolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={() => setUndoTrigger((c) => c + 1)}
        onRedo={() => setRedoTrigger((c) => c + 1)}
        onClear={() => setClearTrigger((c) => c + 1)}
      />

      {/* 2. Interactive Vector Drawing Canvas */}
      <DrawingCanvas
        activeTool={activeTool}
        color={color}
        strokeWidth={strokeWidth}
        onHistoryChange={(undoable, redoable) => {
          setCanUndo(undoable);
          setCanRedo(redoable);
        }}
        undoTrigger={undoTrigger}
        redoTrigger={redoTrigger}
        clearTrigger={clearTrigger}
      />

      {/* 3. Floating Team Participant Indicators (Inspired by Reference 2) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
        {COLLAB_PARTICIPANTS.map((participant) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: participant.floatX,
              y: participant.floatY,
            }}
            transition={{
              opacity: { duration: 0.8 },
              scale: { duration: 0.8 },
              x: { duration: participant.duration, repeat: Infinity, ease: "easeInOut" },
              y: { duration: participant.duration, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{
              left: participant.initialX,
              top: participant.initialY,
            }}
            className="absolute flex items-center gap-1.5"
          >
            {/* SVG Pointer Arrow */}
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 drop-shadow-sm shrink-0"
              style={{
                color: participant.color,
                transform: `rotate(${participant.cursorAngle}deg)`,
              }}
            >
              <path
                d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"
                fill="currentColor"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>

            {/* User Pill Badge */}
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs whitespace-nowrap"
              style={{ backgroundColor: participant.color }}
            >
              {participant.name}
            </span>
          </motion.div>
        ))}
      </div>

      {/* 4. Discrete Bottom Onboarding Hint */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
        <div className="px-3 py-1 rounded-full bg-slate-900/75 dark:bg-slate-800/80 backdrop-blur-md text-[11px] font-medium text-white shadow-md flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
          <span>✍️ Interactive Whiteboard: Sketch freely, test shapes, or write notes</span>
        </div>
      </div>
    </div>
  );
}
