
import { useState } from "react";

function QuestionCard({ question, options, onAnswer, disabled }) {
    return (
        <div>
            <h3>{question}</h3>

            {options.map((option, index) => (
                <button
                    key={index}
                    disabled={disabled}
                    onClick={() => onAnswer(index)}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}

export default function App() {
    const questions = [
        {
            question: "Какой язык используется в React?",
            options: ["Python", "JavaScript", "C++", "PHP"],
            correct: 1
        },
        {
            question: "Как передаются данные компоненту?",
            options: ["State", "Props", "CSS", "HTML"],
            correct: 1
        },
        {
            question: "Какой хук используется для состояния?",
            options: ["useState", "usePage", "useStyle", "useHTML"],
            correct: 0
        }
    ];

    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [finished, setFinished] = useState(false);

    function answer(index) {
        if (answered) return;

        if (index === questions[current].correct) {
            setScore(score + 1);
        }

        setAnswered(true);
    }

    function next() {
        if (current < questions.length - 1) {
            setCurrent(current + 1);
            setAnswered(false);
        } else {
            setFinished(true);
        }
    }

    function restart() {
        setCurrent(0);
        setScore(0);
        setAnswered(false);
        setFinished(false);
    }

    return (
        <div className="container">
            <h1>Задание 15. Мини-викторина</h1>

            {finished ? (
                <div className="card">
                    <h2>Викторина завершена!</h2>
                    <h1>Результат: {score} / {questions.length}</h1>
                    <button onClick={restart}>
                        Начать заново
                    </button>
                </div>
            ) : (
                <div className="card">
                    <p>
                        Вопрос {current + 1} из {questions.length}
                    </p>

                    <QuestionCard
                        question={questions[current].question}
                        options={questions[current].options}
                        onAnswer={answer}
                        disabled={answered}
                    />

                    {answered && (
                        <p>
                            {questions[current].correct ===
                            questions[current].options.findIndex(
                                (_, index) => index === questions[current].correct
                            )
                                ? "Ответ принят!"
                                : ""}
                        </p>
                    )}

                    <h3>Баллы: {score}</h3>

                    <button onClick={next} disabled={!answered}>
                        Следующий вопрос
                    </button>
                </div>
            )}
        </div>
    );
}
