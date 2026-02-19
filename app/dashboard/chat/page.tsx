"use client";

import { useState } from "react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(text?: string) {
    const finalMessage = text || message;
    if (!finalMessage) return;

    setMessages(prev => [...prev, { role: "user", text: finalMessage }]);
    setMessage("");
    setLoading(true);

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: finalMessage }),
    });

    const data = await res.json();

    setMessages(prev => [
      ...prev,
      { role: "ai", text: data.reply || "No response" },
    ]);

    setLoading(false);
  }

  const suggested = [
    "Give me overall inventory health summary",
    "Which products are low in stock?",
    "What should I reorder this week?",
    "Which category has highest inventory value?",
  ];

  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-semibold mb-6">
        Inventory AI Assistant
      </h1>

      {/* Suggested Questions */}
      <div className="flex flex-wrap gap-3 mb-6">
        {suggested.map((q, i) => (
          <button
            key={i}
            onClick={() => sendMessage(q)}
            className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Box */}
      <div className="bg-white border rounded-2xl p-6 h-[400px] overflow-y-auto mb-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-lg p-3 rounded-xl ${
              m.role === "user"
                ? "bg-teal-600 text-white ml-auto"
                : "bg-slate-200 text-slate-800"
            }`}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="text-slate-400 text-sm">
            AI is thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about inventory..."
          className="flex-1 border p-3 rounded-xl"
        />
        <button
          onClick={() => sendMessage()}
          className="bg-teal-600 text-white px-6 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}
