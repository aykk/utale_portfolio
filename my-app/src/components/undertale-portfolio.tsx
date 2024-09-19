'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { VT323 } from 'next/font/google'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const vt323 = VT323({ weight: '400', subsets: ['latin'] })

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const handleAnyInput = () => {
      onComplete()
    }

    window.addEventListener('keydown', handleAnyInput)
    window.addEventListener('mousedown', handleAnyInput)

    return () => {
      window.removeEventListener('keydown', handleAnyInput)
      window.removeEventListener('mousedown', handleAnyInput)
    }
  }, [onComplete])

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-black ${vt323.className}`}>
      <Image
        src="/images/name.png"
        alt="ANDREW KIM pixelated text"
        width={576}
        height={144}
        className="mb-12"
      />
      <div className="text-gray-500 animate-pulse text-4xl">[press any button]</div>
    </div>
  )
}

export function UndertalePortfolio({ initialSkipSplash = false }) {
  const [showSplash, setShowSplash] = useState(!initialSkipSplash)
  const [text, setText] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [evilMode, setEvilMode] = useState(false)
  const [evilStage, setEvilStage] = useState(0)
  const [isShaking, setIsShaking] = useState(false)
  const router = useRouter()

  const dialogues = [
    "* Hi, I'm Andrew!",
    "* Welcome to my digital portfolio!",
    "* I'm a student studying Computer Science at Virginia Tech. I love making fun, interactive websites like this one!",
    "* If you were wondering, this website was made using Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui.",
    "* My skills include full-stack web development and UI/UX design. I am also currently looking for work!",
    "* Want to learn more about me? Just select 'About Me' below!",
    "* If you are interested in seeing my projects, click on 'Projects'!",
    "* Feel free to contact me below as well!",
    "* Oh, and click on the glowing golden button to see my resume.",
    "* Thanks for visiting my website! :)"
  ]

  const evilDialogues = ["Why did you click the button!?!?", "I told you not to click it......", "Hurry and go back!"]

  const typeText = useCallback(() => {
    const currentDialogue = evilMode ? evilDialogues[evilStage] : dialogues[currentTextIndex]
    if (text.length < currentDialogue.length) {
      setText(currentDialogue.slice(0, text.length + 1))
    } else {
      setIsTyping(false)
      if (evilMode && evilStage < evilDialogues.length - 1) {
        setTimeout(() => {
          setEvilStage(prevStage => prevStage + 1)
          setText('')
          setIsTyping(true)
        }, 1000)
      }
    }
  }, [evilMode, evilStage, currentTextIndex, text, evilDialogues, dialogues])

  useEffect(() => {
    if (isTyping) {
      const timeout = setTimeout(typeText, 50)
      return () => clearTimeout(timeout)
    }
  }, [isTyping, typeText])

  useEffect(() => {
    if (!showSplash && text === '') {
      setIsTyping(true)
    }
  }, [showSplash, text])

  const handleNext = () => {
    if (!evilMode) {
      if (text.length < dialogues[currentTextIndex].length) {
        setText(dialogues[currentTextIndex])
        setIsTyping(false)
      } else if (currentTextIndex < dialogues.length - 1) {
        setCurrentTextIndex(currentTextIndex + 1)
        setText('')
        setIsTyping(true)
      }
    }
  }

  const handlePrev = () => {
    if (!evilMode && currentTextIndex > 0) {
      setCurrentTextIndex(currentTextIndex - 1)
      setText('')
      setIsTyping(true)
    }
  }

  const handleEvilClick = () => {
    setEvilMode(true)
    setEvilStage(0)
    setText('')
    setIsTyping(true)
    setIsShaking(true)
  }

  const handleGoBack = () => {
    setEvilMode(false)
    setEvilStage(0)
    setText('')
    setIsTyping(true)
    setIsShaking(false)
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleHomeClick = () => {
    setShowSplash(true)
    setEvilMode(false)
    setEvilStage(0)
    setText('')
    setIsTyping(false)
    setIsShaking(false)
    setCurrentTextIndex(0)
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${evilMode ? 'bg-true-red' : 'bg-black'} ${isShaking ? 'shake' : ''} ${vt323.className}`}>
      <style jsx global>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
        }
        .shake {
          animation: shake 0.5s;
          animation-iteration-count: infinite;
        }
        .bg-true-red {
          background-color: #880000;
        }
        .text-scarlet {
          color: #FF2400;
        }
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
          text-decoration: none;
        }
        .retro-button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        .retro-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .evil-flower {
          filter: brightness(0.85);
        }
        .small-button {
          font-size: 12px;
          padding: 5px;
          height: auto;
          width: auto;
        }
        .green-button {
          background-color: black;
          border: 2px solid #00FF00;
          color: #00FF00;
        }
        .green-button:hover {
          background-color: #001100;
        }
        .red-button {
          background-color: black;
          border: 2px solid #FF0000;
          color: #FF0000;
        }
        .red-button:hover {
          background-color: #110000;
        }
        .gold-button {
          background-color: black;
          border: 2px solid gold;
          color: gold;
          animation: pulse 2s infinite;
        }
        .gold-button:hover {
          background-color: #111100;
        }
      `}</style>
      <button 
        className="retro-button absolute top-4 left-4 bg-transparent p-2"
        onClick={handleHomeClick}
        aria-label="Home"
      >
        <Home size={16} />
      </button>
      <div className="relative w-full max-w-2xl p-8">
        <div className="mb-4 flex justify-center">
          <Image
            src={evilMode ? "/images/evilflowey.png" : "/images/flowey.png"}
            alt={evilMode ? "Evil flower pixel art" : "Smiling flower pixel art"}
            width={120}
            height={120}
            className={evilMode ? 'evil-flower' : ''}
          />
        </div>
        <div className="p-4 bg-black text-white rounded border-2 border-white">
          <p className={`text-2xl leading-relaxed whitespace-pre-wrap ${evilMode ? 'text-scarlet' : ''}`}>{text}</p>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrev}
            className="retro-button"
            disabled={currentTextIndex === 0 || evilMode}
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="retro-button"
            disabled={(currentTextIndex === dialogues.length - 1 && text.length === dialogues[currentTextIndex].length) || evilMode}
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      <nav className="mt-8 flex justify-center space-x-4">
        <button className="retro-button w-32 h-16" onClick={() => handleNavigation('/aboutme')}>
          About Me
        </button>
        <button className="retro-button w-32 h-16" onClick={() => handleNavigation('/projects')}>
          Projects
        </button>
        <button className="retro-button w-32 h-16" onClick={() => handleNavigation('/contact')}>
          Contact
        </button>
        <a 
          href="https://drive.google.com/file/d/1ph89Mg0ZIviaoPFRC4N5H9PrxFWP_J1-/view?usp=sharing" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="retro-button gold-button w-32 h-16"
        >
          Resume
        </a>
      </nav>
      <button 
        className="retro-button small-button red-button absolute bottom-4 left-4"
        onClick={handleEvilClick}
        disabled={evilMode}
      >
        DON&apos;T CLICK HERE
      </button>
      {evilMode && (
        <button 
          className="retro-button green-button absolute bottom-4 right-4 text-xs"
          onClick={handleGoBack}
        >
          GO BACK
        </button>
      )}
    </div>
  )
}