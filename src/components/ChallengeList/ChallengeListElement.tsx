import {Challenge} from "../../views/CreateChallenge/CreateChallengeVM";
import React from "react";

const ChallengeListElement: React.FC<Challenge> = ({ name, image, description, end_date, is_team }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={"image."} alt={name} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="text-gray-600">{description}</p>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-gray-500 text-sm">{new Date(end_date).toLocaleDateString()}</span>
                    <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                            is_team ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                        }`}
                    >
                        {is_team ? 'Командный' : 'Индивидуальный'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChallengeListElement;