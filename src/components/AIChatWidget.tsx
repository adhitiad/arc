"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      // Panggil API Backend
      const res = await api.post("/chat/ask", { message: userMsg });
      setMessages((prev) => [...prev, { role: "ai", text: res.data.answer }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I'm offline." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 bg-blue-600 shadow-lg"
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
      )}

      {isOpen && (
        <div className="w-[350px] h-[500px] bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 rounded-t-lg">
            <span className="font-bold flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-400" /> AI Analyst
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-sm max-w-[80%] ${m.role === "user" ? "bg-blue-900/50 ml-auto" : "bg-zinc-800"}`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="flex items-end">
                <div className="flex items-end">
                  <div className="flex flex-col space-y-2 text-md leading-tight mx-2 order-2 items-start">
                    <div>
                      <img
                        src="https://support.signal.org/hc/article_attachments/360016877511/typing-animation-3x.gif"
                        alt="..."
                        className="w-16 ml-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-zinc-800 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a stock..."
              className="bg-zinc-950 border-zinc-800"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button size="icon" onClick={handleSend}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
