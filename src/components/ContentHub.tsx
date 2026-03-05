import { ExternalLink } from 'lucide-react';
import { FaSpotify, FaApple, FaYoutube, FaInstagram, FaFacebook } from 'react-icons/fa';

export const ContentHub = () => {
    return (
        <div className="w-full py-32 bg-[#050505] border-t border-white/5">
            <div className="max-w-xl mx-auto px-6">

                {/* Links */}
                <div className="rounded-3xl border border-white/10 p-8 bg-[#0a0a0a] shadow-xl hover:border-white/20 transition-all">
                    <h3 className="text-white font-semibold text-lg mb-8 flex items-center justify-center gap-3 tracking-tight">
                        External Links
                    </h3>
                    <div className="flex flex-col gap-3">
                        {[
                            { name: 'Spotify', url: 'https://open.spotify.com/artist/7o2yKOsqKliQMe6uVLXHHJ', icon: <FaSpotify size={20} className="text-[#1DB954]" /> },
                            { name: 'Apple Music', url: 'https://music.apple.com/il/artist/fat-elephant/1605170615', icon: <FaApple size={20} className="text-white" /> },
                            { name: 'YouTube', url: 'https://m.youtube.com/@FatElephant', icon: <FaYoutube size={20} className="text-[#FF0000]" /> },
                            { name: 'Instagram', url: 'https://www.instagram.com/fatellephant?igsh=MTdpa3lhd2FqcTIwMw==', icon: <FaInstagram size={20} className="text-[#E1306C]" /> },
                            { name: 'Facebook', url: 'https://www.facebook.com/fatellephant/', icon: <FaFacebook size={20} className="text-[#1877F2]" /> }

                        ].map((link) => (
                            <a
                                key={link.name} href={link.url} target="_blank" rel="noreferrer"
                                className="group flex items-center justify-between bg-[#111] border border-white/5 rounded-xl p-4 text-white/80 hover:text-white hover:bg-[#1a1a1a] transition-all">

                                <div className="flex items-center gap-4">
                                    <div className="opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-300">
                                        {link.icon}
                                    </div>
                                    <span className="font-medium">{link.name}</span>
                                </div>
                                <ExternalLink size={16} className="text-white/30 group-hover:text-white/80 transition-colors" />
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
