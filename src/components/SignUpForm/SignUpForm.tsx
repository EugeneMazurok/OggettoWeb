import React, { useState } from "react";
import { RegistrationViewModel } from "./SignUpVM";
import { useNavigate } from "react-router-dom";

const RegistrationForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const viewModel = new RegistrationViewModel();
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate("/signin");
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        const success = await viewModel.handleRegisterSubmit({
            email,
            password,
            confirmPassword,
            username,
            full_name: fullName,
        });

        setLoading(false);

        if (success) {
            setSuccessMessage("Регистрация прошла успешно! Перенаправление на вход...");
            setTimeout(() => navigate("/signin"), 2000);
        } else {
            setErrorMessage("Ошибка регистрации. Пожалуйста, проверьте данные и попробуйте снова.");
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-8 p-6 bg-yellow-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-yellow-800 text-center mb-6">Регистрация</h2>

            {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Поле Username */}
                <div>
                    <label className="block text-yellow-800 font-semibold mb-1" htmlFor="register-username">
                        Username
                    </label>
                    <input
                        type="text"
                        id="register-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                </div>

                {/* Поле Full Name */}
                <div>
                    <label className="block text-yellow-800 font-semibold mb-1" htmlFor="register-fullname">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="register-fullname"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                </div>

                {/* Поле Email */}
                <div>
                    <label className="block text-yellow-800 font-semibold mb-1" htmlFor="register-email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="register-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                </div>

                {/* Поле Пароль */}
                <div>
                    <label className="block text-yellow-800 font-semibold mb-1" htmlFor="register-password">
                        Пароль
                    </label>
                    <input
                        type="password"
                        id="register-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                </div>

                {/* Подтверждение пароля */}
                <div>
                    <label className="block text-yellow-800 font-semibold mb-1" htmlFor="confirm-password">
                        Подтвердите пароль
                    </label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                </div>

                {/* Кнопка Submit с лоадером */}
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-yellow-500 hover:bg-orange-500 text-white font-semibold rounded-md transition flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="w-6 h-6 border-4 border-white border-dashed rounded-full animate-spin"></div>
                    ) : (
                        "Зарегистрироваться"
                    )}
                </button>
            </form>

            {/* Ссылка на вход */}
            <p className="mt-4 text-center text-yellow-800">
                Уже зарегистрированы?{" "}
                <span
                    onClick={handleLoginRedirect}
                    className="text-blue-600 cursor-pointer underline"
                >
                    Войдите!
                </span>
            </p>
        </div>
    );
};

export default RegistrationForm;