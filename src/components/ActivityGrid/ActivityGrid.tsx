// components/ActivityGrid.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format, getDay, parseISO, startOfWeek } from 'date-fns';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getColor = (successCount: number) => {
    if (successCount >= 4) return 'bg-green-700';
    if (successCount === 3) return 'bg-green-600';
    if (successCount === 2) return 'bg-green-400';
    if (successCount === 1) return 'bg-green-200';
    return 'bg-gray-200';
};

interface ActivityData {
    date: string;
    success_count: number;
    in_progress_count: number;
}

const defaultActivityData: ActivityData[] = [
    // Значения по умолчанию для отображения без данных
];

const generateGridData = (data: ActivityData[]): { [key: string]: (ActivityData | null)[][] } => {
    const grid: { [key: string]: (ActivityData | null)[][] } = {};
    data.forEach(day => {
        const date = parseISO(day.date);
        const week = startOfWeek(date, { weekStartsOn: 1 });
        const month = format(date, 'MMMM');
        const dayIndex = getDay(date);
        if (!grid[month]) grid[month] = [];
        const weekIndex = grid[month].findIndex(weekData => {
            const start = startOfWeek(new Date(weekData[0]?.date || ''), { weekStartsOn: 1 });
            return week.getTime() === start.getTime();
        });
        if (weekIndex === -1) grid[month].push(new Array(7).fill(null));
        const currentWeekIndex = grid[month].length - 1;
        grid[month][currentWeekIndex][dayIndex === 0 ? 6 : dayIndex - 1] = day;
    });
    return grid;
};

interface ActivityGridProps {
    userId: number;
}

const ActivityGrid: React.FC<ActivityGridProps> = ({ userId }) => {
    const [activityData, setActivityData] = useState<ActivityData[]>(defaultActivityData);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const fetchActivityData = async () => {
        setLoading(true);
        setError('');

        try {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) throw new Error("Токен доступа не найден");

            const response = await axios.get(`http://92.53.105.243:52/challenge/getStatistic/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setActivityData(response.data.length > 0 ? response.data : defaultActivityData);
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                await handleRefreshToken();
            } else {
                console.error('Ошибка загрузки данных активности:', error.message || error);
                setError(error.message || 'Ошибка при загрузке данных активности');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) throw new Error("Токен обновления не найден");

            const response = await axios.post('http://92.53.105.243:52/django/api/auth/token/refresh/', {
                refresh: refreshToken,
            });

            const newAccessToken = response.data.access;
            localStorage.setItem("accessToken", newAccessToken);

            await fetchActivityData(); // Повтор запроса с новым токеном
        } catch (error: any) {
            setError("Не удалось обновить токен, повторите попытку позже");
        }
    };

    useEffect(() => {
        fetchActivityData();
    }, [userId]);

    const gridData = generateGridData(activityData);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                <p className="text-blue-800 mt-4">Загрузка активности...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div className="p-4 overflow-x-auto">
            <div className="flex flex-col">
                {Object.entries(gridData).map(([month, weeks]) => (
                    <div key={month} className="mb-4">
                        <div className="text-xs font-semibold mb-1">{month}</div>
                        <div className="grid grid-cols-8 gap-2">
                            <div className="text-xs font-semibold"></div>
                            {daysOfWeek.map((day, index) => (
                                <div key={index} className="text-xs font-semibold text-gray-600">
                                    {day}
                                </div>
                            ))}
                        </div>
                        {weeks.map((days, weekIndex) => (
                            <div key={weekIndex} className="grid grid-cols-8 gap-2">
                                <div className="text-xs"></div>
                                {days.map((day, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded m-0.5 ${day ? getColor(day.success_count) : 'bg-gray-200'}`}
                                        title={day ? `Date: ${new Date(day.date).toLocaleDateString()} | Completed Challenges: ${day.success_count}` : 'No data'}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityGrid;