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

    const reviewsContainer = document.querySelector(".reviews");

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

        reviewsContainer.innerHTML = `
            <p class="reviews-message">
                Не удалось загрузить отзывы.
            </p>
        `;

        return;
    }


    // Если отзывов пока нет

    if (!data || data.length === 0) {

        reviewsContainer.innerHTML = `
            <p class="reviews-message">
                Отзывов пока нет. Будьте первым!
            </p>
        `;

        return;
    }


    // Выводим отзывы

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
// ЗАПУСК
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    loadReviews();

});
