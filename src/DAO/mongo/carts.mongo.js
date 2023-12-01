import CartModel from "./models/carts.mongo.model.js";
import ProductModel from "./models/products.mongo.model.js";
import Ticket from "./tickets.mongo.js";

export default class Cart {
  getCarts = async () => {
    return await CartModel.find();
  };
  getCartById = async (id) => {
    return await CartModel.findOne({ _id: id });
  };
  createCarts = async (cart) => {
    return await CartModel.create(cart);
  };
  updateCarts = async (cid, product) => {
    let resultDelCarrito = await CartModel.findOne({ _id: cid });
    const resultDelProducto = await ProductModel.findOne({ _id: product.pid });
    /* hacer push del id y no del producto */
    if (!resultDelProducto || !resultDelCarrito)
      return "No existe producto o carrito";

    const resultadoEncontrado = resultDelCarrito.products.find(
      (producto) => producto.pid.toString() === product.pid
    );

    if (resultadoEncontrado !== undefined) {
      resultadoEncontrado.quantity += product.quantity;
      await resultDelCarrito.save();
    } 
    else {
      resultDelCarrito.products.push(product);
      await resultDelCarrito.save();
    }
    //resultDelCarrito.products.push({pid,quantity} )

    return resultDelCarrito;
  };

  purchaseCarts = async (cart, userMail) => {
    
    
    
    let totalAmount = 0;
    for (let i = 0; i < cart.products.length; i++) {
    const resultDelProducto = await ProductModel.findOne({
        _id: cart.products[i].pid,
    });





    if (resultDelProducto.stock >= cart.products[i].quantity) {
    //Si el stock en góndola es mayor a la cantidad en el carrito
    //
    //
        //Calculo el stock en góndola
        resultDelProducto.stock = resultDelProducto.stock - cart.products[i].quantity;

        //Guardo el nuevo stock en góndola
        await resultDelProducto.save();

        //Chequeo el stock que quedó en gondola con productModel.findOne
        // const currentProductStock = await ProductModel.findOne({_id: resultDelProducto._id})
        // console.log('currentProductStock (if)', currentProductStock)

        //Calculo sumo el valor del producto * cantidad al totalAmount
        totalAmount += resultDelProducto.price * cart.products[i].quantity;

        //Elimino el producto del carrito
        const updateCartResponse = await CartModel.updateOne(
          { _id: cart._id }, 
          { $pull: { products: { pid: resultDelProducto._id} } },
        )
        //console.log('updateCartResponse', updateCartResponse)

        //Chequear el carrito a ver si se eliminó correctamente
        // const currentCartState = await CartModel.findOne({_id: cart._id}) 
        // console.log('currentCartState (if)', currentCartState)
    
    
     } else {
    // Si el stock en góndola es menor a la cantidad en el carrito
    //
    //
      console.log('entro al else');
      //Calculo sumo el valor del producto * cantidad DISPONIBLE EN GÓNDOLA al totalAmount
      totalAmount += resultDelProducto.price * resultDelProducto.stock;
      // console.log('totalAmount', totalAmount);

      //Calculo el remanente del stock en el carrito
      const newQuantity = cart.products[i].quantity - resultDelProducto.stock;
      // console.log('newQuantity', newQuantity)

      //Actualizo la cantidad del producto
      const productIdToUpdate = cart.products[i].pid;

      const cartToUpdate = await CartModel.findOneAndUpdate(
        { 
          _id: cart._id,
          'products.pid': productIdToUpdate  
        },
        { 
          $set: { 
            'products.$.quantity': newQuantity 
          } 
        },
        { new: true }
      );

      // console.log('cartToUpdate', cartToUpdate)

      //Chequeo el remanente del stock en el carrito
      // const currentCartState = await CartModel.findOne({_id: cart._id}) 
      // console.log('currentCartState (else)', currentCartState)

      //Calculo el nuevo stock en góndola (Debería ser 0)
      resultDelProducto.stock = 0;

      //Guardo el nuevo stock en góndola
      await resultDelProducto.save();

      //Chequeo el remanente del stock en góndola
      // const currentProductStock = await ProductModel.findOne({_id: resultDelProducto._id})
      // console.log('currentProductStock (else)', currentProductStock)


    }
  }
    const ticket = new Ticket();
    const newTicket = await ticket.createTickets(totalAmount, userMail);
    return newTicket;
};

deleteOneCarts = async (cartId, productId) => {
    const result = await CartModel.updateOne(
    { _id: cartId },
    { $pull: { products: { pid: productId.pid } } },
    { new: true }
    );
    return result;
};  

  deleteProductAll = async (id) => {
    const result = await CartModel.updateOne(
      { _id: id },
      { $set: { products: [] } }
    );
    return result;
  };
}
