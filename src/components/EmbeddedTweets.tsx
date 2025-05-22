import { useEffect, useState } from 'react'
import TweetEmbed from '../components/Tweet.tsx' 
import tweetIds from '../assets/demoTweets.json'
import { useTranslations } from '../contexts/TranslationContext.tsx'

export default function EmbeddedTweets() {
  const t = useTranslations('demo');
    const [hydrated, setHydrated] = useState(false)
  
    useEffect(() => {
      setHydrated(true)
      if (!window.twttr) {
        const s = document.createElement('script')
        s.src = 'https://platform.twitter.com/widgets.js'
        s.async = true
        document.body.appendChild(s)
      }
    }, [])
  
  return (
    <section className="flex-grow px-6 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {t('section_tweets')}
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {hydrated &&
          tweetIds.map((id: string) => (
            <TweetEmbed key={id} tweetId={id} />
          ))}
      </div>
    </section>
  );
}