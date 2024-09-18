'use client'

import React from 'react'
import { VT323 } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'

const vt323 = VT323({ weight: '400', subsets: ['latin'] })

export function ProjectsComponent() {
  const projects = [
    { 
      name: "Pixel Art Generator", 
      description: "An AI-powered tool that creates pixel art from text descriptions.",
      image: "/images/red.png"
    },
    { 
      name: "Retro Game Engine", 
      description: "A JavaScript engine for creating 8-bit style browser games.",
      image: "/images/sky.png"
    },
    { 
      name: "Chiptune Composer", 
      description: "A web app for composing and sharing 8-bit music tracks.",
      image: "/images/orange.png"
    },
    { 
      name: "Nostalgia OS", 
      description: "A Linux distribution styled after classic operating systems.",
      image: "/images/green.png"
    },
    { 
      name: "Retro Social Network", 
      description: "A social media platform with a 90s aesthetic and features.",
      image: "/images/purple.png"
    },
    { 
      name: "Pixel Perfect", 
      description: "A pixel-by-pixel image editor for creating retro-style graphics.",
      image: "/images/blue.png"
    }
  ]

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
          <Link href="/" className="retro-button inline-block">
            Back to Home
          </Link>
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