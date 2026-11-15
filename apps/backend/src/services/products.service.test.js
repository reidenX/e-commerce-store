import * as productService from './products.service.js'
import { getRecommendations } from '../pipelines/products.pipeline.js'
import AppError from '../errors/AppError.js'
import { deleteImage, uploadImage } from './cloudinary.service.js'
import { productDB } from '../repositories/productDB.repository.js'
import { productCache } from '../repositories/productCache.repository.js'

jest.mock('../config/redis.js', () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
}))

jest.mock('../lib/prisma.js', () => ({
  product: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}))

jest.mock('../repositories/productCache.repository.js', () => ({
  ...jest.createMockFromModule('../repositories/productCache.repository.js'),
}))

jest.mock('../repositories/productDB.repository.js', () => ({
  ...jest.createMockFromModule('../repositories/productDB.repository.js'),
}))

jest.mock('./cloudinary.service.js', () => ({
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
}))

jest.mock('../pipelines/products.pipeline.js', () => ({
  getRecommendations: jest.fn(),
}))

describe('fetchAllProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockAllProducts = [{ id: 'prod-456', name: 'Recommended item' }]

  test('should return parsed data from redis cache if it exists', async () => {
    productCache.getAllCached.mockResolvedValue(JSON.stringify(mockAllProducts))

    const result = await productService.fetchAllProducts()

    expect(productCache.getAllCached).toHaveBeenCalled()
    expect(result).toEqual(mockAllProducts)

    expect(productDB.findMany).not.toHaveBeenCalled()
  })

  test('should fall back to the database if the cache read fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    productCache.getAllCached.mockRejectedValue(new Error('redis down'))
    productCache.cacheAllProducts.mockResolvedValue(1)
    productDB.findMany.mockResolvedValue(mockAllProducts)

    const result = await productService.fetchAllProducts()

    expect(productDB.findMany).toHaveBeenCalled()
    expect(result).toEqual(mockAllProducts)
    expect(consoleSpy).toHaveBeenCalled()
  })

  test('should throw a 404 error if the product does not exist in the database', async () => {
    productCache.getAllCached.mockResolvedValue(null)
    productDB.findMany.mockResolvedValue([])

    await expect(productService.fetchAllProducts).rejects.toThrow(
      new AppError('No products found', 404),
    )

    expect(productCache.cacheAllProducts).not.toHaveBeenCalled()
  })

  test('should still return data if caching the result fails', async () => {
    productCache.getAllCached.mockResolvedValue(null)
    productCache.cacheAllProducts.mockRejectedValue(new Error('redis down'))
    productDB.findMany.mockResolvedValue(mockAllProducts)

    const result = await productService.fetchAllProducts()

    expect(result).toEqual(mockAllProducts)
  })
})

describe('fetchFeaturedProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockFeaturedProducts = [{ id: 'prod_123', isFeatured: true }]

  test('should return parsed data from redis cache if it exists', async () => {
    productCache.getFeaturedCached.mockResolvedValue(JSON.stringify(mockFeaturedProducts))

    const result = await productService.fetchFeaturedProducts()

    expect(productCache.getFeaturedCached).toHaveBeenCalledWith()
    expect(result).toEqual(mockFeaturedProducts)

    expect(productDB.findAllFeatured).not.toHaveBeenCalled()
  })

  test('should fall back to the database if the cache read fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    productCache.getFeaturedCached.mockRejectedValue(new Error('redis down'))
    productCache.cacheFeatured.mockResolvedValue(1)
    productDB.findAllFeatured.mockResolvedValue(mockFeaturedProducts)

    const result = await productService.fetchFeaturedProducts()

    expect(productDB.findAllFeatured).toHaveBeenCalled()
    expect(result).toEqual(mockFeaturedProducts)
    expect(consoleSpy).toHaveBeenCalled()
  })

  test('should throw a 404 error if there is no featured products in the database', async () => {
    productCache.getFeaturedCached.mockResolvedValue(null)
    productDB.findAllFeatured.mockResolvedValue([])

    await expect(productService.fetchFeaturedProducts).rejects.toThrow(
      new AppError('No featured products found', 404),
    )

    expect(productCache.cacheFeatured).not.toHaveBeenCalled()
  })

  test('should still return data if caching the result fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    productCache.getFeaturedCached.mockResolvedValue(null)
    productCache.cacheFeatured.mockRejectedValue(new Error('redis down'))
    productDB.findAllFeatured.mockResolvedValue(mockFeaturedProducts)

    const result = await productService.fetchFeaturedProducts()

    expect(result).toEqual(mockFeaturedProducts)
    expect(consoleSpy).toHaveBeenCalled()
  })
})

describe('fetchByCategory', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockProductCategory = 'Food'
  const mockProductsByCategory = [{ id: 'prod_123', category: 'Food' }]

  test('should return parsed data from redis cache if it exists', async () => {
    productCache.getByCategoryCached.mockResolvedValue(JSON.stringify(mockProductsByCategory))

    const result = await productService.fetchByCategory(mockProductCategory)

    expect(productCache.getByCategoryCached).toHaveBeenCalledWith(mockProductCategory)
    expect(productDB.findByCategory).not.toHaveBeenCalled()

    expect(result).toEqual(mockProductsByCategory)
  })

  test('should fall back to the database if the cache read fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    productCache.getByCategoryCached.mockRejectedValue(new Error('redis down'))
    productCache.cacheByCategory.mockResolvedValue(1)
    productDB.findByCategory.mockResolvedValue(mockProductsByCategory)

    const result = await productService.fetchByCategory(mockProductCategory)

    expect(productDB.findByCategory).toHaveBeenCalledWith(mockProductCategory)
    expect(result).toEqual(mockProductsByCategory)
    expect(consoleSpy).toHaveBeenCalled()
  })

  test('should throw a 404 error if the category do not exist in the database', async () => {
    productCache.getByCategoryCached.mockResolvedValue(null)
    productDB.findByCategory.mockResolvedValue([])

    await expect(productService.fetchByCategory(mockProductCategory)).rejects.toThrow(
      new AppError('No category found', 404),
    )

    expect(productCache.cacheByCategory).not.toHaveBeenCalled()
  })

  test('should still return data if caching the result fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    productCache.getByCategoryCached.mockResolvedValue(null)
    productCache.cacheByCategory.mockRejectedValue(new Error('redis down'))
    productDB.findByCategory.mockResolvedValue(mockProductsByCategory)

    const result = await productService.fetchByCategory(mockProductCategory)

    expect(result).toEqual(mockProductsByCategory)
    expect(consoleSpy).toHaveBeenCalled()
  })
})

describe('fetchRecommendedProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockProductId = 'prod-123'
  const mockProduct = { id: 'prod-123', category: 'Food' }
  const mockRecommendations = [{ id: 'prod-456', name: 'Recommended item' }]

  test('should return parsed data from redis cache if it exists', async () => {
    productCache.getRecommendedCached.mockResolvedValue(JSON.stringify(mockRecommendations))

    const result = await productService.fetchRecommendedProducts(mockProductId)

    expect(result).toEqual(mockRecommendations)
    expect(productCache.cacheRecommended).not.toHaveBeenCalled()
    expect(productDB.findById).not.toHaveBeenCalled()
  })

  test('should throw a 404 error if there is no product found in the database', async () => {
    productCache.getRecommendedCached.mockResolvedValue(null)
    productDB.findById.mockResolvedValue(null)

    await expect(productService.fetchRecommendedProducts(mockProductId)).rejects.toThrow(
      new AppError('No product found', 404),
    )

    expect(getRecommendations).not.toHaveBeenCalled()
    expect(productCache.cacheRecommended).not.toHaveBeenCalled()
  })

  test('should run getRecommendations if product exists, cache them, and return them on cache miss', async () => {
    productCache.getRecommendedCached.mockResolvedValue(null)
    productCache.cacheRecommended.mockResolvedValue(1)
    productDB.findById.mockResolvedValue(mockProduct)
    getRecommendations.mockResolvedValue(mockRecommendations)

    const result = await productService.fetchRecommendedProducts(mockProductId)

    expect(productDB.findById).toHaveBeenCalledWith(mockProductId)
    expect(getRecommendations).toHaveBeenCalledWith(mockProduct.id, mockProduct.category)

    expect(productCache.cacheRecommended).toHaveBeenCalledWith(mockProductId, mockRecommendations)

    expect(result).toEqual(mockRecommendations)
  })

  test('should return an empty array when there are no recommendations', async () => {
    productCache.getRecommendedCached.mockResolvedValue(null)
    productCache.cacheRecommended.mockResolvedValue(1)
    productDB.findById.mockResolvedValue({ id: 'prod-1', category: 'shoes' })
    getRecommendations.mockResolvedValue([])

    await expect(productService.fetchRecommendedProducts('prod-1')).resolves.toEqual([])
  })
})

describe('fetchProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockProductId = 'prod_123'
  const mockProduct = { id: 'prod_123', name: 'prod_123' }

  test('should return parsed data from redis cache if it exists', async () => {
    productCache.getCachedById.mockResolvedValue(JSON.stringify(mockProduct))

    const result = await productService.fetchProduct(mockProductId)

    expect(result).toEqual(mockProduct)
    expect(productCache.cacheProduct).not.toHaveBeenCalled()
    expect(productDB.findById).not.toHaveBeenCalled()
  })

  test('should fall back to the database if the cache read fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    productCache.getCachedById.mockRejectedValue(new Error('redis down'))
    productCache.cacheProduct.mockResolvedValue(1)
    productDB.findById.mockResolvedValue(mockProduct)

    const result = await productService.fetchProduct(mockProductId)

    expect(productDB.findById).toHaveBeenCalledWith(mockProductId)
    expect(result).toEqual(mockProduct)
    expect(consoleSpy).toHaveBeenCalled()
  })

  test('should throw a 404 error if no product exist in the database', async () => {
    productCache.getCachedById.mockResolvedValue(null)
    productDB.findById.mockResolvedValue(null)

    await expect(productService.fetchProduct(mockProductId)).rejects.toThrow(
      new AppError('No product found', 404),
    )

    expect(productCache.cacheProduct).not.toHaveBeenCalled()
  })

  test('should still return data if caching the result fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    productCache.getCachedById.mockResolvedValue(null)
    productCache.cacheProduct.mockRejectedValue(new Error('redis down'))
    productDB.findById.mockResolvedValue(mockProduct)

    const result = await productService.fetchProduct(mockProductId)

    expect(productDB.findById).toHaveBeenCalledWith(mockProductId)
    expect(result).toEqual(mockProduct)
    expect(consoleSpy).toHaveBeenCalled()
  })
})

describe('postProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockProductData = { name: 'Gaming Mouse', price: 50, category: 'Electronics' }
  const mockBuffer = Buffer.from('fake-image-bytes')

  const mockCloudinaryResponse = {
    secure_url: 'https://cloudinary.com',
    public_id: 'cloudinary-id-123',
  }

  const mockCreatedProduct = {
    id: 'prod-999',
    ...mockProductData,
    image: 'https://cloudinary.com',
    imageId: 'cloudinary-id-123',
  }

  test('should upload image to cloudinary, save product to database, and invalidate all cache', async () => {
    uploadImage.mockResolvedValue(mockCloudinaryResponse)
    productDB.createProduct.mockResolvedValue(mockCreatedProduct)
    productCache.clearAllCached.mockResolvedValue(1)

    const result = await productService.postProduct(mockProductData, mockBuffer)

    const mockData = {
      name: 'Gaming Mouse',
      price: 50,
      category: 'Electronics',
      image: 'https://cloudinary.com',
      imageId: 'cloudinary-id-123',
    }

    expect(uploadImage).toHaveBeenCalledWith(mockBuffer)
    expect(productDB.createProduct).toHaveBeenCalledWith(mockData)

    expect(productCache.clearAllCached).toHaveBeenCalled()
    expect(result).toEqual(mockCreatedProduct)
  })

  test('should delete image from cloudinary if database creation crashes', async () => {
    productDB.createProduct.mockRejectedValue(new Error('Database Connection Timeout'))
    uploadImage.mockResolvedValue(mockCloudinaryResponse)

    await expect(productService.postProduct(mockProductData, mockBuffer)).rejects.toThrow(
      'Database Connection Timeout',
    )

    expect(deleteImage).toHaveBeenCalledWith('cloudinary-id-123')
    expect(productCache.clearAllCached).not.toHaveBeenCalled()
  })

  test('should try to delete image if the cloudinary upload itself fails first', async () => {
    uploadImage.mockRejectedValue(new Error('Cloudinary Upload Failed'))

    await expect(productService.postProduct(mockProductData, mockBuffer)).rejects.toThrow(
      'Cloudinary Upload Failed',
    )

    expect(deleteImage).not.toHaveBeenCalled()
    expect(productDB.createProduct).not.toHaveBeenCalled()
  })
})

describe('updateProductFeature', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockProduct = { id: 'prod-123', name: 'prod-123', category: 'Food', isFeatured: false }

  const mockUpdatedProduct = {
    ...mockProduct,
    isFeatured: true,
  }

  test('should fetch the product from the database, update the feature, and clear all cache', async () => {
    productDB.findById.mockResolvedValue(mockProduct)
    productDB.updateProductFeature.mockResolvedValue(mockUpdatedProduct)
    productCache.clearAllCached.mockResolvedValue(1)

    const result = await productService.updateProductFeature('prod-123')

    expect(productDB.updateProductFeature).toHaveBeenCalledWith('prod-123', mockProduct.isFeatured)

    expect(productCache.clearAllCached).toHaveBeenCalled()
    expect(result).toEqual(mockUpdatedProduct)
  })

  test('should return a 404 error if no product found in the database and not clear the cache', async () => {
    productDB.findById.mockResolvedValue(null)

    await expect(productService.updateProductFeature('prod-123')).rejects.toThrow(
      new AppError('No product found', 404),
    )

    expect(productDB.updateProductFeature).not.toHaveBeenCalled()
    expect(productCache.clearAllCached).not.toHaveBeenCalled()
  })
})

describe('updateProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockProduct = {
    id: 'prod-id-123',
    name: 'prod-456',
    description: 'prod desc',
    price: 15,
    category: 'Clothes',
  }

  const mockNewProductData = {
    name: 'prod-456',
    description: 'prod desc',
    price: 15,
    category: 'Clothes',
  }

  test('should return updated product and clear the cache', async () => {
    productDB.updateProductData.mockResolvedValue(mockNewProductData)
    productCache.clearAllCached.mockResolvedValue(1)

    const result = await productService.updateProduct(mockProduct.id, mockNewProductData)

    expect(productDB.updateProductData).toHaveBeenCalledWith(mockProduct.id, mockNewProductData)
    expect(result).toEqual(mockNewProductData)
    expect(productCache.clearAllCached).toHaveBeenCalled()
  })

  test('should throw a 404 error if no product found and not clear the cache', async () => {
    productDB.updateProductData.mockResolvedValue(null)

    await expect(productService.updateProduct('prod-id-123', mockNewProductData)).rejects.toThrow(
      new AppError('No product found', 404),
    )

    expect(productCache.clearAllCached).not.toHaveBeenCalled()
  })
})

describe('deleteProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockDeletedProduct = {
    id: 'prod-id-123',
    name: 'prod-name-123',
    description: 'prod desc',
    price: 15,
    image: 'prod-img',
    imageId: 'prod-img-id',
    category: 'prod-category',
    isFeatured: false,
  }

  const mockCloudinaryResponse = {
    secure_url: 'https://cloudinary.com',
    public_id: 'cloudinary-id-123',
  }

  test('should return a 404 error if no product found and not clear the cache', async () => {
    productDB.deleteProduct.mockResolvedValue(null)

    await expect(productService.deleteProduct('testId123')).rejects.toThrow(
      new AppError('No product found', 404),
    )

    expect(productCache.clearAllCached).not.toHaveBeenCalled()
  })

  test('should delete product and cloudinary image if it exists in the database', async () => {
    productDB.deleteProduct.mockResolvedValue(mockDeletedProduct)
    productCache.clearAllCached.mockResolvedValue(1)
    deleteImage.mockResolvedValue(mockCloudinaryResponse)

    const result = await productService.deleteProduct('prod-id-123')

    expect(productDB.deleteProduct).toHaveBeenCalledWith(mockDeletedProduct.id)
    expect(productCache.clearAllCached).toHaveBeenCalled()
    expect(deleteImage).toHaveBeenCalledWith('prod-img-id')
    expect(result).toEqual(true)
  })

  test('should throw 404 error if product do not exist in the database', async () => {
    productDB.deleteProduct.mockResolvedValue(null)

    await expect(productService.deleteProduct('prod-id-123')).rejects.toThrow(
      new AppError('No product found', 404),
    )

    expect(deleteImage).not.toHaveBeenCalledWith('prod-id-123')
    expect(productCache.clearAllCached).not.toHaveBeenCalled()
  })
})
