import { useState, useRef } from "react";

interface TodoFormProps {
  onAdd: (title: string) => void;
}

function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAdd() {
    const trimmed = title.trim();
    if (trimmed === "") return;

    onAdd(trimmed);
    setTitle("");
    inputRef.current?.focus();
  }

  return (
    <div
      className="
        flex items-center gap-3
        bg-glass-input rounded-[18px]
        pl-5 pr-1.5 py-1.5
        border border-white/80
        shadow-sm mb-6
        transition-all duration-300
        focus-within:border-[rgba(108,99,255,0.4)]
        focus-within:shadow-[0_4px_24px_rgba(108,99,255,0.12)]
      "
    >
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
          }
        }}
        placeholder="What needs to be done?"
        className="
          flex-1 border-none outline-none bg-transparent
          text-[15px] font-dm text-[rgba(15,15,35,0.8)]
          font-normal placeholder:text-black/30
        "
      />
      <button
        type="button"
        onClick={handleAdd}
        className="
          bg-gradient-btn border-none rounded-[14px]
          w-12 h-12 flex items-center justify-center
          cursor-pointer shrink-0
          shadow-[0_4px_16px_rgba(108,99,255,0.3)]
          transition-all duration-250
          hover:scale-105 hover:shadow-[0_6px_24px_rgba(108,99,255,0.4)]
          active:scale-[0.97]
        "
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 4V16M4 10H16"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default TodoForm;
