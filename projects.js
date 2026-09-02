const SUPABASE_URL =
    "https://cqhhshrabncntkcnkrym.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_jC2L087LA9OKoEslfgEH8Q_4WjciDSW";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
