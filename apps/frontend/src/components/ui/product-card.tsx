import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price / 100)

  const isOutOfStock = product.stock === 0

  return (
    <Card className="flex flex-col overflow-hidden h-full border transition-all duration-200 hover:shadow-md">
      {/* Visual Image Shell */}
      <CardHeader className="p-0 relative aspect-video w-full bg-slate-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
          priority={product.isFeatured}
        />
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </CardHeader>

      {/* Item Meta Properties Data */}
      <CardContent className="flex-1 p-4">
        <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          {product.category}
        </span>
        <CardTitle className="line-clamp-1 mt-1 text-lg font-bold">{product.name}</CardTitle>
        <p className="line-clamp-2 mt-2 text-sm text-muted-foreground h-10">
          {product.description}
        </p>
      </CardContent>

      {/* Operational Interaction Layer */}
      <CardFooter className="flex items-center justify-between py-4 border-t bg-slate-50/50 mt-auto">
        <span className="text-lg font-semibold text-foreground">{formattedPrice}</span>
        <Button
          size="sm"
          disabled={isOutOfStock}
          className="transition-all duration-150"
          variant={'default'}
        >
          {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  )
}
export default ProductCard
