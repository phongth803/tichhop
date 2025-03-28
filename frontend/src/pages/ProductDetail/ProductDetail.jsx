import { Container, Grid, Divider, Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'
import { useStore } from '@/stores/rootStore'
import { useEffect } from 'react'

import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import ImageGallery from './components/ImageGallery'
import ProductInfo from './components/ProductInfo'
import RelatedProducts from './components/RelatedProducts'

const ProductDetail = observer(() => {
  const { id } = useParams()
  const { productStore } = useStore()
  const { currentProduct, relatedProducts, loading } = productStore

  useEffect(() => {
    productStore.getProductDetail(id)
  }, [id])

  if (loading) return <LoadingSkeleton />
  if (!currentProduct) return <Box>Product not found</Box>

  return (
    <Container maxW='container.xl' py={8}>
      <Grid templateColumns={{ base: '1fr', md: '3fr 2fr' }} gap={8}>
        <ImageGallery images={currentProduct.images} />
        <ProductInfo product={currentProduct} />
      </Grid>

      <Divider my={12} />

      <RelatedProducts products={relatedProducts} />
    </Container>
  )
})

export default ProductDetail
