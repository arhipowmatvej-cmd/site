const SUPABASE_URL = "https://cqhhshrabncntkcnkrym.supabase.co";

const SUPABASE_KEY = "sb_publishable_jC2L087LA9OKoEslfgEH8Q_4WjciDSW";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =========================================
// ЭЛЕМЕНТЫ СТРАНИЦЫ
// =========================================

const loginBlock = document.querySelector("#loginBlock");
const moderationBlock = document.querySelector("#moderationBlock");

const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");

const pendingReviews = document.querySelector("#pendingReviews");

const logoutButton = document.querySelector("#logoutButton");


// =========================================
// ПРОВЕРЯЕМ, ВОШЁЛ ЛИ АДМИНИСТРАТОР
// =========================================

async function checkUser() {

    const {
        data: {
            session
        }
    } = await supabaseClient.auth.getSession();


    if (session) {

        showModeration();

    } else {

        showLogin();

    }

}


// =========================================
// ПОКАЗЫВАЕМ ВХОД
// =========================================

function showLogin() {

    loginBlock.style.display = "block";

    moderationBlock.style.display = "none";

}


// =========================================
// ПОКАЗЫВАЕМ МОДЕРАЦИЮ
// =========================================

function showModeration() {

    loginBlock.style.display = "none";

    moderationBlock.style.display = "block";

    loadPendingReviews();

}


// =========================================
// ВХОД
// =========================================

async function login(event) {

    event.preventDefault();


    const email =
        document.querySelector("#adminEmail").value.trim();

    const password =
        document.querySelector("#adminPassword").value;


    loginMessage.textContent = "Выполняем вход...";


    const {
        error
    } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });


    if (error) {

        console.error(error);

        loginMessage.textContent =
            "Неверный email или пароль.";

        return;

    }


    loginMessage.textContent = "";

    showModeration();

}


// =========================================
// ВЫХОД
// =========================================

async function logout() {

    await supabaseClient.auth.signOut();

    showLogin();

}


// =========================================
// ЗАГРУЗКА НЕОДОБРЕННЫХ ОТЗЫВОВ
// =========================================

async function loadPendingReviews() {

    pendingReviews.innerHTML = `
        <p class="reviews-message">
            Загружаем отзывы...
        </p>
    `;


    const {
        data,
        error
    } = await supabaseClient
        .from("reviews")
        .select("id, name, review_text, created_at, approved")
        .eq("approved", false)
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error(error);

        pendingReviews.innerHTML = `
            <p class="admin-message">
                Не удалось загрузить отзывы.
            </p>
        `;

        return;

    }


    if (!data || data.length === 0) {

        pendingReviews.innerHTML = `
            <div class="empty-reviews">
                <div class="empty-icon">
                    ✓
                </div>

                <h3>
                    Новых отзывов нет
                </h3>

                <p>
                    Все отзывы проверены.
                </p>
            </div>
        `;

        return;

    }


    pendingReviews.innerHTML = "";


    data.forEach(review => {

        const card =
            document.createElement("div");

        card.className =
            "moderation-review";


        // Заголовок

        const header =
            document.createElement("div");

        header.className =
            "moderation-review-header";


        const author =
            document.createElement("div");

        author.className =
            "moderation-author";


        const name =
            document.createElement("strong");

        name.textContent =
            review.name;


        const date =
            document.createElement("span");

        date.textContent =
            new Date(
                review.created_at
            ).toLocaleString("ru-RU");


        author.appendChild(name);

        author.appendChild(date);


        header.appendChild(author);


        // Текст

        const text =
            document.createElement("p");

        text.className =
            "moderation-review-text";

        text.textContent =
            review.review_text;


        // Кнопки

        const buttons =
            document.createElement("div");

        buttons.className =
            "moderation-buttons";


        const approveButton =
            document.createElement("button");

        approveButton.type =
            "button";

        approveButton.className =
            "approve-button";

        approveButton.textContent =
            "✓ Одобрить";


        approveButton.addEventListener(
            "click",
            () => approveReview(
                review.id,
                card,
                approveButton
            )
        );


        const deleteButton =
            document.createElement("button");

        deleteButton.type =
            "button";

        deleteButton.className =
            "delete-button";

        deleteButton.textContent =
            "Удалить";


        deleteButton.addEventListener(
            "click",
            () => deleteReview(
                review.id,
                card,
                deleteButton
            )
        );


        buttons.appendChild(
            approveButton
        );

        buttons.appendChild(
            deleteButton
        );


        card.appendChild(header);

        card.appendChild(text);

        card.appendChild(buttons);


        pendingReviews.appendChild(card);

    });

}


// =========================================
// ОДОБРЕНИЕ ОТЗЫВА
// =========================================

async function approveReview(
    reviewId,
    card,
    button
) {

    button.disabled = true;

    button.textContent =
        "Одобряем...";


    const {
        error
    } = await supabaseClient
        .from("reviews")
        .update({
            approved: true
        })
        .eq("id", reviewId);


    if (error) {

        console.error(error);

        button.disabled = false;

        button.textContent =
            "✓ Одобрить";

        alert(
            "Не удалось одобрить отзыв."
        );

        return;

    }


    card.remove();


    checkEmptyModeration();

}


// =========================================
// УДАЛЕНИЕ ОТЗЫВА
// =========================================

async function deleteReview(
    reviewId,
    card,
    button
) {

    const confirmed =
        confirm(
            "Удалить этот отзыв?"
        );


    if (!confirmed) {
        return;
    }


    button.disabled = true;

    button.textContent =
        "Удаляем...";


    const {
        error
    } = await supabaseClient
        .from("reviews")
        .delete()
        .eq("id", reviewId);


    if (error) {

        console.error(error);

        button.disabled = false;

        button.textContent =
            "Удалить";

        alert(
            "Не удалось удалить отзыв."
        );

        return;

    }


    card.remove();


    checkEmptyModeration();

}


// =========================================
// ПРОВЕРЯЕМ, ОСТАЛИСЬ ЛИ ОТЗЫВЫ
// =========================================

function checkEmptyModeration() {

    if (
        pendingReviews.children.length === 0
    ) {

        pendingReviews.innerHTML = `
            <div class="empty-reviews">

                <div class="empty-icon">
                    ✓
                </div>

                <h3>
                    Новых отзывов нет
                </h3>

                <p>
                    Все отзывы проверены.
                </p>

            </div>
        `;

    }

}


// =========================================
// ОБРАБОТЧИКИ
// =========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        login
    );

}


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );

}


// =========================================
// СТАРТ
// =========================================

checkUser();
