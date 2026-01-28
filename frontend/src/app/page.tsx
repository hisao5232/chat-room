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
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // メッセージ取得関数
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

  // 送信処理
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); // ページリロードを防ぐ
    if (!username || !content) return;

    try {
      await axios.post(`${apiUrl}/messages`, {
        username: username,
        content: content,
      });
      setContent(""); // 送信後にメッセージ欄を空にする
      fetchMessages(); // 最新のリストに更新
    } catch (error) {
      console.error("送信エラー:", error);
    }
  };

  return (
    // min-h-screen（画面全体の高さ）、bg-white（白背景）、text-slate-900（濃いグレーの文字）
    <main className="min-h-screen bg-white text-slate-900 max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Chat Room</h1>

      {/* 投稿フォーム */}
      <form onSubmit={sendMessage} className="mb-8 space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">ユーザー名</label>
          <input
            type="text"
            placeholder="hisao5232"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">メッセージ</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="こんにちは！"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-400 outline-none"
            />
            <button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded-md hover:bg-slate-700 transition-colors">
              送信
            </button>
          </div>
        </div>
      </form>

      {/* メッセージ一覧 */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white border-b border-slate-100 p-4 transition-all">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-800">{msg.username}</span>
              <span className="text-xs text-slate-400">
                {new Date(msg.timestamp).toLocaleString("ja-JP")}
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed">{msg.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

