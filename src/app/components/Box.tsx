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
  cardRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

const DraggableBox = forwardRef<HTMLDivElement, DraggableBoxProps>(
  ({ label, cardsInBox, addCardToBox, removeCardFromBox }, ref) => {

    const [draggingCardIndex, setDraggingCardIndex] = useState<number | null>(null);
    const [draggingCardPos, setDraggingCardPos] = useState({ x: 0, y: 0 });
    const [draggingCardOffset, setDraggingCardOffset] = useState({ x: 0, y: 0 });


    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });


    const startDraggingFromBox = (e: React.MouseEvent, index: number) => {
      setDraggingCardIndex(index);
      setDraggingCardOffset({ x: e.clientX, y: e.clientY });
      setDraggingCardPos({ x: e.clientX, y: e.clientY });
    };

    const handleDraggingCardMove = (e: React.MouseEvent) => {
      if (draggingCardIndex === null) return;
      setDraggingCardPos({ x: e.clientX - draggingCardOffset.x, y: e.clientY - draggingCardOffset.y });
    };

    const handleDraggingCardUp = () => {
      if (draggingCardIndex === null) return;

      const boxRect = ref && 'current' in ref && ref.current ? ref.current.getBoundingClientRect() : null;
      if (boxRect) {
        const cardCenterX = draggingCardPos.x;
        const cardCenterY = draggingCardPos.y;
        if (
         cardCenterX < boxRect.left ||
         cardCenterX > boxRect.right ||
          cardCenterY < boxRect.top ||
          cardCenterY > boxRect.bottom
        ) {
          removeCardFromBox(draggingCardIndex);
        }
      }

      setDraggingCardIndex(null);
    };



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
        style={{ left: position.x, top: position.y }}
        className="absolute w-72 min-h-40 bg-blue-500 rounded-lg shadow-lg cursor-grab p-2 flex flex-col gap-2"
        onMouseMove={(e) => { handleMouseMove(e); handleDraggingCardMove(e); }}
        onMouseDown={handleMouseDown}
        onMouseUp={() => { handleMouseUp(); handleDraggingCardUp(); }}
      >
        <div className="text-white font-bold text-center">{label}</div>
        <div className="flex flex-col gap-2 mt-2">
          {cardsInBox.map((card, i) => (
            <div 
              key={i} 

              ref={el => {
                if (cardRefs.current) cardRefs.current[i] = el; // ✅ só atribui, não retorna nada
              }}

              onMouseDown={(e) => {
                e.stopPropagation();
                startDraggingFromBox(e, i)
              }}

              style={{ cursor: "grab", position: "relative" }}
              className="bg-gray-700 text-white p-2 rounded">
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