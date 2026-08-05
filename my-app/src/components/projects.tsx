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
      name: "Hyperliquid Trading Bot",
      description: "A Hyperliquid perps trading simulation and market-maker bot that consumes live L2 book data over WebSockets with an agent wallet. Runs multi-strategy execution (maker/taker/hybrid OBI scalps plus funding carry) with a SQLite trade journal and a Next.js dashboard for live monitoring.",
      image: "/images/green.png"
    },
    {
      name: "Learnspace",
      description: "Winner of Best Use of Snowflake at HackViolet 2026! A Chrome extension and web app that turns reading lists into an adaptive learning system, using Gemini for semantic IR extraction and clustering. Bookmarks flow through an IR and clustering pipeline backed by SQLite and Snowflake, with personalized audio generation hooks.",
      image: "/images/sky.png"
    },
    {
      name: "Knot",
      description: "Winner of Best Use of Snowflake at PatriotHacks 2026! A course-aligned study platform that ingests Canvas syllabi, modules, and assignments into a structured knowledge base. A custom RAG pipeline on Snowflake (Gemini embeddings and cosine similarity) powers course-scoped quizzes and chat with citations tied to source chunks, plus gap analysis so students can target weak concepts before exams.",
      image: "/images/purple.png"
    },
    {
      name: "Parrot",
      description: "Winner of Best Use of Gemini API at VTHacks 2025! An AI phonetics coach built with Azure Speech Services and MediaPipe Face Mesh for real-time lip tracking, with adaptive practice through Gemini and 90%+ detection accuracy across 5 languages. Made with Next.js and TypeScript.",
      image: "/images/orange.png"
    },
    {
      name: "Markey",
      description: "A mesh-to-G-code pipeline that uploads 3D meshes (.stl/.obj/.glb), renders orthographic views, and slices them with CuraEngine. An ML classifier API flags restricted printable geometry before the G-code ever leaves the slicer, with optional Gemini policy insights. Built with Next.js, TypeScript, Python, and FastAPI.",
      image: "/images/blue.png"
    },
    {
      name: "3Dera",
      description: "Winner of Best Overall at HooHacks 2024! An AI-powered experience that teaches history by transforming historical events into environments you can enter in VR. Generates 3D scenes from historical text using HuggingFace and OpenAI, with Objaverse asset retrieval and Wikipedia data fetching.",
      image: "/images/red.png"
    },
    {
      name: "vigil.AI",
      description: "Winner of Best Arweave Startup at Startup Sprint 2023! A React Native mobile app that uses LAVIS for real-time anomaly detection, with models deployed via Docker and Arweave for decentralized storage.",
      image: "/images/green.png"
    },
    {
      name: "Portfolio",
      description: "You are here right now! Inspired by the video game Undertale, this website was built with Next.js, React, Tailwind CSS, and shadcn/ui.",
      image: "/images/blue.png"
    }
  ]

  const handleBackToHome = () => {
    router.push('/?skipSplash=true&from=projects')
  }

  return (
    <div className={`min-h-screen bg-black text-white ${vt323.className}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl mb-8 text-center">My Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div key={index} className="border-4 border-white p-4 hover:bg-white hover:text-black transition-colors flex">
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