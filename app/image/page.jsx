'use client';

import { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function OCRInput({ onExtractedMileage }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleExtract = async () => {
    if (!image) return alert('Please select an image first.');
    setLoading(true);
    setRecognizedText('');

    try {
      const { data: { text } } = await Tesseract.recognize(image, 'eng', {
        logger: (info) => console.log(info), // Logs progress
      });

      setRecognizedText(text);

      // Extract the first number (mileage) from the recognized text
      const mileage = text.match(/\d+/)?.[0];
      if (mileage) {
        onExtractedMileage(parseInt(mileage, 10));
      } else {
        alert('No numbers found in the image.');
      }
    } catch (err) {
      console.error(err);
      alert('Error recognizing text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="mb-4 border-2 rounded p-2"
      />
      {image && <img src={image} alt="Preview" className="w-64 h-auto mb-4" />}
      <button
        onClick={handleExtract}
        className="bg-primary text-text px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Extract Mileage'}
      </button>
      {recognizedText && (
        <p className="mt-4 text-sm text-gray-400">
          Recognized Text: <span className="text-white">{recognizedText}</span>
        </p>
      )}
    </div>
  );
}
