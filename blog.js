const SUPABASE_URL = "https://cqhhshrabncntkcnkrym.supabase.co";

const SUPABASE_KEY = "sb_publishable_jC2L087LA9OKoEslfgEH8Q_4WjciDSW";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// =========================================
// ЭЛЕМЕНТЫ СТРАНИЦЫ
// =========================================

const blogPosts =
    document.querySelector("#blogPosts");


// =========================================
// ЗАГРУЗКА ПУБЛИКАЦИЙ
// =========================================

async function loadBlogPosts() {

    blogPosts.innerHTML = `
        <p class="reviews-message">
            Загружаем публикации...
        </p>
    `;


    const {
        data,
        error
    } = await supabaseClient
        .from("blog_posts")
        .select(
            "id, title, content, created_at"
        )
        .eq("published", true)
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(error);

        blogPosts.innerHTML = `
            <p class="reviews-message">
                Не удалось загрузить публикации.
            </p>
        `;

        return;
    }


    if (!data || data.length === 0) {

        blogPosts.innerHTML = `
            <div class="empty-blog">

                <div class="empty-blog-icon">
                    ✦
                </div>

                <h3>
                    Пока нет публикаций
                </h3>

                <p>
                    Новые материалы появятся здесь позже.
                </p>

            </div>
        `;

        return;
    }


    blogPosts.innerHTML = "";


    data.forEach(post => {

        const article =
            document.createElement("article");

        article.className =
            "blog-post";


        // =================================
        // ДАТА
        // =================================

        const date =
            document.createElement("div");

        date.className =
            "blog-post-date";

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


        // =================================
        // ЗАГОЛОВОК
        // =================================

        const title =
            document.createElement("h2");

        title.className =
            "blog-post-title";

        title.textContent =
            post.title;


        // =================================
        // ТЕКСТ
        // =================================

        const content =
            document.createElement("div");

        content.className =
            "blog-post-content";


        /*
         * textContent специально используется
         * вместо innerHTML.
         *
         * Это защищает сайт от вставки
         * произвольного HTML/JavaScript
         * через публикацию.
         */

        const paragraphs =
            post.content.split(/\n\s*\n/);


        paragraphs.forEach(paragraphText => {

            const paragraph =
                document.createElement("p");

            paragraph.textContent =
                paragraphText.trim();

            if (
                paragraph.textContent
            ) {

                content.appendChild(
                    paragraph
                );

            }

        });


        // =================================
        // СОБИРАЕМ СТАТЬЮ
        // =================================

        article.appendChild(date);

        article.appendChild(title);

        article.appendChild(content);


        blogPosts.appendChild(article);

    });

}


// =========================================
// ЗАПУСК
// =========================================

loadBlogPosts();
