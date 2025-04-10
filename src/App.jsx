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

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMessage = { role: "user", text: message, timestamp };
    setChat((prevChat) => [...prevChat, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("https://chatbot-deploy-backend.onrender.com/chat", {
        user_id: "12345",
        message,
      });

      const botMessage = { role: "bot", text: response.data.response, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      setChat((prevChat) => [...prevChat, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setChat((prevChat) => [
        ...prevChat,
        { role: "bot", text: "⚠️ Failed to get a response. Please try again!", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
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
      <h1 className="text-3xl font-semibold mb-4 mt-2 text-[#4da4da]">TaxTrack A.I Assistant</h1>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="w-[98%] h-[90vh] border-t border-b rounded-md border-gray-700 bg-gray-900 shadow-xl overflow-y-auto flex flex-col p-6 mb-16"
      > 
        {chat.map((msg, index) => (
          <div key={index} className="flex flex-col items-end w-full">
            <div
              className={`mb-1 p-3 rounded-lg text-sm text-white max-w-[90%] ${
                msg.role === "user"
                  ? "bg-blue-600 self-end ml-auto"
                  : "bg-gray-700 self-start mr-auto"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ children }) => (
                    <table className="w-full border-collapse border border-gray-700">
                      {children}
                    </table>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-600 bg-gray-800 px-4 py-2 text-left">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-600 px-4 py-2">{children}</td>
                  ),
                  tr: ({ children }) => <tr className="even:bg-gray-900">{children}</tr>,
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
            <p
              className={`text-xs text-gray-400 mt-1 ${
                msg.role === "user" ? "self-end mr-2" : "self-start ml-2"
              }`}
            >
              {msg.timestamp}
            </p>
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
