type TodoItemProps = {
  id: string;
  task: string;
  done: boolean;
  toggleDone: () => void;
  removeTask: () => void;
  darkMode: boolean; 
};

export default function TodoItem({ task, done, toggleDone, removeTask, darkMode }: TodoItemProps) {
  return (
    <div
      className={`flex justify-between items-center p-2 border-b transition-all duration-300 rounded
        ${
          done
            ? darkMode
              ? "bg-green-700 text-green-200"
              : "bg-green-200 text-green-800"
            : darkMode
              ? "bg-gray-700 text-white"
              : "bg-blue-200 text-black"
        }
      `}
    >
      <span
        onClick={toggleDone}
        className={`cursor-pointer text-sm transition-all duration-300
          ${done ? "line-through opacity-50" : "opacity-100"}
        `}
      >
        {task}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleDone}
          className={`w-5 h-5 flex items-center justify-center rounded transition 
            ${darkMode ? "bg-green-900 hover:bg-green-700" : "bg-green-100 hover:bg-green-200"}
          `}
        >
          <span className={darkMode ? "text-green-300 text-sm" : "text-green-600 text-sm"}>✔</span>
        </button>

        <button
          onClick={removeTask}
          className="w-3 h-3 flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
        >
          <img
            src="/close.png"
            className="w-full h-full object-contain transform transition-transform duration-200 hover:scale-110"
          />
        </button>
      </div>
    </div>
  );
}
