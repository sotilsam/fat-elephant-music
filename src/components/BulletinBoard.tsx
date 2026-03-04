import { useState, useEffect } from 'react';

export const BulletinBoard = () => {
    const [content, setContent] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('fat-elephant-bulletin');
        if (saved) {
            setContent(saved);
        } else {
            setContent("Welcome to the band dashboard.\nWe need to finish the setlist by Thursday!\n\nLink to Google Drive: drive.google.com/...");
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        localStorage.setItem('fat-elephant-bulletin', e.target.value);
    };

    return (
        <div className="w-full py-16 bg-[#020202]">
            <div className="max-w-5xl mx-auto px-6">
                <h3 className="text-xl font-semibold tracking-tight text-white mb-6">Band Noticeboard</h3>
                <textarea
                    value={content}
                    onChange={handleChange}
                    placeholder="Add notes, links, or messages for the band here..."
                    className="w-full h-48 bg-[#0a0a0a] border border-white/10 rounded-2xl text-white p-6 outline-none focus:border-[#33ccff]/50 transition-all resize-y shadow-lg leading-relaxed"
                />
            </div>
        </div>
    );
};
