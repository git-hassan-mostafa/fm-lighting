'use client'
import AddProductForm from '@/components/add-product-form/AddProductForm'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export default function page() {
  const searchParams = useSearchParams()
  const edit = searchParams.get('edit')
  const id = searchParams.get('id')
  const name = searchParams.get('name')
  const description = searchParams.get('description')
  const quantity = searchParams.get('quantity')
  const price = searchParams.get('price')
  const discountPrice = searchParams.get('discountPrice')
  const category = searchParams.get('category')
  const keywords = searchParams.get('keywords')
  return (
    <div>
      <AddProductForm edit={Boolean(edit)} id={id} name={name} description={description} quantity={quantity} price={price} discountPrice={discountPrice} category={category} keywords={keywords} />
    </div>
  )
}
