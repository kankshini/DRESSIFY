import React, { useEffect, useState } from 'react'
import Filters from './components/Filters'
import OutfitCard from './components/OutfitCard'
import Profile from './components/Profile'
import ImageUpload from './components/ImageUpload'
import Recommendations from './components/Recommendations'
import Auth from './components/Auth'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'))
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')
  
  // Home page state
  const [filters, setFilters] = useState({ country: '', gender: '', season: '', festival: '' })
  const [outfits, setOutfits] = useState([])
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    if (token) {
      // Verify token is still valid
      axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('authToken')
        setCurrentPage('auth')
      })
    }
  }, [token])

  async function fetchOutfits() {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE_URL}/api/outfits`, { params: filters })
      setOutfits(res.data.data || [])
    } catch (e) {
      console.error('Failed to fetch outfits', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentPage === 'home') {
      fetchOutfits()
    }
  }, [filters, currentPage])

  function onFilterChange(next) {
    setFilters(next)
  }

  function handleAuthSuccess(newToken, newUser) {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('authToken', newToken)
    setCurrentPage('home')
  }

  function handleLogout() {
    setToken(null)
    setUser(null)
    localStorage.removeItem('authToken')
    setCurrentPage('auth')
  }

  // Show auth page if not logged in
  if (!token) {
    return <Auth onAuthSuccess={handleAuthSuccess} onLogout={handleLogout} />
  }

  // Render different pages based on currentPage
  if (currentPage === 'profile') {
    return <Profile token={token} onLogout={handleLogout} />
  }

  if (currentPage === 'upload') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="mb-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold text-sm"
          >
            ← Back
          </button>
          <ImageUpload token={token} onUploadSuccess={(url, tags) => {
            console.log('Upload successful:', url, tags)
          }} />
        </div>
      </div>
    )
  }

  if (currentPage === 'recommendations') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="mb-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold text-sm"
          >
            ← Back
          </button>
          <Recommendations token={token} onRecommendationsReceived={setRecommendations} />
          
          {recommendations.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended Outfits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map(o => <OutfitCard key={o.id} outfit={o} token={token} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Home page (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-purple-800">Dressify</h1>
            <p className="text-gray-600 mt-1">Your personalized fashion guidance</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage('upload')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold text-sm transition-colors"
            >
              📸 Upload
            </button>
            <button
              onClick={() => setCurrentPage('recommendations')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-sm transition-colors"
            >
              ✨ AI Pick
            </button>
            <button
              onClick={() => setCurrentPage('profile')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold text-sm transition-colors"
            >
              👤 Profile
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <Filters filters={filters} onChange={onFilterChange} />
        
        {loading && (
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md h-96 animate-pulse"></div>
              ))}
            </div>
          </div>
        )}
        
        {!loading && (
          <>
            <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outfits.map(o => <OutfitCard key={o.id} outfit={o} token={token} />)}
            </section>
            {outfits.length === 0 && (
              <div className="text-center mt-12 py-8">
                <p className="text-gray-500 mb-4">No outfits found. Try adjusting filters.</p>
                <button
                  onClick={() => setCurrentPage('recommendations')}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold"
                >
                  ✨ Get AI Recommendations
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
