import { useEffect, useState } from 'react'
import { getChain } from '../utils/api.ts'

interface Block {
  index: number
  timestamp: number
  data: any
  previousHash: string
  hash: string
}

export default function Blockchain() {
  const [chain, setChain] = useState<Block[]>([])
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    getChain()
      .then(setChain)
      .catch(err => setError(err.message))
  }, [])

  if (error) return <p className="p-6 text-red-600">Error: {error}</p>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-6">🔗 Blockchain</h1>
        {chain.map(b => (
          <div key={b.index} className="mb-4 p-4 bg-white rounded-xl shadow">
            <div className="flex justify-between">
              <span className="font-semibold">Block #{b.index}</span>
              <span className="text-sm text-gray-500">
                {new Date(b.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="mt-2 text-sm"><strong>Hash:</strong> {b.hash}</p>
            <p className="text-sm"><strong>Prev:</strong> {b.previousHash}</p>
            <details className="mt-2 bg-gray-100 p-2 rounded">
              <summary className="cursor-pointer">View Data</summary>
              <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(b.data, null, 2)}</pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  )
}
