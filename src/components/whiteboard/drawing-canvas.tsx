"use client";

import { useRef, useEffect, useState, useCallback, PointerEvent } from "react";
import { WhiteboardTool } from "./whiteboard-toolbar";

export interface Point {
  x: number;
  y: number;
}

export type DrawElement =
  | {
      id: string;
      type: "pen";
      points: Point[];
      color: string;
      width: number;
    }
  | {
      id: string;
      type: "rectangle";
      startX: number;
      startY: number;
      width: number;
      height: number;
      color: string;
      strokeWidth: number;
    }
  | {
      id: string;
      type: "circle";
      centerX: number;
      centerY: number;
      radiusX: number;
      radiusY: number;
      color: string;
      strokeWidth: number;
    }
  | {
      id: string;
      type: "arrow";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      color: string;
      strokeWidth: number;
    }
  | {
      id: string;
      type: "text";
      x: number;
      y: number;
      text: string;
      color: string;
      fontSize: number;
    };

interface DrawingCanvasProps {
  activeTool: WhiteboardTool;
  color: string;
  strokeWidth: number;
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;
  undoTrigger?: number;
  redoTrigger?: number;
  clearTrigger?: number;
}

// Initial creative sketch matching Reference 2
const INITIAL_DEMO_ELEMENTS: DrawElement[] = [
  {
    id: "demo-loop-1",
    type: "pen",
    color: "#0f172a",
    width: 3.5,
    points: [
      { x: 180, y: 220 },
      { x: 160, y: 190 },
      { x: 175, y: 160 },
      { x: 210, y: 155 },
      { x: 245, y: 175 },
      { x: 265, y: 215 },
      { x: 260, y: 250 },
      { x: 225, y: 270 },
      { x: 180, y: 255 },
      { x: 160, y: 220 },
      { x: 180, y: 185 },
      { x: 225, y: 170 },
      { x: 270, y: 190 },
      { x: 300, y: 235 },
      { x: 320, y: 280 },
    ],
  },
  {
    id: "demo-slash-2",
    type: "pen",
    color: "#0f172a",
    width: 3.5,
    points: [
      { x: 205, y: 165 },
      { x: 235, y: 195 },
      { x: 275, y: 235 },
      { x: 305, y: 270 },
    ],
  },
  {
    id: "demo-swoop-3",
    type: "pen",
    color: "#0f172a",
    width: 3.5,
    points: [
      { x: 140, y: 230 },
      { x: 125, y: 210 },
      { x: 135, y: 190 },
      { x: 160, y: 180 },
      { x: 200, y: 210 },
      { x: 250, y: 240 },
      { x: 320, y: 210 },
      { x: 350, y: 195 },
    ],
  },
];

export function DrawingCanvas({
  activeTool,
  color,
  strokeWidth,
  onHistoryChange,
  undoTrigger = 0,
  redoTrigger = 0,
  clearTrigger = 0,
}: DrawingCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas elements state
  const [elements, setElements] = useState<DrawElement[]>(INITIAL_DEMO_ELEMENTS);
  const [history, setHistory] = useState<DrawElement[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawElement[][]>([]);

  // Active drawing interaction state
  const isInteractingRef = useRef(false);
  const currentElementRef = useRef<DrawElement | null>(null);
  const startPosRef = useRef<Point>({ x: 0, y: 0 });
  const selectedElementIdRef = useRef<string | null>(null);
  const dragOffsetRef = useRef<Point>({ x: 0, y: 0 });

  // Inline text input state
  const [textInput, setTextInput] = useState<{
    visible: boolean;
    x: number;
    y: number;
    value: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    value: "",
  });
  const textInputRef = useRef<HTMLInputElement>(null);

  // Sync history flags with parent toolbar
  useEffect(() => {
    onHistoryChange?.(history.length > 0, redoStack.length > 0);
  }, [history.length, redoStack.length, onHistoryChange]);

  // Handle external Undo trigger
  useEffect(() => {
    if (undoTrigger > 0 && history.length > 0) {
      const previous = history[history.length - 1];
      setRedoStack((prev) => [...prev, elements]);
      setElements(previous);
      setHistory((prev) => prev.slice(0, prev.length - 1));
    }
  }, [undoTrigger]);

  // Handle external Redo trigger
  useEffect(() => {
    if (redoTrigger > 0 && redoStack.length > 0) {
      const next = redoStack[redoStack.length - 1];
      setHistory((prev) => [...prev, elements]);
      setElements(next);
      setRedoStack((prev) => prev.slice(0, prev.length - 1));
    }
  }, [redoTrigger]);

  // Handle external Clear trigger
  useEffect(() => {
    if (clearTrigger > 0 && elements.length > 0) {
      setHistory((prev) => [...prev, elements]);
      setElements([]);
      setRedoStack([]);
    }
  }, [clearTrigger]);

  // Render canvas elements
  const drawAll = useCallback(
    (ctx: CanvasRenderingContext2D, items: DrawElement[], previewItem?: DrawElement | null) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      const toRender = previewItem ? [...items, previewItem] : items;

      for (const el of toRender) {
        if (!el || !el.color) continue;
        ctx.save();
        ctx.strokeStyle = el.color;
        ctx.fillStyle = el.color;

        switch (el.type) {
          case "pen": {
            if (el.points.length < 2) break;
            ctx.lineWidth = el.width;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(el.points[0].x, el.points[0].y);
            for (let i = 1; i < el.points.length - 1; i++) {
              const midX = (el.points[i].x + el.points[i + 1].x) / 2;
              const midY = (el.points[i].y + el.points[i + 1].y) / 2;
              ctx.quadraticCurveTo(el.points[i].x, el.points[i].y, midX, midY);
            }
            ctx.lineTo(el.points[el.points.length - 1].x, el.points[el.points.length - 1].y);
            ctx.stroke();
            break;
          }

          case "rectangle": {
            ctx.lineWidth = el.strokeWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            if (typeof ctx.roundRect === "function") {
              ctx.roundRect(el.startX, el.startY, el.width, el.height, 6);
            } else {
              ctx.rect(el.startX, el.startY, el.width, el.height);
            }
            ctx.stroke();
            break;
          }

          case "circle": {
            ctx.lineWidth = el.strokeWidth;
            ctx.beginPath();
            ctx.ellipse(
              el.centerX,
              el.centerY,
              Math.max(1, Math.abs(el.radiusX)),
              Math.max(1, Math.abs(el.radiusY)),
              0,
              0,
              2 * Math.PI
            );
            ctx.stroke();
            break;
          }

          case "arrow": {
            ctx.lineWidth = el.strokeWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            // Main arrow line
            ctx.beginPath();
            ctx.moveTo(el.startX, el.startY);
            ctx.lineTo(el.endX, el.endY);
            ctx.stroke();

            // Arrowhead calculations
            const angle = Math.atan2(el.endY - el.startY, el.endX - el.startX);
            const headLen = Math.max(10, el.strokeWidth * 3.5);
            ctx.beginPath();
            ctx.moveTo(el.endX, el.endY);
            ctx.lineTo(
              el.endX - headLen * Math.cos(angle - Math.PI / 6),
              el.endY - headLen * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(el.endX, el.endY);
            ctx.lineTo(
              el.endX - headLen * Math.cos(angle + Math.PI / 6),
              el.endY - headLen * Math.sin(angle + Math.PI / 6)
            );
            ctx.stroke();
            break;
          }

          case "text": {
            ctx.font = `600 ${el.fontSize}px 'Inter', sans-serif`;
            ctx.fillText(el.text, el.x, el.y);
            break;
          }
        }

        ctx.restore();
      }
    },
    []
  );

  // Resize canvas for high-DPI displays
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
      drawAll(ctx, elements, currentElementRef.current);
    }
  }, [drawAll, elements]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Re-draw when elements change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      drawAll(ctx, elements, currentElementRef.current);
    }
  }, [drawAll, elements]);

  // Get pointer coordinates relative to canvas
  const getCanvasCoords = (e: PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Check if point hits element (for Eraser & Select)
  const findHitElementIndex = (p: Point): number => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (el.type === "pen") {
        for (const pt of el.points) {
          const dist = Math.hypot(pt.x - p.x, pt.y - p.y);
          if (dist < 15) return i;
        }
      } else if (el.type === "rectangle") {
        if (
          p.x >= Math.min(el.startX, el.startX + el.width) - 8 &&
          p.x <= Math.max(el.startX, el.startX + el.width) + 8 &&
          p.y >= Math.min(el.startY, el.startY + el.height) - 8 &&
          p.y <= Math.max(el.startY, el.startY + el.height) + 8
        ) {
          return i;
        }
      } else if (el.type === "circle") {
        const dist = Math.hypot(el.centerX - p.x, el.centerY - p.y);
        if (Math.abs(dist - Math.abs(el.radiusX)) < 15) return i;
      } else if (el.type === "arrow") {
        const dist = Math.hypot(el.endX - p.x, el.endY - p.y);
        if (dist < 20) return i;
      } else if (el.type === "text") {
        if (Math.hypot(el.x - p.x, el.y - p.y) < 25) return i;
      }
    }
    return -1;
  };

  // Pointer Down handler
  const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    // CRITICAL: Prevent page scroll during canvas interaction
    e.stopPropagation();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);

    const pos = getCanvasCoords(e);
    isInteractingRef.current = true;
    startPosRef.current = pos;

    if (activeTool === "eraser") {
      const hitIdx = findHitElementIndex(pos);
      if (hitIdx !== -1) {
        setHistory((prev) => [...prev, elements]);
        setElements((prev) => prev.filter((_, idx) => idx !== hitIdx));
        setRedoStack([]);
      }
      return;
    }

    if (activeTool === "select") {
      const hitIdx = findHitElementIndex(pos);
      if (hitIdx !== -1) {
        selectedElementIdRef.current = elements[hitIdx].id;
        dragOffsetRef.current = { x: pos.x, y: pos.y };
      } else {
        selectedElementIdRef.current = null;
      }
      return;
    }

    if (activeTool === "text") {
      setTextInput({
        visible: true,
        x: pos.x,
        y: pos.y,
        value: "",
      });
      setTimeout(() => textInputRef.current?.focus(), 50);
      return;
    }

    if (activeTool === "pen") {
      currentElementRef.current = {
        id: `pen-${Date.now()}`,
        type: "pen",
        points: [pos],
        color,
        width: strokeWidth,
      };
    } else if (activeTool === "rectangle") {
      currentElementRef.current = {
        id: `rect-${Date.now()}`,
        type: "rectangle",
        startX: pos.x,
        startY: pos.y,
        width: 0,
        height: 0,
        color,
        strokeWidth,
      };
    } else if (activeTool === "circle") {
      currentElementRef.current = {
        id: `circle-${Date.now()}`,
        type: "circle",
        centerX: pos.x,
        centerY: pos.y,
        radiusX: 0,
        radiusY: 0,
        color,
        strokeWidth,
      };
    } else if (activeTool === "arrow") {
      currentElementRef.current = {
        id: `arrow-${Date.now()}`,
        type: "arrow",
        startX: pos.x,
        startY: pos.y,
        endX: pos.x,
        endY: pos.y,
        color,
        strokeWidth,
      };
    }
  };

  // Pointer Move handler
  const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!isInteractingRef.current) return;
    e.stopPropagation();

    const pos = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (activeTool === "eraser") {
      const hitIdx = findHitElementIndex(pos);
      if (hitIdx !== -1) {
        setHistory((prev) => [...prev, elements]);
        setElements((prev) => prev.filter((_, idx) => idx !== hitIdx));
        setRedoStack([]);
      }
      return;
    }

    if (activeTool === "select" && selectedElementIdRef.current) {
      const dx = pos.x - dragOffsetRef.current.x;
      const dy = pos.y - dragOffsetRef.current.y;
      dragOffsetRef.current = pos;

      setElements((prev) =>
        prev.map((el) => {
          if (el.id !== selectedElementIdRef.current) return el;
          if (el.type === "pen") {
            return {
              ...el,
              points: el.points.map((pt) => ({ x: pt.x + dx, y: pt.y + dy })),
            };
          }
          if (el.type === "rectangle") {
            return { ...el, startX: el.startX + dx, startY: el.startY + dy };
          }
          if (el.type === "circle") {
            return { ...el, centerX: el.centerX + dx, centerY: el.centerY + dy };
          }
          if (el.type === "arrow") {
            return {
              ...el,
              startX: el.startX + dx,
              startY: el.startY + dy,
              endX: el.endX + dx,
              endY: el.endY + dy,
            };
          }
          if (el.type === "text") {
            return { ...el, x: el.x + dx, y: el.y + dy };
          }
          return el;
        })
      );
      return;
    }

    const cur = currentElementRef.current;
    if (!cur) return;

    if (cur.type === "pen") {
      cur.points.push(pos);
    } else if (cur.type === "rectangle") {
      cur.width = pos.x - cur.startX;
      cur.height = pos.y - cur.startY;
    } else if (cur.type === "circle") {
      cur.radiusX = pos.x - cur.centerX;
      cur.radiusY = pos.y - cur.centerY;
    } else if (cur.type === "arrow") {
      cur.endX = pos.x;
      cur.endY = pos.y;
    }

    drawAll(ctx, elements, cur);
  };

  // Pointer Up handler
  const handlePointerUp = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!isInteractingRef.current) return;
    e.stopPropagation();
    isInteractingRef.current = false;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already released
    }

    if (currentElementRef.current) {
      setHistory((prev) => [...prev, elements]);
      setElements((prev) => [...prev, currentElementRef.current!]);
      setRedoStack([]);
      currentElementRef.current = null;
    }

    selectedElementIdRef.current = null;
  };

  // Save entered text
  const handleTextSubmit = () => {
    if (textInput.value.trim().length > 0) {
      const newEl: DrawElement = {
        id: `text-${Date.now()}`,
        type: "text",
        x: textInput.x,
        y: textInput.y,
        text: textInput.value.trim(),
        color,
        fontSize: Math.max(16, strokeWidth * 4),
      };
      setHistory((prev) => [...prev, elements]);
      setElements((prev) => [...prev, newEl]);
      setRedoStack([]);
    }
    setTextInput({ visible: false, x: 0, y: 0, value: "" });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-white dark:bg-[#070b16] select-none overflow-hidden"
      style={{
        touchAction: "none",
        backgroundImage:
          "radial-gradient(circle, rgba(148, 163, 184, 0.35) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        style={{ touchAction: "none" }}
      />

      {/* Inline Text Input Overlay */}
      {textInput.visible && (
        <div
          className="absolute z-40"
          style={{ left: textInput.x, top: textInput.y - 12 }}
        >
          <input
            ref={textInputRef}
            type="text"
            value={textInput.value}
            onChange={(e) => setTextInput((prev) => ({ ...prev, value: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTextSubmit();
              if (e.key === "Escape") setTextInput({ visible: false, x: 0, y: 0, value: "" });
            }}
            onBlur={handleTextSubmit}
            placeholder="Type note..."
            className="px-2 py-1 text-sm font-semibold rounded-md bg-white dark:bg-slate-900 border border-violet-500 shadow-md outline-hidden text-slate-900 dark:text-white min-w-[120px]"
            style={{ color }}
          />
        </div>
      )}
    </div>
  );
}
