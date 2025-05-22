import { useEffect, useState } from 'react'
import { useTranslations } from '../contexts/TranslationContext.tsx'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import SliderButton from '../components/SliderButton.tsx'

import type { Quote } from '../types/Quote.ts'
import { getQuotes, getHashedQuotes } from '../utils/api.ts'

export default function Quotes() {
  const t = useTranslations('quotes')
  const [chainType, setChainType] = useState("raw");
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [search, setSearch] = useState('')
  const [filterAuthor, setFilterAuthor] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setQuotes([])

    if (chainType === "raw") {
      getQuotes(search, filterAuthor)
      .then(data => setQuotes(data))
      .catch(err => console.error('Error fetching quotes:', err))
      .finally(() => setLoading(false))
    }

    if (chainType === "hashed") {
      getHashedQuotes(search, filterAuthor)
      .then(data => setQuotes(data))
      .catch(err => console.error('Error fetching quotes:', err))
      .finally(() => setLoading(false))
    }
  }, [search, filterAuthor, chainType])

  const authors = Array.from(new Set(quotes.map(q => q.poster)))

  const filtered = quotes.filter(q => {
    const matchesText = q.content.toLowerCase().includes(search.toLowerCase())
    const matchesAuthor = filterAuthor ? q.poster === filterAuthor : true
    return matchesText && matchesAuthor
  })

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Header />

      <SliderButton
        options={["raw","hashed"]}
        value={chainType}
        onChange={setChainType}
        capitalize={false}
        className="mt-4 mx-auto bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
      />


      <div className="flex-grow py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-extrabold mb-8 text-center">
            {t('quotes_title')}
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <select
              value={filterAuthor}
              onChange={e => setFilterAuthor(e.target.value)}
              className="w-full md:w-1/4 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">{t('filter_all')}</option>
              {authors.map(author => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-center">{t('loading')}</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              {t('no_results')}
            </p>
          ) : (
            <div>
              <AnimatePresence>
                {filtered.map(q => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow hover:shadow-lg transform hover:scale-[1.02] transition"
                  >
                    <p className="text-lg mb-2">“{q.content}”</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      — {q.poster}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
