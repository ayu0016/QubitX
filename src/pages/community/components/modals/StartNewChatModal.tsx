import { useState } from "react";
import { X, Hash, User, MessageCircle, ArrowRight } from "lucide-react";
import type { LearnerItem } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  learners: LearnerItem[];
  onCreateChannel: (name: string, description: string, initialMessage?: string) => void;
  onStartDM: (learner: LearnerItem, initialMessage?: string) => void;
}

export default function StartNewChatModal({
  isOpen,
  onClose,
  learners,
  onCreateChannel,
  onStartDM,
}: Props) {
  const [chatType, setChatType] = useState<"dm" | "channel">("dm");
  const [selectedLearnerId, setSelectedLearnerId] = useState<string>(
    learners[0]?.id || ""
  );
  const [channelName, setChannelName] = useState("");
  const [channelDesc, setChannelDesc] = useState("");
  const [firstMessage, setFirstMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatType === "dm") {
      const targetLearner =
        learners.find((l) => l.id === selectedLearnerId) || learners[0];
      if (targetLearner) {
        onStartDM(targetLearner, firstMessage.trim() || undefined);
      }
    } else {
      if (!channelName.trim()) return;
      onCreateChannel(
        channelName.trim(),
        channelDesc.trim() || "Community topic channel",
        firstMessage.trim() || undefined
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-[28px] border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-indigo-600" />
            <h2 className="text-[18px] font-bold text-slate-900">
              Start a New Community Chat
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 text-[13px]">
          {/* Segmented Type Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setChatType("dm")}
              className={[
                "flex-1 py-2 rounded-lg font-semibold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer",
                chatType === "dm"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800",
              ].join(" ")}
            >
              <User size={15} />
              <span>Direct Message Learner</span>
            </button>
            <button
              type="button"
              onClick={() => setChatType("channel")}
              className={[
                "flex-1 py-2 rounded-lg font-semibold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer",
                chatType === "channel"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800",
              ].join(" ")}
            >
              <Hash size={15} />
              <span>Create Topic Channel</span>
            </button>
          </div>

          {/* Option A: Pick a Learner */}
          {chatType === "dm" && (
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 font-semibold text-[13px]">
                Choose an online learner:
              </label>
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-white">
                {learners.map((learner) => {
                  const isSelected = learner.id === selectedLearnerId;
                  return (
                    <div
                      key={learner.id}
                      onClick={() => setSelectedLearnerId(learner.id)}
                      className={[
                        "p-3 flex items-center justify-between cursor-pointer transition-colors",
                        isSelected
                          ? "bg-indigo-50/70 text-indigo-900 font-semibold"
                          : "hover:bg-slate-50 text-slate-700",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[12px] flex items-center justify-center">
                            {learner.avatarInitials}
                          </div>
                          {learner.isOnline && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold">{learner.name}</p>
                          <p className="text-[11px] text-slate-400 font-normal">
                            {learner.currentTopic}
                          </p>
                        </div>
                      </div>

                      {learner.isOnline && (
                        <span className="text-[11px] text-emerald-600 font-medium">
                          online
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Option B: Create a Channel */}
          {chatType === "channel" && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 font-semibold text-[13px]">
                  Channel Name (e.g. quantum-chemistry)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400 font-mono font-bold">
                    #
                  </span>
                  <input
                    type="text"
                    required
                    value={channelName}
                    onChange={(e) =>
                      setChannelName(
                        e.target.value.toLowerCase().replace(/\s+/g, "-")
                      )
                    }
                    placeholder="grover-oracle-help"
                    className="w-full h-10 pl-8 pr-4 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-indigo-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 font-semibold text-[13px]">
                  Description / Topic
                </label>
                <input
                  type="text"
                  value={channelDesc}
                  onChange={(e) => setChannelDesc(e.target.value)}
                  placeholder="Dedicated discussions on oracle construction"
                  className="w-full h-10 px-4 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-indigo-400"
                />
              </div>
            </div>
          )}

          {/* Opening message */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-700 font-semibold text-[13px]">
              Opening Message (Optional)
            </label>
            <input
              type="text"
              value={firstMessage}
              onChange={(e) => setFirstMessage(e.target.value)}
              placeholder="Hey! Looking to collaborate on quantum circuits..."
              className="w-full h-10 px-4 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:border-indigo-400"
            />
          </div>

          {/* Footer Action */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] active:scale-98 text-white rounded-xl font-semibold shadow-xs transition-all cursor-pointer"
            >
              <span>Start Conversation</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
