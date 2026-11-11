
import { useState } from "react";

function LikeButton({ label }) {
    const [likes, setLikes] = useState(0);

    return (
        <div className="card">
            <h2>{label}</h2>

            <h1>❤️ {likes}</h1>

            <button onClick={() => setLikes(likes + 1)}>
                Поставить лайк
            </button>

            <button onClick={() => setLikes(0)}>
                Сбросить
            </button>
        </div>
    );
}

export default function App() {
    return (
        <div className="container">
            <h1>Задание 1. Счетчик лайков</h1>
            <LikeButton label="Мой счетчик лайков" />
        </div>
    );
}
