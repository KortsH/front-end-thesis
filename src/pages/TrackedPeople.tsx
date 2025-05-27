/* File: src/pages/tracked-people.tsx */
import { useState, useEffect } from 'react';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import { useTranslations } from '../contexts/TranslationContext.tsx';
import { motion } from 'framer-motion';

interface Person {
  id: string;
  name: string;
  handle?: string;
  platform: string;
}

export default function TrackedPeoplePage() {
  const t = useTranslations('trackedPeople');
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/tracked_people')
      .then(res => res.json())
      .then(data => {
        const flatList: Person[] = [];
        Object.entries(data).forEach(([platform, value]) => {
          if (Array.isArray(value)) {
            value.forEach((name: string, idx: number) => {
              flatList.push({ id: `${platform}-${idx}`, name, platform });
            });
          } else if (value && typeof value === 'object') {
            Object.entries(value).forEach(([name, handle]) => {
              flatList.push({ id: `${platform}-${name}`, name, handle: String(handle), platform });
            });
          }
        });
        setPeople(flatList);
      })
      .catch(err => console.error('Failed to fetch tracked people', err));
  }, []);

  const handleAdd = () => {
    alert(t('add_alert'));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16">
        <motion.h1
          className="text-4xl font-bold text-gray-900 dark:text-white mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t('title')}
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {people.map((person, idx) => (
            <motion.div
              key={person.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md ring-1 ring-gray-200 dark:ring-gray-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{person.name}</p>
              {person.handle && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{person.handle}</p>
              )}
              <p className="mt-2 inline-block text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded-lg">
                {person.platform}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full shadow-lg transition-transform"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            {t('add_person')}
          </motion.button>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
