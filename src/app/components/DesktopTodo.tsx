"use client";
import React, { useState } from "react";
import CategoryCard from "./categoryCard";
import { motion, AnimatePresence } from "framer-motion";

export default function DesktopTodo() {
  const [categories, setCategories] = useState<any[]>([]);
  const [storedCategories, setStoredCategories] = useState<any[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const generateWeekDays = () => {
    const days = [
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
      "Domingo",
    ];

    const newCategories = days
      .filter(day => !categories.some(c => c.name === day))
      .map(day => ({ id: crypto.randomUUID(), name: day, items: [], input: "" }));

    setCategories(prev => [...prev, ...newCategories]);
  };

  // Guardar card
  const storeCategory = (index: number) => {
    const cat = categories[index];
    setStoredCategories(prev => [...prev, cat]);
    setCategories(prev => prev.filter((_, i) => i !== index));
  };

  // Voltar card da gaveta
  const restoreCategory = (index: number) => {
    const cat = storedCategories[index];
    setCategories(prev => [...prev, cat]);
    setStoredCategories(prev => prev.filter((_, i) => i !== index));
  };

  // Adicionar nova categoria
  const addCategory = () => {
    if (!categoryInput.trim()) return;
    setCategories([...categories, { id: crypto.randomUUID(), name: categoryInput, items: [], input: "" }]);
    setCategoryInput("");
  };

  return (
    <div className={`w-full min-h-screen p-8 transition-colors duration-200 
      ${darkMode ? "bg-black text-white" : "bg-gray-100 text-black"}`}
    >

      {/* Botões de controle na mesma linha */}
      <div className="flex justify-between items-center mb-4 gap-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-3 py-1 rounded ${
            darkMode
              ? "bg-gray-200 text-black hover:bg-gray-300"
              : "bg-gray-800 text-white hover:bg-gray-900"
          }`}
        >
          {darkMode ? "Claro" : "Escuro"}
        </button>

        <button
          onClick={generateWeekDays}
          className={`px-3 py-1 rounded ${
            darkMode
              ? "bg-green-100 text-black hover:bg-green-500"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          Gerar dias
        </button>

        <button
          onClick={() => setCategories([])}
          className={`px-3 py-1 rounded ${
            darkMode
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          Limpar
        </button>
      </div>

      {/* Input de nova categoria */}
      <div className="flex justify-center mb-4">
        <div className="flex gap-2 w-full max-w-md">
          <input
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            className={`flex-1 p-2 rounded border placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400
              ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
            placeholder="Nova lista"
          />
          <button
            onClick={addCategory}
            className={`px-4 py-2 rounded ${
              darkMode
                ? "bg-blue-100 text-black hover:bg-blue-500"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Criar
          </button>
        </div>
      </div>

      {/* Grid de categorias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {categories.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: -20, scale: 0.86 }}
              animate={{ opacity: 1, y: 0, scale: 0.95 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
              className="hover:scale-105 hover:shadow-lg transform"
            >
              <CategoryCard
                category={c}
                index={i}
                updateCategory={(index, newCat) =>
                  setCategories(prev => prev.map((cat, j) => (j === index ? newCat : cat)))
                }
                removeCategory={(index) =>
                  setCategories(prev => prev.filter((_, j) => j !== index))
                }
                onStore={storeCategory}
                draggingCardOutside={null}
                darkMode={darkMode}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Cards armazenados */}
      <div
        className={`fixed bottom-0 left-0 right-0 max-w-full px-2 py-1 flex gap-2 overflow-x-auto border-t border-gray-400
          ${darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
      >
        {storedCategories.map((c, i) => (
          <div
            key={i}
            className={`min-w-[100px] px-2 py-1 rounded flex-shrink-0 cursor-pointer flex justify-center items-center
              ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}
            onClick={() => restoreCategory(i)}
          >
            <span className="text-sm font-bold">{c.name[0]}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
