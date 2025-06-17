import { useEffect, useRef, useState } from 'react'
import LoadingAnimation from './LoadingAnimation.tsx'
import { useTheme } from '../contexts/ThemeContext.tsx'

declare global {
  interface Window { twttr?: any }
}

interface Props { tweetId: string }

export default function TweetEmbed({ tweetId }: Props) {
  const { theme } = useTheme()     
  const [resolved, setResolved] = useState<'light'|'dark'>(() =>
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark'
      : 'light'
  )
  const [loading, setLoading] = useState(true)
  const lightRef = useRef<HTMLDivElement>(null)
  const darkRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      const onChange = (e: MediaQueryListEvent) =>
        setResolved(e.matches ? 'dark' : 'light')
      mql.addEventListener('change', onChange)
      setResolved(mql.matches ? 'dark' : 'light')
      return () => mql.removeEventListener('change', onChange)
    }
    setResolved(theme)
  }, [theme])

  useEffect(() => {
    setLoading(true);
    lightRef.current!.innerHTML = '';
    darkRef.current! .innerHTML = '';
  
    const renderTweets = () => {
      if (!window.twttr?.widgets) {
        console.error('Twitter widgets not available');
        setLoading(false);
        return;
      }
  
      const lightPromise = window.twttr.widgets.createTweet(
        tweetId,
        lightRef.current!,
        { theme: 'light' }
      );
      const darkPromise = window.twttr.widgets.createTweet(
        tweetId,
        darkRef.current!,
        { theme: 'dark' }
      );
  
      const activePromise = resolved === 'light' ? lightPromise : darkPromise;
      activePromise
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    };
  
    if (window.twttr?.widgets) {
      renderTweets();
    } else {
      const SCRIPT_ID = 'twitter-wjs';
      let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  
      if (!script) {
        script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.addEventListener('load', renderTweets);
        document.body.appendChild(script);
      } else if ((script as any).readyState === 'complete') {
        renderTweets();
      } else {
        script.addEventListener('load', renderTweets);
      }
    }
  }, [tweetId, resolved]);  

  return (
    <div className="relative">
      {loading && <LoadingAnimation />}

      <div
        ref={lightRef}
        className={resolved === 'light'
          ? 'transition-opacity duration-200'
          : 'hidden'}
      />
      <div
        ref={darkRef}
        className={resolved === 'dark'
          ? 'transition-opacity duration-200'
          : 'hidden'}
      />
    </div>
  )
}
