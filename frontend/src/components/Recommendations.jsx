import React, { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export default function Recommendations({ token, onRecommendationsReceived }) {
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [error, setError] = useState('')

  async function getRecommendations() {
    setLoading(true)
    setError('')
    setRecommendations([])

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/recommendations`,
        { userPreferences: {} },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setRecommendations(res.data.recommendations || [])
      if (onRecommendationsReceived) {
        onRecommendationsReceived(res.data.recommendations)
      }
    } catch (e) {
      console.error('Failed to get recommendations:', e)
      setError(e.response?.data?.error || 'Failed to get recommendations')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">✨ AI Recommendations</h2>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-100 text-red-800 text-sm font-medium">
          ✗ {error}
        </div>
      )}

      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Get personalized outfit recommendations based on your preferences.</p>
          <button
            onClick={getRecommendations}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-md font-semibold transition-all"
          >
            {loading ? 'Getting Recommendations...' : '🎯 Get AI Pick'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mb-4">
            <button
              onClick={getRecommendations}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-md text-sm font-semibold transition-colors"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          {recommendations.map((rec, idx) => (
            <div key={rec.id || idx} className="p-4 border border-purple-200 rounded-md hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-purple-700">{rec.title}</h3>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                  #{rec.rank || 'Top'}
                </span>
              </div>
              {rec.reason && (
                <p className="text-sm text-gray-700 mt-2 italic">💡 {rec.reason}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-1">
                {rec.country && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{rec.country}</span>}
                {rec.season && <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">{rec.season}</span>}
                {rec.festival && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">{rec.festival}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
