import { useState, useRef, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Send, Search, ArrowLeft, Flag, Ban, MoreVertical, Package,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import VerifiedBadge from '@/components/VerifiedBadge';

export default function MessagesPage() {
  const { conversations, sendMessage, currentUser } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(
    searchParams.get('c') || conversations[0]?.id || null
  );
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showActions, setShowActions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selected = conversations.find(c => c.id === selectedId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages.length]);

  const filteredConversations = conversations.filter(c =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.productTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const handleSend = async () => {
    if (messageText.trim() && selectedId) {
      await sendMessage(selectedId, messageText.trim());
      setMessageText('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <div className="bg-white rounded-2xl shadow-soft border border-ink-100 overflow-hidden flex h-[calc(100vh-140px)] min-h-[500px]">
        {/* Conversation list */}
        <div className={`${selectedId ? 'hidden sm:flex' : 'flex'} flex-col w-full sm:w-80 border-r border-ink-100 shrink-0`}>
          <div className="p-4 border-b border-ink-100">
            <h2 className="font-bold text-ink-800 mb-3">Messages</h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-ink-50 rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => { setSelectedId(conv.id); setSearchParams({ c: conv.id }); }}
                  className={`w-full text-left p-3 border-b border-ink-50 hover:bg-ink-50 transition-colors flex items-start gap-3 ${selectedId === conv.id ? 'bg-brand-50' : ''}`}
                >
                  <div className="relative shrink-0">
                    <img src={conv.participantAvatar} alt={conv.participantName} className="w-12 h-12 rounded-xl object-cover" />
                    {conv.participantVerified && <div className="absolute -bottom-0.5 -right-0.5"><VerifiedBadge size="sm" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-ink-800 truncate">{conv.participantName}</span>
                      {conv.unread > 0 && <span className="bg-brand-600 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">{conv.unread}</span>}
                    </div>
                    {conv.productTitle && <p className="text-xs text-brand-600 truncate">{conv.productTitle}</p>}
                    <p className="text-xs text-ink-400 truncate mt-0.5">
                      {conv.messages[conv.messages.length - 1]?.text || 'No messages yet'}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-ink-400">No conversations found.</div>
            )}
          </div>
        </div>

        {/* Chat area */}
        {selected ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat header */}
            <div className="p-4 border-b border-ink-100 flex items-center gap-3">
              <button onClick={() => setSelectedId(null)} className="sm:hidden w-8 h-8 rounded-lg hover:bg-ink-50 flex items-center justify-center">
                <ArrowLeft size={20} className="text-ink-600" />
              </button>
              <Link to={`/profile/${selected.participantId}`} className="flex items-center gap-3 min-w-0">
                <img src={selected.participantAvatar} alt={selected.participantName} className="w-10 h-10 rounded-xl object-cover" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-ink-800 truncate">{selected.participantName}</span>
                    {selected.participantVerified && <VerifiedBadge size="sm" />}
                  </div>
                  <p className="text-xs text-ink-400">{selected.participantVerified ? 'Student Verified' : 'Unverified'}</p>
                </div>
              </Link>
              <div className="ml-auto relative">
                <button onClick={() => setShowActions(!showActions)} className="w-8 h-8 rounded-lg hover:bg-ink-50 flex items-center justify-center">
                  <MoreVertical size={18} className="text-ink-500" />
                </button>
                {showActions && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-float border border-ink-100 py-1 z-20 min-w-[140px]">
                    <button className="w-full text-left px-3 py-2 text-sm text-ink-600 hover:bg-ink-50 flex items-center gap-2">
                      <Flag size={14} /> Report
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-error-500 hover:bg-error-50 flex items-center gap-2">
                      <Ban size={14} /> Block
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Product reference */}
            {selected.productTitle && (
              <Link
                to={`/product/${selected.productId}`}
                className="flex items-center gap-2 p-3 bg-brand-50/50 border-b border-brand-100 hover:bg-brand-50 transition-colors"
              >
                {selected.productImage && <img src={selected.productImage} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-ink-400">Re: listing</p>
                  <p className="text-sm font-semibold text-ink-700 truncate">{selected.productTitle}</p>
                </div>
                <Package size={16} className="text-brand-600" />
              </Link>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-ink-50/30">
              {selected.messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-ink-400">No messages yet. Say hello!</p>
                </div>
              ) : (
                selected.messages.map(msg => {
                  const isMe = msg.senderId === currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] ${isMe ? 'order-2' : ''}`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-brand-600 text-white rounded-br-md' : 'bg-white text-ink-700 border border-ink-100 rounded-bl-md'}`}>
                          {msg.text}
                        </div>
                        <p className={`text-[10px] text-ink-300 mt-1 ${isMe ? 'text-right' : ''}`}>
                          {new Date(msg.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="p-3 border-t border-ink-100 flex items-center gap-2">
              <input
                type="text"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200"
              />
              <button
                onClick={handleSend}
                disabled={!messageText.trim()}
                className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors disabled:opacity-40"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex flex-1 items-center justify-center text-ink-400">
            <div className="text-center">
              <p className="font-semibold text-ink-600">Select a conversation</p>
              <p className="text-sm mt-1">Choose a chat from the list to start messaging.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
