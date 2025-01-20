import ArContainer from '@/components/ar/ArContainer'
import React from 'react'

const AR = () => {
  return (
    <div className='min-h-[100dvh] bg-background text-text '>
        <div className="container mx-auto max-w-7xl flex flex-col">
            <h1 className='text-center my-10 text-4xl text-primary'>Acceptance Rate</h1>
            <ArContainer/>
        </div>
    </div>
  )
}

export default AR