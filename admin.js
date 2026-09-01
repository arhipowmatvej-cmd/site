const SUPABASE_URL = "https://cqhhshrabncntkcnkrym.supabase.co";

const SUPABASE_KEY = "sb_publishable_jC2L087LA9OKoEslfgEH8Q_4WjciDSW";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================
   ЭЛЕМЕНТЫ СТРАНИЦЫ
========================= */

const loginBlock =
    document.querySelector("#loginBlock");

const moderationBlock =
    document.querySelector("#moderationBlock");

const loginForm =
    document.querySelector("#loginForm");

const loginMessage =
    document.querySelector("#loginMessage");

const pendingReviews =
    document.querySelector("#pendingReviews");

const logoutButton =
    document.querySelector("#logoutButton");


const blogForm =
    document.querySelector("#blogForm");

const blogTitle =
    document.querySelector("#blogTitle");

const blogContent =
    document.querySelector("#blogContent");

const blogPublished =
    document.querySelector("#blogPublished");

const blogMessage =
    document.querySelector("#blogMessage");

const adminBlogPosts =
    document.querySelector("#adminBlogPosts");


/* =========================
   ПРОВЕРКА АВТОРИЗАЦИИ
========================= */

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


/* =========================
   ПОКАЗ ЭКРАНОВ
========================= */

function showLogin() {

    loginBlock.style.display = "block";

    moderationBlock.style.display = "none";

}


function showModeration() {

    loginBlock.style.display = "none";

    moderationBlock.style.display = "block";


    loadPendingReviews();

    loadBlogPosts();

}


/* =========================
   ВХОД
========================= */

async function login(event) {

    event.preventDefault();


    const email =
        document
            .querySelector("#adminEmail")
            .value
            .trim();


    const password =
        document
            .querySelector("#adminPassword")
            .value;


    loginMessage.textContent =
        "Выполняем вход...";


    const {
        error
    } =
        await supabaseClient.auth.signInWithPassword({

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


/* =========================
   ВЫХОД
========================= */

async function logout() {

    await supabaseClient.auth.signOut();

    showLogin();

}


/* =========================
   СОЗДАНИЕ ПОСТА
========================= */

async function createBlogPost(event) {

    event.preventDefault();


    const title =
        blogTitle.value.trim();


    const content =
        blogContent.value.trim();


    const published =
        blogPublished.checked;


    if (!title || !content) {

        blogMessage.textContent =
            "Заполните заголовок и текст публикации.";

        return;

    }


    blogMessage.textContent =
        "Сохраняем публикацию...";


    const {
        error
    } =
        await supabaseClient
            .from("blog_posts")
            .insert({

                title: title,

                content: content,

                published: published

            });


    if (error) {

        console.error(error);

        blogMessage.textContent =
            "Не удалось сохранить публикацию.";

        return;

    }


    blogForm.reset();


    blogMessage.textContent =
        published
            ? "Публикация опубликована."
            : "Публикация сохранена как черновик.";


    loadBlogPosts();

}


/* =========================
   ЗАГРУЗКА ПОСТОВ
========================= */

async function loadBlogPosts() {

    adminBlogPosts.innerHTML = `

        <p class="reviews-message">
            Загружаем публикации...
        </p>

    `;


    const {
        data,
        error
    } =
        await supabaseClient
            .from("blog_posts")
            .select(
                "id, title, content, created_at, published"
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(error);

        adminBlogPosts.innerHTML = `

            <p class="admin-message">
                Не удалось загрузить публикации.
            </p>

        `;

        return;

    }


    if (!data || data.length === 0) {

        adminBlogPosts.innerHTML = `

            <div class="empty-reviews">

                <div class="empty-icon">
                    ✓
                </div>

                <h3>
                    Публикаций пока нет
                </h3>

                <p>
                    Создайте первую запись в блоге.
                </p>

            </div>

        `;

        return;

    }


    adminBlogPosts.innerHTML = "";


    data.forEach(post => {

        const card =
            document.createElement("div");

        card.className =
            "admin-blog-post";


        /* Дата */

        const date =
            document.createElement("div");

        date.className =
            "admin-blog-post-date";

        date.textContent =
            new Date(
                post.created_at
            ).toLocaleDateString(
                "ru-RU",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        /* Заголовок */

        const title =
            document.createElement("h3");

        title.className =
            "admin-blog-post-title";

        title.textContent =
            post.title;


        /* Статус */

        const status =
            document.createElement("span");

        status.className =
            post.published
                ? "blog-status published"
                : "blog-status draft";

        status.textContent =
            post.published
                ? "Опубликовано"
                : "Черновик";


        /* Текст */

        const text =
            document.createElement("p");

        text.className =
            "admin-blog-post-text";

        text.textContent =
            post.content;


        /* Кнопки */

        const buttons =
            document.createElement("div");

        buttons.className =
            "admin-blog-buttons";


        /* Опубликовать */

        if (!post.published) {

            const publishButton =
                document.createElement("button");

            publishButton.type =
                "button";

            publishButton.className =
                "approve-button";

            publishButton.textContent =
                "✓ Опубликовать";


            publishButton.addEventListener(
                "click",
                () => publishBlogPost(
                    post.id,
                    publishButton
                )
            );


            buttons.appendChild(
                publishButton
            );

        }


        /* Удалить */

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
            () => deleteBlogPost(
                post.id,
                card,
                deleteButton
            )
        );


        buttons.appendChild(
            deleteButton
        );


        /* Собираем карточку */

        card.appendChild(date);

        card.appendChild(title);

        card.appendChild(status);

        card.appendChild(text);

        card.appendChild(buttons);


        adminBlogPosts.appendChild(
            card
        );

    });

}


/* =========================
   ПУБЛИКАЦИЯ ПОСТА
========================= */

async function publishBlogPost(
    postId,
    button
) {

    button.disabled = true;

    button.textContent =
        "Публикуем...";


    const {
        error
    } =
        await supabaseClient
            .from("blog_posts")
            .update({
                published: true
            })
            .eq(
                "id",
                postId
            );


    if (error) {

        console.error(error);

        button.disabled = false;

        button.textContent =
            "✓ Опубликовать";

        alert(
            "Не удалось опубликовать запись."
        );

        return;

    }


    loadBlogPosts();

}


/* =========================
   УДАЛЕНИЕ ПОСТА
========================= */

async function deleteBlogPost(
    postId,
    card,
    button
) {

    const confirmed =
        confirm(
            "Удалить эту публикацию?"
        );


    if (!confirmed) {

        return;

    }


    button.disabled = true;

    button.textContent =
        "Удаляем...";


    const {
        error
    } =
        await supabaseClient
            .from("blog_posts")
            .delete()
            .eq(
                "id",
                postId
            );


    if (error) {

        console.error(error);

        button.disabled = false;

        button.textContent =
            "Удалить";

        alert(
            "Не удалось удалить публикацию."
        );

        return;

    }


    card.remove();

}


/* =========================
   ОТЗЫВЫ
========================= */

async function loadPendingReviews() {

    pendingReviews.innerHTML = `

        <p class="reviews-message">
            Загружаем отзывы...
        </p>

    `;


    const {
        data,
        error
    } =
        await supabaseClient
            .from("reviews")
            .select(
                "id, name, review_text, created_at, approved"
            )
            .eq(
                "approved",
                false
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


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
            ).toLocaleString(
                "ru-RU"
            );


        author.appendChild(name);

        author.appendChild(date);

        header.appendChild(author);


        const text =
            document.createElement("p");

        text.className =
            "moderation-review-text";

        text.textContent =
            review.review_text;


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


        pendingReviews.appendChild(
            card
        );

    });

}


/* =========================
   ОДОБРЕНИЕ ОТЗЫВА
========================= */

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
    } =
        await supabaseClient
            .from("reviews")
            .update({
                approved: true
            })
            .eq(
                "id",
                reviewId
            );


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


/* =========================
   УДАЛЕНИЕ ОТЗЫВА
========================= */

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
    } =
        await supabaseClient
            .from("reviews")
            .delete()
            .eq(
                "id",
                reviewId
            );


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


/* =========================
   ПУСТОЙ СПИСОК ОТЗЫВОВ
========================= */

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


/* =========================
   СОБЫТИЯ
========================= */

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


if (blogForm) {

    blogForm.addEventListener(
        "submit",
        createBlogPost
    );

}


/* =========================
   ЗАПУСК
========================= */

checkUser();
