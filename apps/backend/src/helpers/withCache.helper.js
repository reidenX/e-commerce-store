import AppError from '../errors/AppError.js'
import { safeAwait } from './await.helper.js'

/**
 * Cache-aside helper: tries the cache first, falls back to the loader
 * (usually the database), then writes the result back to the cache.
 *
 * Cache failures are non-fatal. A failed read is treated as a miss and a
 * failed write is logged and ignored, so the request still succeeds
 * using the database.
 *
 * @template T
 * @param {Object} options
 * @param {() => Promise<string|null|undefined>} options.read
 *   Reads the raw cached value (a JSON string). Return a falsy value on a miss.
 * @param {() => Promise<T|null|undefined>} options.load
 *   Loads fresh data from the source of truth. Called only on a cache miss.
 * @param {(data: T) => Promise<unknown>} options.write
 *   Stores the loaded data in the cache. Called only after a successful load.
 * @param {string} options.notFound
 *   Message for the 404 error thrown when `load` returns null, undefined,
 *   or an empty array.
 * @returns {Promise<T>} The cached (parsed) value or the freshly loaded data.
 * @throws {AppError} 404 with `notFound` as the message if nothing is found.
 *
 * @example
 * export const fetchProduct = (id) =>
 *   withCache({
 *     read: () => productCache.getCachedById(id),
 *     load: () => productDB.findById(id),
 *     write: (product) => productCache.cacheProduct(id, product),
 *     notFound: 'No product found',
 *   })
 */

export const withCache = async ({ read, load, write, notFound, allowEmpty = false }) => {
  const hit = await safeAwait(read())
  if (hit) return JSON.parse(hit)

  const data = await load()
  if (!data || (!allowEmpty && Array.isArray(data) && data.length === 0)) {
    throw new AppError(notFound, 404)
  }

  await safeAwait(write(data), 'failed to cache')
  return data
}
