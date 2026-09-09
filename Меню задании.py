import os
import sys
import math


def clear_screen():
    """Очистка консоли"""
    os.system('cls' if os.name == 'nt' else 'clear')


def print_header(title):
    """Красивая рамка для заголовков"""
    print("\n" + "=" * 55)
    print(f"║ {title.center(51)} ║")
    print("=" * 55)


# =========================================================
# ЗАДАНИЕ №3
# =========================================================

def task_3():
    clear_screen()
    print_header("ЗАДАНИЕ №3: РАСЧЕТ ПРЯМОУГОЛЬНИКА")

    try:
        length = float(input("  ► Введите длину прямоугольника: "))
        width = float(input("  ► Введите ширину прямоугольника: "))

        if length <= 0 or width <= 0:
            print("\n  [!] Ошибка: стороны должны быть больше нуля!")
            return

        S = length * width
        P = 2 * (length + width)
        diagonal = math.sqrt(length ** 2 + width ** 2)

        print("\n" + "-" * 55)
        print("  ✔ Результаты вычислений:")
        print(f"    • Площадь (S)   : {S:,.2f}")
        print(f"    • Периметр (P)  : {P:,.2f}")
        print(f"    • Диагональ     : {diagonal:,.2f}")
        print("-" * 55)

    except ValueError:
        print("\n  [!] Ошибка: пожалуйста, вводите только числа.")


# =========================================================
# ЗАДАНИЕ №13
# =========================================================

def task_13():
    clear_screen()
    print_header("ЗАДАНИЕ №13: РАСЧЕТ ЗАРАБОТНОЙ ПЛАТЫ")

    try:
        salary = float(input("  ► Введите заработную плату: "))
        bonus_percent = float(input("  ► Введите процент премии: "))

        if salary < 0 or bonus_percent < 0:
            print("\n  [!] Ошибка: значения не могут быть отрицательными!")
            return

        bonus = salary * bonus_percent / 100
        salary_with_bonus = salary + bonus
        income_tax = salary_with_bonus * 10 / 100

        print("\n" + "-" * 55)
        print("  ✔ Результаты вычислений:")
        print(f"    • Премия              : {bonus:,.2f}")
        print(f"    • Зарплата с премией  : {salary_with_bonus:,.2f}")
        print(f"    • Подоходный налог 10%: {income_tax:,.2f}")
        print("-" * 55)

    except ValueError:
        print("\n  [!] Ошибка: пожалуйста, вводите только числа.")


# =========================================================
# ЗАДАНИЕ №18
# =========================================================

def task_18():
    clear_screen()
    print_header("ЗАДАНИЕ №18: ПЯТИЗНАЧНОЕ ЧИСЛО")

    try:
        num = int(input("  ► Введите пятизначное целое число: "))

        if not (10000 <= abs(num) <= 99999):
            print("\n  [!] Ошибка: число должно содержать ровно 5 цифр!")
            return

        num = abs(num)

        ten_thousands = num // 10000
        thousands = (num % 10000) // 1000
        hundreds = (num % 1000) // 100
        tens = (num % 100) // 10
        units = num % 10

        sum_digits = (
            ten_thousands
            + thousands
            + hundreds
            + tens
            + units
        )

        reversed_number = (
            units * 10000
            + tens * 1000
            + hundreds * 100
            + thousands * 10
            + ten_thousands
        )

        print("\n" + "-" * 55)
        print("  ✔ Результаты вычислений:")
        print(f"    • Сумма цифр            : {sum_digits}")
        print(f"    • Обратное число        : {reversed_number}")
        print("-" * 55)

    except ValueError:
        print("\n  [!] Ошибка: введено не целое число!")


# =========================================================
# ГЛАВНОЕ МЕНЮ
# =========================================================

def main_menu():

    while True:
        clear_screen()

        print("=" * 55)
        print("║" + " ГЛАВНОЕ МЕНЮ ЛАБОРАТОРНОЙ РАБОТЫ ".center(53) + "║")
        print("=" * 55)

        print("  [1] Задание №3  (Прямоугольник)")
        print("  [2] Задание №13 (Заработная плата и премия)")
        print("  [3] Задание №18 (Пятизначное число)")

        print("  [0] Выход из программы")

        print("=" * 55)

        choice = input("  ► Выберите номер пункта меню: ").strip()

        if choice == '1':
            task_3()

        elif choice == '2':
            task_13()

        elif choice == '3':
            task_18()

        elif choice == '0':
            clear_screen()
            print("\n  Программа успешно завершена. Всего доброго!\n")
            sys.exit()

        else:
            print("\n  [!] Неверный пункт меню.")

        input("\n  Нажмите Enter для возврата в меню...")


# =========================================================
# ЗАПУСК ПРОГРАММЫ
# =========================================================

if __name__ == "__main__":
    main_menu()
