import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    id: Number,
    title:String,   
    description:String,
    price: Number,
    thumbnail:Array,
    code:Number,
    stock:Number,
    status:{type: Boolean, default:true},
    category:String,
});

ProductSchema.pre('save', function (next) {
    if (!this.code) {
        this.code = Math.floor(Math.random() * 10000) + 1;
    }
    next();
});

const ProductModel = mongoose.model('products', ProductSchema);

export default ProductModel