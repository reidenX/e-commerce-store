import ProductCard from '@/components/ui/product-card'
import { Product } from '@/types'
import { apiClient } from '@/lib/api-client'

export default async function HomePage() {
  let products: Product[] = []
  let errorMsg = ''

  try {
    products = await apiClient.get<Product[]>('/products')
  } catch {
    errorMsg = 'Failed to fetch live inventory. Displaying fallback server states.'
  }

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Block Section */}
        <div className="border-b pb-6 mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Storefront
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            List of products available for purchase.
          </p>

          {/* Visual Indicator showing the developer environment state */}
          <div className="flex items-center gap-2 self-start md:self-center">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${errorMsg ? 'bg-destructive' : 'bg-emerald-400'}`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${errorMsg ? 'bg-destructive' : 'bg-emerald-500'}`}
              ></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              {errorMsg ? 'Connection Offline' : 'Live API Connected'}
            </span>
          </div>
        </div>

        {/* 🚨 Server-Side Disaster Interception Layout */}
        {errorMsg && (
          <div className="mb-8 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm font-medium text-destructive">
            {errorMsg}
          </div>
        )}

        {/* 🚀 Responsive Product Grid Assembly */}
        {products.length === 0 && !errorMsg ? (
          <div className="text-center py-20 border border-dashed rounded-xl bg-background">
            <p className="text-muted-foreground text-sm">
              No items found inside the database catalog.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
