import { useTranslations } from '../contexts/TranslationContext.tsx'
import Header from '../components/Header.tsx'
import DemoInstructions from '../components/DemoInstructions.tsx'
import TweetEmbed from '../components/Tweet.tsx'
import tweetIds from '../assets/demoTweets.json'
import Footer from '../components/Footer.tsx'

export default function InstructionPanel() {
  const t = useTranslations('demo')
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Header />
      <DemoInstructions />

      <section className="flex-grow px-6 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {t('section_tweets')}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {tweetIds.map(id => (
            <TweetEmbed key={id} tweetId={id} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
