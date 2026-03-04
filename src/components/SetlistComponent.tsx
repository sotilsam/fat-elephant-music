import { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { GripVertical, Trash2, Plus, Edit2, Check } from 'lucide-react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Song {
    id: string;
    title: string;
}

export const SetlistComponent = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [newSong, setNewSong] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'setlist', 'main'), (docSnap) => {
            if (docSnap.exists()) {
                setSongs(docSnap.data().songs || []);
            } else {
                setSongs([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const saveSongs = async (newSongs: Song[]) => {
        setSongs(newSongs); 
        await setDoc(doc(db, 'setlist', 'main'), { songs: newSongs });
    };

    const handleReorder = (newOrder: Song[]) => {
        saveSongs(newOrder);
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSong.trim()) return;
        saveSongs([...songs, { id: crypto.randomUUID(), title: newSong.trim() }]);
        setNewSong('');
    };

    const handleDelete = (id: string) => {
        saveSongs(songs.filter(s => s.id !== id));
    };

    const startEdit = (song: Song) => {
        setEditingId(song.id);
        setEditTitle(song.title);
    };

    const saveEdit = () => {
        if (!editTitle.trim()) {
            setEditingId(null);
            return;
        }
        saveSongs(songs.map(s => s.id === editingId ? { ...s, title: editTitle } : s));
        setEditingId(null);
    };

    return (
        <div className="w-full py-16 bg-[#050505] border-t border-white/5 relative z-10">
            <div className="max-w-4xl mx-auto px-6">
                <h3 className="text-2xl font-semibold tracking-tight text-white mb-8">Live Setlist</h3>

                <form onSubmit={handleAdd} className="flex gap-3 mb-8">
                    <input
                        type="text"
                        value={newSong}
                        onChange={(e) => setNewSong(e.target.value)}
                        placeholder="Add a new song..."
                        className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30 transition-colors"
                    />
                    <button type="submit" disabled={!newSong.trim()} className="bg-white disabled:opacity-50 text-black px-6 rounded-xl font-semibold hover:bg-white/90 transition-colors flex items-center gap-2">
                        <Plus size={18} /> Add
                    </button>
                </form>

                <Reorder.Group axis="y" values={songs} onReorder={handleReorder} className="space-y-3">
                    {songs.map((song, index) => (
                        <Reorder.Item
                            key={song.id}
                            value={song}
                            className="flex items-center gap-4 bg-[#0a0a0a] border border-white/5 p-4 rounded-xl shadow-md cursor-default relative z-0 mt-0"
                            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                        >
                            <div className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60 p-2 touch-none">
                                <GripVertical size={20} />
                            </div>

                            <div className="flex-1">
                                {editingId === song.id ? (
                                    <input
                                        autoFocus
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        onBlur={saveEdit}
                                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                        className="w-full bg-black border border-white/20 rounded-md px-3 py-1 text-white outline-none focus:border-[#33ccff]"
                                    />
                                ) : (
                                    <span className="text-white font-medium text-lg">
                                        <span className="text-white/40 mr-3 text-base">#{index + 1}</span>
                                        {song.title}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-1">
                                {editingId === song.id ? (
                                    <button onClick={saveEdit} className="text-[#00ff41] p-2 hover:bg-[#00ff41]/10 rounded-md transition-colors">
                                        <Check size={18} />
                                    </button>
                                ) : (
                                    <button onClick={() => startEdit(song)} className="text-white/40 hover:text-white p-2 hover:bg-white/10 rounded-md transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                )}
                                <button onClick={() => handleDelete(song.id)} className="text-white/40 hover:text-[#ff66c4] p-2 hover:bg-[#ff66c4]/10 rounded-md transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </Reorder.Item>
                    ))}
                    {songs.length === 0 && (
                        <div className="text-center text-white/30 italic py-8 border border-white/5 border-dashed rounded-xl">
                            The setlist is empty.
                        </div>
                    )}
                </Reorder.Group>
            </div>
        </div>
    );
};
