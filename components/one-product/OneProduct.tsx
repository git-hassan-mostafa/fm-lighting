'use client'

import React, { useEffect, useState } from 'react'
import './one-product.css'
import Image from 'next/image'
import { productType } from '../see-products/SeeProducts'
import { BsFillCheckCircleFill, BsWhatsapp } from 'react-icons/bs'
import { BsCart4 } from 'react-icons/bs'
import Link from 'next/link'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { db } from '@/firebaseConfig'
import AllProducts from '../all-products/AllProducts'
export default function OneProduct(
    {
        ...product
    }: { data: productType['data'], id: string }
) {

    const [addedToCart, setAddedToCart] = useState(false)
    const [suggestedProducts,setSuggestedProducts] = useState<productType[] | null>(null)
    const handleAddToCart = () => {
        const cartItemsString = localStorage.getItem('cart')
        const cartItems = JSON.parse(cartItemsString as string) || []
        !cartItems.find((item: { id: string }) => item.id === product.id) && cartItems?.push({ ...product })
        localStorage.setItem('cart', JSON.stringify(cartItems))
        setAddedToCart(true)
        setTimeout(() => {
            setAddedToCart(false)
        }, 2000)
    }

    const [isFetching,setIsFetching] = useState(false)

    useEffect(()=>{
        const first =query(collection(db, "products"),where('category','==',product.data.category),orderBy('timeStamp','desc'),limit(10)) ;
        async function getSuggestedData(){
            setIsFetching(true)
            const querySnapshot = (await getDocs(first));
            setIsFetching(false)
            querySnapshot.forEach((doc) => {
                setSuggestedProducts(prev => [...(prev || []), { id: doc.id, data: doc.data() } as productType])
            });
        }
        getSuggestedData()
    },[])



    return (
        <>
        <div className="container">
            <div className="single-product">
                <div className="row">
                    <div className="col-6">
                        <div className="product-image">
                            <div className="product-image-main">
                                <Image unoptimized width={100} height={100} src={product.data.photoURL} alt="" id="product-main-image" />
                            </div>
                        </div>
                    </div>
                    <div className="col-6">

                        <div className="product">
                            <div className="product-category">
                                <h2> {product.data.category.toUpperCase()} </h2>
                            </div>
                            <div className="product-title">
                                <h2> {product.data.name.toUpperCase()} </h2>
                            </div>
                            <div className="product-price">
                                <span className="offer-price"> ${product.data.discountPrice.toFixed(2)} </span>
                                <span className="sale-price"> ${product.data.price.toFixed(2)} </span>
                            </div>

                            <div className="product-quantity">
                                <h3> {product.data.quantity} {product.data.quantity > 1 ? 'items' : 'item'} available </h3>
                            </div>

                            <div className="product-details">
                                <h3>Description</h3>
                                <p>
                                    {product.data.description}
                                </p>
                            </div>
                            <span className="divider"></span>

                            <div className="product-btn-group">
                                <Link target='_blank' className='button buy-now' href={'https://api.whatsapp.com/send?phone='+process.env.PHONE_NUMBER} >
                                   <BsWhatsapp className='whatsapp bx bxs-zap' /> Buy Now
                                </Link>
                                <div className="button add-cart" onClick={handleAddToCart}>
                                    {
                                        addedToCart ? <BsFillCheckCircleFill className='cart bx bxs-cart' /> : <BsCart4 className='cart bx bxs-cart' />
                                    }
                                    Add to Cart</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        <br />
        {Boolean(suggestedProducts?.filter(sproduct=>sproduct.id!==product.id)?.length)  && <h2 className='ml-5 text-2xl font-bold mb-16'> Suggested Products </h2> }
            <AllProducts isFetching={isFetching} data={suggestedProducts?.filter(sproduct=>sproduct.id!==product.id) as productType[]} />
        </>
        
    )
}
