// Настройки сайта Lemon Score.
// Адрес и ключ — те же, что в lemon-score/config.js (публичный ключ anon / publishable).
// НИКОГДА не вставляйте сюда secret / service_role ключ: сайт видят все.
window.LEMON_CONFIG = {
  SUPABASE_URL: 'https://uhxmxanuayxlzhmednbx.supabase.co',
  SUPABASE_KEY:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoeG14YW51YXl4bHpobWVkbmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MTI1OTksImV4cCI6MjEwODk4ODU5OX0.3tSnb9tXnJqwfcadyYVO956BaIMj9140T8WKRTdIruc',
  // Ссылка «Установить расширение». Пока расширения нет в Chrome Web Store, можно оставить ссылку на README.
  INSTALL_URL: 'https://chromewebstore.google.com/',
  // Держать в синхроне с CONFIDENT_RATINGS в content.js и _site_verdict в schema.sql
  CONFIDENT_RATINGS: 3,
  PAGE_SIZE: 24,
};
