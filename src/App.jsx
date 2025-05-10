import { useState } from "react";
import axios from "axios";

export default function ResearchEngine() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendQuery = async () => {
    if (!message.trim() || loading) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post("https://deep-research-agent-2.onrender.com/generate", {
        topic: message,
      });
      // Use either 'markdown' or 'content', whichever is present
      setResponse(res.data.markdown || res.data.content || "");
    } catch (err) {
      console.error(err);
      setResponse("⚠ Failed to fetch research results. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center px-4 py-10">
      <h1 className="text-4xl font-bold text-blue-800 mb-10">Deep Research Engine</h1>

      <div className="w-full max-w-3xl flex mb-12">
        <input
          type="text"
          className="flex-1 p-4 border border-gray-300 rounded-l-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Enter the topic"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendQuery()}
        />
        <button
          className="bg-blue-600 text-white px-6 text-lg rounded-r-lg hover:bg-blue-700 transition disabled:opacity-50"
          onClick={sendQuery}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="w-full max-w-4xl bg-gray-50 border border-gray-200 rounded-lg shadow-md p-6">
        {loading && <p className="text-gray-500">Loading research content...</p>}
        {!loading && response && (
          <pre className="whitespace-pre-wrap text-base">{response}</pre>
        )}
      </div>
    </div>
  );
}