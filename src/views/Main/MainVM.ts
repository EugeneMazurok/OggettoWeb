// MainVM.ts
import { makeAutoObservable } from "mobx";

export default class MainVM {
    title: string;
    description: string;

    constructor() {
        this.title = "Главная страница";
        this.description = "Добро пожаловать на главную страницу!";
        makeAutoObservable(this);
    }

    handleButtonClick = () => {
        this.description = "Данные обновлены!";
    };
}