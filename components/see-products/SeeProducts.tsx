'use client'
import { db, storage } from '@/firebaseConfig';
import { DocumentData, QueryDocumentSnapshot, collection, deleteDoc, doc, getCountFromServer, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
import React, { useState } from 'react'
import { MdDelete } from 'react-icons/md'
import s from './seeProducts.module.css'
import Image from 'next/image';
import { BiEdit } from 'react-icons/bi'
import Link from 'next/link';
import { BsPlusCircleFill } from 'react-icons/bs'
import { deleteObject, ref } from 'firebase/storage';
import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import ProgressCircule, { ProgressCirculeInline } from '../ProgressCircule';
import { TransitionProps } from '@mui/material/transitions';

export interface productType {
    id: string,
    data: {
        category: string
        description: string
        discountPrice: number
        name: string
        photoPath: string
        photoURL: string
        price: number
        quantity: number,
        keywords: string
    }
}


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function SeeProducts() {
    const [open, setOpen] = React.useState(false);
    const [deletedProduct, setDeletedProduct] = React.useState<productType | null>(null)
    const handleClickOpen = (document: productType) => {
        setDeletedProduct(document)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseAgree = (document: productType) => {
        setOpen(false);
        handleDelete(document)
    };
    const [nextProducts, setNextProducts] = useState<QueryDocumentSnapshot<DocumentData>[] | null>(null)
    const [data, setData] = useState<productType[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [total, setTotal] = useState(0)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const getData = async () => {
        setIsLoading(true)
        const first = query(collection(db, "products"), limit(10), orderBy('timeStamp', 'desc'));
        const count = query(collection(db, "products"));
        try {
            const totalCount = await getCountFromServer(count)
            const querySnapshot = (await getDocs(first));
            setNextProducts(querySnapshot.docs)
            setIsLoading(false)
            setTotal(totalCount.data().count - querySnapshot.size)
            querySnapshot.forEach((doc) => {
                setData(prev => [...(prev || []), { id: doc.id, data: doc.data() } as any])
            });
        } catch (error) {
            console.error(error)
        }

    }

    const loadMore = async () => {
        const lastVisible = nextProducts?.[nextProducts?.length - 1];
        const next = query(collection(db, "products")
            , orderBy('timeStamp', 'desc'),
            startAfter(lastVisible),
            limit(10)
        );
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

    React.useEffect(() => {
        getData()
    }, [])

    const handleDelete = async (document: productType) => {
        try {
            setDeleteLoading(true)
            await deleteDoc(doc(db, "products", document.id));
            setDeleteLoading(false)
            const filterDataAfterDeletion = data?.filter(product => product.id !== document.id)
            setData(filterDataAfterDeletion as productType[])
            const desertRef = ref(storage, document.data.photoPath);
            await deleteObject(desertRef)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            {
                isLoading ? <ProgressCircule color={'text-cyan-700'} /> :
                    <main className={s.products}>
                        {
                            data?.map((doc) => (
                                <section key={doc.id} className={s.product}>
                                    <div className={s.productInfo}>
                                        <Image unoptimized loading='lazy' className={s.productImage} src={doc.data.photoURL} width={40} height={40} alt='photo' />
                                        <div className={s.infoContent} >
                                            <h1 className={s.name}>{doc.data.name}</h1>
                                            <h2 className={s.price}> ${doc.data.price} </h2>
                                            <h2 className={s.discountPrice}> ${doc.data.discountPrice} </h2>
                                            <h2 className={s.quantity}> {doc.data.quantity} items </h2>
                                        </div>

                                    </div>
                                    <div className={s.productActions}>
                                        <Link href={{
                                            pathname: '/admin/add-product',
                                            query: {
                                                id: doc.id,
                                                edit: 'edit',
                                                name: doc.data.name,
                                                price: doc.data.price,
                                                discountPrice: doc.data.discountPrice,
                                                description: doc.data.description,
                                                quantity: doc.data.quantity,
                                                category: doc.data.category,
                                                keywords: doc.data.keywords
                                            }
                                        }} >
                                            <BiEdit className={s.edit} />
                                        </Link>

                                        <MdDelete onClick={() => handleClickOpen(doc)} className={s.delete} />


                                    </div>
                                </section>
                            )
                            )
                        }
                        {
                            isFetching ? <ProgressCirculeInline color={'text-cyan-700'} /> :
                                total > 0 ? <button>
                                    <BsPlusCircleFill onClick={loadMore} className={s.loadMore} />
                                </button> : null
                        }
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={deleteLoading}>
                            <CircularProgress color="inherit" />
                        </Backdrop>
                        <Dialog
                            open={open}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={handleClose}
                            aria-describedby="alert-dialog-slide-description"
                        >
                            <DialogTitle>{`Delete ${deletedProduct?.data.name} ?`}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-slide-description">
                                    Are you sure , you want to delete this product ?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Disagree</Button>
                                <Button onClick={() => handleCloseAgree(deletedProduct as productType)}>Agree</Button>
                            </DialogActions>
                        </Dialog>
                    </main>
            }

        </div >
    )
}
