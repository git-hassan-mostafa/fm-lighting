/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    VERIFY_PASSWORD:'AHMAD_KHALED_FM_LIGHTING_ELECTRIC_PRODUCTS',
    PHONE_NUMBER:'96170449622'
  },
  images: {
    domains: ['firebasestorage.googleapis.com']
  },

}

module.exports = nextConfig
