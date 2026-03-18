"use client";
export const runtime = "edge";
import { useEffect, useState, useRef } from "react";
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
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // スクロール制御用の参照
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true); // 自動スクロールのON/OFF

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const chatPassword = process.env.NEXT_PUBLIC_CHAT_PASSWORD;

  // 自動スクロール実行関数
  const scrollToBottom = (behavior: "smooth" | "auto" = "smooth") => {
    if (isAutoScroll) {
      scrollEndRef.current?.scrollIntoView({ behavior });
    }
  };

  // スクロール位置を監視して、一番下にいるか判定する
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    
    // 下端から100px以内にいれば「下端にいる」とみなし、自動スクロールを有効にする
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsAutoScroll(isAtBottom);
  };

  // メッセージ更新時にスクロール（isAutoScrollがtrueの時のみ動く）
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedName = localStorage.getItem("chat_username");
    if (savedName) {
      setUsername(savedName);
      setIsLoggedIn(true);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, apiUrl]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${apiUrl}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error("取得エラー:", error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password === chatPassword) {
      localStorage.setItem("chat_username", username);
      setIsLoggedIn(true);
    } else {
      alert("パスワードが正しくありません。");
    }
  };

  const handleLogout = () => {
    if (confirm("ログアウトしますか？")) {
      localStorage.removeItem("chat_username");
      setIsLoggedIn(false);
      setUsername("");
      setPassword("");
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !content) return;
    try {
      await axios.post(`${apiUrl}/messages`, {
        username: username,
        content: content,
      });
      setContent("");
      setIsAutoScroll(true); // 送信時は強制的に一番下へ
      fetchMessages();
    } catch (error) {
      console.error("送信エラー:", error);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm("削除しますか？")) return;
    try {
      await axios.delete(`${apiUrl}/messages/${id}`);
      fetchMessages();
    } catch (error) {
      console.error("削除エラー:", error);
    }
  };

  if (!isInitialized) return null;

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-linear-to-br from-blue-600 to-indigo-700 font-sans p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-2xl w-full max-sm mx-4">
          <h1 className="text-2xl font-black text-center text-gray-800 mb-6 tracking-tight">Pro Chat World</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase ml-1 mb-2">User Name</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="名前を入力" className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 outline-none bg-gray-50 text-gray-800" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase ml-1 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード" className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 outline-none bg-gray-50 text-gray-800" required />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer">ログイン</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#efeae2] text-gray-800 font-sans">
      <header className="bg-white/80 backdrop-blur-md border-b px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <h1 className="text-xl font-black text-blue-600 tracking-tighter">Pro Chat World</h1>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-mono">USER</p>
            <p className="text-sm font-bold text-gray-700 leading-none">{username}</p>
          </div>
          <button onClick={handleLogout} className="text-xs bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">ログアウト</button>
        </div>
      </header>

      {/* handleScrollを登録し、containerRefをセット */}
      <main 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg) => {
          const isMe = msg.username === username;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              {!isMe && <span className="text-[11px] font-bold text-gray-500 ml-3 mb-1">{msg.username}</span>}
              
              <div className={`relative group animate-fade-up max-w-[85%] px-4 py-2 shadow-sm ${
                isMe ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none mr-2' : 'bg-white text-gray-800 rounded-2xl rounded-tl-none ml-2'
              }`}>
                <div className={`absolute top-0 w-3 h-3 transform rotate-45 ${
                  isMe ? 'bg-blue-600 -right-1' : 'bg-white -left-1'
                }`}></div>

                <p className="text-[15px] leading-relaxed break-words relative z-10">{msg.content}</p>
                <div className="flex justify-end items-center gap-1 mt-1 relative z-10">
                  <span className={`text-[10px] opacity-70 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {isMe && (
                  <button onClick={() => deleteMessage(msg.id)} className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={scrollEndRef} />
      </main>

      <footer className="p-4 bg-white border-t sticky bottom-0">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-2">
          <input type="text" value={content} onChange={(e) => setContent(e.target.value)} placeholder="メッセージを入力..." className="flex-1 border-none bg-gray-100 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-[15px]" />
          <button disabled={!content} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9-2-9-18-9 18 9 2zm0 0v-8" /></svg>
          </button>
        </form>
      </footer>
    </div>
  );
}
