import { useState, useEffect, useMemo } from 'react';

interface CustomEvent {
    id: string;
    title: string;
    color: string;
    dateStr?: string;
}






export const Planner = () => {
    const [events] = useState<CustomEvent[]>([]);
    //i add the events manually here!!

    const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);

    // Firebase fetching disabled
    useEffect(() => {
        // No notices or events fetched from Firebase since key was removed
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

            </div>


            {selectedDateIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
                        <button
                            onClick={() => {
                                setSelectedDateIndex(null);
                            }}
                            className="absolute top-6 right-6 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all"
                        >
                            <span className="font-bold">X</span>
                        </button>

                        <h4 className="text-2xl font-semibold text-white mb-1">Schedule Details</h4>
                        <p className="text-[#33ccff] font-medium text-sm mb-8 tracking-wide">{days[selectedDateIndex].displayDate}</p>

                        <div className="mb-8 space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {days[selectedDateIndex].events.length === 0 ? (
                                <p className="text-white/30 text-sm italic py-4 text-center border border-white/5 border-dashed rounded-xl">No events scheduled.</p>
                            ) : (
                                days[selectedDateIndex].events.map(ev => (
                                    <div
                                        key={ev.id}
                                        className="flex flex-col p-3 rounded-xl border border-white/5 bg-[#111]"
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ev.color }}></div>
                                                <span className="text-white text-sm font-medium">{ev.title}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
