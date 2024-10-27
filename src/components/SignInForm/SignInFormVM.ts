import axios from 'axios';

export class LoginViewModel {
    async handleLoginSubmit(
        username: string,
        full_name: string,
        email: string,
        password: string
    ): Promise<boolean> {
        if (!username || !full_name || !email || !password) {
            console.log("Пожалуйста, заполните все поля");
            return false;
        }

        try {
            const response = await axios.post('http://92.53.105.243:52/django/api/auth/login/', {
                username,
                full_name,
                email,
                password
            });

            const {access, refresh} = response.data;
            console.log(response.data)
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            console.log("Логин успешен");
            return true;
        } catch (error) {
            console.error("Ошибка при авторизации:", error);
            return false;
        }
    }
}