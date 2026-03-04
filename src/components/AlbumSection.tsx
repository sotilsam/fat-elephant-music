const ALBUMS = [
    { id: 1, title: "The Fat Elephant in the room", year: "2025", cover: "/tfeitr.png"},
    { id: 2, title: "OUT OF MY HEAD - Single", year: "2025", cover: "/OOMH.png"},
    { id: 3, title: "MAKE you see - Single", year: "2025", cover: "/mus.png"},
    { id: 4, title: "No Time - Single", year: "2025", cover: "/nt.png" },
    { id: 5, title: "What Should We Do? - Single", year: "2022", cover: "/wswd.png" },
];

export const AlbumSection = () => {
    return (
        <div className="w-full pb-32 bg-black">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                    {ALBUMS.map((album) => (
                        <div key={album.id} className="group cursor-pointer flex flex-col items-center">
                            {/* Album Cover Container */}
                            <div className="w-full max-w-[160px] mb-4 aspect-square rounded-xl bg-[#0a0a0a] hover:bg-[#111111] border border-white/5 group-hover:border-white/20 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center shadow-lg group-hover:-translate-y-2 group-hover:shadow-2xl">

                                <img src={album.cover} alt={album.title} className="w-full h-full object-cover" />


                            </div>

                            {/* Album Info (Below Cover) */}
                            <div className="text-center">
                                <h4 className="text-white/90 group-hover:text-white font-medium text-base tracking-wide transition-colors">{album.title}</h4>
                                <p className="text-white/40 text-xs mt-1">{album.year}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
