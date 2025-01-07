export interface popularMoviesTypes {
    page: number;
    total_pages: number;
    total_results: number;
    results: PopularMovie[];
}

export interface PopularMovie {
    adult: boolean;
    backdrop_path: string | null; // ممکن است null باشد اگر مسیری وجود نداشته باشد
    genre_ids: number[]; // آرایه‌ای از اعداد
    id: number; // شناسه‌ی فیلم
    original_language: string; // زبان اصلی فیلم (مانند "en" یا "es")
    original_title: string; // عنوان اصلی فیلم
    overview: string; // توضیحات فیلم
    popularity: number; // مقدار محبوبیت
    poster_path: string | null; // ممکن است null باشد اگر مسیری وجود نداشته باشد
    release_date: string; // تاریخ انتشار به فرمت "YYYY-MM-DD"
    title: string; // عنوان فیلم
    video: boolean; // آیا این ویدیو است؟
    vote_average: number; // میانگین امتیازات
    vote_count: number; // تعداد آرا
}
