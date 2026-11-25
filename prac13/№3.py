
books = [
    "Война и мир",
    "Преступление и наказание",
    "Мастер и Маргарита",
    "Гарри Поттер"
]

while True:
    print("\n--- КАТАЛОГ КНИГ ---")
    print("1. Показать все книги")
    print("2. Найти книгу")
    print("3. Удалить книгу")
    print("4. Добавить книгу")
    print("0. Выход")

    choice = input("Выберите действие: ")

    if choice == "1":
        if books:
            for book in books:
                print("-", book)
        else:
            print("Каталог пуст.")

    elif choice == "2":
        search = input("Введите название книги: ").lower()
        found = [b for b in books if search in b.lower()]

        if found:
            print("Найденные книги:", found)
        else:
            print("Книга не найдена.")

    elif choice == "3":
        name = input("Введите книгу для удаления: ").lower()
        found = next((b for b in books if b.lower() == name), None)

        if found:
            books.remove(found)
            print("Книга удалена.")
        else:
            print("Такой книги нет.")

    elif choice == "4":
        name = input("Введите новую книгу: ").strip()

        if name and name.lower() not in [b.lower() for b in books]:
            books.append(name)
            print("Книга добавлена.")
        else:
            print("Название пустое или книга уже существует.")

    elif choice == "0":
        break

    else:
        print("Неверный выбор.")
