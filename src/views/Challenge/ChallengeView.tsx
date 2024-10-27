import React from 'react';

interface Challenge {
    name: string;
    icon: string;
    image: string;
    description: string;
    end_date: string; // ISO формат
    type: string;
    is_team: boolean;
    creator_id: number;
}

interface ChallengePageProps {
    challenge: Challenge;
}

const ChallengePage: React.FC<ChallengePageProps> = ({ challenge }) => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{challenge.name}</h1>
            <div className="flex flex-col md:flex-row md:space-x-4">
                <img src={challenge.image} alt={challenge.name} className="w-full md:w-1/2 h-64 object-cover rounded-lg shadow-md" />
                <div className="md:w-1/2">
                    <div className="flex items-center mb-2">
                        <img src={challenge.icon} alt={challenge.name} className="h-8 w-8 mr-2" />
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${challenge.is_team ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                            {challenge.is_team ? 'Командный' : 'Индивидуальный'}
                        </span>
                    </div>
                    <p className="text-gray-700 mb-4">{challenge.description}</p>
                    <p className="text-gray-500">Дедлайн: {new Date(challenge.end_date).toLocaleDateString()}</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                        Принять участие
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChallengePage;