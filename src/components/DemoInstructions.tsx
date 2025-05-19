import { useTranslations } from '../contexts/TranslationContext.tsx'
import { motion } from 'framer-motion'

export default function DemoInstructions() {
  const t = useTranslations('demo')
  return (
    <motion.div
      className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-6 shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-2xl font-semibold mb-4 dark:text-white">{t('instructions_title')}</h3>
      <ul className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>{t('instructions_step1')}</li>
        <li>{t('instructions_step2')}</li>
        <li>{t('instructions_step3')}</li>
      </ul>
    </motion.div>
  )
}
