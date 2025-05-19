import React from 'react'
import { motion } from 'framer-motion'

interface Quote { id: number; text: string; author: string; source: string }

interface Props { quote: Quote }

export default function QuoteCard({ quote }: Props) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow hover:shadow-lg transition"
    >
      <p className="text-lg mb-2">“{quote.text}”</p>
      <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-4">
        — {quote.author} ({quote.source})
      </p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition" onClick={() => alert('Not working yet, just made the UI')}>
        Verify on Blockchain
      </button>
    </motion.div>
  )
}
