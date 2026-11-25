
from collections import deque

normal_queue = deque()
urgent_queue = deque()
task_id = 1

while True:
    print("\n--- ПЛАНИРОВЩИК ЗАДАЧ ---")
    print("1. Добавить обычную задачу")
    print("2. Добавить срочную задачу")
    print("3. Выполнить следующую задачу")
    print("4. Показать все задачи")
    print("5. Показать количество задач")
    print("0. Выход")

    choice = input("Выберите действие: ")

    if choice == "1":
        name = input("Название обычной задачи: ").strip()

        if name:
            normal_queue.append({
                "id": task_id,
                "name": name
            })
            print("Обычная задача добавлена.")
            task_id += 1
        else:
            print("Название не может быть пустым.")

    elif choice == "2":
        name = input("Название срочной задачи: ").strip()

        if name:
            urgent_queue.append({
                "id": task_id,
                "name": name
            })
            print("Срочная задача добавлена.")
            task_id += 1
        else:
            print("Название не может быть пустым.")

    elif choice == "3":
        if urgent_queue:
            task = urgent_queue.popleft()
            print("Выполняется СРОЧНАЯ задача:")
        elif normal_queue:
            task = normal_queue.popleft()
            print("Выполняется обычная задача:")
        else:
            print("Нет задач для выполнения.")
            continue

        print(f"Задача №{task['id']}: {task['name']}")

    elif choice == "4":
        print("\nСРОЧНЫЕ ЗАДАЧИ:")
        if urgent_queue:
            for task in urgent_queue:
                print(f"№{task['id']} — {task['name']}")
        else:
            print("Нет срочных задач.")

        print("\nОБЫЧНЫЕ ЗАДАЧИ:")
        if normal_queue:
            for task in normal_queue:
                print(f"№{task['id']} — {task['name']}")
        else:
            print("Нет обычных задач.")

    elif choice == "5":
        print("Срочных задач:", len(urgent_queue))
        print("Обычных задач:", len(normal_queue))
        print("Всего задач:", len(urgent_queue) + len(normal_queue))

    elif choice == "0":
        break

    else:
        print("Неверный выбор.")
