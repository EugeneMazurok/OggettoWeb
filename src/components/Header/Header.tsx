// components/Header.tsx
import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import HeaderViewModel from "./HeaderVM";

const Header: React.FC = () => {
    const [viewModel] = useState(new HeaderViewModel());
    const navigate = useNavigate();

    const handleProfileClick = () => {
        if (viewModel.isUserLoggedIn()) {
            navigate("/profile");
        } else {
            navigate("/signin");
        }
    };

    return (
        <header className="w-full flex flex-wrap items-center justify-between mt-4 py-4 px-4 sm:px-6 lg:px-8 bg-yellow-500 text-gray-900 shadow-md">
            {/* Логотип */}
            <Link to="/" className="flex items-center space-x-2 mb-2 sm:mb-0">
                <img
                    src="https://ictis.sfedu.ru/wp-content/uploads/2023/02/A5M7Ejid6Uo.jpg"
                    alt="Logo"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                />
            </Link>

            {/* Навигационные кнопки */}
            <div className="flex flex-wrap items-center justify-center space-x-2 sm:space-x-4 mb-2 sm:mb-0">
                <Link
                    to="/my_challenges"
                    className="bg-yellow-400 hover:bg-yellow-600 text-white font-semibold py-1 px-2 sm:py-2 sm:px-4 rounded-md transition text-sm sm:text-base"
                >
                    Мои челленджи
                </Link>
                <Link
                    to="/create_challenge"
                    className="bg-orange-500 hover:bg-orange-700 text-white font-semibold py-1 px-2 sm:py-2 sm:px-4 rounded-md transition text-sm sm:text-base"
                >
                    Создать челлендж
                </Link>
            </div>

            {/* Аватар и имя пользователя */}
            <div
                onClick={handleProfileClick}
                className="flex items-center space-x-2 sm:space-x-4 cursor-pointer"
            >
                <span className="font-semibold text-sm sm:text-base">
                    {viewModel.displayUserName}
                </span>
                <img
                    src={viewModel.displayAvatarUrl}
                    alt="User Avatar"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-yellow-300"
                />
            </div>
        </header>
    );
};

export default Header;