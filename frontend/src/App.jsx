import React, { useEffect, useState } from 'react'
import Filters from './components/Filters'
import OutfitCard from './components/OutfitCard'
import axios from 'axios'

export default function App() {
  const [filters, setFilters] = useState({ country: '', gender: '', season: '', festival: '' })
  const [outfits, setOutfits] = useState([])
  const [loading, setLoading] = useState(false)

  async function fetchOutfits() {
    setLoading(true)
    try {
      const res = await axios.get('http://localhost:4000/api/outfits', { params: filters })
      setOutfits(res.data.data || [])
    } catch (e) {
      console.error('Failed to fetch outfits', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOutfits(); }, [filters])

  function onFilterChange(next) {
    setFilters(next)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-purple-800">Dressify</h1>
        <p className="text-gray-600 mt-1">Your personalized fashion guidance</p>
      </header>
      <main className="max-w-6xl mx-auto">
        <Filters filters={filters} onChange={onFilterChange} />
        {loading && <p className="text-center mt-4 text-gray-500">Loading...</p>}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outfits.map(o => <OutfitCard key={o.id} outfit={o} />)}
        </section>
        {!loading && outfits.length === 0 && <p className="text-center mt-8 text-gray-500">No outfits found. Try adjusting filters.</p>}
      </main>
    </div>
  )
}
