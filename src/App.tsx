import { useState, useEffect } from "react";
import TodoItem from "./components/TodoItem";
import TodoForm from "./components/TodoForm";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./services/todoService";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

type FilterType = "All" | "Active" | "Completed";

const FILTERS: FilterType[] = ["All", "Active", "Completed"];

function formatDate(): string {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("All");

  useEffect(() => {
    async function loadTodos() {
      try {
        const data = await fetchTodos();
        setTodos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load todos");
      } finally {
        setLoading(false);
      }
    }

    loadTodos();
  }, []);

  async function handleAdd(title: string) {
    const tempId = -Date.now();
    const newTodo: Todo = {
      id: tempId,
      title: title,
      completed: false,
    };

    setTodos((prev) => [newTodo, ...prev]);

    try {
      const savedTodo = await createTodo({
        title: title,
        completed: false,
      });
      setTodos((prev) => prev.map((t) => (t.id === tempId ? savedTodo : t)));
    } catch (err) {
      setTodos((prev) => prev.filter((t) => t.id !== tempId));
      console.error("Failed to add todo:", err);
    }
  }

  async function handleToggle(id: number) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );

    try {
      await updateTodo(id, { completed: !todo.completed });
    } catch (err) {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: todo.completed } : t,
        ),
      );
      console.error("Failed to toggle todo:", err);
    }
  }

  async function handleDelete(id: number) {
    const deletedTodo = todos.find((t) => t.id === id);
    if (!deletedTodo) return;

    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteTodo(id);
    } catch (err) {
      setTodos((prev) => [deletedTodo, ...prev]);
      console.error("Failed to delete todo:", err);
    }
  }

  async function clearCompleted() {
    const completedTodos = todos.filter((t) => t.completed);
    const previousTodos = [...todos];

    setTodos((prev) => prev.filter((t) => !t.completed));

    try {
      await Promise.all(completedTodos.map((t) => deleteTodo(t.id)));
    } catch (err) {
      setTodos(previousTodos);
      console.error("Failed to clear completed:", err);
    }
  }

  const filtered: Todo[] = todos.filter((t) => {
    if (filter === "Active") return !t.completed;
    if (filter === "Completed") return t.completed;
    return true;
  });

  const activeCount: number = todos.filter((t) => !t.completed).length;
  const completedCount: number = todos.filter((t) => t.completed).length;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center font-dm bg-[#F4F3FA]">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium mb-2">
            Something went wrong
          </p>
          <p className="text-[rgba(15,15,35,0.4)] text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen flex justify-center
        px-5 pt-10 pb-15 font-dm
        bg-[#F4F3FA]
        bg-[radial-gradient(ellipse_at_20%_0%,rgba(108,99,255,0.12)_0%,transparent_50%),radial-gradient(ellipse_at_80%_100%,rgba(72,191,227,0.10)_0%,transparent_50%),radial-gradient(ellipse_at_50%_50%,rgba(255,182,193,0.06)_0%,transparent_60%)]
      "
    >
      <div className="w-full max-w-[480px]">
        {/* Header */}
        <div className="animate-fade-in mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-playfair text-[34px] font-bold text-gradient-purple tracking-tight leading-tight">
                My Tasks
              </h1>
              <p className="text-[14.5px] text-[rgba(15,15,35,0.4)] mt-1.5 font-normal flex items-center gap-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="opacity-50"
                >
                  <rect
                    x="1"
                    y="2.5"
                    width="12"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path d="M1 5.5h12" stroke="currentColor" strokeWidth="1.2" />
                  <path
                    d="M4.5 1v3M9.5 1v3"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                {formatDate()}
              </p>
            </div>

            <div
              className="
                text-center rounded-2xl px-5 py-2.5
                bg-[linear-gradient(135deg,rgba(108,99,255,0.08),rgba(72,191,227,0.08))]
                border border-[rgba(108,99,255,0.1)]
              "
            >
              <div className="text-[28px] font-bold font-playfair text-gradient-blue leading-none">
                {activeCount}
              </div>
              <div className="text-[11px] font-semibold text-[rgba(108,99,255,0.6)] tracking-widest uppercase mt-0.5">
                Active
              </div>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="animate-fade-in delay-1">
          <TodoForm onAdd={handleAdd} />
        </div>

        {/* Filters */}
        <div className="animate-fade-in delay-2">
          <div className="flex items-center justify-between mb-4.5">
            <div className="flex gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`
                    py-2 px-4.5 rounded-full border-none
                    font-dm text-[13.5px] font-medium
                    cursor-pointer transition-all duration-250
                    ${
                      filter === f
                        ? "bg-gradient-btn text-white shadow-[0_4px_16px_rgba(108,99,255,0.3)]"
                        : "bg-white/50 text-[rgba(15,15,35,0.5)] hover:bg-white/80 hover:text-[rgba(15,15,35,0.75)]"
                    }
                  `}
                >
                  {f}
                </button>
              ))}
            </div>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="
                  bg-transparent border-none font-dm text-[13px]
                  text-red-500/60 cursor-pointer font-medium
                  transition-colors duration-200
                  hover:text-red-500 py-1
                "
              >
                Clear completed
              </button>
            )}
          </div>
        </div>

        {/* Todo List */}
        <div className="animate-fade-in delay-3">
          {loading ? (
            <div className="text-center py-12 text-[rgba(15,15,35,0.3)] text-[15px]">
              <div
                className="
                  w-8 h-8 mx-auto mb-3
                  border-3 border-[rgba(108,99,255,0.15)]
                  border-t-[#6C63FF] rounded-full
                  animate-spin-slow
                "
              />
              Loading tasks...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-[rgba(15,15,35,0.3)] text-[15px]">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                className="opacity-35 mx-auto mb-3"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M16 24l5 5 11-11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="font-medium">
                {filter === "Active"
                  ? "All caught up!"
                  : filter === "Completed"
                    ? "Nothing completed yet"
                    : "Add your first task"}
              </p>
              <p className="text-[13px] mt-1 opacity-60">
                {filter === "All" && "Type above and press Enter"}
              </p>
            </div>
          ) : (
            <ul className="todo-list max-h-[420px] overflow-y-auto pr-1 p-0">
              {filtered.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {!loading && todos.length > 0 && (
          <div className="animate-fade-in delay-4">
            <div className="flex justify-center gap-6 mt-5 pt-4 border-t border-[rgba(108,99,255,0.08)]">
              <span className="text-[13px] text-[rgba(15,15,35,0.35)] font-medium">
                {todos.length} total
              </span>
              <span className="text-[13px] text-[rgba(108,99,255,0.5)] font-medium">
                {activeCount} active
              </span>
              <span className="text-[13px] text-[rgba(72,191,227,0.6)] font-medium">
                {completedCount} done
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
