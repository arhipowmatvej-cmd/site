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

    const reviewsContainer =
        document.querySelector("#reviewsContainer");

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

        console.error(
            "Ошибка загрузки отзывов:",
            error
        );

        reviewsContainer.innerHTML = "";

        const message =
            document.createElement("p");

        message.className =
            "reviews-message";

        message.textContent =
            "Не удалось загрузить отзывы.";

        reviewsContainer.appendChild(message);

        return;
    }


    // =========================================
    // ЕСЛИ ОТЗЫВОВ ПОКА НЕТ
    // =========================================

    if (!data || data.length === 0) {

        const message =
            document.createElement("p");

        message.className =
            "reviews-message";

        message.textContent =
            "Отзывов пока нет. Будьте первым!";

        reviewsContainer.appendChild(message);

        return;
    }


    // =========================================
    // ВЫВОДИМ ОДОБРЕННЫЕ ОТЗЫВЫ
    // =========================================

    data.forEach(review => {

        const reviewElement =
            document.createElement("div");

        reviewElement.className =
            "review";


        const mark =
            document.createElement("div");

        mark.className =
            "review-mark";

        mark.textContent = "“";


        const text =
            document.createElement("p");

        text.className =
            "review-text";

        text.textContent =
            review.review_text;


        const author =
            document.createElement("div");

        author.className =
            "review-author";


        const name =
            document.createElement("strong");

        name.textContent =
            review.name;


        const date =
            document.createElement("span");

        const reviewDate =
            new Date(review.created_at);

        date.textContent =
            reviewDate.toLocaleDateString("ru-RU");


        author.appendChild(name);

        author.appendChild(date);


        reviewElement.appendChild(mark);

        reviewElement.appendChild(text);

        reviewElement.appendChild(author);


        reviewsContainer.appendChild(
            reviewElement
        );

    });


    // После добавления отзывов
    // подключаем для них анимацию

    setupRevealAnimations();

}


// =========================================
// ОТКРЫТИЕ ФОРМЫ ОТЗЫВА
// =========================================

function openReviewForm() {

    const formWrapper =
        document.querySelector(
            "#reviewFormWrapper"
        );

    if (!formWrapper) {
        return;
    }

    formWrapper.classList.add("active");


    const nameInput =
        document.querySelector(
            "#reviewName"
        );

    if (nameInput) {
        nameInput.focus();
    }

}


// =========================================
// ЗАКРЫТИЕ ФОРМЫ ОТЗЫВА
// =========================================

function closeReviewForm() {

    const formWrapper =
        document.querySelector(
            "#reviewFormWrapper"
        );

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


    const nameInput =
        document.querySelector(
            "#reviewName"
        );

    const textInput =
        document.querySelector(
            "#reviewText"
        );

    const submitButton =
        document.querySelector(
            "#reviewSubmitButton"
        );

    const message =
        document.querySelector(
            "#reviewFormMessage"
        );


    const name =
        nameInput.value.trim();

    const reviewText =
        textInput.value.trim();


    // =========================================
    // ПРОВЕРКА ДАННЫХ
    // =========================================

    if (name.length < 2) {

        message.textContent =
            "Введите имя.";

        message.classList.remove(
            "success"
        );

        return;
    }


    if (name.length > 50) {

        message.textContent =
            "Имя слишком длинное.";

        message.classList.remove(
            "success"
        );

        return;
    }


    if (reviewText.length < 5) {

        message.textContent =
            "Напишите немного подробнее.";

        message.classList.remove(
            "success"
        );

        return;
    }


    if (reviewText.length > 500) {

        message.textContent =
            "Отзыв слишком длинный.";

        message.classList.remove(
            "success"
        );

        return;
    }


    // =========================================
    // БЛОКИРУЕМ КНОПКУ
    // =========================================

    submitButton.disabled = true;

    submitButton.textContent =
        "Отправляем...";

    message.textContent = "";

    message.classList.remove(
        "success"
    );


    // =========================================
    // ОТПРАВЛЯЕМ В SUPABASE
    // =========================================

    const { error } =
        await supabaseClient
            .from("reviews")
            .insert({
                name: name,
                review_text: reviewText,
                approved: false
            });


    // =========================================
    // ОШИБКА
    // =========================================

    if (error) {

        console.error(
            "Ошибка отправки отзыва:",
            error
        );

        message.textContent =
            "Не удалось отправить отзыв. Попробуйте ещё раз.";

        submitButton.disabled = false;

        submitButton.textContent =
            "Отправить отзыв";

        return;
    }


    // =========================================
    // УСПЕШНАЯ ОТПРАВКА
    // =========================================

    message.textContent =
        "Спасибо! Отзыв отправлен на проверку.";

    message.classList.add(
        "success"
    );


    nameInput.value = "";

    textInput.value = "";


    submitButton.disabled = false;

    submitButton.textContent =
        "Отправить отзыв";

}


// =========================================
// ОТПРАВКА СООБЩЕНИЯ
// =========================================

async function submitContactMessage(event) {

    event.preventDefault();


    const nameInput =
        document.querySelector(
            "#contactName"
        );

    const emailInput =
        document.querySelector(
            "#contactEmail"
        );

    const subjectInput =
        document.querySelector(
            "#contactSubject"
        );

    const messageInput =
        document.querySelector(
            "#contactMessage"
        );

    const submitButton =
        document.querySelector(
            "#contactSubmitButton"
        );

    const formMessage =
        document.querySelector(
            "#contactFormMessage"
        );


    if (
        !nameInput ||
        !emailInput ||
        !messageInput ||
        !submitButton ||
        !formMessage
    ) {
        return;
    }


    const name =
        nameInput.value.trim();

    const email =
        emailInput.value.trim();

    const subject =
        subjectInput
            ? subjectInput.value.trim()
            : "";

    const message =
        messageInput.value.trim();


    // =========================================
    // ПРОВЕРКА ИМЕНИ
    // =========================================

    if (name.length < 2) {

        formMessage.textContent =
            "Введите ваше имя.";

        formMessage.classList.remove(
            "success"
        );

        return;
    }


    if (name.length > 100) {

        formMessage.textContent =
            "Имя слишком длинное.";

        formMessage.classList.remove(
            "success"
        );

        return;
    }


    // =========================================
    // ПРОВЕРКА E-MAIL
    // =========================================

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        formMessage.textContent =
            "Введите корректный e-mail.";

        formMessage.classList.remove(
            "success"
        );

        return;
    }


    // =========================================
    // ПРОВЕРКА ТЕМЫ
    // =========================================

    if (subject.length > 200) {

        formMessage.textContent =
            "Тема слишком длинная.";

        formMessage.classList.remove(
            "success"
        );

        return;
    }


    // =========================================
    // ПРОВЕРКА СООБЩЕНИЯ
    // =========================================

    if (message.length < 5) {

        formMessage.textContent =
            "Напишите немного подробнее.";

        formMessage.classList.remove(
            "success"
        );

        return;
    }


    if (message.length > 3000) {

        formMessage.textContent =
            "Сообщение слишком длинное.";

        formMessage.classList.remove(
            "success"
        );

        return;
    }


    // =========================================
    // НАЧИНАЕМ ОТПРАВКУ
    // =========================================

    submitButton.disabled = true;

    submitButton.textContent =
        "Отправляем...";

    formMessage.textContent = "";

    formMessage.classList.remove(
        "success"
    );


    // =========================================
    // СОХРАНЯЕМ СООБЩЕНИЕ
    // =========================================

    const { error } =
        await supabaseClient
            .from("messages")
            .insert({
                name: name,
                email: email,
                subject: subject || null,
                message: message,
                is_read: false
            });


    // =========================================
    // ОШИБКА
    // =========================================

    if (error) {

        console.error(
            "Ошибка отправки сообщения:",
            error
        );

        formMessage.textContent =
            "Не удалось отправить сообщение. Попробуйте ещё раз.";

        submitButton.disabled = false;

        submitButton.textContent =
            "Отправить сообщение";

        return;
    }


    // =========================================
    // УСПЕШНАЯ ОТПРАВКА
    // =========================================

    formMessage.textContent =
        "Сообщение успешно отправлено! Я свяжусь с вами.";

    formMessage.classList.add(
        "success"
    );


    nameInput.value = "";

    emailInput.value = "";

    if (subjectInput) {
        subjectInput.value = "";
    }

    messageInput.value = "";


    submitButton.disabled = false;

    submitButton.textContent =
        "Отправить сообщение";

}


// =========================================
// МИКРОАНИМАЦИИ ПРИ ПРОКРУТКЕ
// =========================================

function setupRevealAnimations() {

    const elements =
        document.querySelectorAll(
            ".section, .contact-section, .blog-section, .skill, .review, .project-card, .blog-post, .contact-form-wrapper"
        );


    if (!elements.length) {
        return;
    }


    // Если браузер не поддерживает
    // IntersectionObserver —
    // просто показываем всё.

    if (!("IntersectionObserver" in window)) {

        elements.forEach(element => {

            element.classList.add(
                "reveal",
                "is-visible"
            );

        });

        return;
    }


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.classList.add(
                        "reveal",
                        "is-visible"
                    );


                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -40px 0px"
            }
        );


    elements.forEach((element, index) => {

        element.classList.add("reveal");


        // Небольшая задержка для
        // карточек одного блока

        if (
            element.classList.contains("skill") ||
            element.classList.contains("review") ||
            element.classList.contains("project-card")
        ) {

            element.style.transitionDelay =
                `${Math.min(index * 0.05, 0.25)}s`;

        }


        observer.observe(element);

    });

}


// =========================================
// ЗАПУСК ПОСЛЕ ЗАГРУЗКИ
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =====================================
        // ОТЗЫВЫ
        // =====================================

        loadReviews();


        const openButton =
            document.querySelector(
                "#openReviewButton"
            );

        if (openButton) {

            openButton.addEventListener(
                "click",
                openReviewForm
            );

        }


        const closeButton =
            document.querySelector(
                "#closeReviewButton"
            );

        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeReviewForm
            );

        }


        const reviewForm =
            document.querySelector(
                "#reviewForm"
            );

        if (reviewForm) {

            reviewForm.addEventListener(
                "submit",
                submitReview
            );

        }


        // =====================================
        // ФОРМА ОБРАТНОЙ СВЯЗИ
        // =====================================

        const contactForm =
            document.querySelector(
                "#contactForm"
            );

        if (contactForm) {

            contactForm.addEventListener(
                "submit",
                submitContactMessage
            );

        }


        // =====================================
        // МИКРОАНИМАЦИИ
        // =====================================

        setupRevealAnimations();

    }
);
