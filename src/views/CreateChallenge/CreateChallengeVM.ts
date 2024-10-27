export interface Challenge {
    id: number; // Добавлено поле id
    name: string;
    icon: File | null; // Теперь это будет File
    image: File | null; // Теперь это будет File
    description: string;
    start_date: string; // Добавлено поле start_date
    end_date: string; // ISO формат
    type: string;
    is_team: boolean;
    is_finished: boolean; // Добавлено поле is_finished
    creator_id: number; // Предполагается, что ID
}