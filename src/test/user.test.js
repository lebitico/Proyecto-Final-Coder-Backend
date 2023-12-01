import User from '../DAO/mongo/users.mongo.js'
import Assert from 'assert'
import chai from 'chai'
import mongoose from 'mongoose'

// Modulo nativo de Node para validar los test
const assert = Assert.strict
// Expect de chai es mas utilizado en la instria
const expect = chai.expect

describe('Testing Users Dao', function() {

    before(function (done) {
        mongoose.connect('mongodb://localhost:8080', { 
            dbName: 'eccommerce' 
        }).then(() => {console.log('DB connected'); done()})
        
        this.timeout(8000)
    })

    after(function() {
        mongoose.connection.collections.users.drop()
        this.timeout()
    })

    describe('Run', function() {
        it('El dao debe poder obtener los usuarios', async function() {
            const usersDao = new User()
            const result = await usersDao.get()

            assert.strictEqual(Array.isArray(result), true)
            expect(result).to.be.deep.equal([])
        })

        it('El dao debe poder crear usuarios', async function() {
            let mockUser = {
                first_name: 'Germ',
                last_name: 'Iani',
                age: 23,
                role: 'Usuario' ,
                orders: [],
                cartid: [],
                email: 'valentin@meta.com',
                password: 'secret'
            }

            const userDao = new User()
            const result = await userDao.save(mockUser)

            assert.ok(result._id)
        })

        it('El dao pueda crear usuarios con una lista de productos vacia', async function() {
            let mockUser = {
                first_name: 'Germ',
                last_name: 'Iani',
                age: 23,
                role: 'Usuario' ,
                orders: [],
                cartid: [],
                email: 'valentin@meta.com',
                password: 'secret'
            }

            const userDao = new User()
            const result = await userDao.save(mockUser)

            assert.deepStrictEqual(result.users , [])
        })

        it('El dao debe poder buscar por email', async function() {
            const usersDao = new User()

            const user = await usersDao.getBy({ email: 'ger@gmail.com'})

            assert.strictEqual(typeof(user), 'object')
            assert.strictEqual(user.first_name, 'Ger')
        })


    })

})
