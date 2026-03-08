import { characters } from '../data/characters';
import CharacterCard from '../components/CharacterCard';

export default function Characters() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white-10 pb-4">
                <div>
                    <h1 className="text-3xl font-black mb-2 text-white">Major Characters</h1>
                    <p className="text-white-med">The key players in the empire business.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {characters.map(char => (
                    <CharacterCard key={char.id} character={char} />
                ))}
            </div>
        </div>
    );
}
