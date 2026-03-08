export default function CharacterCard({ character }) {
    return (
        <div className="group rounded-xl overflow-hidden glass border-white-10 shadow-lg hover:border-bb-green transition-all duration-500 hover:scale-105 hover:shadow-xl cursor-pointer">
            <div className="aspect-[3/4] overflow-hidden h-64 w-full relative">
                <div className="absolute inset-0 bg-gradient-top from-black-90 via-black-60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img
                    src={character.image}
                    alt={character.name}
                    className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
                />
            </div>
            <div className="p-5 relative z-20 -mt-8 bg-gradient-top from-bb-dark to-transparent pt-8">
                <h3 className="text-2xl font-black text-white mb-2 drop-shadow-md">{character.name}</h3>
                <p className="text-sm border-l-2 border-bb-yellow pl-3 text-white-med italic mb-4 shadow-sm">
                    First Appearance: <span className="text-white font-bold">{character.firstAppearance}</span>
                </p>
                <p className="text-white-dim text-sm line-clamp-3 group-hover:text-white-high transition-colors duration-300">
                    {character.description}
                </p>
            </div>
        </div>
    );
}
