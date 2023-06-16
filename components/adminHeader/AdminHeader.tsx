import Link from 'next/link'
import React from 'react'
import s from './adminHeader.module.css'
export default function AdminHeader() {
  return (
    <header className={s.adminHeader}>
      <Link href={'/admin/see-products'} >
        see products
      </Link>
      <Link href={'/admin/add-product'} >
        add product
      </Link>

    </header>
  )
}
