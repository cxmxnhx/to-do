type TodoItemProps = {
  task: string;
  done: boolean;
  toggleDone: () => void;
  removeTask: () => void;
};

export default function TodoItem({ task, done, toggleDone, removeTask }: TodoItemProps) {
  return (
    <div className={`flex justify-between items-center p-2 border-b text-gray-900 transition ${done ? "bg-green-200 text-gray-400" : "bg-gray-50"}`}>
      <span className={done ? " text-gray-400" : ""}>{task}</span>
      <div>
        <button onClick={toggleDone} className="mr-2 hover:text-green-500 transition">✔</button>
        <button onClick={removeTask} className="hover:text-red-500 transition">✖</button>
      </div>
    </div>
  );
}
