// viewmodels/HeaderViewModel.ts
export default class HeaderViewModel {
    userName: string = "БО СИНН";
    avatarUrl: string = "https://otvet.imgsmail.ru/download/312069193_ebf15da0e5e6fc05b1185a0b0a4b766d_800.png";

    // Проверка, авторизован ли пользователь
    isUserLoggedIn(): boolean {
        return Boolean(localStorage.getItem("accessToken"));
    }

    // Возвращает имя пользователя в зависимости от состояния авторизации
    get displayUserName(): string {
        return this.isUserLoggedIn() ? this.userName : "Вход";
    }

    // Возвращает аватар пользователя в зависимости от состояния авторизации
    get displayAvatarUrl(): string {
        return this.isUserLoggedIn()
            ? this.avatarUrl
            : "https://avatars.mds.yandex.net/i?id=f9f6fcf084be78649f9b0fac47b212d70e6870ce-5381901-images-thumbs&n=13";
    }
}