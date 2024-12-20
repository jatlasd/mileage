'use client'

import { useState } from 'react'
import { createWorker } from 'tesseract.js'

export default function ImagePage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [file, setFile] = useState(null)
  const [debugText, setDebugText] = useState('')
  const [processedPreview, setProcessedPreview] = useState(null)

  const preprocessImage = async (file) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const targetWidth = 2400
        const scaleFactor = targetWidth / img.width
        canvas.width = targetWidth
        canvas.height = img.height * scaleFactor

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        const cropHeight = canvas.height * 0.4
        const cropY = (canvas.height - cropHeight) / 2
        const imageData = ctx.getImageData(0, cropY, canvas.width, cropHeight)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          
          const brightness = (r + g + b) / 3
          const isBlueish = b > Math.max(r, g) && b > 100
          
          if (isBlueish && brightness > 50) {
            data[i] = data[i + 1] = data[i + 2] = 255
          } else {
            data[i] = data[i + 1] = data[i + 2] = 0
          }
        }

        const processedCanvas = document.createElement('canvas')
        processedCanvas.width = canvas.width
        processedCanvas.height = cropHeight
        const processedCtx = processedCanvas.getContext('2d')

        processedCtx.putImageData(imageData, 0, 0)

        const finalCanvas = document.createElement('canvas')
        finalCanvas.width = processedCanvas.width * 1.5
        finalCanvas.height = processedCanvas.height * 1.5
        const finalCtx = finalCanvas.getContext('2d')
        
        finalCtx.imageSmoothingEnabled = false
        finalCtx.drawImage(processedCanvas, 0, 0, finalCanvas.width, finalCanvas.height)

        setProcessedPreview(finalCanvas.toDataURL())
        finalCanvas.toBlob(resolve, 'image/jpeg', 1.0)
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const handleImageCapture = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setImagePreview(URL.createObjectURL(selectedFile))
    setProcessedPreview(null)
    setDebugText('')
  }

  const processImage = async () => {
    if (!file) return
    setIsProcessing(true)
    setDebugText('Starting processing...')

    try {
      const optimizedBlob = await preprocessImage(file)
      setDebugText('Created worker...')
      
      const worker = await createWorker()
      
      setDebugText('Running OCR...')
      const result = await worker.recognize(optimizedBlob, {
        tessedit_char_whitelist: '0123456789',
        tessedit_pageseg_mode: '7',
        tessjs_create_pdf: '0',
        tessjs_create_hocr: '0',
        preserve_interword_spaces: '0'
      })

      const text = result.data.text.trim()
      setDebugText('Raw text: ' + text)
      
      // Find the longest sequence of numbers
      const numbers = text.split(/\s+/)
      const longest = numbers.reduce((a, b) => 
        (a.replace(/\D/g, '').length >= b.replace(/\D/g, '').length) ? a : b
      )
      const cleanNumber = longest.replace(/\D/g, '')
      
      console.log('Extracted mileage:', cleanNumber)

      await worker.terminate()
    } catch (error) {
      console.error('Error processing image:', error)
      setDebugText('Error: ' + error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl mb-8">Scan Odometer</h1>
      
      <div className="w-full max-w-xs flex flex-col gap-4">
        <label className="bg-primary text-text px-6 py-2 rounded w-full flex items-center justify-center cursor-pointer">
          Take Photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageCapture}
            className="hidden"
            disabled={isProcessing}
          />
        </label>

        {imagePreview && (
          <>
            <div className="relative w-full aspect-square rounded overflow-hidden">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="absolute inset-0 w-full h-full object-contain bg-black/50"
              />
            </div>

            {processedPreview && (
              <div className="relative w-full aspect-[3/1] rounded overflow-hidden">
                <img 
                  src={processedPreview} 
                  alt="Processed" 
                  className="absolute inset-0 w-full h-full object-contain bg-black"
                />
              </div>
            )}

            <button
              onClick={processImage}
              disabled={isProcessing}
              className="bg-primary text-text px-6 py-2 rounded w-full disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Process Image'}
            </button>

            {debugText && (
              <div className="text-sm text-text/70 text-center">
                {debugText}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
