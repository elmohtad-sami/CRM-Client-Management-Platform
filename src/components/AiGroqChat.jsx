import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, MessageCircle, Zap } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function AiGroqChat({ riskAnomalies, invoices, clients }) {
  const { token } = useUser();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: `Welcome! I'm your AI Financial Advisor powered by Groq. I specialize in:

📊 **FINANCE** - Invoice analysis, payment optimization, cash flow insights
👥 **CLIENT MANAGEMENT** - Client risk assessment, relationship strategies, account health
📋 **FISCAL & ECONOMIC** - Tax optimization, compliance, fiscal risks, economic trends

Ask me questions like:
• "What's our payment risk with client X?"
• "How can we optimize our cash flow?"
• "What are the fiscal implications of..."
• "Which clients need attention?"
• "Analyze our recent anomalies"

What would you like to know?`
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
      
      let botResponseText = data.response || data.message;
      
      if (!response.ok) {
        console.error('API Error:', data);
        botResponseText = `⚠️ **Error**: ${data.message || 'Failed to get response from AI. Please check server logs.'}`;
      }
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: botResponseText || 'Sorry, I couldn\'t process that. Please try again.'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling Groq API:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: `⚠️ **Network Error**: ${error.message}. Please check your connection and try again.`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.03)] overflow-hidden">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl border-b border-white/[0.08] text-white px-4 py-3">
        <div className="flex items-center gap-2">
                <div className="p-2 bg-white/10 rounded-lg">
            <Zap size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold">AI Groq Assistant</h3>
            <p className="text-xs opacity-90">Analyze your financial data</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
                msg.type === 'user'
                  ? 'bg-white/15 text-white backdrop-blur-sm rounded-br-none'
                  : 'bg-white/[0.06] text-white/90 backdrop-blur-sm rounded-bl-none'
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap break-all">
                {msg.text.split('\n').map((line, idx) => (
                  <div key={idx} className="mb-1 last:mb-0">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/[0.06] text-white/70 px-4 py-2.5 rounded-2xl rounded-bl-none flex items-center gap-2">
              <Loader size={14} className="animate-spin" />
              <span className="text-xs">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-white/[0.08] px-4 py-3 bg-transparent">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about finance, clients, fiscal matters, economic trends..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.15] bg-white/[0.08] text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-white/15 text-white font-bold uppercase tracking-wider text-xs hover:bg-white/25 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 backdrop-blur-sm border border-white/10"
          >
            <Send size={14} />
            {!isLoading && <span className="hidden sm:inline">Send</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
