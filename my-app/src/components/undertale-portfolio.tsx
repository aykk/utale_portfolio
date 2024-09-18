'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { VT323 } from 'next/font/google'

const vt323 = VT323({ weight: '400', subsets: ['latin'] })

export function UndertalePortfolio() {
  const [text, setText] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  const dialogues = [
    "* Hi, I'm Andrew.",
    "* Welcome to my Undertale-themed website!",
    "* I'm a student in Computer Science with a passion for designing fun, interactive websites like this one.",
    "* My skills include web development, machine learning, and UI/UX design.",
    "* Want to see my projects? Just select 'Projects' below!",
    "* Feel free to contact me anytime.",
    "* Thanks for visiting!"
  ]

  useEffect(() => {
    if (isTyping && text.length < dialogues[currentTextIndex].length) {
      const timeout = setTimeout(() => {
        setText(dialogues[currentTextIndex].slice(0, text.length + 1))
      }, 50)
      return () => clearTimeout(timeout)
    } else if (text.length === dialogues[currentTextIndex].length) {
      setIsTyping(false)
    }
  }, [text, isTyping, currentTextIndex])

  const handleNext = () => {
    if (text.length < dialogues[currentTextIndex].length) {
      // Auto-finish current line
      setText(dialogues[currentTextIndex])
      setIsTyping(false)
    } else if (currentTextIndex < dialogues.length - 1) {
      setCurrentTextIndex(currentTextIndex + 1)
      setText('')
      setIsTyping(true)
    }
  }

  const handlePrev = () => {
    if (currentTextIndex > 0) {
      setCurrentTextIndex(currentTextIndex - 1)
      setText('')
      setIsTyping(true)
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-black ${vt323.className}`}>
      <style jsx global>{`
        .retro-button {
          background-color: black;
          border: 2px solid white;
          color: white;
          padding: 10px;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .retro-button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        .retro-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
      <div className="relative w-full max-w-2xl p-8">
        <div className="mb-4 flex justify-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngegg-xX3hkNESNTITOCd6ZsjBWEMtDnHZ7k.png"
            alt="Smiling flower pixel art"
            style={{ height: '15vh', width: 'auto' }}
          />
        </div>
        <div className="p-4 bg-black text-white rounded border-2 border-white">
          <p className="text-2xl leading-relaxed whitespace-pre-wrap">{text}</p>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrev}
            className="retro-button"
            disabled={currentTextIndex === 0}
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="retro-button"
            disabled={currentTextIndex === dialogues.length - 1 && text.length === dialogues[currentTextIndex].length}
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      <nav className="mt-8 flex justify-center space-x-4">
        <button className="retro-button w-32 h-16">
          Projects
        </button>
        <button className="retro-button w-32 h-16">
          Skills
        </button>
        <button className="retro-button w-32 h-16">
          Contact
        </button>
      </nav>
    </div>
  )
}