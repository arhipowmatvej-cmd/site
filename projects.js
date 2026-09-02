/* =========================================================
   СТИЛИ ОКНА ПРОЕКТА
========================================================= */

const projectStyles = document.createElement("style");

projectStyles.textContent = `
/* =========================
   СПИСОК ПРОЕКТОВ
========================= */
#projectsList {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 25px;
}


/* =========================
   КАРТОЧКА
========================= */

.project-card {
    position: relative;

    display: flex;
    flex-direction: column;

    min-height: 280px;

    padding: 30px;

    overflow: hidden;

    border: 1px solid rgba(255, 255, 255, 0.10);

    border-radius: 22px;

    background:
        linear-gradient(
            145deg,
            rgba(99, 213, 162, 0.055),
            rgba(255, 255, 255, 0.018)
        );

    cursor: pointer;

    transition:
        transform 0.3s ease,
        border-color 0.3s ease,
        box-shadow 0.3s ease,
        background 0.3s ease;
}


.project-card::before {

    content: "";

    position: absolute;

    top: 0;
    left: 0;

    width: 100%;
    height: 3px;

    background: rgba(99, 213, 162, 0.55);

    opacity: 0.7;

    transition: opacity 0.3s ease;

}


.project-card:hover {

    transform: translateY(-7px);

    border-color:
        rgba(99, 213, 162, 0.40);

    box-shadow:
        0 25px 70px rgba(0, 0, 0, 0.30);

    background:
        linear-gradient(
            145deg,
            rgba(99, 213, 162, 0.08),
            rgba(255, 255, 255, 0.025)
        );
}


.project-card:hover::before {
    opacity: 1;
}


/* =========================
   ВЕРХ КАРТОЧКИ
========================= */

.project-card-top {

    display: flex;

    align-items: center;

    justify-content: space-between;

    margin-bottom: 25px;
}


.project-number {

    color: rgba(99, 213, 162, 0.65);

    font-size: 12px;

    font-weight: 700;

    letter-spacing: 2px;
}


.project-category {

    color: #63d5a2;

    font-size: 11px;

    font-weight: 700;

    letter-spacing: 2px;

    text-transform: uppercase;
}


/* =========================
   ЗАГОЛОВОК
========================= */

.project-card h3 {

    margin: 0 0 15px;

    color: #edf7f1;

    font-size: 27px;

    line-height: 1.2;

    letter-spacing: -0.8px;
}


/* =========================
   КРАТКОЕ ОПИСАНИЕ
========================= */

.project-short-description {

    margin: 0;

    color: #aebbb4;

    font-size: 16px;

    line-height: 1.7;
}


/* =========================
   НИЗ КАРТОЧКИ
========================= */

.project-card-footer {

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 15px;

    margin-top: auto;

    padding-top: 30px;
}


.project-open-label {

    color: #7f8d86;

    font-size: 13px;

    transition:
        color 0.25s ease,
        transform 0.25s ease;
}


.project-card:hover
.project-open-label {

    color: #63d5a2;

    transform: translateX(4px);
}


/* =========================
   МОДАЛЬНОЕ ОКНО
========================= */

.project-modal {

    position: fixed;

    inset: 0;

    z-index: 9999;

    display: flex;

    align-items: center;

    justify-content: center;

    padding: 30px;

    background:
        rgba(2, 8, 6, 0.78);

    backdrop-filter:
        blur(12px);

    -webkit-backdrop-filter:
        blur(12px);

    opacity: 0;

    visibility: hidden;

    pointer-events: none;

    transition:
        opacity 0.3s ease,
        visibility 0.3s ease;
}


.project-modal.active {

    opacity: 1;

    visibility: visible;

    pointer-events: auto;
}


/* =========================
   ОКНО СОДЕРЖИМОГО
========================= */

.project-modal-content {

    position: relative;

    width: min(900px, 100%);

    max-height: min(820px, 90vh);

    overflow-y: auto;

    padding: 50px;

    border:
        1px solid
        rgba(99, 213, 162, 0.22);

    border-radius: 28px;

    background:
        linear-gradient(
            145deg,
            #101a16,
            #0b1210
        );

    box-shadow:
        0 40px 120px rgba(0, 0, 0, 0.55);

    transform:
        translateY(25px)
        scale(0.97);

    transition:
        transform 0.35s ease;
}


.project-modal.active
.project-modal-content {

    transform:
        translateY(0)
        scale(1);
}


/* =========================
   КНОПКА ЗАКРЫТЬ
========================= */

.project-modal-close {

    position: absolute;

    top: 22px;
    right: 22px;

    display: flex;

    align-items: center;

    justify-content: center;

    width: 42px;
    height: 42px;

    border:
        1px solid
        rgba(255, 255, 255, 0.10);

    border-radius: 50%;

    background:
        rgba(255, 255, 255, 0.04);

    color: #aebbb4;

    font-size: 25px;

    line-height: 1;

    cursor: pointer;

    transition:
        background 0.25s ease,
        color 0.25s ease,
        border-color 0.25s ease,
        transform 0.25s ease;
}


.project-modal-close:hover {

    color: #63d5a2;

    border-color:
        rgba(99, 213, 162, 0.40);

    background:
        rgba(99, 213, 162, 0.08);

    transform: rotate(90deg);
}


/* =========================
   СОДЕРЖИМОЕ МОДАЛКИ
========================= */

.project-modal-category {

    margin-bottom: 15px;

    color: #63d5a2;

    font-size: 11px;

    font-weight: 700;

    letter-spacing: 2.5px;

    text-transform: uppercase;
}


.project-modal-title {

    margin: 0 55px 25px 0;

    color: #edf7f1;

    font-size: clamp(32px, 5vw, 52px);

    line-height: 1.08;

    letter-spacing: -1.5px;
}


.project-modal-short {

    margin-bottom: 30px;

    color: #aebbb4;

    font-size: 18px;

    line-height: 1.7;
}


.project-modal-divider {

    width: 100%;

    height: 1px;

    margin-bottom: 30px;

    background:
        rgba(255, 255, 255, 0.08);
}


.project-modal-description {

    color: #c4cec9;

    font-size: 16px;

    line-height: 1.85;

    white-space: pre-line;
}


.project-modal-actions {

    display: flex;

    align-items: center;

    gap: 15px;

    margin-top: 40px;
}


.project-modal-link {

    display: inline-flex;

    align-items: center;

    justify-content: center;

    padding: 13px 22px;

    border:
        1px solid
        rgba(99, 213, 162, 0.35);

    border-radius: 12px;

    background:
        rgba(99, 213, 162, 0.08);

    color: #63d5a2;

    font-size: 14px;

    font-weight: 600;

    text-decoration: none;

    transition:
        background 0.25s ease,
        border-color 0.25s ease,
        transform 0.25s ease;
}


.project-modal-link:hover {

    background:
        rgba(99, 213, 162, 0.15);

    border-color:
        rgba(99, 213, 162, 0.60);

    transform:
        translateY(-2px);
}


/* =========================
   МОБИЛЬНАЯ ВЕРСИЯ
========================= */

@media (max-width: 700px) {

    #projectsList {

        grid-template-columns: 1fr;

        gap: 18px;
    }


    .project-card {

        min-height: 250px;

        padding: 25px;
    }


    .project-card h3 {

        font-size: 24px;
    }


    .project-modal {

        padding: 15px;
    }


    .project-modal-content {

        max-height: 92vh;

        padding: 35px 25px;

        border-radius: 22px;
    }


    .project-modal-title {

        font-size: 34px;

        margin-right: 40px;
    }


    .project-modal-short {

        font-size: 16px;
    }


    .project-modal-description {

        font-size: 15px;

        line-height: 1.75;
    }


    .project-modal-actions {

        flex-direction: column;

        align-items: stretch;
    }


    .project-modal-link {

        width: 100%;
    }

}


/* =========================
   БЛОКИРОВКА ПРОКРУТКИ
========================= */

body.project-modal-open {

    overflow: hidden;
}
`;

document.head.appendChild(projectStyles);


/* =========================================================
   СОЗДАНИЕ МОДАЛЬНОГО ОКНА
========================================================= */

function createProjectModal() {

    const modal = document.createElement("div");

    modal.className = "project-modal";

    modal.id = "projectModal";

    modal.innerHTML = `

        <div class="project-modal-content">

            <button
                class="project-modal-close"
                id="projectModalClose"
                type="button"
                aria-label="Закрыть"
            >
                ×
            </button>


            <div
                class="project-modal-category"
                id="projectModalCategory"
            ></div>


            <h2
                class="project-modal-title"
                id="projectModalTitle"
            ></h2>


            <p
                class="project-modal-short"
                id="projectModalShort"
            ></p>


            <div
                class="project-modal-divider"
            ></div>


            <div
                class="project-modal-description"
                id="projectModalDescription"
            ></div>


            <div
                class="project-modal-actions"
                id="projectModalActions"
            ></div>

        </div>

    `;


    document.body.appendChild(modal);


    const closeButton =
        document.getElementById(
            "projectModalClose"
        );


    closeButton.addEventListener(
        "click",
        closeProjectModal
    );


    modal.addEventListener(
        "click",
        function(event) {

            if (event.target === modal) {

                closeProjectModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains("active")
            ) {

                closeProjectModal();

            }

        }
    );

}


/* =========================================================
   ОТКРЫТЬ ПРОЕКТ
========================================================= */

function openProjectModal(project) {

    const modal =
        document.getElementById(
            "projectModal"
        );


    const category =
        document.getElementById(
            "projectModalCategory"
        );


    const title =
        document.getElementById(
            "projectModalTitle"
        );


    const shortDescription =
        document.getElementById(
            "projectModalShort"
        );


    const description =
        document.getElementById(
            "projectModalDescription"
        );


    const actions =
        document.getElementById(
            "projectModalActions"
        );


    category.textContent =
        project.category || "ПРОЕКТ";


    title.textContent =
        project.title || "Без названия";


    shortDescription.textContent =
        project.short_description || "";


    description.textContent =
        project.description ||
        "Подробная информация о проекте пока не добавлена.";


    actions.innerHTML = "";


    if (project.project_url) {

        const link =
            document.createElement("a");


        link.className =
            "project-modal-link";


        link.href =
            project.project_url;


        link.target =
            "_blank";


        link.rel =
            "noopener noreferrer";


        link.textContent =
            "Открыть проект →";


        actions.appendChild(link);

    }


    modal.classList.add("active");


    document.body.classList.add(
        "project-modal-open"
    );

}


/* =========================================================
   ЗАКРЫТЬ ПРОЕКТ
========================================================= */

function closeProjectModal() {

    const modal =
        document.getElementById(
            "projectModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove("active");


    document.body.classList.remove(
        "project-modal-open"
    );

}


/* =========================================================
   ЗАГРУЗКА ПРОЕКТОВ
========================================================= */

async function loadProjects() {

    const projectsList =
        document.getElementById(
            "projectsList"
        );


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
    } = await supabaseClient

        .from("projects")

        .select("*")

        .eq("published", true)

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Ошибка загрузки проектов:",
            error
        );


        projectsList.innerHTML = `

            <div class="empty-blog">

                <div class="empty-blog-icon">
                    !
                </div>

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


    data.forEach(
        (project, index) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "project-card";


            card.setAttribute(
                "tabindex",
                "0"
            );


            card.setAttribute(
                "role",
                "button"
            );


            /* Верх */

            const top =
                document.createElement(
                    "div"
                );


            top.className =
                "project-card-top";


            const number =
                document.createElement(
                    "span"
                );


            number.className =
                "project-number";


            number.textContent =
                String(index + 1)
                    .padStart(2, "0");


            top.appendChild(number);


            if (project.category) {

                const category =
                    document.createElement(
                        "span"
                    );


                category.className =
                    "project-category";


                category.textContent =
                    project.category;


                top.appendChild(
                    category
                );

            }


            card.appendChild(top);


            /* Заголовок */

            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =
                project.title ||
                "Без названия";


            card.appendChild(title);


            /* Краткое описание */

            if (
                project.short_description
            ) {

                const shortDescription =
                    document.createElement(
                        "p"
                    );


                shortDescription.className =
                    "project-short-description";


                shortDescription.textContent =
                    project.short_description;


                card.appendChild(
                    shortDescription
                );

            }


            /* Нижняя часть */

            const footer =
                document.createElement(
                    "div"
                );


            footer.className =
                "project-card-footer";


            const openLabel =
                document.createElement(
                    "span"
                );


            openLabel.className =
                "project-open-label";


            openLabel.textContent =
                "Подробнее →";


            footer.appendChild(
                openLabel
            );


            card.appendChild(
                footer
            );


            /* Открытие по клику */

            card.addEventListener(
                "click",
                function() {

                    openProjectModal(
                        project
                    );

                }
            );


            /* Открытие клавишей Enter */

            card.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        openProjectModal(
                            project
                        );

                    }

                }
            );


            projectsList.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   ЗАПУСК
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        createProjectModal();

        loadProjects();

    }
);
