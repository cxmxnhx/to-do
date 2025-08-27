"use client";
import React, { useState, useEffect, useRef } from "react";
import CategoryCard from "./categoryCard";
import TaskBoard from "./TaskBoard";
import DraggableBox from "./Box";
import { motion, AnimatePresence } from "framer-motion";



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


export default function DraggableTodo() {
  const categoryRef = useRef<HTMLDivElement>(null);
  const [showTaskBoard, setShowTaskBoard] = useState(true);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);
  const [cardsInBox, setCardsInBox] = useState<Category[]>([]);

  const stopCategoryDrag = () => setCategoryDragging(false);

  const addCardToBox = (card: Category) => {
    setCardsInBox(prev => [card, ...prev]);
  };

  const removeCardFromBox = (index: number) => {
    setCardsInBox(prev => {
      const removed = prev[index];
      if (removed) {
        setCategories(old => [...old, removed]); // reaparece na tela
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };
  // Categorias
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("categories");
    return saved ? JSON.parse(saved) : [];
  });

  // Tarefas
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Draggable tasks
  const [taskPosition, setTaskPosition] = useState(() => {
    const saved = localStorage.getItem("taskPosition");
    return saved ? JSON.parse(saved) : { x: 160, y: 450 };
  });
  const [taskDragging, setTaskDragging] = useState(false);
  const [taskOffset, setTaskOffset] = useState({ x: 0, y: 0 });


  // Criador de categoria (a "caixa de criar categoria")
  const [categoryPosition, setCategoryPosition] = useState(() => {
    const saved = localStorage.getItem("categoryPosition");
    return saved ? JSON.parse(saved) : { x: 300, y: 100 };
  });

  const [categoryDragging, setCategoryDragging] = useState(false);
  const [categoryOffset, setCategoryOffset] = useState({ x: 0, y: 0 });
  const [categoryInput, setCategoryInput] = useState("");

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("taskPosition", JSON.stringify(taskPosition));
    localStorage.setItem("categoryPosition", JSON.stringify(categoryPosition));
  }, [categories, tasks, taskPosition, categoryPosition]);

    const updateCategory = (index: number, newCategory: Category) => {
        setCategories(prevCategories => 
            prevCategories.map((c, i) => i === index ? newCategory : c)
        );
    };

  const addCategory = () => {
    if (!categoryInput.trim()) return;
    setCategories([
      ...categories,
      { name: categoryInput, x: 300, y: 100, dragging: false, offset: { x: 0, y: 0 }, items: [], input: "" },
    ]);
    setCategoryInput("");
  };

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { task: input, done: false }]);
    setInput("");
  };

  const toggleDone = (index: number) => {
    setTasks(tasks.map((t, i) => (i === index ? { ...t, done: !t.done } : t)));
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleTaskMouseDown = (e: React.MouseEvent) => {
    setTaskDragging(true);
    setTaskOffset({ x: e.clientX - taskPosition.x, y: e.clientY - taskPosition.y });
  };

  const handleTaskMouseMove = (e: React.MouseEvent) => {
    if (!taskDragging) return;
    setTaskPosition({ x: e.clientX - taskOffset.x, y: e.clientY - taskOffset.y });
  };

  const handleTaskMouseUp = () => setTaskDragging(false);

  const handleCategoryMouseMove = (e: React.MouseEvent) => {
    if (!categoryDragging || !categoryRef.current) return;

    const rect = categoryRef.current.getBoundingClientRect();
    const cardWidth = rect.width;
    const cardHeight = rect.height;

    let newX = e.clientX - categoryOffset.x;
    let newY = e.clientY - categoryOffset.y;

    // Limita para que o card não ultrapasse a tela
    newX = Math.max(0, Math.min(window.innerWidth - cardWidth, newX));
   newY = Math.max(0, Math.min(window.innerHeight - cardHeight, newY));

    setCategoryPosition({ x: newX, y: newY });
  };
  

  const handleCategoryMouseUp = (index: number, card: HTMLDivElement | null) => {
    const cardData = categories[index];
    if (!boxRef.current || !card) return;

    const rectBox = boxRef.current.getBoundingClientRect();
    const rectCard = card.getBoundingClientRect();
    const cardCenterX = rectCard.left + rectCard.width / 2;
    const cardCenterY = rectCard.top + rectCard.height / 2;

    if (
      cardCenterX > rectBox.left &&
      cardCenterX < rectBox.right &&
      cardCenterY > rectBox.top &&
      cardCenterY < rectBox.bottom
    ) {
      // adiciona na caixa e remove da tela
      setCardsInBox(prev => [cardData, ...prev]);
      setCategories(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div
      onMouseMove={(e) => { handleTaskMouseMove(e); handleCategoryMouseMove(e); }}
      onMouseUp={() => { handleTaskMouseUp(); stopCategoryDrag(); }}
      className={`w-screen h-screen relative overflow-hidden ${darkMode ? "bg-black" : "bg-white"}`}
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
      >
        {darkMode ? "Modo Claro" : "Modo Escuro"}
      </button>

      <button
        onClick={() => setCategories([])} // limpa todas as categorias
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 absolute top-16 right-4"
      >
        Limpar Categorias
    </button>

      {/* Card de criação de categoria */}
      <div
        ref={categoryRef}
        onMouseDown={(e) => {
          setCategoryDragging(true);
          setCategoryOffset({ x: e.clientX - categoryPosition.x, y: e.clientY - categoryPosition.y });
        }}
        
        onMouseUp={() => setCategoryDragging(false)}
        style={{ position: "absolute", left: categoryPosition.x, top: categoryPosition.y, cursor: "grab" }}
        className={`w-110 p-2 bg-gray-300 rounded-full shadow select-none flex items-center gap-2 w-40 sm:w-60 md:w-80 lg:w-110 ${
             darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
        }`}
      >
        <h2 className="text-base sm:text-lg md:text-xl font-bold whitespace-nowrap">Criar Categoria</h2>
        <input
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          className={`
                flex-1 p-1 sm:p-2 md:p-3 rounded-full placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-400
                ${darkMode ? "bg-white text-black" : "bg-white text-black"}
            `}
          placeholder="Nome da categoria"
        />
        <button onClick={addCategory} className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex-shrink-0">
          Criar
        </button>
      </div>

  
      <DraggableBox
        ref={boxRef}
        label="Minha Caixa"
        cardsInBox={cardsInBox}
        cardRefs={cardRefs}
        addCardToBox={(card) => setCardsInBox(prev => [card, ...prev])}
        removeCardFromBox={removeCardFromBox}
      />
  

      {/* Renderizar categorias */}
      <AnimatePresence>
        {categories.map((c, i) => (
        <motion.div
           key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <CategoryCard
              ref={el => { cardRefs.current[i] = el; }}
              category={c}
              index={i}
              updateCategory={updateCategory}
              removeCategory={removeCategory} 
              onMouseUp={() => handleCategoryMouseUp(i, cardRefs.current[i])}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Minhas tarefas */}
      {showTaskBoard && (
        <TaskBoard
        tasks={tasks}
        input={input}
        setInput={setInput}
        addTask={addTask}
        toggleDone={toggleDone}
        removeTask={removeTask}
        position={taskPosition}
        handleMouseDown={handleTaskMouseDown}
        close={() => setShowTaskBoard(false)}
      />
    )}
    </div>
  );
}
