export interface CommunityMember {
  id: string;
  name: string;
  role: 'pastor' | 'minister' | 'member';
  gifts: string[];
  joinedYear?: number;
}

export const communityMembers: CommunityMember[] = [
  { id: 'm-01', name: 'Сергій Коваль',       role: 'pastor',   gifts: ['Проповідь', 'Пастирство', 'Лідерство'],            joinedYear: 2018 },
  { id: 'm-02', name: 'Анна Петрова',         role: 'minister', gifts: ['Поклоніння', 'Музика', 'Жіноче служіння'],          joinedYear: 2019 },
  { id: 'm-03', name: 'Ігор Козлов',          role: 'minister', gifts: ['Домашні групи', 'Євангелізм', 'Учнівство'],          joinedYear: 2020 },
  { id: 'm-04', name: 'Дмитро Соколов',       role: 'minister', gifts: ['Молодь', 'Медіа', 'Технології'],                    joinedYear: 2020 },
  { id: 'm-05', name: 'Наталія Волкова',      role: 'minister', gifts: ['Дитяче служіння', 'Освіта', 'Творчість'],           joinedYear: 2019 },
  { id: 'm-06', name: 'Михайло Криловий',     role: 'member',   gifts: ['Допомога', 'Організація', 'Гостинність'],            joinedYear: 2021 },
  { id: 'm-07', name: 'Олена Крилова',        role: 'member',   gifts: ['Гостинність', 'Молитва', 'Добродійність'],           joinedYear: 2021 },
  { id: 'm-08', name: 'Іван Мельник',         role: 'member',   gifts: ['Технічне служіння', 'Музика'],                       joinedYear: 2022 },
  { id: 'm-09', name: 'Марія Шевченко',       role: 'member',   gifts: ['Переклад', 'Освіта', 'Молодь'],                      joinedYear: 2022 },
  { id: 'm-10', name: 'Олексій Бойко',        role: 'member',   gifts: ['Євангелізм', 'Підтримка', 'Спорт'],                  joinedYear: 2022 },
  { id: 'm-11', name: 'Тетяна Лисенко',       role: 'member',   gifts: ['Діаконія', 'Молитва', 'Піклування'],                 joinedYear: 2023 },
  { id: 'm-12', name: 'Роман Гриценко',       role: 'member',   gifts: ['Музика', 'Творчість', 'Відео'],                       joinedYear: 2023 },
  { id: 'm-13', name: 'Катерина Руденко',     role: 'member',   gifts: ['Психологія', 'Молодь', 'Підтримка'],                  joinedYear: 2023 },
  { id: 'm-14', name: 'Василь Гончар',        role: 'member',   gifts: ['Технічне служіння', 'Будівництво', 'Допомога'],       joinedYear: 2024 },
  { id: 'm-15', name: 'Надія Марченко',       role: 'member',   gifts: ['Творчість', 'Вишивка', 'Мистецтво'],                  joinedYear: 2024 },
  { id: 'm-16', name: 'Юрій Павленко',        role: 'member',   gifts: ['Учнівство', 'Молодь', 'Спорт'],                       joinedYear: 2024 },
  { id: 'm-17', name: 'Ірина Захарченко',     role: 'member',   gifts: ['Поклоніння', 'Музика', 'Молодь'],                     joinedYear: 2025 },
  { id: 'm-18', name: 'Сергій Тимченко',      role: 'member',   gifts: ['IT', 'Технології', 'Медіа'],                          joinedYear: 2025 },
  { id: 'm-19', name: 'Оксана Приходько',     role: 'member',   gifts: ['Добродійність', 'Piклування', 'Гостинність'],         joinedYear: 2025 },
  { id: 'm-20', name: 'Антон Семененко',      role: 'member',   gifts: ['Євангелізм', 'Фотографія', 'Медіа'],                  joinedYear: 2026 },
];
