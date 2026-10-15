import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, Send } from 'lucide-react';
import type { Post } from '@/data/types';
import { useApp } from '@/context/AppContext';
import VerifiedBadge from './VerifiedBadge';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { togglePostLike, togglePostSave, savedPosts, addComment } = useApp();
  const isSaved = savedPosts.includes(post.id);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleComment = () => {
    if (commentText.trim()) {
      addComment(post.id, commentText.trim());
      setCommentText('');
    }
  };

  const typeLabels: Record<Post['type'], string> = {
    'product': 'New Product',
    'update': 'Update',
    'behind-the-scenes': 'Behind the Scenes',
    'promotion': 'Promotion',
    'launch': 'Launch',
    'achievement': 'Achievement',
  };

  return (
    <article className="bg-white rounded-2xl shadow-soft border border-ink-100 overflow-hidden animate-fade-in">
      <div className="p-4 flex items-center gap-3">
        <Link to={`/profile/${post.authorId}`}>
          <img src={post.authorAvatar} alt={post.authorName} className="w-11 h-11 rounded-full object-cover" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Link to={`/profile/${post.authorId}`} className="font-semibold text-ink-800 hover:text-brand-700 truncate">
              {post.authorName}
            </Link>
            {post.authorVerified && <VerifiedBadge size="sm" />}
          </div>
          <p className="text-xs text-ink-400">
            {typeLabels[post.type]} · {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </p>
        </div>
      </div>

      <div className="relative aspect-[4/3] bg-ink-100 overflow-hidden">
        <img src={post.image} alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>

      <div className="p-4">
        <p className="text-sm text-ink-700 leading-relaxed mb-3">{post.caption}</p>

        {post.productId && (
          <Link
            to={`/product/${post.productId}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full mb-3"
          >
            View Product →
          </Link>
        )}

        <div className="flex items-center gap-1 -ml-2">
          <button
            onClick={() => togglePostLike(post.id)}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-error-50 transition-colors group"
          >
            <Heart
              size={20}
              className={post.liked ? 'text-error-500' : 'text-ink-400 group-hover:text-error-400'}
              fill={post.liked ? 'currentColor' : 'none'}
            />
            <span className={`text-sm font-medium ${post.liked ? 'text-error-600' : 'text-ink-500'}`}>
              {post.likes}
            </span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-brand-50 transition-colors group"
          >
            <MessageCircle size={20} className="text-ink-400 group-hover:text-brand-500" />
            <span className="text-sm font-medium text-ink-500">{post.comments.length}</span>
          </button>

          <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-sky-50 transition-colors group ml-auto">
            <Share2 size={18} className="text-ink-400 group-hover:text-sky-500" />
            <span className="text-sm font-medium text-ink-500">{post.shares}</span>
          </button>

          <button
            onClick={() => togglePostSave(post.id)}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-amber-50 transition-colors group"
          >
            <Bookmark
              size={20}
              className={isSaved ? 'text-amber-500' : 'text-ink-400 group-hover:text-amber-400'}
              fill={isSaved ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        {showComments && (
          <div className="mt-3 pt-3 border-t border-ink-100 space-y-3 animate-fade-in">
            {post.comments.map(c => (
              <div key={c.id} className="flex items-start gap-2">
                <img src={c.authorAvatar} alt={c.authorName} className="w-7 h-7 rounded-full object-cover shrink-0" />
                <div className="bg-ink-50 rounded-xl px-3 py-2 flex-1">
                  <span className="text-xs font-semibold text-ink-700">{c.authorName}</span>
                  <p className="text-sm text-ink-600">{c.text}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleComment()}
                placeholder="Add a comment..."
                className="flex-1 bg-ink-50 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300"
              />
              <button
                onClick={handleComment}
                className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
