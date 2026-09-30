const passwordInput = document.querySelector("#password");
const checkButton = document.querySelector("#checkButton");
const result = document.querySelector("#result");

checkButton.addEventListener("click", () => {

    const password = passwordInput.value;

    const hasLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUppercase = /[A-ZА-ЯЁ]/.test(password);

    if (hasLength && hasNumber && hasUppercase) {

        result.className = "success";

        result.innerHTML = `
            <strong>Пароль подходит!</strong>
            <ul>
                <li>Минимум 8 символов — выполнено</li>
                <li>Есть цифра — выполнено</li>
                <li>Есть заглавная буква — выполнено</li>
            </ul>
        `;

    } else {

        result.className = "error";

        result.innerHTML = `
            <strong>Пароль не соответствует требованиям.</strong>
            <ul>
                <li>
                    Минимум 8 символов:
                    ${hasLength ? "✓" : "✗"}
                </li>

                <li>
                    Хотя бы одна цифра:
                    ${hasNumber ? "✓" : "✗"}
                </li>

                <li>
                    Хотя бы одна заглавная буква:
                    ${hasUppercase ? "✓" : "✗"}
                </li>
            </ul>
        `;
    }
});
