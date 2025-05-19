import { motion } from 'framer-motion'

interface Story {
  id: number
  title: string
  source: string
  url: string
  excerpt: string
  image: string
}

interface Props { story: Story }

export default function NewsCard({ story }: Props) {
  return (
    <motion.a
      href={story.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow hover:shadow-lg transform hover:scale-[1.01] transition"
    >
      <img src={story.image} alt={story.title} className="w-full h-40 object-cover rounded-md mb-4" />
      <h4 className="text-xl font-semibold mb-2">{story.title}</h4>
      <p className="text-gray-600 dark:text-gray-400 mb-2">{story.excerpt}</p>
      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{story.source}</span>
    </motion.a>
  )
}
