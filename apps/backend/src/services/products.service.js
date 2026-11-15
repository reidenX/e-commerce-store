import AppError from '../errors/AppError.js'
import * as cloudinaryService from './cloudinary.service.js'
import { getRecommendations } from '../pipelines/products.pipeline.js'
import { productDB } from '../repositories/productDB.repository.js'
import { productCache } from '../repositories/productCache.repository.js'
import { safeAwait } from '../helpers/await.helper.js'
import { withCache } from '../helpers/withCache.helper.js'

export const fetchAllProducts = () =>
  withCache({
    read: () => productCache.getAllCached(),
    load: () => productDB.findMany(),
    write: (allProducts) => productCache.cacheAllProducts(allProducts),
    notFound: 'No products found',
  })

export const fetchFeaturedProducts = () =>
  withCache({
    read: () => productCache.getFeaturedCached(),
    load: () => productDB.findAllFeatured(),
    write: (featuredProducts) => productCache.cacheFeatured(featuredProducts),
    notFound: 'No featured products found',
  })

export const fetchByCategory = (category) =>
  withCache({
    read: () => productCache.getByCategoryCached(category),
    load: () => productDB.findByCategory(category),
    write: (byCategory) => productCache.cacheByCategory(category, byCategory),
    notFound: 'No category found',
  })

export const fetchRecommendedProducts = (currentProductId) =>
  withCache({
    read: () => productCache.getRecommendedCached(currentProductId),
    load: async () => {
      const currentProduct = await productDB.findById(currentProductId)
      if (!currentProduct) throw new AppError('No product found', 404)

      return getRecommendations(currentProduct.id, currentProduct.category)
    },
    write: (recommendations) => productCache.cacheRecommended(currentProductId, recommendations),
    notFound: 'No recommendations found',
    allowEmpty: true,
  })

export const fetchProduct = (productId) =>
  withCache({
    read: () => productCache.getCachedById(productId),
    load: () => productDB.findById(productId),
    write: (product) => productCache.cacheProduct(productId, product),
    notFound: 'No product found',
  })

export const postProduct = async (productData, fileBuffer) => {
  let cloudinaryResult

  try {
    cloudinaryResult = await cloudinaryService.uploadImage(fileBuffer)

    const finalData = {
      ...productData,
      image: cloudinaryResult.secure_url,
      imageId: cloudinaryResult.public_id,
    }

    const newProduct = await productDB.createProduct(finalData)

    await safeAwait(
      productCache.clearAllCached(newProduct.category),
      'failed to clear all cached products',
    )

    return newProduct
  } catch (error) {
    if (cloudinaryResult?.public_id) {
      await cloudinaryService.deleteImage(cloudinaryResult.public_id)
    }
    throw error
  }
}

export const updateProductFeature = async (productId) => {
  const product = await productDB.findById(productId)
  if (!product) throw new AppError('No product found', 404)

  const updatedProduct = await productDB.updateProductFeature(productId, product.isFeatured)

  await safeAwait(
    productCache.clearAllCached(updatedProduct.category, productId),
    'failed to clear cached products',
  )

  return updatedProduct
}

export const updateProduct = async (productId, newData) => {
  const updatedProduct = await productDB.updateProductData(productId, newData)
  if (!updatedProduct) throw new AppError('No product found', 404)

  await safeAwait(
    productCache.clearAllCached(updatedProduct.category),
    'failed to clear cached products',
  )

  return updatedProduct
}

export const deleteProduct = async (productId) => {
  const deletedProduct = await productDB.deleteProduct(productId)
  if (!deletedProduct) throw new AppError('No product found', 404)
  if (deletedProduct.imageId) await cloudinaryService.deleteImage(deletedProduct.imageId)

  await safeAwait(
    productCache.clearAllCached(deletedProduct.category, productId),
    'failed to clear cached products',
  )

  return true
}
