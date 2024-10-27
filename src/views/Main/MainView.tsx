// MainView.tsx
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import Header from "../../components/Header/Header";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import ChatWindow from "../../components/Oksana/OksanaWindow";

const MainView: React.FC = observer(() => {
    const [isChatOpen, setChatOpen] = useState(false);

    const handleChatOpen = () => {
        setChatOpen(true);
    };

    const handleChatClose = () => {
        setChatOpen(false);
    };

    return (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen">
            <div className="flex flex-wrap justify-center w-full max-w-7xl mt-4">
                <Leaderboard />
                <Leaderboard />
            </div>
            <div
                className="fixed bottom-4 right-4 cursor-pointer bg-blue-500 text-white p-3 rounded-full shadow-lg flex items-center"
                onClick={handleChatOpen}
            >
                <img
                    src="https://avatars.mds.yandex.net/i?id=82b06b3c7b1a8855dcb66814f216757876204f8f-10995265-images-thumbs&n=13" // Аватарка Оксаны
                    alt="Avatar"
                    className="w-10 h-10 rounded-full mr-2"
                />
                <span>У вас новое сообщение</span>
            </div>
            <ChatWindow isOpen={isChatOpen} onClose={handleChatClose} /> {/* Используем наш компонент чата */}
        </div>
    );
});

export default MainView;