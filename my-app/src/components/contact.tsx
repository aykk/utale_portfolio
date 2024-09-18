'use client'

import React, { useState } from 'react'
import { VT323 } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Home } from 'lucide-react'

const vt323 = VT323({ weight: '400', subsets: ['latin'] })

export function ContactComponent() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to a server
    console.log('Form submitted:', { name, email, message })
    setSubmitMessage("* (The message fills you with determination.)")
    setName('')
    setEmail('')
    setMessage('')
    setTimeout(() => setSubmitMessage(''), 3000) // Clear message after 3 seconds
  }

  const handleBackToHome = () => {
    router.push('/?skipSplash=true')
  }

  return (
    <div className={`min-h-screen bg-black text-white ${vt323.className} flex flex-col`}>
      <div className="flex-1 flex flex-col p-8">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={handleBackToHome}
            className="retro-button bg-transparent p-2"
            aria-label="Back to Home"
          >
            <Home size={24} />
          </button>
          <h1 className="text-5xl text-center flex-grow">Contact</h1>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="max-w-2xl w-full mx-auto bg-black p-8 border-2 border-white">
            <p className="mb-6 text-xl">* (You encounter a mysterious form. You feel compelled to fill it out...)</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-lg font-medium text-gray-400 mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="retro-input text-xl"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-400 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="retro-input text-xl"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-lg font-medium text-gray-400 mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="retro-input text-xl"
                  placeholder="Enter your message"
                  rows={5}
                />
              </div>
              
              <Button type="submit" className="retro-button w-full text-xl py-4">
                SEND
              </Button>
            </form>
            
            {submitMessage && (
              <p className="mt-4 text-xl text-center text-yellow-400">{submitMessage}</p>
            )}
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .retro-button {
          background-color: black;
          border: 2px solid white;
          color: white;
          padding: 12px;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 0;
        }
        .retro-button:hover {
          background-color: white;
          color: black;
        }
        .retro-input {
          background-color: black;
          border: 2px solid white;
          color: white;
          padding: 12px;
          font-size: 18px;
          width: 100%;
          border-radius: 0;
        }
        .retro-input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
        }
        /* Override shadcn/ui default styles */
        .retro-input[type="text"],
        .retro-input[type="email"],
        textarea.retro-input {
          border-radius: 0;
        }
      `}</style>
    </div>
  )
}