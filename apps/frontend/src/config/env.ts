const isInDevelopment = process.env.NODE_ENV === 'production'

export const envConfig = {
  isInDevelopment,
  apiBaseUrl: isInDevelopment
    ? process.env.NEXT_PUBLIC_API_DEV_URL || 'http://localhost:4005/api'
    : process.env.NEXT_PUBLIC_API_PROD_URL || '',
}
