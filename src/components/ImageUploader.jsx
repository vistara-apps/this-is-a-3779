import React, { useState } from 'react'
import { Upload, Image as ImageIcon } from 'lucide-react'

const ImageUploader = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        setUploadedImage(imageUrl)
        onImageUpload(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  if (uploadedImage) {
    return (
      <div className="relative">
        <img
          src={uploadedImage}
          alt="Uploaded product"
          className="w-full h-64 object-cover rounded-lg border border-dark-border"
        />
        <button
          onClick={() => {
            setUploadedImage(null)
            onImageUpload(null)
          }}
          className="absolute top-2 right-2 bg-dark-surface hover:bg-dark-border text-dark-text p-2 rounded-lg transition-colors"
        >
          <Upload className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
        dragActive
          ? 'border-primary bg-primary bg-opacity-10'
          : 'border-dark-border hover:border-dark-muted'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input').click()}
    >
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="w-16 h-16 bg-dark-border rounded-full flex items-center justify-center mx-auto mb-4">
        <ImageIcon className="w-8 h-8 text-dark-muted" />
      </div>
      
      <h3 className="text-lg font-medium mb-2">Upload Product Image</h3>
      <p className="text-dark-muted mb-4">
        Drag and drop your image here, or click to browse
      </p>
      <p className="text-sm text-dark-muted">
        Supports JPG, PNG, GIF up to 10MB
      </p>
    </div>
  )
}

export default ImageUploader