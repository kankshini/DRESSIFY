import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export default function OutfitCard({ outfit }) {
  const [suggestions, setSuggestions] = useState(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (expanded) fetchSuggestions()
  }, [expanded])

  async function fetchSuggestions() {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/suggestions`)
      const relevant = res.data.data?.find(s => s.outfitTitle === outfit.title)
      setSuggestions(relevant)
    } catch (e) {
      console.error('Failed to fetch suggestions', e)
    }
  }

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-purple-700">{outfit.title}</h3>
        <p className="text-gray-600 mt-2">{outfit.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {outfit.country && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{outfit.country}</span>}
          {outfit.gender && <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium">{outfit.gender}</span>}
          {outfit.season && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">{outfit.season}</span>}
          {outfit.festival && <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">{outfit.festival}</span>}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold transition-colors"
        >
          {expanded ? 'Hide Details' : 'View Styling Details'}
        </button>

        {expanded && suggestions && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="mb-3">
              <h4 className="font-semibold text-gray-800">Accessories</h4>
              <p className="text-sm text-gray-600">{suggestions.accessories?.join(', ') || 'N/A'}</p>
            </div>
            <div className="mb-3">
              <h4 className="font-semibold text-gray-800">Makeup Suggestion</h4>
              <p className="text-sm text-gray-600">{suggestions.makeup || 'N/A'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Hairstyle</h4>
              <p className="text-sm text-gray-600">{suggestions.hairstyle || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
