import { productService } from "../services/index.js"

export const getProducts = async (req, res) => {
    const result = await productService.getProducts()
    res.send({ status: 'success', payload: result })
}

export const getProductByID = async (req, res) => {
    const  pid  = req.params.pid
    const result = await productService.getProductById(pid)

    res.send({ status: 'success', payload: result })
}

export const createProducts = async (req, res) => {
    try { 
    
        const product = req.body

    const result = await productService.createProducts(product)
    res.send({ status: 'success', payload: result })
}catch (error) {
    res.send({ status: 'error', payload: error.message })
}
}

export const updateProducts = async (req, res) => {
    try {
        const pid = req.params.pid
        const product = req.body
        const result = await productService.updateProducts(pid, product)
        res.send({ status: 'success', payload: result })
    } catch (error) {
        res.send({ status: 'error', payload: error.message })
    }
}

export const deleteProducts = async (req, res) => {
    try {
        const { pid } = req.params
        const result = await productService.deleteProducts(pid)
        res.send({ status: 'success', payload: result })
    } catch (error) {
        res.send({ status: 'error', payload: error.message })
    }
}