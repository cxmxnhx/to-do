"use client";
import React from "react";
import TodoItem from "./TodoItem";

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

interface CategoryCardProps {
  category: Category;
  index: number;
  updateCategory: (index: number, newCategory: Category) => void;
  removeCategory: (index: number) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  draggingCardOutside: Category | null;
} 

const CategoryCard = React.forwardRef<HTMLDivElement, CategoryCardProps> (({ category, index, updateCategory, removeCategory, onMouseUp, onMouseDown, draggingCardOutside  }, ref) => {
 
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const internalRef = React.useRef<HTMLDivElement>(null);

  const setRefs = (el: HTMLDivElement) => {
    internalRef.current = el;
    if (typeof ref === "function") {
      ref(el);
    } else if (ref) {
    (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
 
    setOffset({ x: e.clientX - category.x, y: e.clientY - category.y });

    if (onMouseDown) onMouseDown(e); // vai iniciar o drag global
  };





  const handleAddTask = () => {
    if (!category.input.trim()) return;
    const newItems = [...category.items, { task: category.input, done: false }];
    updateCategory(index, { ...category, items: newItems, input: "" });
  };

  const handleInputChange = (value: string) => {
    updateCategory(index, { ...category, input: value });
  };

  const toggleTaskDone = (taskIndex: number) => {
    const newItems = category.items.map((t, i) =>
      i === taskIndex ? { ...t, done: !t.done } : t
    );
    updateCategory(index, { ...category, items: newItems });
  };

  const removeTask = (taskIndex: number) => {
    const newItems = category.items.filter((_, i) => i !== taskIndex);
    updateCategory(index, { ...category, items: newItems });
  };

  return (
    <div
      ref={setRefs}
      onMouseDown={handleMouseDown}
      style={{ position: "absolute", left: category.x, top: category.y, cursor: "grab" }}
      className="w-80 p-4 bg-gray-700 text-white rounded shadow select-none"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{category.name}</h2>
        <button
          onClick={() => removeCategory(index)}
          className="text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
        >
          X
        </button>
      </div>
      
      <div className="flex mb-2 gap-2">
        <input
          value={category.input}
          onChange={(e) => handleInputChange(e.target.value)}
          className="flex-1 p-2 rounded text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Nova tarefa"
        />
        <button
          onClick={handleAddTask}
          className="px-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex-shrink-0"
        >
          Adicionar
        </button>
      </div>

      <div>
        {category.items.map((t, idx) => (
          <TodoItem
            key={idx}
           
            task={t.task}
            done={t.done}
            toggleDone={() => toggleTaskDone(idx)}
            removeTask={() => removeTask(idx)}
          />
        ))}
      </div>
    </div>
  );
});

CategoryCard.displayName = "CategoryCard";
export default CategoryCard;