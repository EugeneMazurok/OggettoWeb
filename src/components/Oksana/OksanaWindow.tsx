import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

interface ChatMessage {
    id: number;
    text: string;
    role: "user" | "assistant"; // "assistant" - роль Оксаны
    timestamp: string;
}

interface ChatWindowProps {
    isOpen: boolean;
    onClose: () => void;
}

const DEFAULT_AVATAR = "https://avatars.mds.yandex.net/i?id=82b06b3c7b1a8855dcb66814f216757876204f8f-10995265-images-thumbs&n=13";

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false); // Индикатор "Оксана печатает"
    const messagesEndRef = useRef<HTMLDivElement>(null); // Реф для прокрутки вниз

    useEffect(() => {
        const savedMessages = localStorage.getItem("chatMessages");
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        } else {
            // Первое сообщение от Оксаны, если истории сообщений нет
            const initialMessage: ChatMessage = {
                id: Date.now(),
                text: "Здравствуйте! Как я могу помочь вам сегодня?",
                role: "assistant",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages([initialMessage]);
            localStorage.setItem("chatMessages", JSON.stringify([initialMessage]));
        }
    }, []);

    // Прокрутка вниз при добавлении нового сообщения
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Функция для обновления токена
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
            return newAccessToken; // Возвращаем новый токен
        } catch (error) {
            console.error("Не удалось обновить токен:", error);
            return null; // Возвращаем null в случае ошибки
        }
    };

    const handleSendMessage = async () => {
        if (input.trim() === "") return;

        const newMessage: ChatMessage = {
            id: Date.now(),
            text: input,
            role: "user",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // Добавляем новое сообщение в историю
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
        setInput("");

        // Получаем токен доступа из локального хранилища
        let accessToken = localStorage.getItem("accessToken");

        // Формируем тело запроса, исключая первое сообщение от Оксаны
        const payload = {
            messages: updatedMessages.map((msg) => ({
                role: msg.role === "user" ? "user" : "assistant",
                content: msg.text,
            })).filter(msg => msg.content !== "Здравствуйте! Как я могу помочь вам сегодня?"), // Исключаем первое сообщение
        };

        // Отправка сообщения на сервер
        try {
            const response = await axios.post('http://92.53.105.243:52/django/assistent/get_answer/',
                { messages: payload.messages }, // Отправляем массив сообщений как тело запроса
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Добавляем токен в заголовок
                        'Content-Type': 'application/json', // Указываем тип содержимого
                    },
                }
            );

            const assistantReply: ChatMessage = {
                id: Date.now() + 1,
                text: response.data.answer,
                role: "assistant",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            // Обновляем состояние чата с ответом ассистента
            const finalMessages = [...updatedMessages, assistantReply];
            setMessages(finalMessages);
            localStorage.setItem("chatMessages", JSON.stringify(finalMessages));

        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                // Если ответ 401, пробуем обновить токен
                console.warn("Токен истек, пробуем обновить...");
                accessToken = await handleRefreshToken();

                if (accessToken) {
                    // Если токен обновлен, повторяем запрос
                    try {
                        const response = await axios.post('http://92.53.105.243:52/django/assistent/get_answer/',
                            { messages: payload.messages }, // Отправляем массив сообщений как тело запроса
                            {
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`,
                                    'Content-Type': 'application/json', // Указываем тип содержимого
                                },
                            }
                        );

                        const assistantReply: ChatMessage = {
                            id: Date.now() + 1,
                            text: response.data.answer,
                            role: "assistant",
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        };

                        // Обновляем состояние чата с ответом ассистента
                        const finalMessages = [...updatedMessages, assistantReply];
                        setMessages(finalMessages);
                        localStorage.setItem("chatMessages", JSON.stringify(finalMessages));

                    } catch (retryError) {
                        console.error("Ошибка при повторном запросе:", retryError);
                        const errorReply: ChatMessage = {
                            id: Date.now() + 2,
                            text: "Извините, произошла ошибка при повторной попытке. Пожалуйста, попробуйте позже.",
                            role: "assistant",
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        };
                        const finalMessages = [...updatedMessages, errorReply];
                        setMessages(finalMessages);
                        localStorage.setItem("chatMessages", JSON.stringify(finalMessages));
                    }
                } else {
                    // Если не удалось обновить токен
                    const errorReply: ChatMessage = {
                        id: Date.now() + 2,
                        text: "Не удалось обновить токен, пожалуйста, войдите снова.",
                        role: "assistant",
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    };
                    const finalMessages = [...updatedMessages, errorReply];
                    setMessages(finalMessages);
                    localStorage.setItem("chatMessages", JSON.stringify(finalMessages));
                }
            } else {
                console.error("Ошибка при отправке сообщения:", error);
                const errorReply: ChatMessage = {
                    id: Date.now() + 2,
                    text: "Извините, произошла ошибка. Пожалуйста, попробуйте позже.",
                    role: "assistant",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                const finalMessages = [...updatedMessages, errorReply];
                setMessages(finalMessages);
                localStorage.setItem("chatMessages", JSON.stringify(finalMessages));
            }
        }

        setIsTyping(true);
        // Имитация задержки для отображения "Оксана печатает..."
        setTimeout(() => {
            setIsTyping(false);
        }, 2000);
    };

    if (!isOpen) return null;


    return (
        <div className={`fixed bottom-16 right-4 bg-white rounded-lg shadow-lg p-4 w-[400px] h-[500px] flex flex-col`}>
            <h2 className="text-lg font-bold">Чат с Оксаной</h2>
            <div className="flex-grow overflow-y-auto border border-gray-300 p-2 flex flex-col">
                {messages.map((msg) => (
                    <div key={msg.id}
                         className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
                        {msg.role === "assistant" && (
                            <img src={DEFAULT_AVATAR} alt="Avatar" className="w-8 h-8 rounded-full mr-2"/>
                        )}
                        <div
                            className={`p-2 rounded ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
                            <p>{msg.text}</p>
                            <span className="text-xs text-gray-500">{msg.timestamp}</span>
                        </div>
                        {msg.role === "user" && (
                            <img
                                src={"https://otvet.imgsmail.ru/download/312069193_ebf15da0e5e6fc05b1185a0b0a4b766d_800.png"}
                                alt="Avatar" className="w-8 h-8 rounded-full ml-2"/>
                        )}
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start mb-2">
                        <img src={DEFAULT_AVATAR} alt="Avatar" className="w-8 h-8 rounded-full mr-2"/>
                        <div className="p-2 bg-gray-300 rounded">
                            <p>Оксана печатает...</p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef}/>
                {/* Ссылка для прокрутки */}
            </div>
            <div className="mt-2 flex items-center">
                <textarea
                    className="border w-full p-2 resize-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Напишите сообщение..."
                    rows={2}
                />
                <button
                    className="ml-2 bg-blue-500 text-white p-2 rounded-full flex items-center justify-center"
                    onClick={handleSendMessage}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M3 12l2-2m0 0l8-8m-8 8h18m-9 9l9-9-9-9"/>
                    </svg>
                </button>
            </div>
            <button
                className="mt-2 text-red-500"
                onClick={onClose}
            >
                Закрыть
            </button>
        </div>
    );
};

export default ChatWindow;