import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

interface SectionProps {
  title: string;
  content: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border-t border-gray-300 dark:border-gray-700 rounded overflow-hidden ${
        isOpen ? "bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-900"
      } transition-colors duration-200`}
    >
      <div
        className="flex justify-between items-center p-5 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {title}
        </h4>
        <div
          className={`transform transition-transform ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          <PlusIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { height: "auto", opacity: 1 },
              collapsed: { height: 0, opacity: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 text-gray-800 dark:text-gray-300">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Section;
