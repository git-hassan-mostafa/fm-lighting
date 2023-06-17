'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function AdminComponent() {
  const {replace} = useRouter()
  React.useEffect(()=>{
    replace('/admin/see-products')
  },[])
  return (
    <div>
    </div>
  )
}
