import { useState, useRef, useEffect } from "react";
import {
  Hash,
  Send,
  Plus,
  Search,
  Play,
  Copy,
  Check,
  Code2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ChatChannel } from "../types";
import { ROUTES } from "../../../utils/routes";

interface Props {
  channels: ChatChannel[];
  activeChannelId: string;
  onSelectChannel: (channelId: string) => void;
  onSendMessage: (channelId: string, text: string, circuitCode?: string) => void;
  onStartNewChat: () => void;
}

export default function CommunityChatView({
  channels,
  activeChannelId,
  onSelectChannel,
  onSendMessage,
  onStartNewChat,
}: Props) {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [includeCircuit, setIncludeCircuit] = useState(false);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeChannel =
    channels.find((c) => c.id === activeChannelId) || channels[0];

  const channelList = channels.filter((c) => c.type === "channel");
  const dmList = channels.filter((c) => c.type === "dm");

  const filteredChannels = channelList.filter((c) =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase())
  );
  const filteredDMs = dmList.filter((c) =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChannel?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed && !includeCircuit) return;

    const circuitSnippet = includeCircuit
      ? "qc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()"
      : undefined;

    onSendMessage(
      activeChannel.id,
      trimmed || "Shared a quantum circuit:",
      circuitSnippet
    );
    setInputText("");
    setIncludeCircuit(false);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleOpenInLab = () => {
    navigate(ROUTES.quantumLab);
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-sm overflow-hidden flex flex-col md:flex-row h-[680px] animate-in fade-in duration-200">
      {/* ── Left Sidebar: Channels & DMs ─────────────────────────────────── */}
      <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-[#FAFBFD] shrink-0">
        {/* Top Action Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[16px] text-slate-900">
              Community Chat
            </span>
            <button
              type="button"
              onClick={onStartNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[12px] font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Plus size={13} />
              <span>New Chat</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search conversations..."
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-white border border-slate-200 text-[12px] outline-none focus:border-indigo-400 transition-colors placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Channels & DMs List */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">
          {/* Channels Section */}
          <div className="flex flex-col gap-1">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Discussion Channels
            </span>

            {filteredChannels.map((chan) => {
              const isActive = chan.id === activeChannel.id;
              return (
                <button
                  key={chan.id}
                  type="button"
                  onClick={() => onSelectChannel(chan.id)}
                  className={[
                    "w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-[13px] transition-all cursor-pointer",
                    isActive
                      ? "bg-white font-bold text-indigo-700 shadow-2xs border border-slate-200/80"
                      : "text-slate-600 hover:bg-slate-100/80",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Hash
                      size={15}
                      className={isActive ? "text-indigo-600" : "text-slate-400"}
                    />
                    <span className="truncate">{chan.name}</span>
                  </div>

                  {chan.unreadCount !== undefined && chan.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {chan.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Direct Messages Section */}
          <div className="flex flex-col gap-1">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Online Learners (DMs)
            </span>

            {filteredDMs.map((dm) => {
              const isActive = dm.id === activeChannel.id;
              return (
                <button
                  key={dm.id}
                  type="button"
                  onClick={() => onSelectChannel(dm.id)}
                  className={[
                    "w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 text-[13px] transition-all cursor-pointer",
                    isActive
                      ? "bg-white font-bold text-indigo-700 shadow-2xs border border-slate-200/80"
                      : "text-slate-600 hover:bg-slate-100/80",
                  ].join(" ")}
                >
                  <div className="relative shrink-0">
                    <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[11px] flex items-center justify-center">
                      {dm.avatarInitials}
                    </div>
                    {dm.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="truncate text-slate-800 font-semibold text-[13px]">
                        {dm.name}
                      </span>
                      {dm.lastMessageTime && (
                        <span className="text-[10px] text-slate-400">
                          {dm.lastMessageTime}
                        </span>
                      )}
                    </div>
                    {dm.lastMessage && (
                      <p className="text-[11px] text-slate-400 truncate">
                        {dm.lastMessage}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Right Main Area: Chat Messages & Input ───────────────────────── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            {activeChannel.type === "channel" ? (
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                <Hash size={16} />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-700 font-bold text-[12px] border border-purple-200">
                {activeChannel.avatarInitials}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-[15px]">
                  {activeChannel.type === "channel"
                    ? `#${activeChannel.name}`
                    : activeChannel.name}
                </h3>
                {activeChannel.type === "dm" && activeChannel.isOnline && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                    online
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-sm">
                {activeChannel.description || "Active community participant"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenInLab}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[12px] font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              <Play size={12} className="text-indigo-600" />
              <span>Launch Lab</span>
            </button>
          </div>
        </div>

        {/* Message Thread Feed */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {activeChannel.messages.map((msg) => {
            const isUser = msg.isCurrentUser;
            return (
              <div
                key={msg.id}
                className={[
                  "flex items-start gap-3 max-w-[85%]",
                  isUser ? "ml-auto flex-row-reverse" : "",
                ].join(" ")}
              >
                {/* Avatar */}
                <div
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 select-none",
                    isUser
                      ? "bg-slate-900 text-white"
                      : msg.senderColor || "bg-indigo-50 text-indigo-700 border border-indigo-200",
                  ].join(" ")}
                >
                  {msg.senderInitials}
                </div>

                {/* Message Bubble & Meta */}
                <div
                  className={[
                    "flex flex-col gap-1",
                    isUser ? "items-end" : "items-start",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-700">
                      {isUser ? "You" : msg.senderName}
                    </span>
                    <span>• {msg.time}</span>
                  </div>

                  <div
                    className={[
                      "p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-2xs",
                      isUser
                        ? "bg-[#0B1C30] text-white rounded-tr-xs"
                        : "bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-xs",
                    ].join(" ")}
                  >
                    <p>{msg.text}</p>

                    {/* Circuit Snippet Attachment */}
                    {msg.circuitSnippet && (
                      <div className="mt-2.5 p-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-[12px] flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[11px] font-sans font-semibold text-indigo-700">
                          <div className="flex items-center gap-1.5">
                            <Code2 size={13} />
                            <span>{msg.circuitSnippet.title}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyCode(msg.id, msg.circuitSnippet!.code)
                              }
                              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-sans flex items-center gap-1 transition-colors"
                            >
                              {copiedSnippetId === msg.id ? (
                                <Check size={11} className="text-emerald-600" />
                              ) : (
                                <Copy size={11} />
                              )}
                              <span>
                                {copiedSnippetId === msg.id ? "Copied" : "Copy"}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={handleOpenInLab}
                              className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-sans flex items-center gap-1 transition-colors"
                            >
                              <Play size={10} className="fill-indigo-600" />
                              <span>Open</span>
                            </button>
                          </div>
                        </div>
                        <pre className="text-slate-700 whitespace-pre-wrap text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                          {msg.circuitSnippet.code}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-slate-100 bg-[#FAFCFF] flex flex-col gap-2 shrink-0"
        >
          {includeCircuit && (
            <div className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] flex items-center justify-between animate-in fade-in duration-100">
              <span className="font-mono">
                Attached: 2-Qubit Bell State (Qiskit Python)
              </span>
              <button
                type="button"
                onClick={() => setIncludeCircuit(false)}
                className="text-indigo-600 hover:text-indigo-900 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIncludeCircuit((v) => !v)}
              title="Attach quantum circuit snippet"
              className={[
                "p-2.5 rounded-xl border text-[12px] font-semibold transition-colors flex items-center gap-1",
                includeCircuit
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100",
              ].join(" ")}
            >
              <Code2 size={16} />
              <span className="hidden sm:inline">Attach Circuit</span>
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message #${activeChannel.name}...`}
              className="flex-1 h-11 px-4 rounded-xl bg-white border border-slate-200 text-[13px] outline-none focus:border-indigo-400 transition-colors placeholder:text-slate-400"
            />

            <button
              type="submit"
              disabled={!inputText.trim() && !includeCircuit}
              className="px-5 h-11 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white rounded-xl text-[13px] font-semibold transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
            >
              <Send size={14} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
