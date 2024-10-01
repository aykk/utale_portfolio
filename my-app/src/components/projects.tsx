'use client'

import React from 'react'
import { VT323 } from 'next/font/google'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const vt323 = VT323({ weight: '400', subsets: ['latin'] })

export function ProjectsComponent() {
  const router = useRouter()

  const projects = [
    { 
      name: "3Dera", 
      description: "An AI-powered experience that teaches history by transforming historical events into environments you can enter in VR!",
      image: "/images/red.png"
    },
    { 
      name: "creditJAM", 
      description: "Website that curates a custom portfolio of credit cards based on the user's financial background and spending habits.",
      image: "/images/sky.png"
    },
    { 
      name: "winsight", 
      description: "A web-app that uses a trained YOLOv8 model to watch a game of blackjack and make decisions and calculate risk (bust) percentage for the player based on the cards in play.",
      image: "/images/orange.png"
    },
    { 
      name: "ELLIS", 
      description: "A web-app that helps immigrants better understand the legal and cultural differences between the country they are moving from and the United States, translated to their native tongue.",
      image: "/images/green.png"
    },
    { 
      name: "Retro Terminals", 
      description: "Two portfolio templates I made replicating the terminals from Fallout 4 and Alien: Romulus. Comes with a cool, glitchy/retro design and interactivity (power button, terminal commands, etc.) Uses Three.js, Next.js, and React.",
      image: "/images/purple.png"
    },
    { 
      name: "Portfolio", 
      description: "You are here right now! Inspired by the video game Undertale, this website was built with Next.js, React, Tailwind CSS, and shadcn/ui.",
      image: "/images/blue.png"
    }
  ]

  const handleBackToHome = () => {
    router.push('/?skipSplash=true')
  }

  return (
    <div className={`min-h-screen bg-black text-white ${vt323.className}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl mb-8 text-center">My Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div key={index} className="border-2 border-white p-4 hover:bg-white hover:text-black transition-colors flex">
              <div className="flex-grow">
                <h2 className="text-2xl mb-2">{project.name}</h2>
                <p>{project.description}</p>
              </div>
              <div className="flex items-center justify-center w-16">
                <Image 
                  src={project.image} 
                  alt={`${project.name} icon`} 
                  width={32} 
                  height={32} 
                  className="object-contain"
                />
              </div>
            </div>
          ))}
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