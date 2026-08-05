'use client'

import React from 'react'
import { VT323 } from 'next/font/google'
import { useRouter } from 'next/navigation'

const vt323 = VT323({ weight: '400', subsets: ['latin'] })

export function About() {
  const router = useRouter()

  const experience = [
    {
      role: "Founding Engineer",
      org: "sakas.io, Radford, VA",
      dates: "Jan. 2025 - Present",
      description: "Co-developed a low-code automation platform that lets clients design, schedule, and run multi-step workflows across third-party APIs and internal tools. I own end-to-end delivery of the workflow connectors, execution runtime, and monitoring, and partner directly with clients to scope and ship production pipelines for data sync, notifications, and operational workflows."
    },
    {
      role: "Full-Stack Software Engineer",
      org: "Aerostrategy, San Francisco, CA",
      dates: "Nov. 2025 - Feb. 2026",
      description: "Redesigned the main web platform, integrating a web3 backend with Dune Analytics dashboards to visualize live smart contract data. Engineered the frontend logic for advanced DeFi mechanics, translating staking, escrow, and ve(3,3) tokenomics into real-time data representation. The product supported $6M+ market cap and $1M+ TVL at peak."
    },
    {
      role: "Technical Lead",
      org: "Virginia Tech E-Club, Blacksburg, VA",
      dates: "Oct. 2024 - May 2026",
      description: "Led technical strategy for 12 events and 30+ incubations, and facilitated $20k of funding allocation to 7 successful ventures. Scaled member services with Next.js and Supabase, and built data pipelines that turned activity logs into operational insights."
    },
    {
      role: "Co-Founder & Co-President",
      org: "Virginia Tech Blockchain Club, Blacksburg, VA",
      dates: "Sept. 2025 - May 2026",
      description: "Co-founded and led the VT Blockchain Club, driving $8.55M+ in organizational onchain volume across community initiatives and events. Represented the organization at the Michigan Blockchain Conference and shipped the club's public web presence end-to-end."
    },
    {
      role: "Full-Stack Software Engineer Intern",
      org: "J.B. Hunt, Fayetteville, AR",
      dates: "May 2023 - Jan. 2024",
      description: "Engineered a Spring Boot microservice that automated config management for 150+ products, cutting manual deployment time. Designed REST APIs with Swagger, integrated Apache Kafka for event-driven messaging across product admin services, remediated 100+ CVEs, and wrote Mockito/JUnit suites reaching 95% code coverage in a CI/CD environment."
    },
    {
      role: "Software Engineer Intern",
      org: "Widelity, Inc., Arlington, VA",
      dates: "Jul. 2022 - Aug. 2022",
      description: "Orchestrated containerized 5G network environments with Kubernetes, deploying clusters to validate Open-RAN architecture. Integrated the Comsovereign product suite into the testing pipeline, increasing testing coverage by 35% and reducing latency bottlenecks by 20%."
    }
  ]

  const handleBackToHome = () => {
    router.push('/?skipSplash=true&from=aboutme')
  }

  return (
    <div className={`min-h-screen bg-black text-white ${vt323.className}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl mb-8 text-center">About Me</h1>
        <div className="border-4 border-white p-6 max-w-2xl mx-auto">
          <p className="text-xl mb-4">
            * Hello! I&apos;m Andrew, a software engineer based in Washington, D.C. with a passion for full-stack web development and UI/UX design.
          </p>
          <p className="text-xl mb-4">
            * I graduated from the Virginia Tech College of Engineering in May 2026 with a B.S. in Computer Science.
          </p>
          <p className="text-xl mb-4">
            * My journey in tech began with my love for classic/retro video games, which inspired me to create my own digital experiences.
          </p>
          <p className="text-xl mb-4">
            * When I&apos;m not coding, I enjoy playing basketball, playing the electric guitar, and playing video games!
          </p>
          <p className="text-xl">
            * Let&apos;s connect and create something awesome together!
          </p>
        </div>

        <h2 className="text-4xl mt-12 mb-8 text-center">Experience</h2>
        <div className="border-4 border-white p-6 max-w-2xl mx-auto">
          {experience.map((job, index) => (
            <div key={index} className={index === experience.length - 1 ? '' : 'mb-6'}>
              <p className="text-2xl">{job.role}</p>
              <p className="text-xl text-gray-400 mb-2">{job.org} &mdash; {job.dates}</p>
              <p className="text-xl">* {job.description}</p>
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