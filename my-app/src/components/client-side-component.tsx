'use client'

import { useSearchParams } from 'next/navigation'
import { Overworld } from '../components/overworld'

export function ClientSideComponent() {
  const searchParams = useSearchParams()
  const skipSplash = searchParams.get('skipSplash') === 'true'
  const from = searchParams.get('from')

  return <Overworld initialSkipSplash={skipSplash} from={from} />
}