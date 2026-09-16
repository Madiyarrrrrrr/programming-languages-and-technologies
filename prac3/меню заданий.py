import os
import sys


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
    print_header("ЗАДАНИЕ №3: АВТОМОБИЛЬ")

    try:
        brand = input("  ► Введите марку автомобиля: ").strip()
        model = input("  ► Введите модель автомобиля: ").strip()
        year = int(input("  ► Введите год выпуска: "))
        speed = float(input("  ► Введите начальную скорость: "))

        if not brand or not model:
            print("\n  [!] Ошибка: марка и модель не могут быть пустыми!")
            return

        if year <= 0:
            print("\n  [!] Ошибка: год должен быть больше нуля!")
            return

        if speed < 0:
            print("\n  [!] Ошибка: скорость не может быть отрицательной!")
            return

        class Car:
            def __init__(self, brand, model, year, speed):
                self.brand = brand
                self.model = model
                self.year = year
                self.speed = speed

            def accelerate(self, value):
                if value > 0:
                    self.speed += value

            def stop(self):
                self.speed = 0

            def show_info(self):
                print(f"    • Марка автомобиля : {self.brand}")
                print(f"    • Модель            : {self.model}")
                print(f"    • Год выпуска       : {self.year}")
                print(f"    • Скорость          : {self.speed:.2f} км/ч")

        car = Car(brand, model, year, speed)

        print("\n" + "-" * 55)
        print("  ✔ Информация об автомобиле:")
        car.show_info()

        accelerate_value = float(
            input("\n  ► На сколько увеличить скорость: ")
        )

        if accelerate_value <= 0:
            print("\n  [!] Ошибка: значение должно быть больше нуля!")
            return

        car.accelerate(accelerate_value)

        print("\n  ✔ После ускорения:")
        print(f"    • Текущая скорость : {car.speed:.2f} км/ч")

        car.stop()

        print("\n  ✔ После остановки:")
        print(f"    • Текущая скорость : {car.speed:.2f} км/ч")
        print("-" * 55)

    except ValueError:
        print("\n  [!] Ошибка: пожалуйста, вводите корректные данные.")


# =========================================================
# ЗАДАНИЕ №12
# =========================================================

def task_12():
    clear_screen()
    print_header("ЗАДАНИЕ №12: КОРЗИНА ПОКУПОК")

    class ShoppingCart:
        def __init__(self):
            self.items = []

        def add_item(self, name, price, quantity):
            self.items.append({
                "name": name,
                "price": price,
                "quantity": quantity
            })

        def total(self):
            return sum(
                item["price"] * item["quantity"]
                for item in self.items
            )

        def show_cart(self):
            if not self.items:
                print("\n  Корзина пуста.")
                return

            print("\n" + "-" * 55)
            print("  ✔ Содержимое корзины:")

            for item in self.items:
                cost = item["price"] * item["quantity"]

                print(
                    f"    • {item['name']} — "
                    f"{item['quantity']} шт. × "
                    f"{item['price']:.2f} = {cost:.2f}"
                )

            print("-" * 55)
            print(f"    • Итоговая стоимость: {self.total():.2f}")
            print("-" * 55)

    cart = ShoppingCart()

    try:
        while True:
            print("\n  Добавление товара в корзину")
            print("  Для завершения введите '0' вместо названия.")

            name = input("\n  ► Название товара: ").strip()

            if name == "0":
                break

            if not name:
                print("\n  [!] Ошибка: название товара не может быть пустым!")
                continue

            price = float(input("  ► Цена товара: "))
            quantity = int(input("  ► Количество: "))

            if price <= 0:
                print("\n  [!] Ошибка: цена должна быть больше нуля!")
                continue

            if quantity <= 0:
                print("\n  [!] Ошибка: количество должно быть больше нуля!")
                continue

            cart.add_item(name, price, quantity)

            print("\n  ✔ Товар успешно добавлен!")

        cart.show_cart()

    except ValueError:
        print("\n  [!] Ошибка: пожалуйста, вводите корректные числа.")


# =========================================================
# ЗАДАНИЕ №20
# =========================================================

def task_20():
    clear_screen()
    print_header("ЗАДАНИЕ №20: ЭЛЕКТРОННЫЙ КОШЕЛЁК")

    class ElectronicWallet:
        def __init__(self, owner, balance=0, pin="0000"):
            self.owner = owner
            self.__balance = balance
            self.__pin = pin
            self.__history = []

        def check_pin(self, pin):
            return pin == self.__pin

        def deposit(self, amount, pin):
            if not self.check_pin(pin):
                print("\n  [!] Неверный PIN!")
                return False

            if amount <= 0:
                print("\n  [!] Сумма должна быть больше нуля!")
                return False

            self.__balance += amount
            self.__history.append(f"Пополнение: +{amount:.2f}")

            print(f"\n  ✔ Кошелёк пополнен на {amount:.2f}")
            return True

        def pay(self, amount, pin):
            if not self.check_pin(pin):
                print("\n  [!] Неверный PIN!")
                return False

            if amount <= 0:
                print("\n  [!] Сумма должна быть больше нуля!")
                return False

            if amount > self.__balance:
                print("\n  [!] Недостаточно средств!")
                return False

            self.__balance -= amount
            self.__history.append(f"Оплата: -{amount:.2f}")

            print(f"\n  ✔ Оплата выполнена: {amount:.2f}")
            return True

        def transfer(self, other_wallet, amount, pin):
            if not self.check_pin(pin):
                print("\n  [!] Неверный PIN!")
                return False

            if amount <= 0:
                print("\n  [!] Сумма должна быть больше нуля!")
                return False

            if amount > self.__balance:
                print("\n  [!] Недостаточно средств для перевода!")
                return False

            self.__balance -= amount
            other_wallet.__balance += amount

            self.__history.append(
                f"Перевод {other_wallet.owner}: -{amount:.2f}"
            )

            other_wallet.__history.append(
                f"Получение от {self.owner}: +{amount:.2f}"
            )

            print(
                f"\n  ✔ Перевод {amount:.2f} "
                f"пользователю {other_wallet.owner} выполнен!"
            )

            return True

        def get_balance(self, pin):
            if not self.check_pin(pin):
                print("\n  [!] Неверный PIN!")
                return None

            return self.__balance

        def show_history(self, pin):
            if not self.check_pin(pin):
                print("\n  [!] Неверный PIN!")
                return

            print("\n" + "-" * 55)
            print("  ✔ История операций:")

            if not self.__history:
                print("    История операций пуста.")
            else:
                for operation in self.__history:
                    print(f"    • {operation}")

            print("-" * 55)

    try:
        owner = input("  ► Введите имя владельца кошелька: ").strip()
        pin = input("  ► Создайте PIN-код: ").strip()
        initial_balance = float(
            input("  ► Введите начальный баланс: ")
        )

        if not owner:
            print("\n  [!] Ошибка: имя владельца не может быть пустым!")
            return

        if not pin:
            print("\n  [!] Ошибка: PIN не может быть пустым!")
            return

        if initial_balance < 0:
            print("\n  [!] Ошибка: баланс не может быть отрицательным!")
            return

        wallet = ElectronicWallet(
            owner,
            initial_balance,
            pin
        )

        # Второй кошелёк для демонстрации перевода
        other_wallet = ElectronicWallet(
            "Друг",
            1000,
            "0000"
        )

        print("\n" + "-" * 55)
        print("  ✔ Электронный кошелёк создан!")
        print(f"    • Владелец : {owner}")
        print(f"    • Баланс   : {initial_balance:.2f}")
        print("-" * 55)

        entered_pin = input("\n  ► Введите PIN для продолжения: ")

        if not wallet.check_pin(entered_pin):
            print("\n  [!] Неверный PIN!")
            return

        print("\n  Выберите операцию:")
        print("    [1] Пополнение")
        print("    [2] Оплата")
        print("    [3] Перевод")
        print("    [4] Проверка баланса")
        print("    [5] История операций")

        choice = input("\n  ► Ваш выбор: ").strip()

        if choice == "1":
            amount = float(input("  ► Сумма пополнения: "))
            wallet.deposit(amount, entered_pin)

        elif choice == "2":
            amount = float(input("  ► Сумма оплаты: "))
            wallet.pay(amount, entered_pin)

        elif choice == "3":
            amount = float(input("  ► Сумма перевода: "))
            wallet.transfer(other_wallet, amount, entered_pin)

        elif choice == "4":
            balance = wallet.get_balance(entered_pin)

            if balance is not None:
                print("\n" + "-" * 55)
                print(f"  ✔ Текущий баланс: {balance:.2f}")
                print("-" * 55)

        elif choice == "5":
            wallet.show_history(entered_pin)

        else:
            print("\n  [!] Неверный пункт меню!")

        # Показываем итоговый баланс
        balance = wallet.get_balance(entered_pin)

        if balance is not None:
            print(f"\n  ✔ Итоговый баланс: {balance:.2f}")

    except ValueError:
        print("\n  [!] Ошибка: пожалуйста, вводите корректные данные.")


# =========================================================
# ГЛАВНОЕ МЕНЮ
# =========================================================

def main_menu():

    while True:
        clear_screen()

        print("=" * 55)
        print(
            "║" +
            " ГЛАВНОЕ МЕНЮ ЛАБОРАТОРНОЙ РАБОТЫ ".center(53) +
            "║"
        )
        print("=" * 55)

        print("  [1] Задание №3  (Автомобиль)")
        print("  [2] Задание №12 (Корзина покупок)")
        print("  [3] Задание №20 (Электронный кошелёк)")

        print("  [0] Выход из программы")

        print("=" * 55)

        choice = input("  ► Выберите номер пункта меню: ").strip()

        if choice == '1':
            task_3()

        elif choice == '2':
            task_12()

        elif choice == '3':
            task_20()

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
