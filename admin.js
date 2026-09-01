const SUPABASE_URL =
    "https://cqhhshrabncntkcnkrym.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_jC2L087LA9OKoEslfgEH8Q_4WjciDSW";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==================================================
// ЭЛЕМЕНТЫ
// ==================================================

const loginSection =
    document.querySelector("#loginSection");

const adminContent =
    document.querySelector("#adminContent");

const loginForm =
    document.querySelector("#loginForm");

const loginMessage =
    document.querySelector("#loginMessage");

const logoutButton =
    document.querySelector("#logoutButton");


// ==================================================
// ПРОВЕРКА АВТОРИЗАЦИИ
// ==================================================

async function checkSession() {

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();

    if (error) {

        console.error(error);

        return;

    }

    if (data.session) {

        showAdmin();

    } else {

        showLogin();

    }

}


// ==================================================
// ПОКАЗАТЬ ВХОД
// ==================================================

function showLogin() {

    if (loginSection) {

        loginSection.style.display =
            "block";

    }

    if (adminContent) {

        adminContent.style.display =
            "none";

    }

}


// ==================================================
// ПОКАЗАТЬ АДМИНКУ
// ==================================================

function showAdmin() {

    if (loginSection) {

        loginSection.style.display =
            "none";

    }

    if (adminContent) {

        adminContent.style.display =
            "block";

    }

    loadProjects();
    loadBlogPosts();
    loadReviews();

}


// ==================================================
// ВХОД
// ==================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const email =
                document.querySelector("#email").value.trim();

            const password =
                document.querySelector("#password").value;

            loginMessage.textContent =
                "Выполняется вход...";

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
                    "Ошибка входа: " +
                    error.message;

                return;

            }

            loginMessage.textContent =
                "";

            showAdmin();

        }
    );

}


// ==================================================
// ВЫХОД
// ==================================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function() {

            await supabaseClient.auth.signOut();

            showLogin();

        }
    );

}


// ==================================================
// ПРОЕКТЫ
// ==================================================

const projectForm =
    document.querySelector("#projectForm");

const projectMessage =
    document.querySelector("#projectMessage");

const projectsList =
    document.querySelector("#projectsList");


// ==================================================
// СОЗДАНИЕ ПРОЕКТА
// ==================================================

if (projectForm) {

    projectForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            projectMessage.textContent =
                "Создаём проект...";


            const title =
                document
                    .querySelector("#projectTitle")
                    .value
                    .trim();


            const category =
                document
                    .querySelector("#projectCategory")
                    .value
                    .trim();


            const shortDescription =
                document
                    .querySelector("#projectShortDescription")
                    .value
                    .trim();


            const description =
                document
                    .querySelector("#projectDescription")
                    .value
                    .trim();


            const projectUrl =
                document
                    .querySelector("#projectUrl")
                    .value
                    .trim();


            const imageUrl =
                document
                    .querySelector("#projectImage")
                    .value
                    .trim();


            const published =
                document
                    .querySelector("#projectPublished")
                    .checked;


            const {
                data,
                error
            } =
                await supabaseClient
                    .from("projects")
                    .insert([
                        {
                            title: title,
                            category: category,
                            short_description:
                                shortDescription,
                            description:
                                description,
                            project_url:
                                projectUrl || null,
                            image_url:
                                imageUrl || null,
                            published:
                                published
                        }
                    ])
                    .select();


            if (error) {

                console.error(error);

                projectMessage.textContent =
                    "Не удалось создать проект: " +
                    error.message;

                return;

            }


            projectMessage.textContent =
                "Проект успешно создан.";


            projectForm.reset();


            loadProjects();

        }
    );

}


// ==================================================
// ЗАГРУЗКА ПРОЕКТОВ
// ==================================================

async function loadProjects() {

    if (!projectsList) {

        return;

    }


    projectsList.innerHTML = `
        <p class="reviews-message">
            Загружаем проекты...
        </p>
    `;


    const {
        data,
        error
    } =
        await supabaseClient
            .from("projects")
            .select(
                "id, created_at, title, category, short_description, description, project_url, image_url, published"
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(error);

        projectsList.innerHTML = `
            <p class="reviews-message">
                Не удалось загрузить проекты.
            </p>
        `;

        return;

    }


    if (!data || data.length === 0) {

        projectsList.innerHTML = `
            <div class="empty-blog">

                <div class="empty-blog-icon">
                    ✦
                </div>

                <h3>
                    Пока нет проектов
                </h3>

                <p>
                    Создай первый проект выше.
                </p>

            </div>
        `;

        return;

    }


    projectsList.innerHTML = "";


    data.forEach(project => {

        const item =
            document.createElement("div");

        item.className =
            "admin-list-item";


        // ------------------------------------------
        // Заголовок
        // ------------------------------------------

        const title =
            document.createElement("h3");

        title.textContent =
            project.title;


        // ------------------------------------------
        // Категория
        // ------------------------------------------

        const category =
            document.createElement("div");

        category.className =
            "admin-list-meta";

        category.textContent =
            project.category ||
            "Без категории";


        // ------------------------------------------
        // Статус
        // ------------------------------------------

        const status =
            document.createElement("div");

        status.className =
            "admin-list-meta";


        if (project.published) {

            status.textContent =
                "Опубликован";

        } else {

            status.textContent =
                "Черновик";

        }


        // ------------------------------------------
        // Описание
        // ------------------------------------------

        const description =
            document.createElement("p");

        description.textContent =
            project.short_description ||
            "";


        // ------------------------------------------
        // Кнопки
        // ------------------------------------------

        const buttons =
            document.createElement("div");

        buttons.className =
            "admin-list-actions";


        const publishButton =
            document.createElement("button");

        publishButton.type =
            "button";

        publishButton.className =
            "admin-button";


        if (project.published) {

            publishButton.textContent =
                "Снять с публикации";

        } else {

            publishButton.textContent =
                "Опубликовать";

        }


        publishButton.addEventListener(
            "click",
            function() {

                toggleProjectPublished(
                    project.id,
                    !project.published
                );

            }
        );


        const deleteButton =
            document.createElement("button");

        deleteButton.type =
            "button";

        deleteButton.className =
            "admin-button admin-button-danger";

        deleteButton.textContent =
            "Удалить";


        deleteButton.addEventListener(
            "click",
            function() {

                deleteProject(
                    project.id,
                    project.title
                );

            }
        );


        buttons.appendChild(
            publishButton
        );

        buttons.appendChild(
            deleteButton
        );


        // ------------------------------------------
        // Собираем карточку
        // ------------------------------------------

        item.appendChild(title);

        item.appendChild(category);

        item.appendChild(status);

        item.appendChild(description);

        item.appendChild(buttons);


        projectsList.appendChild(item);

    });

}


// ==================================================
// ПУБЛИКАЦИЯ / СНЯТИЕ С ПУБЛИКАЦИИ
// ==================================================

async function toggleProjectPublished(
    projectId,
    published
) {

    const {
        error
    } =
        await supabaseClient
            .from("projects")
            .update({
                published: published
            })
            .eq(
                "id",
                projectId
            );


    if (error) {

        console.error(error);

        alert(
            "Не удалось изменить статус проекта: " +
            error.message
        );

        return;

    }


    loadProjects();

}


// ==================================================
// УДАЛЕНИЕ ПРОЕКТА
// ==================================================

async function deleteProject(
    projectId,
    projectTitle
) {

    const confirmed =
        confirm(
            'Удалить проект "' +
            projectTitle +
            '"?'
        );


    if (!confirmed) {

        return;

    }


    const {
        error
    } =
        await supabaseClient
            .from("projects")
            .delete()
            .eq(
                "id",
                projectId
            );


    if (error) {

        console.error(error);

        alert(
            "Не удалось удалить проект: " +
            error.message
        );

        return;

    }


    loadProjects();

}


// ==================================================
// БЛОГ
// ==================================================

const blogForm =
    document.querySelector("#blogForm");

const blogMessage =
    document.querySelector("#blogMessage");

const blogList =
    document.querySelector("#blogList");


// ==================================================
// СОЗДАНИЕ ПУБЛИКАЦИИ
// ==================================================

if (blogForm) {

    blogForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            blogMessage.textContent =
                "Создаём публикацию...";


            const title =
                document
                    .querySelector("#blogTitle")
                    .value
                    .trim();


            const content =
                document
                    .querySelector("#blogContent")
                    .value
                    .trim();


            const published =
                document
                    .querySelector("#blogPublished")
                    .checked;


            const {
                error
            } =
                await supabaseClient
                    .from("blog_posts")
                    .insert([
                        {
                            title: title,
                            content: content,
                            published: published
                        }
                    ]);


            if (error) {

                console.error(error);

                blogMessage.textContent =
                    "Не удалось создать публикацию: " +
                    error.message;

                return;

            }


            blogMessage.textContent =
                "Публикация успешно создана.";


            blogForm.reset();


            loadBlogPosts();

        }
    );

}


// ==================================================
// ЗАГРУЗКА ПУБЛИКАЦИЙ
// ==================================================

async function loadBlogPosts() {

    if (!blogList) {

        return;

    }


    blogList.innerHTML = `
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
                "id, created_at, title, content, published"
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(error);

        blogList.innerHTML = `
            <p class="reviews-message">
                Не удалось загрузить публикации.
            </p>
        `;

        return;

    }


    if (!data || data.length === 0) {

        blogList.innerHTML = `
            <div class="empty-blog">

                <div class="empty-blog-icon">
                    ✦
                </div>

                <h3>
                    Пока нет публикаций
                </h3>

                <p>
                    Создай первую публикацию выше.
                </p>

            </div>
        `;

        return;

    }


    blogList.innerHTML = "";


    data.forEach(post => {

        const item =
            document.createElement("div");

        item.className =
            "admin-list-item";


        const title =
            document.createElement("h3");

        title.textContent =
            post.title;


        const date =
            document.createElement("div");

        date.className =
            "admin-list-meta";

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


        const status =
            document.createElement("div");

        status.className =
            "admin-list-meta";

        status.textContent =
            post.published
                ? "Опубликовано"
                : "Черновик";


        const buttons =
            document.createElement("div");

        buttons.className =
            "admin-list-actions";


        const publishButton =
            document.createElement("button");

        publishButton.type =
            "button";

        publishButton.className =
            "admin-button";


        publishButton.textContent =
            post.published
                ? "Снять с публикации"
                : "Опубликовать";


        publishButton.addEventListener(
            "click",
            function() {

                toggleBlogPublished(
                    post.id,
                    !post.published
                );

            }
        );


        const deleteButton =
            document.createElement("button");

        deleteButton.type =
            "button";

        deleteButton.className =
            "admin-button admin-button-danger";

        deleteButton.textContent =
            "Удалить";


        deleteButton.addEventListener(
            "click",
            function() {

                deleteBlogPost(
                    post.id,
                    post.title
                );

            }
        );


        buttons.appendChild(
            publishButton
        );

        buttons.appendChild(
            deleteButton
        );


        item.appendChild(title);

        item.appendChild(date);

        item.appendChild(status);

        item.appendChild(buttons);


        blogList.appendChild(item);

    });

}


// ==================================================
// ПУБЛИКАЦИЯ БЛОГА
// ==================================================

async function toggleBlogPublished(
    postId,
    published
) {

    const {
        error
    } =
        await supabaseClient
            .from("blog_posts")
            .update({
                published: published
            })
            .eq(
                "id",
                postId
            );


    if (error) {

        console.error(error);

        alert(
            "Не удалось изменить статус публикации: " +
            error.message
        );

        return;

    }


    loadBlogPosts();

}


// ==================================================
// УДАЛЕНИЕ ПУБЛИКАЦИИ
// ==================================================

async function deleteBlogPost(
    postId,
    postTitle
) {

    const confirmed =
        confirm(
            'Удалить публикацию "' +
            postTitle +
            '"?'
        );


    if (!confirmed) {

        return;

    }


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

        alert(
            "Не удалось удалить публикацию: " +
            error.message
        );

        return;

    }


    loadBlogPosts();

}


// ==================================================
// ОТЗЫВЫ
// ==================================================

const reviewsList =
    document.querySelector("#reviewsList");


// ==================================================
// ЗАГРУЗКА ОТЗЫВОВ
// ==================================================

async function loadReviews() {

    if (!reviewsList) {

        return;

    }


    reviewsList.innerHTML = `
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
                "id, created_at, name, review_text, approved"
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(error);

        reviewsList.innerHTML = `
            <p class="reviews-message">
                Не удалось загрузить отзывы.
            </p>
        `;

        return;

    }


    if (!data || data.length === 0) {

        reviewsList.innerHTML = `
            <div class="empty-blog">

                <div class="empty-blog-icon">
                    ✦
                </div>

                <h3>
                    Пока нет отзывов
                </h3>

                <p>
                    Новые отзывы появятся здесь.
                </p>

            </div>
        `;

        return;

    }


    reviewsList.innerHTML = "";


    data.forEach(review => {

        const item =
            document.createElement("div");

        item.className =
            "admin-list-item";


        const name =
            document.createElement("h3");

        name.textContent =
            review.name;


        const text =
            document.createElement("p");

        text.textContent =
            review.review_text;


        const status =
            document.createElement("div");

        status.className =
            "admin-list-meta";

        status.textContent =
            review.approved
                ? "Опубликован"
                : "На модерации";


        const buttons =
            document.createElement("div");

        buttons.className =
            "admin-list-actions";


        if (!review.approved) {

            const approveButton =
                document.createElement("button");

            approveButton.type =
                "button";

            approveButton.className =
                "admin-button";

            approveButton.textContent =
                "Одобрить";


            approveButton.addEventListener(
                "click",
                function() {

                    approveReview(
                        review.id
                    );

                }
            );


            buttons.appendChild(
                approveButton
            );

        }


        const deleteButton =
            document.createElement("button");

        deleteButton.type =
            "button";

        deleteButton.className =
            "admin-button admin-button-danger";

        deleteButton.textContent =
            "Удалить";


        deleteButton.addEventListener(
            "click",
            function() {

                deleteReview(
                    review.id
                );

            }
        );


        buttons.appendChild(
            deleteButton
        );


        item.appendChild(name);

        item.appendChild(text);

        item.appendChild(status);

        item.appendChild(buttons);


        reviewsList.appendChild(item);

    });

}


// ==================================================
// ОДОБРЕНИЕ ОТЗЫВА
// ==================================================

async function approveReview(
    reviewId
) {

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

        alert(
            "Не удалось одобрить отзыв: " +
            error.message
        );

        return;

    }


    loadReviews();

}


// ==================================================
// УДАЛЕНИЕ ОТЗЫВА
// ==================================================

async function deleteReview(
    reviewId
) {

    const confirmed =
        confirm(
            "Удалить этот отзыв?"
        );


    if (!confirmed) {

        return;

    }


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

        alert(
            "Не удалось удалить отзыв: " +
            error.message
        );

        return;

    }


    loadReviews();

}


// ==================================================
// ЗАПУСК
// ==================================================

checkSession();
