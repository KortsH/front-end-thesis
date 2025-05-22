import { Link } from 'react-router-dom'
import Header from '../components/Header.tsx'
import { useTranslations } from '../contexts/TranslationContext.tsx';
import ExtensionInstructions from "../components/ExtensionInstructions.tsx";
import Footer from '../components/Footer.tsx';
import LinkButton from '../components/LinkButton.tsx';

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-5xl font-extrabold leading-tight max-w-3xl mx-auto text-gray-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t("description")}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <LinkButton
            to="/chain"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
          >
            {t("view_chain")}
          </LinkButton>

          <LinkButton
            to="/quotes"
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 text-lg"
          >
            {t("view_quotes")}
          </LinkButton>

          <LinkButton
            to="/demo"
            className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
          >
            ▶️ {t("try_demo")}
          </LinkButton>
        </div>

        <div className="mt-12 w-full max-w-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg transition-transform transform hover:scale-[1.01] text-gray-900 dark:text-gray-100">
          <ExtensionInstructions />
        </div>
      </main>

      <Footer />
    </div>
  )
}
