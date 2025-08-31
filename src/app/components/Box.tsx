import React, { useState, forwardRef, useRef } from "react";

interface Task { task: string; done: boolean; }

interface Category {
  name: string;
  x: number;
  y: number;
  dragging?: boolean;
  offset?: { x: number; y: number };
  items: Task[];
  input: string;
}

interface DraggableBoxProps {
  label: string;
  cardsInBox: Category[];
  addCardToBox: (card: Category) => void;
  removeCardFromBox: (index: number) => void;
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  onStartDraggingOutside?: (card: Category, e: React.MouseEvent) => void;
  darkMode: boolean;
}

const DraggableBox = forwardRef<HTMLDivElement, DraggableBoxProps>(
  ({ label, cardsInBox, removeCardFromBox, onStartDraggingOutside, cardRefs, darkMode }, ref) => {
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // Drag da própria Box
    const handleMouseDown = (e: React.MouseEvent) => {
      setDragging(true);
      setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!dragging) return;
      setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseUp = () => setDragging(false);

    return (
       <div
          ref={ref}
          style={{ left: position.x, top: position.y, userSelect: "none" }}
          className={`absolute w-72 min-h-40
            ${darkMode 
              ? "bg-white/20 backdrop-blur-md border border-white/30" 
              : "bg-blue-300/60 backdrop-blur-md border border-blue-400/50 text-black"}
            rounded-2xl shadow-lg 
            cursor-grab p-4 flex flex-col gap-3`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
        <div className="text-white font-bold text-center">{label}</div>
        <div className="flex flex-col gap-2 mt-2">
          {cardsInBox.map((card, i) => (
            <div
              key={i}
              ref={(el) => {
  cardRefs.current[i] = el;
}}
              style={{ cursor: "grab", position: "relative" }}
              className="bg-gray-700 text-white p-2 rounded"
              onMouseDown={(e) => {
                e.stopPropagation();
                onStartDraggingOutside?.(card, e); // avisa o pai que iniciou drag
              }}
            >
              {card.name}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

DraggableBox.displayName = "DraggableBox"; // necessário para forwardRef
export default DraggableBox;