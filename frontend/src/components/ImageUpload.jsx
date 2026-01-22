import React, { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export default function ImageUpload({ token, onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState('')
  const [message, setMessage] = useState('')
  const [tags, setTags] = useState(null)

  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) {
      setMessage('Please select an image')
      return
    }

    setLoading(true)
    setMessage('')
    setTags(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      setTags(res.data.tags)
      setMessage('✓ Image uploaded and analyzed!')
      setFile(null)
      setPreview('')
      
      if (onUploadSuccess) {
        onUploadSuccess(res.data.url, res.data.tags)
      }

      setTimeout(() => setMessage(''), 3000)
    } catch (e) {
      console.error('Upload failed:', e)
      setMessage(`✗ ${e.response?.data?.error || 'Upload failed'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📸 Upload Outfit</h2>

      {message && (
        <div className={`mb-4 p-3 rounded-md text-sm font-medium ${
          message.startsWith('✓')
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-4">
        {/* Preview */}
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-md border-2 border-purple-200"
            />
            <button
              type="button"
              onClick={() => {
                setFile(null)
                setPreview('')
              }}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold"
            >
              ✕
            </button>
          </div>
        )}

        {/* File Input */}
        <label className="block cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
          />
          <div className="p-4 border-2 border-dashed border-purple-300 rounded-md hover:border-purple-500 transition-colors text-center">
            <p className="text-sm text-gray-600">
              {file ? file.name : 'Click to select image or drag & drop'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Supported: JPG, PNG, WebP, GIF (Max 10MB)</p>
          </div>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={!file || loading}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-md font-semibold transition-colors"
        >
          {loading ? 'Uploading...' : 'Upload & Analyze'}
        </button>
      </form>

      {/* Tags Result */}
      {tags && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">🏷️ AI Analysis</h3>
          <div className="space-y-2 text-sm">
            {tags.colors && (
              <p><span className="font-medium">Colors:</span> {Array.isArray(tags.colors) ? tags.colors.join(', ') : tags.colors}</p>
            )}
            {tags.style && (
              <p><span className="font-medium">Style:</span> {tags.style}</p>
            )}
            {tags.season && (
              <p><span className="font-medium">Season:</span> {Array.isArray(tags.season) ? tags.season.join(', ') : tags.season}</p>
            )}
            {tags.gender && (
              <p><span className="font-medium">Gender:</span> {tags.gender}</p>
            )}
            {tags.occasions && (
              <p><span className="font-medium">Occasions:</span> {Array.isArray(tags.occasions) ? tags.occasions.join(', ') : tags.occasions}</p>
            )}
            {tags.description && (
              <p><span className="font-medium">Description:</span> {tags.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
