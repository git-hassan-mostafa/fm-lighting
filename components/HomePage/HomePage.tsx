'use client'
import React, { useEffect, useState } from 'react'
import './homePage.css'
import Image from 'next/image'
import logo from '../../public/logo.jpg'
import { db } from '@/firebaseConfig'
import { query, collection, limit, getCountFromServer, getDocs, QueryDocumentSnapshot, DocumentData, startAfter, orderBy, where } from 'firebase/firestore'
import { productType } from '../see-products/SeeProducts'
import Skeleton from '@mui/material/Skeleton';
import ProgressCircule, { ProgressCirculeInline } from '../ProgressCircule'
import ProductCard from '../product-card/ProductCard'
import AllProducts from '../all-products/AllProducts'
import { BsPlusCircleFill } from 'react-icons/bs'

export default function HomePage() {
    const [nextProducts, setNextProducts] = useState<QueryDocumentSnapshot<DocumentData>[] | null>(null)
    const [data, setData] = useState<productType[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [categoryIsLoading, setCategoryIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [total, setTotal] = useState(0)
    const [categories, setCategories] = useState<string[] | null>(null)
    const [currentCategory, setCurrentCategory] = useState('all')

    const getData = async (refetch: boolean = false) => {
        setIsLoading(true)
        const first = currentCategory === 'all' ? query(collection(db, "products"), limit(10), orderBy('timeStamp', 'desc')) : query(collection(db, "products"), where('category', '==', currentCategory), orderBy('timeStamp', 'desc'), limit(10));
        const count = currentCategory === 'all' ? query(collection(db, "products")) : query(collection(db, "products"), where('category', '==', currentCategory));
        try {
            setData(null)
            const totalCount = await getCountFromServer(count)
            const querySnapshot = (await getDocs(first));
            setNextProducts(querySnapshot.docs)
            setIsLoading(false)
            setTotal(totalCount.data().count - querySnapshot.size)
            querySnapshot.forEach((doc) => {
                setData(prev => [...(prev || []), { id: doc.id, data: doc.data() } as productType])
            });
        } catch (error) {
            console.error(error)
        }

    }

    const loadMore = async () => {
        const lastVisible = nextProducts?.[nextProducts?.length - 1];
        const next = currentCategory === 'all' ? query(collection(db, "products"),
            orderBy('timeStamp', 'desc'),
            startAfter(lastVisible),
            limit(10),
        ) : query(collection(db, "products"),
            where('category', '==', currentCategory),
            orderBy('timeStamp', 'desc'),
            startAfter(lastVisible),
            limit(10),
        )
        setIsFetching(true)
        try {
            const nextSnap = await getDocs(next)
            setTotal(prev => prev - 10)
            setNextProducts(nextSnap.docs)
            setIsFetching(false)
            nextSnap.forEach((doc) => {
                setData(prev => [...(prev || []), { id: doc.id, data: doc.data() } as any])
            });
        } catch (error) {
            console.error(error)
        }

    }

    const getAllCategories = async () => {
        const querying = query(collection(db, "products"), orderBy('timeStamp', 'desc'));
        setCategoryIsLoading(true)
        const allCategories = await getDocs(querying)
        setCategoryIsLoading(false)
        const distinctCategories = new Set()
        allCategories.forEach(doc => {
            distinctCategories.add(doc.data().category)
        })
        setCategories(Array.from(distinctCategories) as string[])
    }
    useEffect(() => {
        getData(true)
    }, [currentCategory])

    useEffect(() => {
        getAllCategories()
    }, [])
    return (
        <>
            <header className='sticky top-0 z-30'>
                <div className="scroll-container">
                    <Image src={logo} width={40} height={40} className='logo' alt='logo' />
                    <div className="scroll-content">
                        {
                            categoryIsLoading ? <div className='m-2'> Loading... </div> :
                                <>
                                    <span onClick={() => setCurrentCategory('all')} className={currentCategory === 'all' ? 'active' : ''}> all </span>
                                    {
                                        categories?.map((category) => (
                                            <span onClick={() => setCurrentCategory(category)} key={category} className={currentCategory === category ? 'active' : ''}> {category} </span>
                                        ))
                                    }

                                </>

                        }
                    </div>
                </div>
            </header>
            <AllProducts data={data} isLoading={isLoading} setData={function (id: string): void {
                throw new Error('Function not implemented.')
            }} />
            {
                isFetching ? <ProgressCirculeInline color={'text-cyan-700'} /> :
                    total > 0 ? 
                        <BsPlusCircleFill onClick={loadMore} className={'load-more'} />: null
            }
        </>


    )
}
