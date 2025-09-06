type TodoItemProps = {
  task: string;
  done: boolean;
  toggleDone: () => void;
  removeTask: () => void;
};

export default function TodoItem({ task, done, toggleDone, removeTask }: TodoItemProps) {
  return (
    <div
      className={`flex justify-between items-center p-2 border-b transition-all duration-300 rounded
        ${done ? "bg-green-200" : "bg-gray-50"}`}
    >
      <span
        onClick={toggleDone}
        className={`cursor-pointer text-sm transition-all duration-300
          ${done ? "line-through opacity-50 text-gray-500" : "opacity-100 text-gray-900"}`}
      >
        {task}
      </span>
      <div className="flex items-center gap-1">
  <button
    onClick={toggleDone}
    className="w-5 h-5 flex items-center justify-center bg-green-100 rounded hover:bg-green-200 transition"
  >
    <span className="text-green-600 text-sm">✔</span>
  </button>

  <button
    onClick={removeTask}
    className="w-3 h-3 flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
  >
    <img src="/close.png" className="w-full h-full object-contain transform transition-transform duration-200  hover:scale-110" />
  </button>
</div>
    </div>
  );
}
