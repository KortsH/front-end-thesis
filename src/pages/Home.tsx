import { Link } from 'react-router-dom'
import Header from '../components/Header.tsx'
import { useTranslations } from '../contexts/TranslationContext.tsx';
import ExtensionInstructions from "../components/ExtensionInstructions.tsx";
import Footer from '../components/Footer.tsx';
import LinkButton from '../components/LinkButton.tsx';

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
            <LinkButton to="/chain" className="bg-blue-600 hover:bg-blue-700">
              {t("view_chain")}
            </LinkButton>

            <LinkButton to="/quotes" className="bg-purple-600 hover:bg-purple-700">
              {t("view_quotes")}
            </LinkButton>

            <LinkButton to="/demo" className="bg-green-600 hover:bg-green-700">
              {t("try_demo")}
            </LinkButton>
          </div>

          <ExtensionInstructions />
        </main>

        <Footer />
      </div>
    </div>
  );
}