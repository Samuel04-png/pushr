import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage } from '../types';
import { Header, Button, Badge } from '../components/UI';
import { Send, Phone, MoreVertical, Image as ImageIcon, MapPin, Smile, Paperclip, Check, CheckCheck } from 'lucide-react';

const MOCK_MESSAGES: ChatMessage[] = [
  { id: '1', senderId: 'other', text: 'Hello! I have picked up your package.', timestamp: Date.now() - 100000 },
  { id: '2', senderId: 'me', text: 'Great, thank you! Is the traffic bad?', timestamp: Date.now() - 80000 },
  { id: '3', senderId: 'other', text: 'It is moving okay. I should be there in 10 mins.', timestamp: Date.now() - 60000 },
  { id: '4', senderId: 'other', text: 'I\'ve arrived at the pickup location.', timestamp: Date.now() - 30000 },
];

export const ChatView = ({ user, onBack }: { user: User, onBack: () => void }) => {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      text: input,
      timestamp: Date.now()
    };
    
    setMessages([...messages, newMessage]);
    setInput('');
    
    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate reply
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'other',
        text: 'Got it! 👍',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
    
    if ('vibrate' in navigator) navigator.vibrate(10);
    inputRef.current?.focus();
  };

  const handleCall = () => {
    if ('vibrate' in navigator) navigator.vibrate(30);
    alert('Calling Kennedy...');
  };

  const handleShareLocation = () => {
    if ('vibrate' in navigator) navigator.vibrate(20);
    const locationMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      text: '📍 Shared Location',
      timestamp: Date.now()
    };
    setMessages([...messages, locationMessage]);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header 
        title={
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-pushr-blue/20"
                alt="Kennedy"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-pushr-success rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="font-bold text-gray-900">Kennedy M.</p>
              <p className="text-xs text-pushr-success font-medium">Online</p>
            </div>
          </div>
        }
        onBack={onBack}
        rightAction={
          <div className="flex space-x-2">
            <button
              onClick={handleCall}
              className="p-2 bg-pushr-success/10 text-pushr-success rounded-full hover:bg-pushr-success/20 transition-colors touch-feedback active:scale-95"
            >
              <Phone size={20} />
            </button>
            <button className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors touch-feedback active:scale-95">
              <MoreVertical size={20} />
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar scroll-smooth">
        {/* Date Divider */}
        <div className="flex justify-center">
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
            Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Messages */}
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === 'me';
          const isLast = idx === messages.length - 1;
          const showTime = idx === messages.length - 1 || 
            Math.abs(msg.timestamp - messages[idx + 1].timestamp) > 300000; // 5 minutes
          
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              <div className={`max-w-[75%] sm:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-3xl shadow-sm ${
                  isMe 
                    ? 'bg-pushr-blue text-white rounded-br-md' 
                    : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                }`}>
                  {msg.text.includes('📍') ? (
                    <div className="flex items-center space-x-2">
                      <MapPin size={20} />
                      <span className="font-medium">Location Shared</span>
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                  )}
                </div>
                {showTime && (
                  <div className="flex items-center space-x-1 mt-1 px-2">
                    <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                    {isMe && isLast && (
                      <CheckCheck size={12} className="text-pushr-blue" />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-slide-up">
            <div className="bg-white rounded-3xl rounded-bl-md border border-gray-100 px-4 py-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-2 border-t border-gray-100">
        <div className="flex space-x-2 py-2 overflow-x-auto no-scrollbar">
          <button
            onClick={handleShareLocation}
            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 whitespace-nowrap hover:bg-gray-50 transition-colors touch-feedback active:scale-95 flex items-center space-x-1"
          >
            <MapPin size={16} />
            <span>Location</span>
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 whitespace-nowrap hover:bg-gray-50 transition-colors touch-feedback active:scale-95 flex items-center space-x-1">
            <ImageIcon size={16} />
            <span>Photo</span>
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 pb-safe">
        <div className="flex items-end space-x-3">
          <button className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors touch-feedback active:scale-95 flex-shrink-0">
            <Paperclip size={20} className="text-gray-600" />
          </button>
          
          <div className="flex-1 bg-gray-100 rounded-3xl px-4 py-2 flex items-center min-h-[48px] max-h-32 overflow-y-auto">
            <input 
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..." 
              className="bg-transparent border-none w-full focus:ring-0 outline-none py-2 text-sm sm:text-base resize-none"
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              autoFocus
            />
            <button className="p-1.5 hover:bg-gray-200 rounded-full transition-colors touch-feedback active:scale-95 ml-2 flex-shrink-0">
              <Smile size={20} className="text-gray-600" />
            </button>
          </div>
          
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-3 rounded-full shadow-lg transition-all touch-feedback active:scale-95 flex-shrink-0 ${
              input.trim()
                ? 'bg-pushr-blue text-white hover:bg-blue-600 shadow-blue-500/30 scale-100' 
                : 'bg-gray-200 text-gray-400 scale-95 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
