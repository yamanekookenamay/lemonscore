// Настройки сайта Lemon Score.
// Адрес и ключ — те же, что в lemon-score/config.js (публичный ключ anon / publishable).
// НИКОГДА не вставляйте сюда secret / service_role ключ: сайт видят все.
window.LEMON_CONFIG = {
  SUPABASE_URL: 'https://uhxmxanuayxlzhmednbx.supabase.co',
  SUPABASE_KEY:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoeG14YW51YXl4bHpobWVkbmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MTI1OTksImV4cCI6MjEwODk4ODU5OX0.3tSnb9tXnJqwfcadyYVO956BaIMj9140T8WKRTdIruc',
  // Куда ведёт кнопка «Установить расширение». Когда расширение появится в Chrome Web Store, впишите сюда его страницу.
  INSTALL_URL: '#/install',
  // Архив расширения рядом с сайтом. После изменений в расширении пересоберите его (см. README) и обновите версию и размер.
  EXTENSION_ZIP: 'lemon-score.zip',
  EXTENSION_VERSION: '0.3.0', // = "version" в lemon-score/manifest.json
  EXTENSION_ZIP_KB: 40,
  // Держать в синхроне с CONFIDENT_RATINGS в content.js и _site_verdict в schema.sql
  CONFIDENT_RATINGS: 3,
  PAGE_SIZE: 24,
};
