'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function AdminComponent() {
  const {push} = useRouter()
  React.useEffect(()=>{
    push('/admin/see-products')
  })
  return (
    <div>
    </div>
  )
}
