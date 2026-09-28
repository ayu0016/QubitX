import { useState } from "react";
import { X, Send } from "lucide-react";
import type { DiscussionType } from "../types";

interface WritePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    body: string;
    category: DiscussionType;
    codeSnippet?: string;
  }) => void;
}

const CATEGORIES: { value: DiscussionType; label: string; description: string }[] = [
  { value: "question", label: "Question", description: "Ask the community for help" },
  { value: "discussion", label: "Discussion", description: "Start a conversation" },
  { value: "project", label: "Project", description: "Showcase your work" },
];

export default function WritePostModal({ isOpen, onClose, onSubmit }: WritePostModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<DiscussionType>("question");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [showCode, setShowCode] = useState(false);

  if (!isOpen) return null;

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      title: title.trim(),
      body: body.trim(),
      category,
      codeSnippet: codeSnippet.trim() || undefined,
    });
    // Reset form
    setTitle("");
    setBody("");
    setCategory("question");
    setCodeSnippet("");
    setShowCode(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[600px] max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-[18px] font-bold text-slate-900">
            Write a Post
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question or topic?"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              Category
            </label>
            <div className="flex gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`flex-1 px-4 py-3 rounded-xl text-[13px] font-medium border transition-all cursor-pointer ${
                    category === cat.value
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="font-semibold">{cat.label}</div>
                  <div className="text-[11px] mt-0.5 opacity-70">{cat.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your thoughts, describe your problem, or showcase your project..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 resize-none transition-all"
            />
          </div>

          {/* Code toggle + input */}
          {!showCode ? (
            <button
              type="button"
              onClick={() => setShowCode(true)}
              className="text-[13px] text-indigo-600 hover:text-indigo-700 font-medium w-fit cursor-pointer"
            >
              + Add a code snippet (optional)
            </button>
          ) : (
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Code Snippet (optional)
              </label>
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder={"qc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()"}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 resize-none transition-all font-mono"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-[14px] font-medium text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[14px] font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <Send size={15} />
            Publish Post
          </button>
        </div>
      </div>
    </div>
  );
}
