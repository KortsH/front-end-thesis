import { useEffect } from 'react'

declare global {
  interface Window {
    twttr: any;
  }
}

interface Props { tweetId: string }

export default function TweetEmbed({ tweetId }: Props) {
  useEffect(() => {
    window.twttr?.widgets.load()
  }, [tweetId])

  return (
    <blockquote className="twitter-tweet" data-theme="light">
      <a href={`https://twitter.com/user/status/${tweetId}`}></a>
    </blockquote>
  )
}
