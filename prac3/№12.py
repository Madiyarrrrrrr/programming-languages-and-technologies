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
        for item in self.items:
            print(
                f"{item['name']}: "
                f"{item['quantity']} шт. × {item['price']}"
            )

        print("Итого:", self.total())


cart = ShoppingCart()

cart.add_item("Хлеб", 300, 2)
cart.add_item("Молоко", 450, 3)
cart.add_item("Сыр", 2500, 1)

cart.show_cart()
