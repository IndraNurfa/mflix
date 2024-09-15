import clientPromise from "../lib/mongodb";
import { GetServerSideProps } from 'next';


interface Movie {
    _id: string;
    title: string;
    metacritic: number;
    plot: string;
}


interface MoviesProps {
    movies: Movie[];
}

const Movies: React.FC<MoviesProps> = ({ movies }) => {
    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Top 20 Movies of All Time</h1>
            <p className="text-sm mb-6">
                <small>(According to Metacritic)</small>
            </p>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="py-2 px-4">Title</th>
                            <th className="py-2 px-4">Metacritic Score</th>
                            <th className="py-2 px-4">Plot</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map((movie) => (
                            <tr key={movie._id} className="border-t">
                                <td className="py-2 px-4 font-semibold">{movie.title}</td>
                                <td className="py-2 px-4">{movie.metacritic}</td>
                                <td className="py-2 px-4">{movie.plot}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};



export default Movies;


export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const client = await clientPromise;
        const db = client.db("sample_mflix");
        const movies = await db
            .collection("movies")
            .find({})
            .sort({ metacritic: -1 })
            .limit(20)
            .toArray();
        return {
            props: { movies: JSON.parse(JSON.stringify(movies)) },
        };
    } catch (e) {
        console.error(e);
        return { props: { movies: [] } };
    }
};