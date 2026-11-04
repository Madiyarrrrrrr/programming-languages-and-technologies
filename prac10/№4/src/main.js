import {
    rectangleArea,
    rectanglePerimeter,
    circleArea,
    circlePerimeter
} from "./modules/geometry.js";

document.getElementById("rectangleBtn").addEventListener("click", () => {
    const a = Number(document.getElementById("length").value);
    const b = Number(document.getElementById("width").value);
    const result = document.getElementById("rectangleResult");

    if (a <= 0 || b <= 0 ||
        document.getElementById("length").value === "" ||
        document.getElementById("width").value === "") {
        result.textContent = "Введите положительные числа!";
        return;
    }

    result.textContent =
        `Площадь: ${rectangleArea(a, b).toFixed(2)} | ` +
        `Периметр: ${rectanglePerimeter(a, b).toFixed(2)}`;
});

document.getElementById("circleBtn").addEventListener("click", () => {
    const r = Number(document.getElementById("radius").value);
    const result = document.getElementById("circleResult");

    if (r <= 0 || document.getElementById("radius").value === "") {
        result.textContent = "Введите положительный радиус!";
        return;
    }

    result.textContent =
        `Площадь: ${circleArea(r).toFixed(2)} | ` +
        `Длина окружности: ${circlePerimeter(r).toFixed(2)}`;
});