import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Challenge } from './CreateChallengeVM';

const CreateChallengeView: React.FC = () => {
    const [challenge, setChallenge] = useState<Challenge>({
        id: 0, // Добавлено поле id
        name: '',
        icon: null, // Теперь это будет File
        image: null, // Теперь это будет File
        description: '',
        end_date: '',
        start_date: '', // Добавлено поле start_date
        type: '',
        is_finished: false, // Добавлено поле is_finished
        is_team: false,
        creator_id: 0,
    });

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setChallenge((prev) => ({
                ...prev,
                creator_id: parsedUser.id,
            }));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setChallenge({
            ...challenge,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleDrop = (acceptedFiles: File[], field: 'icon' | 'image') => {
        if (acceptedFiles.length > 0) {
            setChallenge((prev) => ({
                ...prev,
                [field]: acceptedFiles[0], // Сохраняем файл вместо имени
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('creator_id', challenge.creator_id.toString());
        formData.append('description', challenge.description);
        formData.append('end_date', challenge.end_date);
        formData.append('start_date', challenge.start_date); // Добавлено поле start_date
        formData.append('name', challenge.name);
        formData.append('type', challenge.type);
        formData.append('is_finished', JSON.stringify(challenge.is_finished)); // Используем значение is_finished
        formData.append('is_team', JSON.stringify(challenge.is_team));

        if (challenge.icon) {
            formData.append('icon', challenge.icon); // Добавляем файл иконки
        }

        if (challenge.image) {
            formData.append('image', challenge.image); // Добавляем файл изображения
        }
        // Отправьте запрос на сервер с использованием fetch или axios
        try {
            let accesstoken = localStorage.getItem('accessToken');
            const response = await fetch('http://92.53.105.243:52/challenge/challenges', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accesstoken}`,
                },
                body: formData,
            });
            if (!response.ok) {
                console.error('Response status:', response.status);
                const text = await response.text();
                console.error('Response body:', text);
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log('Challenge created:', result);
        } catch (error) {
            console.error('Error creating challenge:', error);
        }
    };

    const { getRootProps: getRootPropsForIcon, getInputProps: getInputPropsForIcon } = useDropzone({
        onDrop: (acceptedFiles) => handleDrop(acceptedFiles, 'icon')
    });

    const { getRootProps: getRootPropsForImage, getInputProps: getInputPropsForImage } = useDropzone({
        onDrop: (acceptedFiles) => handleDrop(acceptedFiles, 'image')
    });

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form
                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
                onSubmit={handleSubmit}
            >
                <h2 className="text-3xl font-bold text-orange-600 mb-6">Создание челленджа</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold" htmlFor="name">Название</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                        value={challenge.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">Загрузка иконки</label>
                    <div {...getRootPropsForIcon()}
                         className="mt-1 p-4 border-2 border-dashed rounded cursor-pointer border-gray-300">
                        <input {...getInputPropsForIcon()} />
                        {challenge.icon ? (
                            <p className="text-gray-700">Выбранный
                                файл: {challenge.icon.name}</p>
                        ) : (
                            <p className="text-gray-500">Перетащите файл или кликните, чтобы загрузить</p>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">Загрузка изображения</label>
                    <div {...getRootPropsForImage()}
                         className="mt-1 p-4 border-2 border-dashed rounded cursor-pointer border-gray-300">
                        <input {...getInputPropsForImage()} />
                        {challenge.image ? (
                            <p className="text-gray-700">Выбранный
                                файл: {challenge.image.name}</p>
                        ) : (
                            <p className="text-gray-500">Перетащите файл или кликните, чтобы загрузить</p>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold" htmlFor="description">Описание</label>
                    <textarea
                        name="description"
                        id="description"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                        value={challenge.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold" htmlFor="start_date">Дата начала</label>
                    <input
                        type="datetime-local"
                        name="start_date" // Изменено на start_date
                        id="start_date" // Изменено на start_date
                        className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                        value={challenge.start_date} // Используем start_date
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold" htmlFor="end_date">Дата окончания</label>
                    <input
                        type="datetime-local"
                        name="end_date"
                        id="end_date"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                        value={challenge.end_date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold" htmlFor="type">Тип челленджа</label>
                    <input
                        type="text"
                        name="type"
                        id="type"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                        value={challenge.type}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name="is_team"
                            className="form-checkbox h-5 w-5 text-orange-600"
                            checked={challenge.is_team}
                            onChange={handleChange}
                        />
                        <span className="ml-2 text-gray-700 font-semibold">Командный челлендж</span>
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-orange-600 text-white p-2 rounded hover:bg-orange-700 transition"
                >
                    Создать челлендж
                </button>
            </form>
        </div>
    );
};

export default CreateChallengeView;
