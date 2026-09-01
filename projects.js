const SUPABASE_URL = "https://cqhhshrabncntkcnkrym.supabase.co";
const SUPABASE_KEY = "sb_publishable_jC2L087LA9OKoEslfgEH8Q_4WjciDSW";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


async function loadProjects() {

    const projectsList = document.getElementById("projectsList");

    if (!projectsList) {
        return;
    }


    projectsList.innerHTML = `
        <p class="reviews-message">
            Загружаем проекты...
        </p>
    `;


    const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error("Ошибка загрузки проектов:", error);

        projectsList.innerHTML = `
            <div class="empty-blog">
                <div class="empty-blog-icon">!</div>

                <h3>
                    Не удалось загрузить проекты
                </h3>

                <p>
                    Попробуйте обновить страницу позже.
                </p>
            </div>
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
                    Новые проекты появятся здесь позже.
                </p>

            </div>
        `;

        return;
    }


    projectsList.innerHTML = "";


    data.forEach(project => {

        const article = document.createElement("article");

        article.className = "blog-card project-card";


        if (project.image_url) {

            const image = document.createElement("img");

            image.className = "project-image";

            image.src = project.image_url;

            image.alt = project.title || "Проект";

            image.loading = "lazy";

            article.appendChild(image);
        }


        const content = document.createElement("div");

        content.className = "project-card-content";


        if (project.category) {

            const category = document.createElement("div");

            category.className = "project-category";

            category.textContent = project.category;

            content.appendChild(category);
        }


        const title = document.createElement("h3");

        title.textContent = project.title || "Без названия";

        content.appendChild(title);


        if (project.short_description) {

            const shortDescription = document.createElement("p");

            shortDescription.className = "project-short-description";

            shortDescription.textContent = project.short_description;

            content.appendChild(shortDescription);
        }


        if (project.description) {

            const description = document.createElement("p");

            description.className = "project-description";

            description.textContent = project.description;

            content.appendChild(description);
        }


        if (project.project_url) {

            const link = document.createElement("a");

            link.className = "button project-button";

            link.href = project.project_url;

            link.target = "_blank";

            link.rel = "noopener noreferrer";

            link.textContent = "Подробнее →";

            content.appendChild(link);
        }


        article.appendChild(content);

        projectsList.appendChild(article);

    });

}


document.addEventListener(
    "DOMContentLoaded",
    loadProjects
);
