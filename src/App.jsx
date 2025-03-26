import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = { role: "user", text: message };
    setChat((prevChat) => [...prevChat, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        user_id: "12345",
        message,
      });

      const botMessage = { role: "bot", text: response.data.response };
      setChat((prevChat) => [...prevChat, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setChat((prevChat) => [
        ...prevChat,
        { role: "bot", text: "⚠️ Failed to get a response. Please try again!" },
      ]);
    }

    setLoading(false);
  };

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-950 text-white">
      <h1 className="text-3xl font-semibold mb-4 text-gray-300">Chatbot</h1>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="w-[98%] h-[90vh] border-t border-b rounded-md border-gray-700 bg-gray-900 shadow-xl overflow-y-auto flex flex-col p-6 mb-16"
      > 
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 p-3 rounded-lg text-sm text-white max-w-[90%] ${
              msg.role === "user"
                ? "bg-blue-600 self-end ml-auto"
                : "bg-gray-700 self-start mr-auto"
            }`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
          </div>
        ))}
        
        {loading && <p className="text-gray-500">Typing...</p>}
      </div>

      {/* Input Section */}
      <div className="w-full flex p-4 bg-gray-950 border-t border-gray-800 fixed bottom-0">
        <input
          type="text"
          className="flex-1 p-3 rounded-l-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none border border-gray-700"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-r-lg font-semibold hover:bg-blue-500 transition-all"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
