import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export default function OutfitCard({ outfit, token }) {
  const [suggestions, setSuggestions] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

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

  async function handleSave() {
    if (!token) return
    
    setSaving(true)
    try {
      await axios.post(`${API_BASE_URL}/api/user/saved-outfits`, 
        { outfitId: outfit.id, title: outfit.title },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error('Failed to save outfit:', e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold text-purple-700">{outfit.title}</h3>
          {token && (
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${
                saved
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              {saved ? '✓ Saved' : '♡ Save'}
            </button>
          )}
        </div>
        
        <p className="text-gray-600 mt-2">{outfit.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {outfit.country && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{outfit.country}</span>}
          {outfit.gender && <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium">{outfit.gender}</span>}
          {outfit.season && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">{outfit.season}</span>}
          {outfit.festival && <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">{outfit.festival}</span>}
        </div>

        {outfit.colors && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-700 mb-2">Colors:</p>
            <div className="flex gap-2">
              {outfit.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  title={color}
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              ))}
            </div>
          </div>
        )}

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
