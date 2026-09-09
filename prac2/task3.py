length = float(input("Введите длину прямоугольника: "))
width = float(input("Введите ширину прямоугольника: "))

area = length * width
perimeter = 2 * (length + width)
diagonal = (length ** 2 + width ** 2) ** 0.5

print("Площадь:", area)
print("Периметр:", perimeter)
print("Диагональ:", diagonal)