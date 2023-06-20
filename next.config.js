/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    VERIFY_PASSWORD:'FM_Lighting_Alibaba_20623',
    PHONE_NUMBER:'96170449622'
  },
  images: {
    domains: ['firebasestorage.googleapis.com']
  },

}

module.exports = nextConfig
