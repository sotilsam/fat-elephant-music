import { ExternalLink } from 'lucide-react';

export const ContentHub = () => {
    return (
        <div className="w-full py-32 bg-[#050505] border-t border-white/5">
            <div className="max-w-xl mx-auto px-6">

                {/* Links */}
                <div className="rounded-3xl border border-white/10 p-8 bg-[#0a0a0a] shadow-xl hover:border-white/20 transition-all">
                    <h3 className="text-white font-semibold text-lg mb-8 flex items-center justify-center gap-3 tracking-tight">
                        <div className="p-2 bg-[#33ccff]/20 rounded-lg text-[#33ccff]"><ExternalLink size={18} /></div> External Links
                    </h3>
                    <div className="flex flex-col gap-3">
                        {[
                        { name: 'Spotify', url: '#' },
                        { name: 'Apple Music', url: 'https://music.apple.com/il/artist/fat-elephant/1605170615' },
                        { name: 'Instagram', url: 'https://www.instagram.com/fatellephant?igsh=MTdpa3lhd2FqcTIwMw==' }
                    
                    ].map((link) => (
                            <a
                                key={link.name} href={link.url} target="_blank" rel="noreferrer"
                                className="group flex items-center justify-between bg-[#111] border border-white/5 rounded-xl p-4 text-white/80 hover:text-white hover:bg-[#1a1a1a] transition-all">
                        
                                <span className="font-medium">{link.name}</span>
                                <ExternalLink size={16} className="text-white/30 group-hover:text-white/80 transition-colors" />
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
