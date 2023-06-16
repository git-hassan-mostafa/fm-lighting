import AdminLayout from '@/components/adminLayout/AdminLayout'
import React from 'react'

export default async function RootLayout({
    children
}:{
    children:React.ReactNode
}) {

  return (
    <AdminLayout children={children} />
  )
}
