"use client";

import React, { useEffect, useState } from "react";
//import DraggableTodo from "./components/DraggableToDo";
import MobileTodo from "./components/MobileToDo";
import DesktopTodo from "./components/DesktopTodo";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // se for menor que 768px, considero mobile
    };

    handleResize(); // roda ao carregar
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      {isMobile ? <MobileTodo /> : <DesktopTodo />}
    </main>
  );
}
