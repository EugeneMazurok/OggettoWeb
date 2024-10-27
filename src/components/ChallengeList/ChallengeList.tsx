import {useEffect, useState} from "react";
import {Challenge} from "../../views/CreateChallenge/CreateChallengeVM";
import ChallengeListElement from "./ChallengeListElement";

const ChallengeList: React.FC = () => {
    const [challenges, setChallenges] = useState<Challenge[]>([]);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Список челленджей</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {challenges.map((challenge) => (
                    <ChallengeListElement key={challenge.name} {...challenge} />
                ))}
            </div>
        </div>
    );
};

export default ChallengeList;