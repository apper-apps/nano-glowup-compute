import productData from '@/services/mockData/products.json'

export const ProductService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 350))
    return [...productData]
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const product = productData.find(item => item.Id === id)
    if (!product) {
      throw new Error('Product not found')
    }
    return { ...product }
  },

  create: async (product) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newId = Math.max(...productData.map(item => item.Id)) + 1
    const newProduct = { ...product, Id: newId }
    productData.push(newProduct)
    return { ...newProduct }
  },

  update: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = productData.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    productData[index] = { ...productData[index], ...data }
    return { ...productData[index] }
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = productData.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    const deleted = productData.splice(index, 1)[0]
    return { ...deleted }
  }
}