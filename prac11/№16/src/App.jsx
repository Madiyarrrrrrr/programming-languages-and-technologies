
import { useState } from "react";

function ExpenseForm({ onAddExpense }) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Еда");

    function submit(event) {
        event.preventDefault();

        if (!title.trim() || Number(amount) <= 0) {
            alert("Введите правильные данные!");
            return;
        }

        onAddExpense({
            id: Date.now(),
            title: title,
            amount: Number(amount),
            category: category
        });

        setTitle("");
        setAmount("");
    }

    return (
        <form onSubmit={submit}>
            <input
                placeholder="Название расхода"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                type="number"
                placeholder="Сумма"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option>Еда</option>
                <option>Транспорт</option>
                <option>Учёба</option>
                <option>Развлечения</option>
                <option>Другое</option>
            </select>

            <button type="submit">Добавить</button>
        </form>
    );
}

function ExpenseList({ expenses, onDelete }) {
    return (
        <div>
            {expenses.map((expense) => (
                <div className="expense" key={expense.id}>
                    <span>
                        {expense.title} ({expense.category})
                    </span>

                    <strong>{expense.amount} ₸</strong>

                    <button onClick={() => onDelete(expense.id)}>
                        Удалить
                    </button>
                </div>
            ))}

            {expenses.length === 0 && (
                <p>Расходов пока нет.</p>
            )}
        </div>
    );
}

export default function App() {
    const [expenses, setExpenses] = useState([]);
    const [filter, setFilter] = useState("Все");

    function addExpense(expense) {
        setExpenses([...expenses, expense]);
    }

    function deleteExpense(id) {
        setExpenses(
            expenses.filter((expense) => expense.id !== id)
        );
    }

    const total = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    const filteredExpenses = filter === "Все"
        ? expenses
        : expenses.filter(
            (expense) => expense.category === filter
        );

    return (
        <div className="container">
            <h1>Задание 16. Планировщик расходов</h1>

            <div className="card">
                <h2>
                    Общая сумма: {total.toLocaleString("ru-RU")} ₸
                </h2>

                <ExpenseForm onAddExpense={addExpense} />

                <h3>Фильтр категорий:</h3>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option>Все</option>
                    <option>Еда</option>
                    <option>Транспорт</option>
                    <option>Учёба</option>
                    <option>Развлечения</option>
                    <option>Другое</option>
                </select>

                <ExpenseList
                    expenses={filteredExpenses}
                    onDelete={deleteExpense}
                />
            </div>
        </div>
    );
}
