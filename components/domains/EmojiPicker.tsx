"use client";

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

const COMMON_EMOJIS = [
  "💼",
  "🎯",
  "💪",
  "🧠",
  "❤️",
  "🏃",
  "📚",
  "🎨",
  "🎵",
  "🍎",
  "🏋️",
  "🧘",
  "💰",
  "📱",
  "🏠",
  "🌱",
  "✨",
  "🔥",
  "⚡",
  "🌟",
  "🎓",
  "👔",
  "🏆",
  "📈",
  "🚀",
  "💡",
  "🎬",
  "📝",
  "🎮",
  "☕",
  "🍕",
  "🎪",
  "🌈",
  "🎁",
  "🔧",
  "⚙️",
  "🎤",
  "🎸",
  "🎹",
  "🎭",
  "📷",
  "🖼️",
  "🗺️",
  "✈️",
  "🚗",
  "🚴",
  "🏖️",
  "⛰️",
  "🌊",
  "🌸",
  "🌺",
  "🌻",
  "🌼",
  "🍀",
  "🌿",
  "🌳",
  "🐶",
  "🐱",
  "🐼",
  "🦁",
  "🦊",
  "🐻",
  "🐨",
  "🐯",
];

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-stone-600 dark:text-stone-400">
          Selected:
        </span>
        <div className="text-4xl">{value}</div>
      </div>
      <div className="grid grid-cols-8 gap-2 max-h-[300px] overflow-y-auto p-2">
        {COMMON_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onChange(emoji)}
            className={`
              text-3xl p-2 rounded-lg transition-all hover:scale-110
              ${
                value === emoji
                  ? "bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-indigo-500"
                  : "hover:bg-stone-100 dark:hover:bg-stone-800"
              }
            `}
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
