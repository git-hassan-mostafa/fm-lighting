'use client'
import AllProducts from '@/components/all-products/AllProducts'
import React, { useEffect, useState } from 'react'
import { productType } from '../see-products/SeeProducts'

export default function CartComponent() {
  const [data,setData] = useState<productType[] | null>(null)
  useEffect(()=>{
    setData(JSON.parse(localStorage.getItem('cart') as string))
  },[])
  const removeFromCart=(id:string)=>{
    const filteredData = data?.filter((product: { id: string })=>product.id!==id)
    localStorage.setItem('cart',JSON.stringify(filteredData || []))
    setData(filteredData as productType[])
  }
  return (
    <>
    <h2 className='text-3xl text-cyan-700 font-bold text-center my-5'> CART </h2>
    <AllProducts data={data} cart={true} setData={removeFromCart} />
    <div className='mb-16' />
    </>
    
  )
}