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
            print("Неверный PIN")
            return

        if amount > 0:
            self.__balance += amount
            self.__history.append(f"Пополнение: +{amount}")
            print("Кошелёк пополнен")

    def pay(self, amount, pin):
        if not self.check_pin(pin):
            print("Неверный PIN")
            return

        if 0 < amount <= self.__balance:
            self.__balance -= amount
            self.__history.append(f"Оплата: -{amount}")
            print("Оплата выполнена")
        else:
            print("Недостаточно средств")

    def transfer(self, other_wallet, amount, pin):
        if not self.check_pin(pin):
            print("Неверный PIN")
            return

        if 0 < amount <= self.__balance:
            self.__balance -= amount
            other_wallet.__balance += amount

            self.__history.append(
                f"Перевод {other_wallet.owner}: -{amount}"
            )

            other_wallet.__history.append(
                f"Получение от {self.owner}: +{amount}"
            )

            print("Перевод выполнен")
        else:
            print("Недостаточно средств")

    def get_balance(self, pin):
        if self.check_pin(pin):
            return self.__balance

        print("Неверный PIN")
        return None

    def show_history(self, pin):
        if not self.check_pin(pin):
            print("Неверный PIN")
            return

        print("История операций:")
        for operation in self.__history:
            print("-", operation)


wallet1 = ElectronicWallet("Аян", 50000, "1234")
wallet2 = ElectronicWallet("Данияр", 10000, "5678")

wallet1.deposit(10000, "1234")
wallet1.pay(5000, "1234")
wallet1.transfer(wallet2, 15000, "1234")

print("Баланс Аяна:", wallet1.get_balance("1234"))
print("Баланс Данияра:", wallet2.get_balance("5678"))

print("\nИстория Аяна:")
wallet1.show_history("1234")

print("\nИстория Данияра:")
wallet2.show_history("5678")
