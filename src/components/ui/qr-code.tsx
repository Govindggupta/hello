'use client'

import { useEffect, useRef } from 'react'

interface QRCodeProps {
  value: string
  size?: number
}

export function QRCode({ value, size = 200 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const generateQRCode = async () => {
      if (!canvasRef.current) return
      
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      if (!ctx) return
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Set canvas size
      canvas.width = size
      canvas.height = size
      
      // Draw a simple placeholder for the QR code
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, size, size)
      
      ctx.fillStyle = '#1e293b'
      ctx.font = '14px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Draw text in the center
      const maxWidth = size - 20
      const lineHeight = 20
      const words = value.split(' ')
      let line = ''
      let y = size / 2 - (Math.ceil(words.length / 3) * lineHeight) / 2
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' '
        const metrics = ctx.measureText(testLine)
        const testWidth = metrics.width
        
        if (testWidth > maxWidth && i > 0) {
          ctx.fillText(line, size / 2, y)
          line = words[i] + ' '
          y += lineHeight
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, size / 2, y)
      
      // Draw a border
      ctx.strokeStyle = '#d1d5db'
      ctx.lineWidth = 2
      ctx.strokeRect(0, 0, size, size)
    }
    
    generateQRCode()
  }, [value, size])
  
  return (
    <div className="bg-white p-4 rounded-lg border border-light-gray">
      <canvas ref={canvasRef} className="mx-auto" />
      <p className="text-xs text-center mt-2 text-deep-slate break-all">
        {value}
      </p>
    </div>
  )
}