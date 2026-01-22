import React, { useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'

// Initialize Firebase (ensure this matches your Firebase config)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
}

let auth = null
try {
  const app = initializeApp(firebaseConfig)
  auth = getAuth(app)
} catch (e) {
  console.warn('Firebase not initialized:', e.message)
}

export default function Auth({ onAuthSuccess, onLogout }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)

  async function handleAuth(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!auth) {
        setError('Firebase not configured. Check your environment variables.')
        return
      }

      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        setUser(result.user)
        const token = await result.user.getIdToken()
        onAuthSuccess(token, result.user)
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password)
        setUser(result.user)
        const token = await result.user.getIdToken()
        onAuthSuccess(token, result.user)
      }
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      if (auth) {
        await signOut(auth)
        setUser(null)
        setEmail('')
        setPassword('')
        onLogout()
      }
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  if (user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-700 mb-4">Welcome, <span className="font-semibold">{user.email}</span>!</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold transition-colors"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">Dressify</h1>
        <p className="text-gray-600 mb-6">Your personalized fashion guide</p>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-100 text-red-800 text-sm font-medium">
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-md font-semibold transition-all"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError('')
          }}
          className="w-full mt-4 text-purple-600 hover:text-purple-800 font-medium text-sm"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  )
}
