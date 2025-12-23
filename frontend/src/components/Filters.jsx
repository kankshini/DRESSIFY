import React from 'react'

const countries = ['', 'India', 'USA', 'UK', 'Canada']
const genders = ['', 'female', 'male', 'unisex']
const seasons = ['', 'summer', 'winter', 'spring', 'fall']
const festivals = ['', 'diwali', 'wedding', 'casual', 'christmas', 'eid', 'holi']

export default function Filters({ filters, onChange }) {
  function update(k, v) {
    onChange({ ...filters, [k]: v })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter by Preferences</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <select
            value={filters.country}
            onChange={e => update('country', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {countries.map(c => (
              <option key={c} value={c}>
                {c || 'All Countries'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={filters.gender}
            onChange={e => update('gender', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {genders.map(g => (
              <option key={g} value={g}>
                {g || 'All Genders'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
          <select
            value={filters.season}
            onChange={e => update('season', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {seasons.map(s => (
              <option key={s} value={s}>
                {s || 'All Seasons'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Festival/Occasion</label>
          <select
            value={filters.festival}
            onChange={e => update('festival', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {festivals.map(f => (
              <option key={f} value={f}>
                {f || 'All Occasions'}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
