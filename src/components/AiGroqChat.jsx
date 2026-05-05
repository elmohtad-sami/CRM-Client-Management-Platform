import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, MessageCircle, Zap } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function AiGroqChat({ riskAnomalies, invoices, clients }) {
  const { token } = useUser();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m your AI assistant powered by Groq. I can help you analyze financial risks, discuss anomalies, and provide insights about your clients and invoices. What would you like to know?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call Groq API with authentication
      const response = await fetch('/api/groq/analyze', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: input,
          context: {
            riskCount: riskAnomalies?.length || 0,
            invoiceCount: invoices?.length || 0,
            clientCount: clients?.length || 0,
            anomalies: riskAnomalies?.slice(0, 5)
          }
        })
      });

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: data.response || data.message || 'Sorry, I couldn\'t process that. Please try again.'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling Groq API:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-cyan-500 text-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold">AI Groq Assistant</h3>
            <p className="text-sm opacity-90">Analyze your financial data</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                msg.type === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-900 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-2">
              <Loader size={16} className="animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-slate-200 p-4 bg-slate-50">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your risks, invoices, or clients..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={16} />
            {!isLoading && <span className="hidden sm:inline">Send</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
