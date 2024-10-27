import React, { useEffect, useState } from "react";
import axios from "axios";
import ActivityGrid from "../../components/ActivityGrid/ActivityGrid";

const UserProfile: React.FC = () => {
    const [user, setUser] = useState({
        id: 0,
        username: "Не указано",
        email: "Не указано",
        first_name: "Не указано",
        full_name: "Не указано",
        profile_photo: "https://avatars.mds.yandex.net/i?id=f9f6fcf084be78649f9b0fac47b212d70e6870ce-5381901-images-thumbs&n=13", // Значение по умолчанию
        interests: "Не указаны",
        stats: "Не указаны",
        bio: "Не указано",
        registration_date: new Date().toISOString(),
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchUserProfile = async () => {
        setLoading(true);
        setError("");

        try {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                throw new Error("Токен доступа не найден");
            }

            const response = await axios.get('http://92.53.105.243:52/django/api/auth/profile/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            console.log("Полученные данные:", response.data);

            setUser((prevUser) => ({
                ...prevUser,
                ...response.data,
                profile_photo: response.data.profile_photo || prevUser.profile_photo, // Установим значение по умолчанию
            }));
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                await handleRefreshToken();
            } else {
                setError(error.message || "Ошибка при загрузке профиля");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                throw new Error("Токен обновления не найден");
            }

            const response = await axios.post('http://92.53.105.243:52/django/api/auth/token/refresh/', {
                refresh: refreshToken,
            });

            const newAccessToken = response.data.access;
            localStorage.setItem("accessToken", newAccessToken);

            await fetchUserProfile();
        } catch (error: any) {
            setError("Не удалось обновить токен, повторите попытку позже");
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    // Ждем, пока загрузятся данные
    if (loading) {
        return (
            <div className="text-center py-10">
                <div className="w-12 h-12 border-4 border-yellow-500 border-dashed rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-yellow-800">Загрузка профиля...</p>
            </div>
        );
    }

    // Обработка ошибок
    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    const handleCreateTeam = () => {
        console.log("Создание команды");
    };

    const handleLinkTelegram = () => {
        const telegramLink = `https://t.me/ogetto_bot?start=${user.id}`;
        window.open(telegramLink, "_blank"); // Открываем ссылку в новой вкладке
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-yellow-100 rounded-lg shadow-md mt-8">
            <h1 className="text-3xl font-bold text-yellow-800 text-center mb-4">Ваш профиль</h1>

            <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-500 mb-4">
                    <img
                        src={user.profile_photo || "https://via.placeholder.com/128"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>

                <h2 className="text-2xl font-semibold text-yellow-700">{user.full_name || user.username}</h2>
                <p className="text-yellow-600">@{user.username}</p>
            </div>

            <div className="mt-6">
                <div className="mb-4">
                    <span className="font-bold text-yellow-700">Email:</span> {user.email || "Не указано"}
                </div>

                <div className="mb-4">
                    <span className="font-bold text-yellow-700">Дата регистрации:</span> {new Date(user.registration_date).toLocaleDateString()}
                </div>

                {user.bio && (
                    <div className="mb-4">
                        <span className="font-bold text-yellow-700">О себе:</span> {user.bio}
                    </div>
                )}

                {user.full_name && (
                    <div className="mb-4">
                        <span className="font-bold text-yellow-700">ФИО:</span> {user.full_name}
                    </div>
                )}

                {user.interests && (
                    <div className="mb-4">
                        <span className="font-bold text-yellow-700">Интересы:</span> {user.interests}
                    </div>
                )}

                {user.stats && (
                    <div className="mb-4">
                        <span className="font-bold text-yellow-700">Статистика:</span> {user.stats}
                    </div>
                )}
            </div>
            <ActivityGrid userId={user.id} />
            <div className="mt-6 flex justify-center space-x-4">
                <button
                    onClick={handleCreateTeam}
                    className="py-2 px-4 bg-yellow-500 hover:bg-orange-500 text-white font-semibold rounded-md transition"
                >
                    Создать команду
                </button>

                <button
                    onClick={handleLinkTelegram}
                    className="py-2 px-4 bg-yellow-500 hover:bg-orange-500 text-white font-semibold rounded-md transition"
                >
                    Привязать Telegram
                </button>
            </div>
        </div>
    );
};

export default UserProfile;