
from collections import deque

orders = deque([
    {"number": 101, "name": "Ноутбук"},
    {"number": 102, "name": "Мышь"},
    {"number": 103, "name": "Клавиатура"}
])

while True:
    print("\n--- СИСТЕМА ЗАКАЗОВ ---")
    print("1. Показать очередь")
    print("2. Выдать первый заказ")
    print("3. Найти заказ по номеру")
    print("4. Отчет об оставшихся заказах")
    print("5. Добавить заказ")
    print("0. Выход")

    choice = input("Выберите действие: ")

    if choice == "1":
        if orders:
            for order in orders:
                print(f"№{order['number']} — {order['name']}")
        else:
            print("Очередь пуста.")

    elif choice == "2":
        if orders:
            order = orders.popleft()
            print(f"Выдан заказ №{order['number']}: {order['name']}")
        else:
            print("Нет заказов.")

    elif choice == "3":
        try:
            number = int(input("Введите номер заказа: "))
            found = next((o for o in orders
                          if o["number"] == number), None)

            if found:
                print("Заказ найден:", found)
            else:
                print("Заказ не найден.")
        except ValueError:
            print("Введите правильный номер.")

    elif choice == "4":
        print("Количество оставшихся заказов:", len(orders))

        for order in orders:
            print(f"№{order['number']} — {order['name']}")

        if not orders:
            print("Очередь пуста.")

    elif choice == "5":
        try:
            number = int(input("Номер нового заказа: "))

            if any(o["number"] == number for o in orders):
                print("Такой номер уже существует.")
            else:
                name = input("Название заказа: ").strip()

                if name:
                    orders.append({
                        "number": number,
                        "name": name
                    })
                    print("Заказ добавлен.")
                else:
                    print("Название не может быть пустым.")

        except ValueError:
            print("Введите целое число.")

    elif choice == "0":
        break

    else:
        print("Неверный выбор.")
