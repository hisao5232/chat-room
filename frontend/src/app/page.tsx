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
  const [username, setUsername] = useState("hisao5232"); // 初期値を設定
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

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-sans">
      {/* ヘッダー */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-blue-600 tracking-tight">Pro Chat World</h1>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-gray-400 font-mono">{apiUrl}</span>
          <span className="text-sm font-medium text-gray-600 uppercase">User: {username}</span>
        </div>
      </header>
  
      {/* メッセージ表示エリア */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ddd5] dark:bg-gray-900">
        {messages.map((msg) => {
          // 自分が送ったメッセージか判定（usernameで比較）
          const isMe = msg.username === username;
          
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
                isMe 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border text-gray-700 rounded-tl-none'
              }`}>
                {!isMe && <p className="text-[10px] font-bold text-blue-600 mb-1">{msg.username}</p>}
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <span className={`text-[10px] block mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
      </main>
  
      {/* 送信フォーム */}
      <footer className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 border border-gray-300 rounded-full px-6 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
          />
          <button 
            disabled={!content}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md active:scale-95 flex-shrink-0"
          >
            送信
          </button>
        </form>
      </footer>
    </div>
  );
}
