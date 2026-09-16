class Car:
    def __init__(self, brand, model, year):
        self.brand = brand
        self.model = model
        self.year = year
        self.speed = 0

    def accelerate(self, value):
        self.speed += value
        print(f"Скорость увеличена до {self.speed} км/ч")

    def stop(self):
        self.speed = 0
        print("Автомобиль остановлен")


car = Car("Toyota", "Camry", 2023)

car.accelerate(30)
car.accelerate(20)
car.stop()
