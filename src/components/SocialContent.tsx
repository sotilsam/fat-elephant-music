import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Video, Trash2, Edit2, Check } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface SocialPost {
    id: string;
    title: string;
    notes: string;
    isOpen?: boolean;
    createdAt?: string;
}

export const SocialContent = () => {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [newNotes, setNewNotes] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editNotes, setEditNotes] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'social_posts'), orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData: SocialPost[] = [];
            snapshot.forEach((doc) => {
                postsData.push({ id: doc.id, ...doc.data() } as SocialPost);
            });
            setPosts(postsData);
        });

        return () => unsubscribe();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        await addDoc(collection(db, 'social_posts'), {
            title: newTitle.trim(),
            notes: newNotes.trim(),
            isOpen: false,
            createdAt: new Date().toISOString()
        });

        setNewTitle('');
        setNewNotes('');
    };

    const toggleOpen = async (id: string) => {
        const postToUpdate = posts.find(p => p.id === id);
        if (postToUpdate) {
            await updateDoc(doc(db, 'social_posts', id), {
                isOpen: !postToUpdate.isOpen
            });
        }
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, 'social_posts', id));
    };

    const startEdit = async (post: SocialPost, e: React.MouseEvent) => {
        e.stopPropagation(); // prevent toggleOpen
        setEditingId(post.id);
        setEditTitle(post.title);
        setEditNotes(post.notes);
        // keep it open while editing
        await updateDoc(doc(db, 'social_posts', post.id), {
            isOpen: true
        });
    };

    const saveEdit = async () => {
        if (!editTitle.trim() || !editingId) {
            setEditingId(null);
            return;
        }
        await updateDoc(doc(db, 'social_posts', editingId), {
            title: editTitle,
            notes: editNotes
        });
        setEditingId(null);
    };

    return (
        <div className="w-full py-24 bg-[#050505] border-t border-white/5 relative z-10">
            <div className="max-w-6xl mx-auto px-6">

                <div className="mb-12 flex items-center gap-4">
                    <div className="p-3 bg-[#ff66c4]/20 rounded-xl text-[#ff66c4] shadow-[0_0_15px_rgba(255,102,196,0.3)]">
                        <Video size={24} />
                    </div>
                    <h2 className="text-3xl font-semibold text-white tracking-tight">Social Content Ideas</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                    {/* Left Column - Form */}
                    <div className="md:col-span-5 lg:col-span-4">
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:sticky md:top-8 shadow-xl hover:border-white/20 transition-all">
                            <h3 className="text-xl font-medium text-white/90 mb-6 flex items-center gap-2">
                                <span className="bg-white/10 w-6 h-6 rounded flex items-center justify-center text-xs">+</span>
                                Add New Idea
                            </h3>
                            <form onSubmit={handleSave} className="space-y-5">
                                <div>
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={e => setNewTitle(e.target.value)}
                                        className="w-full bg-[#111] border border-white/5 rounded-xl text-white px-4 py-3 outline-none focus:border-[#ff66c4]/50 focus:ring-1 focus:ring-[#ff66c4]/50 transition-all placeholder:text-white/30 text-sm shadow-inner"
                                        placeholder="Title (e.g., Snippet Teaser)"
                                    />
                                </div>
                                <div>
                                    <textarea
                                        value={newNotes}
                                        onChange={e => setNewNotes(e.target.value)}
                                        className="w-full bg-[#111] border border-white/5 rounded-xl text-white px-4 py-3 h-32 outline-none focus:border-[#ff66c4]/50 focus:ring-1 focus:ring-[#ff66c4]/50 transition-all placeholder:text-white/30 text-sm resize-none custom-scrollbar shadow-inner"
                                        placeholder="Add visual directions and notes here..."
                                    />
                                </div>
                                <button
                                    disabled={!newTitle.trim()}
                                    className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition-all text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,102,196,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Save Draft
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Accordion List */}
                    <div className="md:col-span-7 lg:col-span-8">
                        <div className="bg-transparent min-h-[400px]">
                            {posts.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center border border-white/10 border-dashed rounded-3xl bg-[#0a0a0a] shadow-inner">
                                    <Video size={32} className="text-white/20 mb-3" />
                                    <div className="text-white/30 italic text-sm">No social ideas yet...</div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {posts.map((post, index) => (
                                        <div
                                            key={post.id}
                                            className="bg-[#0a0a0a] border border-white/10 overflow-hidden transition-all shadow-lg rounded-2xl hover:border-white/20"
                                        >
                                            <div
                                                onClick={() => { if (editingId !== post.id) toggleOpen(post.id) }}
                                                className={`w-full py-5 px-6 flex items-center justify-between text-left ${editingId !== post.id ? 'cursor-pointer hover:bg-white/[0.02]' : ''} transition-colors`}
                                            >
                                                <div className="flex-1 mr-4">
                                                    {editingId === post.id ? (
                                                        <input
                                                            autoFocus
                                                            value={editTitle}
                                                            onChange={(e) => setEditTitle(e.target.value)}
                                                            className="w-full bg-black border border-[#ff66c4]/50 rounded-lg px-3 py-2 text-white outline-none focus:ring-1 focus:ring-[#ff66c4]/50 text-lg font-medium shadow-inner"
                                                        />
                                                    ) : (
                                                        <span className="text-white font-medium text-lg flex items-center gap-3">
                                                            <span className="text-white/30 text-sm font-semibold bg-white/5 px-2.5 py-1 rounded-md">#{index + 1}</span>
                                                            {post.title}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {/* Action Buttons */}
                                                    {editingId === post.id ? (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); saveEdit(); }}
                                                            className="text-[#00ff41] p-2 hover:bg-[#00ff41]/10 rounded-lg transition-colors flex items-center gap-2 bg-[#00ff41]/5 border border-[#00ff41]/20"
                                                            title="Save changes"
                                                        >
                                                            <Check size={18} />
                                                            <span className="text-sm font-semibold pr-1">Save</span>
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={(e) => startEdit(post, e)}
                                                                className="text-white/40 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                                title="Edit idea"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                                                                className="text-white/40 hover:text-[#ff66c4] p-2 hover:bg-[#ff66c4]/10 rounded-lg transition-colors"
                                                                title="Delete idea"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                            <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
                                                            <button className="text-white/50 p-1 hover:text-white transition-colors">
                                                                {post.isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {post.isOpen && (
                                                <div className="px-6 pb-6 pt-2 border-t border-white/5 bg-[#111]/30">
                                                    {editingId === post.id ? (
                                                        <textarea
                                                            value={editNotes}
                                                            onChange={(e) => setEditNotes(e.target.value)}
                                                            className="w-full bg-black border border-[#ff66c4]/30 rounded-lg mt-4 px-4 py-3 h-32 text-white/90 outline-none focus:border-[#ff66c4]/50 focus:ring-1 focus:ring-[#ff66c4]/50 transition-all resize-none text-base custom-scrollbar shadow-inner"
                                                            placeholder="Add your visual notes or ideas here..."
                                                        />
                                                    ) : (
                                                        <div className="mt-4 text-white/70 text-base leading-relaxed whitespace-pre-wrap">
                                                            {post.notes || <span className="italic text-white/30">No notes provided for this idea.</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
