// App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import MainView from "./views/Main/MainView";
import RegistrationForm from "./components/SignUpForm/SignUpForm";
import SignInForm from "./components/SignInForm/SignInForm";
import UserProfile from "./views/Profile/ProfileView";
import CreateChallengeView from "./views/CreateChallenge/CreateChallengeView";
import MyChallenges from "./views/MyChallenges/MyChallenges";


function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center">
                <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <Header />

                    {/* Определение маршрутов */}
                    <Routes>
                        <Route path="/" element={<MainView/>} />
                        <Route path="/register" element={<RegistrationForm/>}/>
                        <Route path="/signin" element={<SignInForm/>}/>
                        <Route path="/profile" element={<UserProfile/>}/>
                        <Route path="/create_challenge" element={<CreateChallengeView/>}/>
                        <Route path="/my_challenges" element={<MyChallenges/>}/>
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
