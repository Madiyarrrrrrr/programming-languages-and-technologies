number = int(input("Введите пятизначное число: "))

ten_thousands = number // 10000
thousands = number // 1000 % 10
hundreds = number // 100 % 10
tens = number // 10 % 10
units = number % 10

sum_digits = ten_thousands + thousands + hundreds + tens + units

reversed_number = (
    units * 10000
    + tens * 1000
    + hundreds * 100
    + thousands * 10
    + ten_thousands
)

print("Сумма цифр:", sum_digits)
print("Число в обратном порядке:", reversed_number)
