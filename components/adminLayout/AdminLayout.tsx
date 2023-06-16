'use client'
import { Snackbar, Alert } from '@mui/material'
import React, { useState } from 'react'
import AdminHeader from '../adminHeader/AdminHeader'
import './adminLayout.css'
export default function AdminLayout({
    children
}:{
    children:React.ReactNode
}) {
    const [isAdmin,setIsAdmin] = useState(false)
    const [status, setStatus] = React.useState<'error' | 'info' | 'success' | 'warning'>('success')
    const [message,setMessage] = useState('')
    const [open,setOpen] = useState(false)

    const verifyAdminRef = React.useRef<HTMLInputElement | null>(null)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(verifyAdminRef.current?.value === process.env.VERIFY_PASSWORD) setIsAdmin(true)
        else {
            setOpen(true)
            setMessage('wrong password')
            setStatus('error')
            setTimeout(()=>{
                setOpen(false)
            },5000)
        }
        
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <>
        {
            !isAdmin ?
            <form className="form" onSubmit={handleSubmit}>
            <p className="title">verify admin</p>
            <label>
                <input ref={verifyAdminRef} placeholder="product name" type="text" className="input" />
            </label>
            <button className="submit"> verify </button>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert variant='filled' onClose={handleClose} severity={status} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </form> :
        <div>
        <AdminHeader />
        {children}
      </div>
        }
        </>
        
    )
}
