import { ObjectId } from "mongodb";
import clientPromise from "../lib/mongodb";
import { GetStaticProps } from "next";


interface Movie {
    _id: ObjectId;
    title: string;
    metacritic: number;
    plot: string;
}


interface TopProps {
    movies: Movie[];
}


export default function Top({ movies }: TopProps) {
    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Top 1000 Movies of All Time</h1>
            <p className="text-sm mb-6">
                <small>(According to Metacritic)</small>
            </p>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                    <thead>
                        <tr className="bg-gray-500 text-left">
                            <th className="py-2 px-4">#</th>
                            <th className="py-2 px-4">Title</th>
                            <th className="py-2 px-4">Metacritic Score</th>
                            <th className="py-2 px-4">Plot</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map((movie, index) => (
                            <tr key={movie._id.toString()} className="border-t hover:bg-zinc-400">
                                <td className="py-2 px-4">{index + 1}</td>
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
}


export const getStaticProps: GetStaticProps<TopProps> = async () => {
    try {
        const client = await clientPromise;


        const db = client.db("sample_mflix");


        const movies = await db
            .collection("movies")
            .find({})
            .sort({ metacritic: -1 })
            .limit(1000)
            .toArray();


        return {
            props: { movies: JSON.parse(JSON.stringify(movies)) },
        };
    } catch (e) {
        console.error(e);
        return {
            props: { movies: [] },
        };
    }
};