import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Domain, DomainFormData } from "@/lib/types";
import { ColorPicker } from "./ColorPicker";
import { EmojiPicker } from "./EmojiPicker";

interface DomainModalProps {
  domain?: Domain | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: DomainFormData) => void;
}

export function DomainModal({
  domain,
  open,
  onOpenChange,
  onSave,
}: DomainModalProps) {
  const [formData, setFormData] = useState<DomainFormData>({
    name: "",
    emoji: "💼",
    color: "indigo",
  });

  const [nameError, setNameError] = useState<string>("");

  // Reset form when dialog opens/closes or domain changes
  useEffect(() => {
    if (open) {
      if (domain) {
        //setFormData({
        //  name: domain.name,
        //  emoji: domain.emoji,
        //  color: domain.color,
        //});
      } else {
        //setFormData({
        //  name: "",
        //  emoji: "💼",
        //  color: "indigo",
        //});
      }
      //setNameError("");
    }
  }, [open, domain]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setNameError("Domain name is required");
      return;
    }
    if (formData.name.length > 30) {
      setNameError("Domain name must be 30 characters or less");
      return;
    }

    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {domain ? "Edit Domain" : "Create Domain"}
            </DialogTitle>
            <DialogDescription>
              {domain
                ? "Update your domain details below"
                : "Add a new life domain to start tracking"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Domain Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setNameError("");
                }}
                placeholder="e.g., Career Growth"
                maxLength={30}
                className={nameError ? "border-red-500" : ""}
              />
              {nameError && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {nameError}
                </p>
              )}
              <p className="text-xs text-stone-500 dark:text-stone-500">
                {formData.name.length}/30 characters
              </p>
            </div>

            {/* Color Picker */}
            <div className="space-y-2">
              <Label>Color</Label>
              <ColorPicker
                value={formData.color}
                onChange={(color) => setFormData({ ...formData, color })}
              />
            </div>

            {/* Emoji Picker */}
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="border border-stone-200 dark:border-stone-800 rounded-lg p-4">
                <EmojiPicker
                  value={formData.emoji}
                  onChange={(emoji) => setFormData({ ...formData, emoji })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {domain ? "Save Changes" : "Create Domain"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
