// components/Leaderboard.tsx
import React, { useEffect, useState } from 'react';

interface LeaderboardItem {
    username: string;
    score: number;
}

const Leaderboard: React.FC = () => {
    const [items, setItems] = useState<LeaderboardItem[]>([
        { username: "БО СИНН", score: 150 },
        { username: "БО СИНН", score: 120 },
        { username: "БО СИНН", score: 100 },
        { username: "Игрок 1488", score: 160 },
    ]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://your-api-endpoint.com/leaderboard');
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboardData();
    }, []);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 m-2 flex-1 min-w-[300px]">
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-4">Leaderboard</h2>
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
            ) : (
                <ul className="space-y-2">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className={`flex justify-between py-2 px-2 ${index % 2 !== 0 ? "bg-yellow-100" : ""}`}
                        >
                            <span className="text-gray-800">{index + 1} {item.username}</span>
                            <span className="text-gray-600">{item.score}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Leaderboard;