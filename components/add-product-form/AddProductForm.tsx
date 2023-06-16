'use client'
import React, { ChangeEvent, useState } from 'react'
import './addProductForm.css'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/firebaseConfig';
import { Alert, Snackbar } from '@mui/material';
import { UploadTask, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Image from 'next/image';
import next from '../../public/next.svg'

interface formType {
    edit: boolean,
    id: string | null
    name: string | null
    description: string | null
    quantity: string | null
    price: string | null
    discountPrice: string | null
    category: string | null
    keywords: string | null
}
export default function AddProductForm({ edit, id, name, description, discountPrice, price, quantity, category, keywords }: formType) {

    const productNameRef = React.useRef<HTMLInputElement>(null)
    const quantityRef = React.useRef<HTMLInputElement>(null)
    const descriptionRef = React.useRef<HTMLInputElement>(null)
    const priceRef = React.useRef<HTMLInputElement>(null)
    const discountPriceRef = React.useRef<HTMLInputElement>(null)
    const keywordsRef = React.useRef<HTMLInputElement>(null)
    const categoryRef = React.useRef<HTMLInputElement>(null)

    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [data, setData] = React.useState<File | null>(null);
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [status, setStatus] = React.useState<'error' | 'info' | 'success' | 'warning'>('success')
    const [message, setMessage] = React.useState('')

    const storageRef = ref(storage, `photos/${data?.name}`);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
        e.target.files &&
            setData(e.target.files[0])
        const file = e?.target?.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPhotoPreview(url);
        }

    }


    const uploadTask: UploadTask | null = data ? uploadBytesResumable(storageRef, data) : null;

    const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {

            if (!productNameRef.current?.value || !quantityRef.current?.value || !priceRef.current?.value || !photoPreview
            ) {
                setMessage('all fields are required')
                setOpen(true)
                setStatus('error')
                setTimeout(() => {
                    setOpen(false)
                }, 5000)
                return
            }
            setIsLoading(true)
            uploadTask?.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    switch (snapshot.state) {
                        case 'paused':
                            break;
                        case 'running':
                            break;
                    }
                },
                (error) => {
                    console.error(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        const docRef = await addDoc(collection(db, "products"), {
                            name: productNameRef?.current?.value,
                            quantity: quantityRef?.current?.value,
                            description: descriptionRef?.current?.value,
                            price: priceRef?.current?.value,
                            discountPrice: discountPriceRef?.current?.value,
                            keywords: keywordsRef?.current?.value,
                            category: categoryRef?.current?.value,
                            photoURL: downloadURL,
                            photoPath: storageRef.fullPath,
                            timeStamp:serverTimestamp()
                        });
                        setIsLoading(false)
                        if (docRef.id) {
                            setOpen(true)
                            setMessage('product added successfully')
                            setStatus('success')
                            console.log('product with id ' + docRef.id)
                            productNameRef.current ? productNameRef.current.value = '' : null
                            quantityRef.current ? quantityRef.current.value = '' : null
                            descriptionRef.current ? descriptionRef.current.value = '' : null
                            priceRef.current ? priceRef.current.value = '' : null
                            discountPriceRef.current ? discountPriceRef.current.value = '' : null
                            categoryRef?.current ? categoryRef.current.value = '' : null
                            keywordsRef.current ? keywordsRef.current.value = '' : null
                            setPhotoPreview(null)
                            setTimeout(() => {
                                setOpen(false)
                            }, 5000)
                        }
                        else {
                            setOpen(true)
                            setMessage('an error occurred , please try again')
                            setStatus('error')
                            setTimeout(() => {
                                setOpen(false)
                            }, 5000)
                        }
                    });
                }
            );

        } catch (e) {
            setOpen(true)
            setMessage('an error occurred , please try again')
            setStatus('error')
            console.error("Error adding document: ", e);
            setTimeout(() => {
                setOpen(false)
            }, 5000)
        }
    }

    const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            const docRef = doc(db, 'products', id as string);
            // Update the timestamp field with the value from the server
            setIsLoading(true)
            await updateDoc(docRef, {
                name: productNameRef?.current?.value || name,
                quantity: quantityRef?.current?.value || quantity,
                description: descriptionRef?.current?.value || description,
                price: priceRef?.current?.value || price,
                discountPrice: discountPriceRef?.current?.value || discountPrice,
                keywords: keywordsRef?.current?.value || keywords,
                category: categoryRef?.current?.value || category,
            });
            setIsLoading(false)
            productNameRef.current ? productNameRef.current.value = '' : null
            quantityRef.current ? quantityRef.current.value = '' : null
            descriptionRef.current ? descriptionRef.current.value = '' : null
            priceRef.current ? priceRef.current.value = '' : null
            discountPriceRef.current ? discountPriceRef.current.value = '' : null
            categoryRef?.current ? categoryRef.current.value = '' : null
            keywordsRef.current ? keywordsRef.current.value = '' : null
            setOpen(true)
            setMessage('updated successfully')
            setStatus('success')
            setTimeout(() => {
                setOpen(false)
            }, 5000)
        } catch (error) {
            setMessage('an error occured')
            setStatus('error')
            console.error(error)
        }

    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!edit) handleAddProduct(e)
        else handleEditProduct(e)
    }
    
    return (
        <form className="form" onSubmit={handleSubmit}>
            <p className="title">{edit ? `update ${name}` : 'add'} Product </p>
            <p className="message">fill this form out to add a product </p>
            {photoPreview && <Image className='product-photo' src={photoPreview || next} width={0} height={0} alt='photo' />}
            {
                !edit && <>
                    <label className='p-2 bg-cyan-700 hover:bg-cyan-600 rounded-md text-center text-white' htmlFor="product-photo">upload photo</label>
                    <input onChange={(e) => handleSelectFile(e)} className='hidden' type="file" accept='.jpg,.jpeg,.png,.jfif,.avif,.webp,.ico' id="product-photo" />
                </>
            }
            <div className="flex">
                <label>
                    <input ref={productNameRef} placeholder="product name" type="text" className="input" />
                </label>

                <label>
                    <input min={0} ref={quantityRef} placeholder="quantity" type="number" className="input" />
                </label>
            </div>

            <label>
                <input ref={descriptionRef} placeholder="description" type="text" className="input" />
            </label>

            <label>
                <input min={0} ref={priceRef} placeholder="price $" type="number" className="input" />
            </label>
            <label>
                <input min={0} ref={discountPriceRef} placeholder="discount price $" type="number" className="input" />
            </label>
            <label>
                <input ref={categoryRef} placeholder="category" type="text" className="input" />
            </label>
            <label>
                <input ref={keywordsRef} placeholder="keywords" type="text" className="input" />
            </label>
            <button className="submit"> {isLoading ? 'loading...' : 'submit'} </button>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert variant='filled' onClose={handleClose} severity={status} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </form>
    )
}

