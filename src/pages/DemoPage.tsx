import { useTranslations } from '../contexts/TranslationContext.tsx'
import Header from '../components/Header.tsx'
import DemoInstructions from '../components/DemoInstructions.tsx'
import TweetEmbed from '../components/Tweet.tsx'
import tweetIds from '../assets/demoTweets.json'


export default function InstructionPanel() {
  const t = useTranslations('demo')
  return (
    <div>
      <Header />
      <DemoInstructions />
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">
          {t('section_tweets')}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {tweetIds.map(id => (
            <TweetEmbed key={id} tweetId={id} />
          ))}
        </div>
      </section>
    </div>
  )
}
