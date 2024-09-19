import { Suspense } from 'react'
import { ClientSideComponent } from '../components/client-side-component'

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientSideComponent />
    </Suspense>
  )
}