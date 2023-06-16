import React, { useState } from 'react'
import { productType } from '../see-products/SeeProducts'
import Image from 'next/image'
import s from './productCard.module.css'
import { BsCart4 } from 'react-icons/bs'
import { Tooltip } from '@mui/material'
import { MdDelete } from 'react-icons/md'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import Link from 'next/link'

export default function ProductCard({ product, cart = false ,setData }: { product: productType, cart: boolean , setData?:(id:string)=>void }) {
    const [addedToCart, setAddedToCart] = useState(false)

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
    return (
        <div className={s.productCard}>
            <Image width={40} height={40} className={s.productImage} unoptimized src={product.data.photoURL} alt={'product-image'} />
            <h1 className={s.productName}> {product.data.name.toUpperCase()} </h1>
            <section className={s.productPrices}>
                <span className={s.productDiscountPrice}> ${product.data.discountPrice} </span>
                <span className={s.productPrice}> ${product.data.price} </span>
            </section>
            <section className={s.buttons}>

                <Link className={s.link} href={{
                    pathname: `/products/${product.id}`,
                    query: {
                        name: product.data.name,
                        category: product.data.category,
                        description: product.data.description,
                        discountPrice: product.data.discountPrice,
                        photoPath: product.data.photoPath,
                        photoURL: product.data.photoURL,
                        price: product.data.price,
                        quantity: product.data.quantity,
                        keywords: product.data.keywords
                    }
                }} >
                    learn more
                </Link>
                <Tooltip title={cart? 'remove from cart' : 'add to cart'} placement='top' >
                    <button className={cart?s.removeFromCart :s.addToCart}> {addedToCart ? <BsFillCheckCircleFill /> :
                        cart ? <MdDelete onClick={()=>setData && setData(product.id)} /> :
                            <BsCart4 onClick={handleAddToCart} />}  </button>
                </Tooltip>

            </section>

        </div>
    )
}
