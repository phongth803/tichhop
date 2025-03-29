import { Container, Grid, Divider, Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'
import { useStore } from '@/stores/rootStore'
import { useEffect } from 'react'

import ImageGallery from './components/ImageGallery'
import ProductInfo from './components/ProductInfo'
import RelatedProducts from './components/RelatedProducts'
import Loading from '@/components/common/Loading'

const ProductDetail = observer(() => {
  const { id } = useParams()
  const { productStore } = useStore()
  const { currentProduct, relatedProducts, loadingStates } = productStore

  useEffect(() => {
    productStore.getProductDetail(id)
  }, [id])

  if (loadingStates.detail || loadingStates.related) {
    return <Loading text='Loading product details...' />
  }

  if (!currentProduct) {
    return (
      <Container maxW='container.xl' py={8}>
        <Box>Product not found</Box>
      </Container>
    )
  }

  return (
    <Container maxW='container.xl' py={8}>
      <Grid templateColumns={{ base: '1fr', md: '3fr 2fr' }} gap={8}>
        <ImageGallery images={currentProduct.images} />
        <ProductInfo product={currentProduct} />
      </Grid>

      {relatedProducts.length > 0 && (
        <>
          <Divider my={12} />
          <RelatedProducts products={relatedProducts} />
        </>
      )}
    </Container>
  )
})

export default ProductDetail
