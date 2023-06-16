'use client'
import OneProduct from '@/components/one-product/OneProduct'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export default function ProductComponent({params:{id}}:{params:{id:string}}) {
  const searchParams = useSearchParams()

    const name = searchParams.get('name') as string
    const keywords = searchParams.get('keywords')  as string
    const category = searchParams.get('category') as string
    const description = searchParams.get('description') as string
    const discountPrice = Number(searchParams.get('discountPrice'))
    const photoPath = searchParams.get('photoPath') as string
    const photoURL = searchParams.get('photoURL') as string
    const price = Number(searchParams.get('price'))
    const quantity = Number(searchParams.get('quantity'))
  return (
    <div>
      <OneProduct data={{
        category,
        description,
        discountPrice,
        name,
        photoPath,
        photoURL,
        price,
        quantity,
        keywords
      }} id={id} />
    </div>
  )
}