import s from './chat.module.css';
import { useEffect, useRef, useState, } from 'react';

function Chat() {
    const convoEndRef = useRef(null)

    const [message, setMessage] = useState("");
    const [chatMemory, setChatMemory] = useState([]);
    const [thinking, setThinking] = useState(false)

    // 🌐 Automatically choose backend URL
    const API_URL =
        import.meta.env.MODE === "development"
            ? "http://localhost:3000/chat" // Local backend
            : "https://chat-2ret.onrender.com/"; // Render backend

    async function sendMessage(msg) {
        setThinking(true);
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: msg }),
            });

            const data = await response.json();
            console.log("✅ Bot Bryan reply:", data);

            // Append Bryan’s reply to chat
            setChatMemory((prev) => [...prev, { role: "bryan", message: data.reply }]);
            setThinking(false);
        } catch (err) {
            console.error("❌ Error sending message:", err);
            setChatMemory((prev) => [
                ...prev,
                { role: "bryan", message: "⚠️ Hindi ako makasagot ngayon. Try ulit mamaya!" },
            ]);

            setThinking(false);
        }
    }

    useEffect(() => {
        convoEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMemory]);

    return (
        <div className={s.chatWrapper}>
            <div className={s.chatBox}>
                <header>
                    <h2>🤖 Bryan</h2>
                </header>

                <div className={s.chatBody}>
                    {chatMemory.length === 0 ? (
                        <div className={s.botDescription}>
                            <div className={s.icon}>🤖</div>
                            <h1>Bot Bryan</h1>
                            <p>Hi! Ako si Bryan A. Pajarillaga — this chat bot is a digital version of me.</p>
                        </div>
                    ) : (
                        <div className={s.convoContainer}>
                            <ul className={s.convo}>
                                {chatMemory.map((res, i) => (
                                    <>
                                        <li className={res.role === "user" ? s.user : s.bryan}
                                            key={i}>
                                            <span>{res.role == "user" ? "🧑" : "🤖"}</span>
                                            <p>{res.message.split("\n").map((text)=>(<>{text} <br /></>))}</p>
                                        </li>
                                    </>

                                ))}
                                {
                                    thinking && <li className={s.bryan}>
                                        <span>{"🤖"}</span>
                                        <p>
                                            ...
                                        </p>
                                    </li>
                                }
                                <div ref={convoEndRef}></div>
                            </ul>
                        </div>
                    )}

                    <div className={s.chatInput}>
                        {
                            message.includes("\n") ?
                                <textarea
                                    type="text"
                                    placeholder="Chat anything about Bryan..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    autoFocus="true"
                                /> :
                                <input
                                    type="text"
                                    placeholder="Chat anything about Bryan..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key == "Enter") setMessage(e.target.value + "\n")
                                    }}
                                />
                        }
                        <button
                            onClick={() => {
                                if (!message.trim()) return;
                                const user = { role: "user", message };
                                setChatMemory((prev) => [...prev, user]);
                                sendMessage(message);
                                setMessage("");
                            }}
                            className={s.sendButton}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    function handleSend() {
        if (!message.trim()) return;
        const user = { role: "user", message };
        setChatMemory((prev) => [...prev, user]);
        sendMessage(message);
        setMessage("");
    }
}

export default Chat;
