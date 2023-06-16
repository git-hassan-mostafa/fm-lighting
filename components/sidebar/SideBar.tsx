'use client'

import React from 'react'
import './sidebar.css'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../../public/logo.jpg'
import { FaHome } from 'react-icons/fa'
import { RiAdminLine } from 'react-icons/ri'
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { BsCart4 } from 'react-icons/bs'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { redirect, useParams, usePathname, useRouter } from 'next/navigation'
export default function SideBar() {
    const [value, setValue] = React.useState(0);
    const { push } = useRouter()
    return (
        <div className=''>
            <Paper className='bottom-navigation' sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    onChange={(event, newValue) => {
                        const paths = ['/', '/cart', '/admin']
                        push(paths[newValue])
                    }}
                >
                    <BottomNavigationAction className='text-cyan-700' label="Home" icon={<HomeIcon />} />
                    <BottomNavigationAction className='text-cyan-700' label="Cart" icon={<ShoppingCartIcon />} />
                    <BottomNavigationAction className='text-cyan-700' label="Admin" icon={<AdminPanelSettingsIcon />} />

                </BottomNavigation>
            </Paper>
            <div className="area"></div>
            <nav className="main-menu">
                <div className='logo' >
                    <Image src={logo} width={40} height={40} alt='logo' className='logo-image' />
                </div>
                <ul>
                    <li>
                        <Link className='link' href="/">
                            <FaHome className='fa-2x fa icon' />
                            <span className="nav-text">
                                Home
                            </span>
                        </Link>

                    </li>
                    <li>
                        <Link className='link' href="/cart">
                            <BsCart4 className='fa-2x fa icon' />
                            <span className="nav-text">
                                Cart
                            </span>
                        </Link>

                    </li>
                    <li>
                        <Link className='link' href="/admin">
                            <RiAdminLine className='fa-2x fa icon' />
                            <span className="nav-text">
                                Admin Dashboard
                            </span>
                        </Link>

                    </li>

                </ul>
            </nav>
        </div>
    )
}
