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

interface BoxData {
  id: number;
  x: number;
  y: number;
  label: string;
  cardsInBox: Category[];
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}




export default function DraggableTodo() {

 const [boxes, setBoxes] = useState<BoxData[]>([]); // inicial vazio
 const setBoxRef = (id: number, el: HTMLDivElement | null) => {
    if (el) boxRefs.current[id] = el;
  };


  const categoryRef = useRef<HTMLDivElement>(null);
  const [showTaskBoard, setShowTaskBoard] = useState(true);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const boxRef = useRef<HTMLDivElement>(null);

  const boxRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  

  const [cardsInBox, setCardsInBox] = useState<Category[]>([]);

  const [draggingCardOffset, setDraggingCardOffset] = useState({ x: 0, y: 0 });
  const [draggingCardPos, setDraggingCardPos] = useState({ x: 0, y: 0 });
  const [draggingCardOutside, setDraggingCardOutside] = useState<Category | null>(null);

  const stopCategoryDrag = () => setCategoryDragging(false);

  const criarGaveta = () => {
    const newBox: BoxData = {
      id: Date.now(),
      x: 100,
      y: 100,
      label: "Nova Gaveta",
      cardsInBox: [],
      cardRefs: { current: [] } as React.MutableRefObject<(HTMLDivElement | null)[]>
    };

    setBoxes(prev => [...prev, newBox]);
  };

  
  const handleDraggingMove = (e: React.MouseEvent) => {
    if (!draggingCardOutside) return;

    setDraggingCardPos({
      x: e.clientX - draggingCardOffset.x,
      y: e.clientY - draggingCardOffset.y,
    });
  };

const handleDraggingEnd = () => {
  if (!draggingCardOutside) return;

  const finalX = draggingCardPos.x;
  const finalY = draggingCardPos.y;

  let cardAdded = false;

  // 1️⃣ Tenta adicionar em alguma gaveta
  boxes.forEach(box => {
    if (cardAdded) return; // já entrou em uma, ignora as outras
    const el = boxRefs.current[box.id];
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (
      finalX > rect.left &&
      finalX < rect.right &&
      finalY > rect.top &&
      finalY < rect.bottom
    ) {
      setBoxes(prev =>
        prev.map(b =>
          b.id === box.id
            ? { ...b, cardsInBox: [draggingCardOutside!, ...b.cardsInBox] }
            : b
        )
      );
      cardAdded = true;
    }
  });

  // 2️⃣ Se não entrou em gaveta, tenta na "Minha Caixa"
  if (!cardAdded && boxRef.current) {
    const rect = boxRef.current.getBoundingClientRect();
    if (
      finalX > rect.left &&
      finalX < rect.right &&
      finalY > rect.top &&
      finalY < rect.bottom
    ) {
      setCardsInBox(prev => [draggingCardOutside!, ...prev]);
      cardAdded = true;
    }
  }

  // 3️⃣ Se não entrou em lugar nenhum, volta para categories
  if (!cardAdded) {
    setCategories(prev => [
      ...prev,
      { ...draggingCardOutside!, x: finalX, y: finalY }
    ]);
  }

  // Limpa o estado de arrasto
  setDraggingCardOutside(null);
  setDraggingCardOffset({ x: 0, y: 0 });
  setDraggingCardPos({ x: 0, y: 0 });

  // ⚡ resetar drag interno dos CategoryCards
cardRefs.current.forEach(ref => {
  if (!ref) return;
  const cardInstance = ref as any;
  if (cardInstance && cardInstance.dragging) {
    cardInstance.dragging = false;
  }
});
};



  const addCardToBox = (card: Category) => {
    setCardsInBox(prev => [card, ...prev]);
  };

  const removeCardFromBox = (index: number, shouldReadd = true) => {
    setCardsInBox(prev => {
      const removed = prev[index];
      if (removed && shouldReadd) {
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

  
  useEffect(() => {
  const handleGlobalMouseUp = () => {
    if (draggingCardOutside) {
      // Se estava arrastando, finaliza o drag
      handleDraggingEnd();
    }
    // Reseta estado de arrasto
    setDraggingCardOutside(null);
    setDraggingCardOffset({ x: 0, y: 0 });
    setDraggingCardPos({ x: 0, y: 0 });
  };

  window.addEventListener("mouseup", handleGlobalMouseUp);
  return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
}, [draggingCardOutside, boxes, categories, cardsInBox]);;




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
      onMouseMove={(e) => {
        handleTaskMouseMove(e);
        handleCategoryMouseMove(e);
        handleDraggingMove(e); // ⬅ aqui
      }}

      
      onMouseUp={() => {
        handleTaskMouseUp();
        stopCategoryDrag();
        handleDraggingEnd(); // ⬅ aqui

        setDraggingCardOutside(null);
        setDraggingCardOffset({ x: 0, y: 0 });
        setDraggingCardPos({ x: 0, y: 0 });
      }}

       className={`fixed top-0 left-0 w-screen h-screen overflow-hidden ${darkMode ? "bg-black" : "bg-white"}`}
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

      {/* Card de criação de tarefa */}
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
        <h2 className="text-base sm:text-lg md:text-xl font-bold whitespace-nowrap">Nova tarefa</h2>
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

      {/* Botão para criar gaveta */}
      <button
       onClick={() => criarGaveta()} // função que cria um novo DraggableBox
        className="absolute top-32 right-4 px-3 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
      >
        Criar Gaveta
      </button>




      {/* Renderização das gavetas */}
      {boxes.map(box => (
      <DraggableBox
        key={box.id}
        ref={el => { if (el) boxRefs.current[box.id] = el; }}
        label={box.label}
        cardsInBox={box.cardsInBox}
        cardRefs={box.cardRefs}

        onStartDraggingOutside={(card, e) => {
      
          const rect = (e.target as HTMLDivElement).getBoundingClientRect();
          const offsetX = e.clientX - rect.left;
          const offsetY = e.clientY - rect.top;

          setDraggingCardOutside(card);
          setDraggingCardPos({ x: e.clientX - offsetX, y: e.clientY - offsetY });
          setDraggingCardOffset({ x: offsetX, y: offsetY });

          // Remove da Box
          setBoxes(prev => prev.map(b => b.id === box.id ? { ...b, cardsInBox: b.cardsInBox.filter(c => c !== card) } : b));
        }}


        addCardToBox={(card) => {
         setBoxes(prev => prev.map(b => b.id === box.id ? { ...b, cardsInBox: [card, ...b.cardsInBox] } : b));
        }}
        removeCardFromBox={(index) => {
          setBoxes(prev => prev.map(b => b.id === box.id ? { ...b, cardsInBox: b.cardsInBox.filter((_, i) => i !== index) } : b));
        }}
        darkMode={darkMode}
      />
      ))}
  
      <DraggableBox
        ref={boxRef}
        label="Minha Caixa"
        cardsInBox={cardsInBox}
        cardRefs={cardRefs}
        addCardToBox={(card) => setCardsInBox(prev => [card, ...prev])}

        removeCardFromBox={(index) => {
          // opcional: você ainda pode remover diretamente da Box
          setCardsInBox(prev => prev.filter((_, i) => i !== index));
        }}

        onStartDraggingOutside={(card, e) => {
          const rect = (e.target as HTMLDivElement).getBoundingClientRect();
          const offsetX = e.clientX - rect.left;
          const offsetY = e.clientY - rect.top;

          setDraggingCardOutside(card);
          setDraggingCardPos({ x: e.clientX - offsetX, y: e.clientY - offsetY });
          setDraggingCardOffset({ x: offsetX, y: offsetY });

          // Remove da Box
          setCardsInBox(prev => prev.filter(c => c !== card));
        }}

        darkMode={darkMode}
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
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {

              if (draggingCardOutside) return;

              const target = e.target as HTMLElement;
              if (target.tagName === "BUTTON" || target.closest("button")) return;
              const cardEl = cardRefs.current[i]; // <- aqui usamos o ref do CategoryCard
              if (!cardEl) return;

              const rect = cardEl.getBoundingClientRect(); // <-- agora é o card real

              const offsetX = e.clientX - rect.left;
              const offsetY = e.clientY - rect.top;

              setDraggingCardOutside(c);
              setDraggingCardOffset({ x: offsetX, y: offsetY });
              setDraggingCardPos({ x: e.clientX - offsetX, y: e.clientY - offsetY });

              setCategories(prev => prev.filter((_, j) => j !== i));

              // desabilita drag interno
              c.dragging = false;
            }}
    
          >
            <CategoryCard
              ref={el => { cardRefs.current[i] = el; }}
              category={c}
              index={i}
              updateCategory={updateCategory}
              removeCategory={removeCategory} 
              onMouseUp={() => handleCategoryMouseUp(i, cardRefs.current[i])}
              draggingCardOutside={draggingCardOutside}
              
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {draggingCardOutside && (
        <div
          style={{
            position: 'absolute',
            left: draggingCardPos.x,
            top: draggingCardPos.y,
            pointerEvents: 'none',
            }}
            className="bg-gray-700 text-white p-2 rounded cursor-grabbing"
          >
          {draggingCardOutside.name}
        </div>
      )}

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
