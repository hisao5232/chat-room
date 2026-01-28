"use client";
export const runtime = "edge";
import { useEffect, useState } from "react";
import axios from "axios";

interface Message {
  id: number;
  username: string;
  content: string;
  timestamp: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("hisao5232");
  const [content, setContent] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${apiUrl}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error("取得エラー:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [apiUrl]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !content) return;
    try {
      await axios.post(`${apiUrl}/messages`, {
        username: username,
        content: content,
      });
      setContent("");
      fetchMessages();
    } catch (error) {
      console.error("送信エラー:", error);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm("このメッセージを削除しますか？")) return;
    try {
      await axios.delete(`${apiUrl}/messages/${id}`);
      fetchMessages();
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました。バックエンドのAPIを確認してください。");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <h1 className="text-xl font-bold text-blue-600 tracking-tight">Pro Chat World</h1>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-gray-400 font-mono">Server: Connected</span>
          <span className="text-sm font-medium text-gray-600 uppercase tracking-widest">User: {username}</span>
        </div>
      </header>
  
      <main className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#e5ddd5]">
        {messages.map((msg) => {
          const isMe = msg.username === username;
          
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* メッセージ本体 */}
              <div className={`group relative max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
                isMe 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white border text-gray-700 rounded-bl-none'
              }`}>
                {!isMe && <p className="text-[10px] font-bold text-blue-600 mb-1">{msg.username}</p>}
                <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                
                <span className={`text-[10px] block mt-1 text-right opacity-70 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>

                {/* ホバー時に表示される削除ボタン */}
                {isMe && (
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
                    title="削除"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </main>
  
      <footer className="p-4 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 border border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 text-sm"
          />
          <button 
            disabled={!content}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white w-12 h-12 rounded-full font-bold transition-all shadow-md active:scale-95 flex items-center justify-center flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-2-9-18-9 18 9 2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
}
