import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export default function Profile({ token, onLogout }) {
  const [profile, setProfile] = useState(null)
  const [preferences, setPreferences] = useState({
    colors: [],
    budget: '',
    style: [],
    bio: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [token])

  async function fetchProfile() {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProfile(res.data.user)
      if (res.data.user.preferences) {
        setPreferences(res.data.user.preferences)
      }
    } catch (e) {
      console.error('Failed to fetch profile:', e)
    } finally {
      setLoading(false)
    }
  }

  async function savePreferences() {
    setSaving(true)
    setMessage('')
    try {
      await axios.post(`${API_BASE_URL}/api/user/preferences`, preferences, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage('✓ Preferences saved!')
      setTimeout(() => setMessage(''), 3000)
    } catch (e) {
      console.error('Failed to save preferences:', e)
      setMessage('✗ Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 text-center text-gray-500">Loading profile...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-purple-800">My Profile</h1>
              <p className="text-gray-600">{profile?.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold transition-colors"
            >
              Logout
            </button>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-md text-sm font-medium ${
              message.startsWith('✓') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-6">
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About You</label>
              <textarea
                value={preferences.bio || ''}
                onChange={e => setPreferences({ ...preferences, bio: e.target.value })}
                placeholder="Tell us about your fashion style..."
                maxLength={500}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">{(preferences.bio || '').length}/500</p>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Colors</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {['Red', 'Pink', 'Purple', 'Blue', 'Green', 'Black', 'White', 'Gold', 'Silver'].map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      const colors = preferences.colors || []
                      if (colors.includes(color)) {
                        setPreferences({ ...preferences, colors: colors.filter(c => c !== color) })
                      } else {
                        setPreferences({ ...preferences, colors: [...colors, color] })
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      (preferences.colors || []).includes(color)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
              <select
                value={preferences.budget || ''}
                onChange={e => setPreferences({ ...preferences, budget: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select...</option>
                <option value="budget">Budget-friendly</option>
                <option value="mid-range">Mid-range</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            {/* Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fashion Style</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {['Casual', 'Formal', 'Ethnic', 'Street-style', 'Minimalist', 'Bohemian'].map(style => (
                  <button
                    key={style}
                    onClick={() => {
                      const styles = preferences.style || []
                      if (styles.includes(style)) {
                        setPreferences({ ...preferences, style: styles.filter(s => s !== style) })
                      } else {
                        setPreferences({ ...preferences, style: [...styles, style] })
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      (preferences.style || []).includes(style)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={savePreferences}
              disabled={saving}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-md font-semibold transition-colors"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
