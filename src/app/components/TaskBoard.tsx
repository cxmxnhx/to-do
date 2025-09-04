"use client";
import React from "react";
import TodoItem from "./TodoItem";

interface Task { task: string; done: boolean; }
interface TaskBoardProps {
  tasks: Task[];
  input: string;
  setInput: (value: string) => void;
  addTask: () => void;
  toggleDone: (index: number) => void;
  removeTask: (index: number) => void;
  position: { x: number; y: number };
  handleMouseDown: (e: React.MouseEvent) => void;
  close: () => void;
  
}

export default function TaskBoard({
  tasks,
  input,
  setInput,
  addTask,
  toggleDone,
  removeTask,
  position,
  handleMouseDown,
  close
}: TaskBoardProps) {
  return (
    <div
      onMouseDown={handleMouseDown}
      style={{ position: "absolute", left: position.x, top: position.y, cursor: "grab" }}
      className="max-w-md w-80 p-4 bg-gray-700 text-white rounded shadow select-none"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Minhas Tarefas</h2>
        <button
          onClick={close}
          className="text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
        >
          X
        </button>
      </div>

      <div className="flex mb-2 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Nova tarefa"
        />
        <button
          onClick={addTask}
          className="px-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex-shrink-0"
        >
          Adicionar
        </button>
      </div>

      <div>
        {tasks.map((t, i) => (
          <TodoItem
            key={i}
            task={t.task}
            done={t.done}
            toggleDone={() => toggleDone(i)}
            removeTask={() => removeTask(i)}
          />
        ))}
      </div>
    </div>
  );
}
