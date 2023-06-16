'use client'
import SeeProducts from '@/components/see-products/SeeProducts'
import React from 'react'

export const revalidate = 0

export default function page() {
  return (
    <div>
      <SeeProducts />
    </div>
  )
}
