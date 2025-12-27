"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { EmojiClickData } from "emoji-picker-react";

const EmojiPickerComponent = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="h-[350px] flex items-center justify-center text-stone-500">
      Loading emoji picker...
    </div>
  ),
});

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [selectedEmoji, setSelectedEmoji] = useState(value);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData.emoji);
    onChange(emojiData.emoji);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-stone-600 dark:text-stone-400">
          Selected:
        </span>
        <div className="text-4xl">{selectedEmoji}</div>
      </div>
      <EmojiPickerComponent
        onEmojiClick={handleEmojiClick}
        searchPlaceHolder="Search emoji..."
        width="100%"
        height={350}
      />
    </div>
  );
}
