import { useState, useEffect } from 'react'
import { useTranslations } from '../contexts/TranslationContext.tsx'
import Header from '../components/Header.tsx'
import DemoInstructions from '../components/DemoInstructions.tsx'
import EmbeddedTweets from '../components/EmbeddedTweets.tsx'
import TwitterLink from '../components/TwitterLink.tsx'

import Footer from '../components/Footer.tsx'

export default function DemoPage() {
  // const t = useTranslations('demo')

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <DemoInstructions />
      <TwitterLink />
      <EmbeddedTweets />

      <Footer />
    </div>
  )
}
