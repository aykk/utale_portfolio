'use client'

import React from 'react'
import { VT323 } from 'next/font/google'
import { useRouter } from 'next/navigation'

const vt323 = VT323({ weight: '400', subsets: ['latin'] })

export function About() {
  const router = useRouter()

  const handleBackToHome = () => {
    router.push('/?skipSplash=true')
  }

  return (
    <div className={`min-h-screen bg-black text-white ${vt323.className}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl mb-8 text-center">About Me</h1>
        <div className="border-2 border-white p-6 max-w-2xl mx-auto">
          <p className="text-xl mb-4">
            * Hello! I&apos;m Andrew, a Computer Science student at Virginia Tech with a passion in web development and UI/UX design.
          </p>
          <p className="text-xl mb-4">
            * My journey in tech began with my love for classic/retro video games, which inspired me to create my own digital experiences.
          </p>
          <p className="text-xl mb-4">
            * When I&apos;m not coding, I enjoy playing basketball, playing the electric guitar, and playing video games!.
          </p>
          <p className="text-xl">
            * Let&apos;s connect and create something awesome together!
          </p>
        </div>
        <div className="mt-8 text-center">
          <button onClick={handleBackToHome} className="retro-button">
            Back to Home
          </button>
        </div>
      </div>
      <style jsx global>{`
        .retro-button {
          background-color: black;
          border: 2px solid white;
          color: white;
          padding: 10px 20px;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .retro-button:hover {
          background-color: white;
          color: black;
        }
      `}</style>
    </div>
  )
}