import React, { useState } from 'react';
import { BulletinPost, User } from '../types';
import {
  Megaphone,
  Car,
  BookOpen,
  Calendar,
  Search,
  PlusCircle,
  ThumbsUp,
  MessageCircle,
  MapPin,
  Tag,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface BulletinBoardProps {
  posts: BulletinPost[];
  currentUser: User;
  onAddPost: (post: BulletinPost) => void;
  onUpvotePost: (postId: string) => void;
  onAddReply: (postId: string, text: string) => void;
  selectedCampus: string;
}

export const BulletinBoard: React.FC<BulletinBoardProps> = ({
  posts,
  currentUser,
  onAddPost,
  onUpvotePost,
  onAddReply,
  selectedCampus,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');

  // New post form
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<BulletinPost['category']>('rideshare');
  const [tagsInput, setTagsInput] = useState('LiftClub, Commute');

  const categories = [
    { id: 'all', label: 'All Notices', icon: Megaphone },
    { id: 'rideshare', label: 'Lift Clubs (Rideshare)', icon: Car },
    { id: 'study_group', label: 'Study Groups', icon: BookOpen },
    { id: 'lost_found', label: 'Lost & Found', icon: Search },
    { id: 'campus_event', label: 'Campus Events', icon: Calendar },
    { id: 'src_notice', label: 'SRC & Official Notices', icon: Megaphone },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesCampus =
      selectedCampus === 'all' || post.campus.toLowerCase().includes(selectedCampus.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCampus && matchesSearch;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newPost: BulletinPost = {
      id: `post-${Date.now()}`,
      author: currentUser,
      title: title.trim(),
      body: body.trim(),
      category,
      campus: currentUser.campusOrArea || 'University of Cape Town (UCT)',
      date: 'Just now',
      upvotes: 1,
      hasUpvoted: true,
      repliesCount: 0,
      replies: [],
      tags: tags.length ? tags : ['CampusNotice'],
    };

    onAddPost(newPost);
    setTitle('');
    setBody('');
    setIsPostingModalOpen(false);
  };

  const handleSendReply = (postId: string) => {
    if (!replyInput.trim()) return;
    onAddReply(postId, replyInput.trim());
    setReplyInput('');
    setActiveReplyPostId(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-emerald-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Campus Social & Community Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Campus Bulletin & Lift Clubs
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Connecting students and local residents for petrol-share lift clubs, study groups, lost & found, and community initiatives across South Africa.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsPostingModalOpen(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Campus Notice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Chips & Search */}
      <div className="flex flex-col sm:flex-row gap-2.5 justify-between items-stretch sm:items-center">
        {/* Interactive Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`py-1.5 px-3 rounded-lg font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white border border-stone-200/90 text-stone-600 hover:border-stone-300 hover:text-stone-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="py-12 bg-white rounded-2xl border border-stone-200 text-center p-6 space-y-2">
            <Megaphone className="w-8 h-8 text-stone-400 mx-auto" />
            <h3 className="font-bold text-stone-800 text-sm">No notices found</h3>
            <p className="text-xs text-stone-500">
              Be the first to post a lift club, event, or announcement for this campus!
            </p>
            <button
              onClick={() => setIsPostingModalOpen(true)}
              className="mt-2 px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
            >
              Create Notice
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs space-y-3 hover:border-stone-300 transition-colors"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-stone-900 text-xs sm:text-sm">
                        {post.author.name}
                      </span>
                      {post.author.verificationStatus === 'verified' && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                    {/* Zero-pill metadata */}
                    <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                      <span>{post.author.badgeLabel}</span>
                      <span>·</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-stone-500">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span className="truncate max-w-[140px] sm:max-w-none">{post.campus}</span>
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">
                  {post.body}
                </p>
              </div>

              {/* Clean tags */}
              <div className="flex items-center gap-2 flex-wrap text-[11px] text-stone-500">
                <Tag className="w-3 h-3 text-stone-400" />
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="hover:text-stone-800">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action Footer */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onUpvotePost(post.id)}
                    className={`flex items-center gap-1.5 font-semibold transition-colors ${
                      post.hasUpvoted ? 'text-emerald-700' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${post.hasUpvoted ? 'fill-emerald-700' : ''}`} />
                    <span>{post.upvotes} Helpful</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)
                    }
                    className="flex items-center gap-1.5 font-semibold text-stone-600 hover:text-stone-900"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post.repliesCount} Responses</span>
                  </button>
                </div>
              </div>

              {/* Inline Reply Box if toggled */}
              {activeReplyPostId === post.id && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2 mt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a public response..."
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendReply(post.id)}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" /> Reply
                    </button>
                  </div>

                  {post.replies && post.replies.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-stone-200">
                      {post.replies.map((r) => (
                        <div key={r.id} className="text-xs bg-white p-2 rounded-lg border border-stone-200/70">
                          <span className="font-bold text-stone-800">{r.author.name}: </span>
                          <span className="text-stone-700">{r.text}</span>
                          <span className="text-[10px] text-stone-400 block mt-0.5">{r.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </article>
          ))
        )}
      </div>

      {/* Post Notice Modal */}
      {isPostingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/65 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm">Post to Campus Bulletin</h3>
              <button
                onClick={() => setIsPostingModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Notice Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as BulletinPost['category'])}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                >
                  <option value="rideshare">Lift Club / Rideshare (Petrol split)</option>
                  <option value="study_group">Study Group / Tutoring Circle</option>
                  <option value="lost_found">Lost & Found Item</option>
                  <option value="campus_event">Campus Event / Student Society</option>
                  <option value="src_notice">SRC / Community Announcement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lift Club: Claremont to UCT Upper Campus Mon-Fri"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Details & Information</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide times, departure locations, contact details, or event schedule..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="LiftClub, Rondebosch, Carpool"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPostingModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
