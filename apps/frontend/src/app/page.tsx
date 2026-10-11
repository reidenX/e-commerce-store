import ProductCard from '@/components/ui/product-card'
import { MOCK_PRODUCTS } from '@/constants/mock-products'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Block Section */}
        <div className="border-b pb-6 mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Production Storefront
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Displaying modern decoupled components fueled by a mock relational schema.
          </p>
        </div>

        {/* 🚀 Responsive Product Grid Assembly */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  )
}
