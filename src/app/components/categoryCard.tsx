"use client";
import React from "react";
import TodoItem from "./TodoItem";
import { motion, AnimatePresence } from "framer-motion";


interface Task { id:string, task: string; done: boolean; }
interface Category {
  id: string;
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
  onStore?: (index: number) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  draggingCardOutside: Category | null;
  darkMode: boolean;
} 

const CategoryCard = ({
  category,
  index,
  updateCategory,
  removeCategory,
  onStore,
  darkMode
}: CategoryCardProps) => {

    const handleAddTask = () => {
  if (!category.input.trim()) return;
  const newItems = [
    ...category.items, 
    { id: crypto.randomUUID(), task: category.input, done: false }
  ];
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
        className={`w-full p-4 rounded shadow select-none flex flex-col h-96 transition-colors duration-200
          ${darkMode
            ? "bg-gradient-to-r from-gray-800 to-gray-900 text-white"
            : "bg-gradient-to-r from-blue-50 to-blue-100 text-black"
          }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-black"}`}>
            {category.name}
          </h2>

          <div className="flex gap-1">
            {onStore && (
              <button
                onClick={() => onStore(index)}
                className={`px-2 py-1 rounded transition-colors duration-200 
                  ${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-black hover:bg-gray-300"}`}
              >
                Salvar
              </button>
            )}
          </div>

          <button
            onClick={() => removeCategory(index)}
            className={`px-2 py-1 rounded transition-colors duration-200
              ${darkMode ? "bg-red-700 text-white hover:bg-red-600" : "bg-red-100 text-red-500 hover:bg-red-200"}`}
          >
            X
          </button>
        </div>

        {/* Input e botão adicionar */}
        <div className="flex mb-2 gap-2">
          <input
            value={category.input}
            onChange={(e) => handleInputChange(e.target.value)}
            className={`flex-1 p-2 rounded placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400
              ${darkMode ? "bg-gray-700 text-white border border-gray-600" : "bg-white text-black border border-gray-300"}`}
            placeholder="Nova tarefa"
          />
          <button
            onClick={handleAddTask}
            className={`px-1 py-2 rounded flex-shrink-0 transition-colors duration-200
              ${darkMode ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            Adicionar
          </button>
        </div>

        {/* Lista de tarefas */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2">
          <AnimatePresence>
            {category.items.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.2 }}
              >
                <TodoItem
                  id={t.id}
                  task={t.task}
                  done={t.done}
                  toggleDone={() => toggleTaskDone(idx)}
                  removeTask={() => removeTask(idx)}
                  darkMode={darkMode}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

CategoryCard.displayName = "CategoryCard";
export default CategoryCard;
