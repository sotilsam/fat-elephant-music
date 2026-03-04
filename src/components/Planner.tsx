import { useState, useEffect, useMemo } from 'react';
import { Plus, X, Trash2, Edit2, Check } from 'lucide-react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface CustomEvent {
    id: string;
    title: string;
    color: string;
    dateStr?: string;
}



const COLORS = [
    { name: 'Pink', value: '#ff66c4', bg: 'bg-[#ff66c4]/10', border: 'border-[#ff66c4]/50' },
    { name: 'Cyan', value: '#33ccff', bg: 'bg-[#33ccff]/10', border: 'border-[#33ccff]/50' },
    { name: 'Purple', value: '#b57edd', bg: 'bg-[#b57edd]/10', border: 'border-[#b57edd]/50' },
    { name: 'Green', value: '#00ff41', bg: 'bg-[#00ff41]/10', border: 'border-[#00ff41]/50' },
    { name: 'Yellow', value: '#f4e04d', bg: 'bg-[#f4e04d]/10', border: 'border-[#f4e04d]/50' },
    { name: 'Red', value: '#eb3f3f', bg: 'bg-[#f4e04d]/10', border: 'border-[#f4e04d]/50' },
];

export const Planner = () => {
    const [events, setEvents] = useState<CustomEvent[]>([]);
    const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);

    // Band messages state
    const [bandMessage, setBandMessage] = useState('');

    // Modal State
    const [newEventTitle, setNewEventTitle] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);

    // Editing State
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [editEventTitle, setEditEventTitle] = useState('');
    const [editEventColor, setEditEventColor] = useState(COLORS[0]);

    // Initialize schedule
    useEffect(() => {
        const unsubscribeEvents = onSnapshot(collection(db, 'schedule_events'), (snapshot) => {
            const eventsData: CustomEvent[] = [];
            snapshot.forEach((doc) => {
                eventsData.push({ id: doc.id, ...doc.data() } as CustomEvent);
            });
            setEvents(eventsData);
        });

        const unsubscribeMsg = onSnapshot(doc(db, 'band_message', 'main'), (docSnap) => {
            if (docSnap.exists()) {
                setBandMessage(docSnap.data().text || '');
            }
        });

        return () => {
            unsubscribeEvents();
            unsubscribeMsg();
        };
    }, []);

    const days = useMemo(() => {
        return Array.from({ length: 14 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            return {
                dateStr,
                displayDate: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                events: events.filter(e => e.dateStr === dateStr),
            };
        });
    }, [events]);

    const handleMessageChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setBandMessage(newText);
        await setDoc(doc(db, 'band_message', 'main'), { text: newText });
    };

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDateIndex === null || !newEventTitle.trim()) return;

        await addDoc(collection(db, 'schedule_events'), {
            title: newEventTitle.trim(),
            color: selectedColor.value,
            dateStr: days[selectedDateIndex].dateStr,
            createdAt: new Date().toISOString()
        });

        setNewEventTitle(''); // Form reset, keep modal open to add more
    };

    const handleRemoveEvent = async (eventId: string) => {
        await deleteDoc(doc(db, 'schedule_events', eventId));
    };

    const startEditEvent = (ev: CustomEvent) => {
        setEditingEventId(ev.id);
        setEditEventTitle(ev.title);
        setEditEventColor(COLORS.find(c => c.value === ev.color) || COLORS[0]);
    };

    const handleSaveEditEvent = async () => {
        if (!editEventTitle.trim() || !editingEventId) {
            setEditingEventId(null);
            return;
        }

        await updateDoc(doc(db, 'schedule_events', editingEventId), {
            title: editEventTitle.trim(),
            color: editEventColor.value
        });
        setEditingEventId(null);
    };

    return (
        <div className="w-full py-24 bg-black border-t border-white/5 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-semibold tracking-tight text-white">Schedule</h3>
                    <span className="text-xs font-semibold bg-white/10 text-white px-3 py-1.5 rounded-full tracking-wide">Next 14 Days</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                    {days.map((day, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedDateIndex(idx)}
                            className="rounded-2xl p-4 flex flex-col min-h-[140px] transition-all duration-300 border border-white/5 bg-[#0a0a0a] hover:bg-[#111] hover:border-white/20 cursor-pointer hover:-translate-y-1 shadow-lg"
                        >
                            <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-2">
                                <div className="text-xs font-bold text-white/40 uppercase tracking-widest">
                                    {day.displayDate}
                                </div>
                                <Plus size={14} className="text-white/20 hover:text-white transition-colors" />
                            </div>

                            <div className="flex-1 flex flex-col gap-2 relative">
                                {day.events.length === 0 ? (
                                    <span className="block w-full text-center text-white/10 text-xs font-medium mt-4">—</span>
                                ) : (
                                    day.events.map(ev => (
                                        <div
                                            key={ev.id}
                                            className="px-2 py-1.5 rounded-md text-xs font-semibold shadow-sm w-full truncate"
                                            style={{
                                                backgroundColor: `${ev.color}15`,
                                                color: ev.color,
                                                borderLeft: `2px solid ${ev.color}`
                                            }}
                                        >
                                            {ev.title}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Team Messages Section */}
                <div className="mt-12 p-6 rounded-2xl border border-white/5 bg-[#0a0a0a] shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-white/90">Band Notice Board</h4>
                        <span className="text-xs text-white/40">Auto-saved</span>
                    </div>
                    <textarea
                        value={bandMessage}
                        onChange={handleMessageChange}
                        placeholder="Drop messages or links here for other band members..."
                        className="w-full h-64 bg-black border border-white/10 rounded-xl p-4 text-white/80 text-sm focus:border-white/30 focus:outline-none resize-none transition-colors custom-scrollbar"
                    />
                </div>
            </div>

            {/* Event Input Modal/Overlay */}
            {selectedDateIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
                        <button
                            onClick={() => {
                                setSelectedDateIndex(null);
                                setNewEventTitle('');
                                setEditingEventId(null);
                            }}
                            className="absolute top-6 right-6 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all"
                        >
                            <X size={16} />
                        </button>

                        <h4 className="text-2xl font-semibold text-white mb-1">Manage Events</h4>
                        <p className="text-[#33ccff] font-medium text-sm mb-8 tracking-wide">{days[selectedDateIndex].displayDate}</p>

                        {/* Existing Events List */}
                        <div className="mb-8 space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {days[selectedDateIndex].events.length === 0 ? (
                                <p className="text-white/30 text-sm italic py-4 text-center border border-white/5 border-dashed rounded-xl">No events scheduled.</p>
                            ) : (
                                days[selectedDateIndex].events.map(ev => (
                                    <div
                                        key={ev.id}
                                        className="flex flex-col p-3 rounded-xl border border-white/5 bg-[#111]"
                                    >
                                        {editingEventId === ev.id ? (
                                            <div className="flex flex-col gap-3">
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={editEventTitle}
                                                    onChange={(e) => setEditEventTitle(e.target.value)}
                                                    className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/40 shadow-inner"
                                                />
                                                <div className="flex justify-between items-center">
                                                    <div className="flex gap-2">
                                                        {COLORS.map(color => (
                                                            <button
                                                                key={color.name}
                                                                type="button"
                                                                onClick={() => setEditEventColor(color)}
                                                                className={`w-5 h-5 rounded-full transition-all border-2 ${editEventColor.value === color.value ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                                                style={{ backgroundColor: color.value }}
                                                                title={color.name}
                                                            />
                                                        ))}
                                                    </div>
                                                    <button
                                                        onClick={handleSaveEditEvent}
                                                        className="text-[#00ff41] p-1.5 hover:bg-[#00ff41]/10 rounded-lg transition-colors bg-[#00ff41]/5 border border-[#00ff41]/20 flex items-center gap-1"
                                                    >
                                                        <Check size={14} /> <span className="text-xs font-semibold pr-1">Save</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center w-full">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ev.color }}></div>
                                                    <span className="text-white text-sm font-medium">{ev.title}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => startEditEvent(ev)}
                                                        className="text-white/30 hover:text-white p-1.5 transition-colors"
                                                        title="Edit Event"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveEvent(ev.id)}
                                                        className="text-white/30 hover:text-[#ff66c4] p-1.5 transition-colors"
                                                        title="Delete Event"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add New Event Form */}
                        <form onSubmit={handleAddEvent} className="bg-[#111] p-5 rounded-2xl border border-white/5">
                            <h5 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Add New Event</h5>

                            <input
                                type="text"
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                                placeholder="Event title..."
                                className="w-full bg-black border border-white/10 rounded-xl text-white px-4 py-3 outline-none focus:border-white/30 transition-all text-sm mb-4"
                                autoFocus
                            />

                            <div className="flex gap-2 mb-6">
                                {COLORS.map(color => (
                                    <button
                                        key={color.name}
                                        type="button"
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 rounded-full transition-all border-2 ${selectedColor.value === color.value ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={!newEventTitle.trim()}
                                className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition-all text-sm"
                            >
                                Add to Schedule
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
