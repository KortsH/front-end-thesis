import { useState } from 'react';
import { useTranslations } from '../contexts/TranslationContext.tsx';
import { BlockItem }      from './BlockItem.tsx';
import MerkleTree         from './MerkleTree.tsx';

interface Block {
  index:       number;
  timestamp:   number;
  previousHash:string;
  hash:        string;
  nonce:       number;
  records?:    Array<{ recordId: string; commitment: string }>;
}

interface MerkleBlockItemProps {
  chain: Block[];
  initialIndex: number;
}

export default function MerkleBlockItem({
  chain,
  initialIndex
}: MerkleBlockItemProps) {
  const [showTree, setShowTree]     = useState(false);
  const [currentIdx, setCurrentIdx] = useState(initialIndex);
  const t = useTranslations('blockchain');

  const block = chain.find(b => b.index === currentIdx)!;

  const cm = (block.records || []).map(r => r.commitment);
  while (cm.length < 16) cm.push(cm[cm.length - 1] || '');

  const hasPrev = chain.some(b => b.index === currentIdx - 1);
  const hasNext = chain.some(b => b.index === currentIdx + 1);

  return (
    <div className="relative group mb-16">
      <BlockItem block={block} />

      <div className="
          absolute left-1/2 bottom-full -translate-x-1/2 mb-4
          opacity-0 group-hover:opacity-100
          pointer-events-auto
          bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-700
          rounded-lg shadow-lg text-xs font-mono
          text-gray-800 dark:text-gray-100 w-40
          z-50
          transition-opacity
        ">
        <button
          onClick={() => setShowTree(true)}
          className="
            w-full text-center
            bg-blue-500 text-white rounded py-1
            hover:bg-blue-600 transition-colors
          "
        >
          {t('view_merkle_tree')}
        </button>
      </div>

      {showTree && (
        <div className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black bg-opacity-50
          ">
          <div className="
              bg-white dark:bg-gray-800
              rounded-lg p-6
              max-w-[90vw] max-h-[90vh]
              overflow-auto
              relative
            ">
            <button
              onClick={() => setShowTree(false)}
              className="
                absolute top-2 right-2
                text-gray-600 dark:text-gray-300
                hover:text-gray-800 dark:hover:text-white
              "
            >
              ✕
            </button>

            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={() => hasPrev && setCurrentIdx(currentIdx - 1)}
                disabled={!hasPrev}
                className="px-3 py-1 rounded text-lg font-bold
                          text-gray-800 dark:text-white
                          bg-gray-200 dark:bg-gray-700
                          disabled:opacity-30 transition-colors"
              >
                &lt;
              </button>
              <h2 className="text-xl font-semibold dark:text-gray-100">
                {t('merkle_tree_for_block')} #{block.index}
              </h2>
              <button
                onClick={() => hasNext && setCurrentIdx(currentIdx + 1)}
                disabled={!hasNext}
                className="px-3 py-1 rounded text-lg font-bold
                          text-gray-800 dark:text-white
                          bg-gray-200 dark:bg-gray-700
                          disabled:opacity-30 transition-colors"
              >
                &gt;
              </button>
            </div>

            <div className="w-[1500px] mx-auto">
              <MerkleTree commitments={cm} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
