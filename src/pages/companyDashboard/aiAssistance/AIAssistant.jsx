import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiSend } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Scroll to bottom when messages change or when opening
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: Date.now(),
        sender: 'user',
        text: inputValue,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
      
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: "Based on your current 24% conversion rate, I recommend increasing referral rewards by 15% during weekends when engagement is highest.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 1500);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-80 bg-white/90 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-blue-500 to-indigo-600 mb-1 text-white">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-white/20">
                  {/* <FiSparkles /> */}
                </div>
                <h3 className="font-semibold">Optimization Assistant</h3>
                <span onClick={() => setIsOpen(false)} className="font-bold text-3xl cursor-pointer absolute right-3">×</span>
              </div>
            </div>

            <div 
              ref={messagesContainerRef}
              className="h-64 p-4 overflow-y-auto"
            >
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    Ask me about campaign optimizations...
                  </div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-2xl ${
                        message.sender === 'user' ? 
                          'bg-blue-500 text-white rounded-br-none' : 
                          'bg-slate-100 dark:bg-slate-700 rounded-bl-none'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="p-3 border-t border-slate-200/50 dark:border-slate-700/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about optimizations..."
                  className="flex-1 bg-slate-100 dark:bg-slate-700/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button
                  onClick={handleSend}
                  className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  <FiSend />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="p-4 rounded-full shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
          >
            <FiMessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}