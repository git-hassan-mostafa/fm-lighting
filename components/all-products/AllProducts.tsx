import React from 'react'
import { productType } from '../see-products/SeeProducts'
import ProgressCircule, { ProgressCirculeInline } from '../ProgressCircule'
import ProductCard from '../product-card/ProductCard'
import './allProducts.css'

export default function AllProducts({data , isLoading=false , isFetching, cart=false , setData }:{data:productType[] | null , isLoading?:boolean , cart?:boolean , setData?:(id:string)=>void  ,isFetching?:boolean }) {
  return (
    <div>
      {isFetching ? <ProgressCirculeInline color={'text-cyan-700'} /> :
                isLoading ? <ProgressCircule color={'text-cyan-700'} /> :
                    <div className="products-display">
                        {
                            data?.map(product => <ProductCard product={product} cart={cart} key={product.id} setData={setData}  />)
                        }
                    </div>
            }
    </div>
  )
}
