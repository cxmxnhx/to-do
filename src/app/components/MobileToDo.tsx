"use client";
import React, { useState, useEffect } from "react";
import CategoryCard from "./categoryCard";


export default function MobileTodo() {
  const [categories, setCategories] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  const [storedCategories, setStoredCategories] = useState<any[]>([]);

    const storeCategory = (index: number) => {
     const cat = categories[index];
        setStoredCategories(prev => [...prev, cat]);
        setCategories(prev => prev.filter((_, i) => i !== index));
    };


  useEffect(() => {
    if (typeof window !== "undefined") {
        const savedCategories = localStorage.getItem("categories");
        const savedTasks = localStorage.getItem("tasks");
        if (savedCategories) setCategories(JSON.parse(savedCategories));
        if (savedTasks) setTasks(JSON.parse(savedTasks));
    }
    }, []);

  const [input, setInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [categories, tasks]);

  const addCategory = () => {
    if (!categoryInput.trim()) return;
    setCategories([...categories, { name: categoryInput, items: [], input: "" }]);
    setCategoryInput("");
  };

  return (
    <div className={`min-h-screen p-4 ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      {/* Botões de controle */}
      <div className="flex justify-between mb-4">
        <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1 bg-gray-300 rounded">
          {darkMode ? "Claro" : "Escuro"}
        </button>
        <button onClick={() => setCategories([])} className="px-3 py-1 bg-red-500 text-white rounded">
          Limpar
        </button>
      </div>

      {/* Criar categoria */}
      <div className="flex gap-2 mb-4">
        <input
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          className="flex-1 p-2 rounded border"
          placeholder="Nova tarefa"
        />
        <button onClick={addCategory} className="px-4 py-2 bg-blue-500 text-white rounded">
          Criar
        </button>
      </div>

      {/* Lista de categorias (fixas) */}
      <div className="space-y-4">
        {categories.map((c, i) => (
          <CategoryCard
            key={i}
            category={c}
            index={i}
            updateCategory={(index, newcat) =>
              setCategories(prev => prev.map((cat, j) => j === index ? newcat : cat))
            }
            removeCategory={(index) => setCategories(prev => prev.filter((_, j) => j !== index))}
            onStore={storeCategory}
            draggingCardOutside={null}
            darkMode={darkMode}
          />
        ))}
      </div>


        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-3 
                flex gap-3 overflow-x-auto border-t border-gray-600">
            {storedCategories.map((c, i) => (
                <div
                key={i}
                className="min-w-[120px] p-2 bg-gray-700 rounded shadow flex-shrink-0 flex justify-between items-center"
            >
                <span>{c.name}</span>
                <button
                    onClick={() => {
                        setCategories(prev => [...prev, c]);
                        setStoredCategories(prev => prev.filter((_, j) => j !== i));
                    }}
                    className="ml-2 px-1 py-0.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                >
                    ↑
                </button>
             </div>
            ))}
        </div>

    </div>
  );
}
