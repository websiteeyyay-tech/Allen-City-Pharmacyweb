import React, { useEffect, useRef, useState } from "react";
import { FaCommentAlt, FaTimes, FaPaperPlane } from "react-icons/fa";

type Msg = {
    id: string;
    from: "bot" | "user";
    text: string;
    ts: number;
};

const sampleBotReplies = [
    "Hi! How can I help you today?",
    "You can search products in the Shop page and add them to your cart.",
    "To place a refill order, go to Order and upload your prescription.",
    "Our opening hours are Mon-Fri 9:00am - 6:00pm.",
    "I'll pass this to a human agent. Please provide your contact number."
];

function randomReply(input: string) {
    // simple heuristic — if user mentions order, reply accordingly
    const t = input.toLowerCase();
    if (t.includes("order") || t.includes("refill")) {
        return "For orders and refills, head to the Order page and upload your prescription or RX number.";
    }
    return sampleBotReplies[Math.floor(Math.random() * sampleBotReplies.length)];
}

const ChatBot: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Msg[]>([
        { id: "m0", from: "bot", text: "Hello! 👋 How can I help you today?", ts: Date.now() }
    ]);
    const [text, setText] = useState("");
    const endRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        // auto-scroll when messages change
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, open]);

    useEffect(() => {
        // focus input when opened
        if (open) inputRef.current?.focus();
    }, [open]);

    function sendMessage() {
        const trimmed = text.trim();
        if (!trimmed) return;
        const userMsg: Msg = { id: `u${Date.now()}`, from: "user", text: trimmed, ts: Date.now() };
        setMessages((m) => [...m, userMsg]);
        setText("");

        // simulated bot reply (replace this with real API call later)
        setTimeout(() => {
            const botText = randomReply(trimmed);
            const botMsg: Msg = { id: `b${Date.now()}`, from: "bot", text: botText, ts: Date.now() };
            setMessages((m) => [...m, botMsg]);
        }, 600 + Math.random() * 700);
    }

    function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <>
            {/* Floating button */}
            <div className="fixed right-6 bottom-6 z-50">
                <button
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Open chat"
                    className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg"
                    style={{ background: "linear-gradient(90deg,#f97316,#16a34a)" }} // orange → green
                >
                    <FaCommentAlt className="text-white text-xl" />
                </button>
            </div>

            {/* Chat panel */}
            {open && (
                <div className="fixed right-6 bottom-24 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3" style={{ background: "linear-gradient(90deg,#f97316,#16a34a)" }}>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 rounded-full w-9 h-9 flex items-center justify-center">
                                <FaCommentAlt className="text-white" />
                            </div>
                            <div className="text-white font-semibold">Allen City Chat</div>
                        </div>
                        <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-white">
                            <FaTimes />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gradient-to-b from-white to-gray-50">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex ${m.from === "bot" ? "justify-start" : "justify-end"}`}>
                                <div className={`${m.from === "bot" ? "bg-white border" : "bg-[linear-gradient(90deg,#f97316,#16a34a)] text-white"} rounded-lg p-3 max-w-[80%] shadow-sm`}>
                                    <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                                    <div className="text-xs text-gray-400 mt-1 text-right">{new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                                </div>
                            </div>
                        ))}
                        <div ref={endRef} />
                    </div>

                    {/* Input area */}
                    <div className="p-3 border-t border-gray-100 bg-white">
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={handleKey}
                                placeholder="Type your message..."
                                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-200"
                            />
                            <button
                                onClick={sendMessage}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium"
                                style={{ background: "linear-gradient(90deg,#f97316,#16a34a)" }}
                            >
                                <FaPaperPlane />
                                <span className="hidden sm:inline">Send</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;