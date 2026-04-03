import { useState, useEffect } from "react";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M4.5 9.5L7.5 12.5L13.5 6"
        stroke={checked ? "#fff" : "transparent"}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-250"
      />
    </svg>
  );
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [exiting, setExiting] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setVisible(true);
    });
  }, []);

  return (
    <li
      className={`
        list-none flex items-center gap-3.5
        px-5 py-4 bg-glass rounded-2xl
        border border-white/70 mb-2.5
        select-none
        transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]
        hover:shadow-md hover:-translate-y-px
        ${exiting ? "opacity-0 translate-x-10 scale-95" : ""}
        ${!visible && !exiting ? "opacity-0 translate-y-3" : ""}
        ${visible && !exiting ? "opacity-100 translate-y-0 shadow-sm" : ""}
      `}
    >
      {/* Checkbox */}
      <div
        role="button"
        tabIndex={0}
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle(todo.id);
        }}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle(todo.id);
          }
        }}
        className={`
          w-7 h-7 rounded-full flex items-center justify-center
          shrink-0 cursor-pointer transition-all duration-300
          ${
            todo.completed
              ? "bg-gradient-btn shadow-[0_3px_12px_rgba(108,99,255,0.35)]"
              : "bg-white/80 border-2 border-[rgba(108,99,255,0.25)]"
          }
        `}
      >
        <CheckIcon checked={todo.completed} />
      </div>

      {/* Title and Description */}
      <div
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle(todo.id);
        }}
        className="flex-1 cursor-pointer"
      >
        <span
          className={`
            block text-[15.5px] font-dm font-medium
            tracking-tight leading-snug transition-all duration-300
            ${
              todo.completed
                ? "text-black/30 line-through decoration-[rgba(108,99,255,0.3)]"
                : "text-[rgba(15,15,35,0.85)]"
            }
          `}
        >
          {todo.title}
        </span>
        {todo.description && (
          <span
            className={`
              block text-[12.5px] font-dm font-normal
              mt-0.5 leading-snug transition-all duration-300
              ${todo.completed ? "text-black/20" : "text-[rgba(15,15,35,0.4)]"}
            `}
          >
            {todo.description}
          </span>
        )}
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setExiting(true);
          setTimeout(() => onDelete(todo.id), 300);
        }}
        className="
          w-[30px] h-[30px] rounded-[10px] border-none
          bg-transparent cursor-pointer
          flex items-center justify-center
          opacity-35 shrink-0
          transition-all duration-200
          hover:opacity-100 hover:bg-red-500/10
        "
        aria-label="Delete todo"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 4L12 12M12 4L4 12"
            stroke="#FF5050"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </li>
  );
}

export default TodoItem;
