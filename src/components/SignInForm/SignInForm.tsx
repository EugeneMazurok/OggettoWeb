import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {LoginViewModel} from "./SignInFormVM";

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const viewModel = new LoginViewModel();
    const navigate = useNavigate();

    const handleRegisterRedirect = () => {
        navigate("/register");
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        const success = await viewModel.handleLoginSubmit(username, fullName, email, password);
        setLoading(false);

        if (success) {
            navigate("/");
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-8 p-6 bg-yellow-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-yellow-800 text-center mb-6">Вход</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Поле Username */}
                <div>
                    <label className="block text-yellow-800 font-semibold mb-1" htmlFor="login-username">
                        Имя пользователя
                    </label>
                    <input
                        type="text"
                        id="login-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                </div>

                {/* Поле Полное имя */}
                <div>
                    <label className="block text-yellow-800 font-semibold mb-1" htmlFor="login-fullname">
                        Полное имя
                    </label>
                    <input
                        type="text"
                        id="login-fullname"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                </div>

                {/* Поле Email */}
                <div>
                    <label className="block text-yellow-800 font-semibold mb-1" htmlFor="login-email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="login-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                </div>

                {/* Поле Пароль */}
                <div>
                    <label className="block text-yellow-800 font-semibold mb-1" htmlFor="login-password">
                        Пароль
                    </label>
                    <input
                        type="password"
                        id="login-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                </div>

                {/* Кнопка Войти */}
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-yellow-500 hover:bg-orange-500 text-white font-semibold rounded-md transition"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <div className="w-6 h-6 border-4 border-white border-dashed rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        "Войти"
                    )}
                </button>
            </form>

            {/* Ссылка на регистрацию */}
            <p className="mt-4 text-center text-yellow-800">
                Вас нет на платформе?{" "}
                <span
                    onClick={handleRegisterRedirect}
                    className="text-blue-600 cursor-pointer underline"
                >
                    Зарегистрируйтесь
                </span>
            </p>
        </div>
    );
};

export default LoginForm;