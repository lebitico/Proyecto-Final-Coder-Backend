import chai from "chai";
import { request } from "express";
import supertest from "supertest";
import { faker } from "@faker-js/faker"

const expect = chai.expect

const requester = supertest ('mongodb://localhost:8080')

describe('TEsting Eccomerces', () => {
    describe('Test de Carts', () => {
        it('En endpoint POST /api/carts debera registrar un carrito', async() => {
            const cartMock = {
                pid: '651ad1146448a583a5dd0c7e',
                quantity: '100'
            }
            const response = await requester.post('/api/carts').send(cartMock)
            const { status, ok, _body } = response

            expect(_body.payload).to.have.property('_id')
        })

        it('En endpoint POST /api/carts debera registrar un carrito cuando sea vacio', async() => {
            const cartMock = {}
            
            const response = await requester.post('/api/carts').send(cartMock)
            const { status, ok, _body } = response

            expect(_body.payload).to.be.eq(false)
        })
    })
})

describe('Registro, Login and Current', () => {
    let cookie;
    const mockUser = { 
        first_name : 'NN',
        last_name :  'NN',
        email : faker.internet.email(),
        age : '23',
        password : '12235'   
    }

    it ('Debe registrar un usuario', async() => {
       const {_body} = await requester.post('/api/users/register').send(mockUser)     
       expect (_body.payload).to.be.ok 
    })

    it ('Debe loguear un user y devolver una cookie', async() => {

        const result = await requester.post('/api/users/login').send({
            email : mockUser.email,
            password : mockUser.password  
        })    
       
        const cookieResult = result.headers['set-cookie'][0]

        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1].split(';')[0]

        }

        expect(cookie.name).to.be.ok.and.equal('coderCookie')
        expect(cookie.value).to.be.ok
        console.log({cookie})
     })


     it ('Enviar la cookie para ver el contenido del user', async() => {
        const { _body } = await requester.get('/api/users/login').set('´Cookie', [`${cookie.name}=${cookie.value}`])
        expect (_body.payload.email).to.be.eq(mockUser.email)
     })

})

describe('Test upload file', () => {
    it('Debe subir un archivo', async() => {
        const productMock = {
            title: 'Product',
            description: 'Descripcion',

        }   
        const result= await requester.post('/api/products/withimage')
            .field ('title', productMock.title)
            .field ('description', productMock.description)
            .attach('image', './src/test/juan.jpg')
        
        expect(result.status).to.be.eq(200)
        expect(result._body.payload).to.have.property('_id') 
        expect(result._body.payload.image).to.be.ok   

        })
})        