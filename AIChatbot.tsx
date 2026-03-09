import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import Markdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are an AI assistant for "Public Project", a Rural Infrastructure Exchange & Monitoring Platform.
Your goal is to help citizens, contractors, and investors understand how the platform works, answer questions about public projects, and provide instructions.

Platform Overview:
- Citizens can submit project proposals (e.g., schools, bridges, hospitals).
- Contractors can view approved proposals, submit execution plans (PPTs), and update project status.
- Investors/CSR Entities can review projects in the funding phase and express interest to fund them.
- Admins validate projects, review contractor plans, and authorize funding.
- The CEO/Super Admin manages KYC for contractors and investors.

Key Features:
- Real-time tracking of projects.
- Transparency in funding and execution.
- Geo-tagged project locations.

When answering:
- Be helpful, concise, and professional.
- If asked about specific projects, mention that you can only provide general information about the platform's workflow, as you don't have access to the live database of specific projects.
- Guide users to the appropriate sections of the app (e.g., "Submit Project" for new ideas, "Projects Feed" for ongoing work).
`;

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Hello! I am the Public Project Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const modelName = isThinkingMode ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview';
      const config: any = {
        systemInstruction: SYSTEM_INSTRUCTION,
      };

      if (isThinkingMode) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: userMsg,
        config
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || 'Sorry, I could not generate a response.' }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error while processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-800 transition-transform hover:scale-110 z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <i className="fas fa-comment-dots text-2xl"></i>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10">
          {/* Header */}
          <div className="bg-blue-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <i className="fas fa-robot text-xl"></i>
              <span className="font-bold">Public Project AI</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center cursor-pointer gap-2">
                <span className="text-xs font-medium text-blue-200">Think</span>
                <div className="relative inline-block w-8 h-4 align-middle select-none">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={isThinkingMode}
                    onChange={(e) => setIsThinkingMode(e.target.checked)}
                  />
                  <div className={`block w-8 h-4 rounded-full transition-colors ${isThinkingMode ? 'bg-blue-400' : 'bg-blue-950'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-2 h-2 rounded-full transition-transform ${isThinkingMode ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>
              <button onClick={() => setIsOpen(false)} className="text-blue-200 hover:text-white transition">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto bg-slate-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-900 text-white rounded-br-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                }`}>
                  {msg.role === 'model' ? (
                    <div className="markdown-body text-sm prose prose-sm max-w-none prose-p:leading-snug prose-p:my-1">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-500 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about projects..."
                className="flex-grow bg-transparent outline-none text-sm text-slate-700"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="text-blue-900 hover:text-blue-900 disabled:opacity-50 transition"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
