import axios from "axios";

interface RegistrationData {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
    full_name: string;
}

class RegistrationViewModel {
    async handleRegisterSubmit(data: RegistrationData): Promise<boolean> {
        const { email, password, confirmPassword, username, full_name } = data;

        if (password !== confirmPassword) {
            console.log("Пароли не совпадают");
            return false;
        }

        if (!email || !password || !username || !full_name) {
            console.log("Пожалуйста, заполните все поля");
            return false;
        }

        try {
            await axios.post('http://92.53.105.243:52/django/api/auth/register/', {
                email,
                password,
                username,
                full_name,
            });
            console.log("Регистрация успешна");
            return true;
        } catch (error) {
            console.error("Ошибка регистрации:", error);
            return false;
        }
    }
}

export { RegistrationViewModel };