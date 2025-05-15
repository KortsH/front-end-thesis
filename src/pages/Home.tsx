import { Link } from 'react-router-dom'
import Header from '../components/Header.tsx'
import { useTranslations } from '../contexts/TranslationContext.tsx';

export default function Home() {
  const t = useTranslations("home");

  return (
    <div>
      <Header />
      <div className="min-h-screen flex flex-col bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
        <main className="flex-1 container mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-extrabold">{t("title")}</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              {t("description")}
            </p>
            <Link
              to="/chain"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
            >
              {t("view_chain")}
            </Link>
          </div>
        </main>

        <footer className="bg-gray-100 dark:bg-gray-800 text-center py-4">
          <small className="text-gray-500 dark:text-gray-400">Your University • Year 3 Thesis</small>
        </footer>
      </div>
    </div>
  );
}