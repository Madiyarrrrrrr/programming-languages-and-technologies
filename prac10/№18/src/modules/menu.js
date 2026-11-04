// Меню столовой
export const menu = [
    { id: 1, name: "Борщ", price: 900 },
    { id: 2, name: "Куриный суп", price: 800 },
    { id: 3, name: "Плов", price: 1400 },
    { id: 4, name: "Котлета с пюре", price: 1300 },
    { id: 5, name: "Овощной салат", price: 700 },
    { id: 6, name: "Компот", price: 400 }
];

export function findMenuItem(id) {
    return menu.find(item => item.id === Number(id));
}