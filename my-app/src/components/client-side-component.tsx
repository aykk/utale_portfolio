'use client'

import { useSearchParams } from 'next/navigation'
import { UndertalePortfolio } from '../components/undertale-portfolio'

export function ClientSideComponent() {
  const searchParams = useSearchParams()
  const skipSplash = searchParams.get('skipSplash') === 'true'

  return <UndertalePortfolio initialSkipSplash={skipSplash} />
}