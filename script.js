const SUPABASE_URL = "https://cqhhshrabncntkcnkrym.supabase.co";

const SUPABASE_KEY = "sb_publishable_jC2L087LA9OKoEslfgEH8Q_4WjciDSW";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =========================================
// ЗАГРУЗКА ОДОБРЕННЫХ ОТЗЫВОВ
// =========================================

async function loadReviews() {

    const reviewsContainer = document.querySelector("#reviewsContainer");

    if (!reviewsContainer) {
        return;
    }

    reviewsContainer.innerHTML = "";

    const { data, error } = await supabaseClient
        .from("reviews")
        .select("id, name, review_text, created_at")
        .eq("approved", true)
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error("Ошибка загрузки отзывов:", error);

        reviewsContainer.innerHTML = "";

        const message = document.createElement("p");

        message.className = "reviews-message";

        message.textContent = "Не удалось загрузить отзывы.";

        reviewsContainer.appendChild(message);

        return;
    }


    // =========================================
    // ЕСЛИ ОТЗЫВОВ ПОКА НЕТ
    // =========================================

    if (!data || data.length === 0) {

        const message = document.createElement("p");

        message.className = "reviews-message";

        message.textContent = "Отзывов пока нет. Будьте первым!";

        reviewsContainer.appendChild(message);

        return;
    }


    // =========================================
    // ВЫВОДИМ ОДОБРЕННЫЕ ОТЗЫВЫ
    // =========================================

    data.forEach(review => {

        const reviewElement = document.createElement("div");

        reviewElement.className = "review";


        const mark = document.createElement("div");

        mark.className = "review-mark";

        mark.textContent = "“";


        const text = document.createElement("p");

        text.className = "review-text";

        text.textContent = review.review_text;


        const author = document.createElement("div");

        author.className = "review-author";


        const name = document.createElement("strong");

        name.textContent = review.name;


        const date = document.createElement("span");

        const reviewDate = new Date(review.created_at);

        date.textContent = reviewDate.toLocaleDateString("ru-RU");


        author.appendChild(name);

        author.appendChild(date);


        reviewElement.appendChild(mark);

        reviewElement.appendChild(text);

        reviewElement.appendChild(author);


        reviewsContainer.appendChild(reviewElement);

    });

}


// =========================================
// ОТКРЫТИЕ ФОРМЫ
// =========================================

function openReviewForm() {

    const formWrapper = document.querySelector("#reviewFormWrapper");

    if (!formWrapper) {
        return;
    }

    formWrapper.classList.add("active");

    const nameInput = document.querySelector("#reviewName");

    if (nameInput) {
        nameInput.focus();
    }

}


// =========================================
// ЗАКРЫТИЕ ФОРМЫ
// =========================================

function closeReviewForm() {

    const formWrapper = document.querySelector("#reviewFormWrapper");

    if (!formWrapper) {
        return;
    }

    formWrapper.classList.remove("active");

}


// =========================================
// ОТПРАВКА ОТЗЫВА
// =========================================

async function submitReview(event) {

    event.preventDefault();


    const nameInput = document.querySelector("#reviewName");

    const textInput = document.querySelector("#reviewText");

    const submitButton = document.querySelector("#reviewSubmitButton");

    const message = document.querySelector("#reviewFormMessage");


    const name = nameInput.value.trim();

    const reviewText = textInput.value.trim();


    // =========================================
    // ПРОВЕРКА ДАННЫХ
    // =========================================

    if (name.length < 2) {

        message.textContent = "Введите имя.";

        return;
    }


    if (name.length > 50) {

        message.textContent = "Имя слишком длинное.";

        return;
    }


    if (reviewText.length < 5) {

        message.textContent = "Напишите немного подробнее.";

        return;
    }


    if (reviewText.length > 500) {

        message.textContent = "Отзыв слишком длинный.";

        return;
    }


    // =========================================
    // БЛОКИРУЕМ КНОПКУ НА ВРЕМЯ ОТПРАВКИ
    // =========================================

    submitButton.disabled = true;

    submitButton.textContent = "Отправляем...";

    message.textContent = "";


    // =========================================
    // ОТПРАВЛЯЕМ В SUPABASE
    // =========================================

    const { error } = await supabaseClient
        .from("reviews")
        .insert({
            name: name,
            review_text: reviewText,
            approved: false
        });


    // =========================================
    // ЕСЛИ ПРОИЗОШЛА ОШИБКА
    // =========================================

    if (error) {

        console.error("Ошибка отправки отзыва:", error);

        message.textContent =
            "Не удалось отправить отзыв. Попробуйте ещё раз.";

        submitButton.disabled = false;

        submitButton.textContent = "Отправить отзыв";

        return;
    }


    // =========================================
    // УСПЕШНАЯ ОТПРАВКА
    // =========================================

    message.textContent =
        "Спасибо! Отзыв отправлен на проверку.";

    message.classList.add("success");


    nameInput.value = "";

    textInput.value = "";


    submitButton.disabled = false;

    submitButton.textContent = "Отправить отзыв";

}


// =========================================
// ЗАПУСК ПОСЛЕ ЗАГРУЗКИ СТРАНИЦЫ
// =========================================

document.addEventListener("DOMContentLoaded", function () {


    // Загружаем отзывы

    loadReviews();


    // Кнопка «Оставить отзыв»

    const openButton =
        document.querySelector("#openReviewButton");

    if (openButton) {

        openButton.addEventListener(
            "click",
            openReviewForm
        );

    }


    // Кнопка закрытия

    const closeButton =
        document.querySelector("#closeReviewButton");

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeReviewForm
        );

    }


    // Форма

    const reviewForm =
        document.querySelector("#reviewForm");

    if (reviewForm) {

        reviewForm.addEventListener(
            "submit",
            submitReview
        );

    }

});
