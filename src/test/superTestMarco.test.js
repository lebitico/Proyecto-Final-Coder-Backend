import chai from "chai";
import supertest from "supertest";
import { faker } from "@faker-js/faker";

const expect = chai.expect;
const requester = supertest("http://127.0.0.1:8080");

describe('Integration tests', function () {

    this.timeout(1000000000)

    let adminId;
    let adminCookie;
    let productMockId;

    const admin = {
        first_name: "Coder",
        last_name: "House",
        email: "adminCoder@coder.com",
        age: 99,
        password: "adminCod3r123"
    };

    const productMock = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.int(),
        category: faker.commerce.department(),
        stock: faker.number.int(),
        thumbnail: [faker.image.url()],
    };

    const productMockForAdminDeletion = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.int(),
        category: faker.commerce.department(),
        stock: faker.number.int(),
        thumbnail: [faker.image.url()],
    };

    const productMockForUserDeletion = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.int(),
        category: faker.commerce.department(),
        stock: faker.number.int(),
        thumbnail: [faker.image.url()],
    };

    describe('User sessions', () => {

        const user = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: faker.number.int(),
            password: "asd",
        };

        const userTwo = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: faker.number.int(),
            password: "asd",
        };


        it('Register through endpoint POST `/api/session/register` with user rol', async () => {

            const actual = await requester
                .post('/api/session/register')
                .send(user);
            expect(actual.body.payload).to.be.ok
            expect(actual.body.payload._id).to.be.ok
            expect(actual.body.payload.email).to.eq(user.email)
            expect(actual.body.payload.rol).to.eq("user")
            expect(actual.header['set-cookie'][0]).not.to.eq('coderCookie')

        });

        it('Login through endpoint POST /api/session/login', async () => {

            const actual = await requester
                .post('/api/session/login')
                .send({
                    email: user.email,
                    password: user.password
                });

            const actualCookie = actual.header['set-cookie']
            const cookieName = actualCookie[0].split('=')[0]

            expect(actual.status).to.equal(200);
            expect(cookieName).to.be.ok.and.eq('coderCookie')
        });

        it('Logout through endpoint POST /api/session/logout', async () => {

            await requester
                .post('/api/session/login')
                .send({
                    email: user.email,
                    password: user.password
                });

            const actualLogout = await requester
                .post('/api/session/logout');

            //Para borrar la cookie pone una fecha de vencimiento en el pasado, entonces: 
            expect(actualLogout.header['set-cookie'][0]).to.match(/Expires=Thu, 01 Jan 1970 00:00:00 GMT/);

        });

        it('Get current user through endpoint GET /api/session/current', async () => {

            const sut = await requester
                .post('/api/session/login')
                .send({
                    email: user.email,
                    password: user.password
                });

            const sutCookieResult = sut.header['set-cookie']
            const actual = await requester
                .get('/api/session/current')
                .set('Cookie', sutCookieResult)

            expect(actual.status).to.equal(200);
            expect(actual.body).to.have.property('payload');
            expect(actual.body.payload.user).to.have.property('email').that.equals(user.email);
        });

        it('Can NOT change users rol through endpoint POST /api/session/premium/:uid', async function () {
            this.timeout(9000);
            const sut = await requester
                .post('/api/session/register')
                .send(userTwo);

            const sutUid = sut.body.payload._id
            const sutExpectedRol = sut.body.payload.rol

            const currentUser = await requester
                .post('/api/session/login')
                .send({
                    email: user.email,
                    password: user.password
                });
            const currentUserCookie = currentUser.header['set-cookie']
            const currentUserResponse = await requester
                .post(`/api/session/premium/${sutUid}`)
                .set('Cookie', currentUserCookie)

            const sutActual = await requester
                .get(`/api/session/${sutUid}`)

            expect(currentUserResponse.body.error).to.be.eq('No permission')
            expect(sutActual.body.payload.rol).to.be.eq(sutExpectedRol)
        })

    })

    describe('Admin products', () => {

        it('Should assign admin rol when registered with Coder credentials', async () => {

            const adminRegisterResponse = await requester
                .post('/api/session/register')
                .send(admin);

            adminId = adminRegisterResponse.body.payload._id

            expect(adminRegisterResponse.body.payload).to.be.ok
            expect(adminRegisterResponse.body.payload._id).to.be.ok
            expect(adminRegisterResponse.body.payload.email).to.eq(admin.email)
            expect(adminRegisterResponse.body.payload.rol).to.eq('admin')
        })

        it('Should be able to create a product', async function () {
            this.timeout(9000);

            const adminLoginResponse = await requester
                .post('/api/session/login')
                .send({
                    email: admin.email,
                    password: admin.password
                });

            adminCookie = adminLoginResponse.headers['set-cookie']

            const adminProductResponse = await requester
                .post('/api/products')
                .send(productMock)
                .set('Cookie', adminCookie)

            productMockId = adminProductResponse.body.payload._id

            expect(adminProductResponse.body.payload).to.be.ok
            expect(adminProductResponse.body.payload._id).to.be.ok
            expect(adminProductResponse.body.payload.code).to.be.ok
            expect(adminProductResponse.body.payload.title).to.eq(productMock.title)
            expect(adminProductResponse.body.payload.description).to.eq(productMock.description)
            expect(adminProductResponse.body.payload.price).to.eq(productMock.price)
            expect(adminProductResponse.body.payload.category).to.eq(productMock.category)
            expect(adminProductResponse.body.payload.stock).to.eq(productMock.stock)
            expect(adminProductResponse.body.payload.thumbnail).to.be.an('array').that.deep.equals(productMock.thumbnail);
            expect(adminProductResponse.body.payload.status).to.be.eq(true)

        })

        it('Should be able to modify a product', async function () {

            this.timeout = 9000

            const oldProduct = await requester
                .get('/api/products/' + productMockId)


            const changesToBeMade = {
                stock: 1111,
                title: "New Title",
            }

            const adminProductResponse = await requester
                .put('/api/products/' + productMockId)
                .send(changesToBeMade)
                .set('Cookie', adminCookie)

            const actualProduct = await requester
                .get('/api/products/' + productMockId)

            expect(adminProductResponse.body.payload).to.be.ok
            expect(changesToBeMade.stock).to.eq(actualProduct.body.payload.stock)
            expect(changesToBeMade.title).to.eq(actualProduct.body.payload.title)
            expect(oldProduct.body.payload.stock).not.to.eq(actualProduct.body.payload.stock)
            expect(oldProduct.body.payload.title).not.to.eq(actualProduct.body.payload.title)

        })

        it('Should be able to delete a product', async function () {
            this.timeout = 9000
            const productPost = await requester
                .post('/api/products')
                .send(productMockForAdminDeletion)
                .set('Cookie', adminCookie)

            const deletionId = productPost.body.payload._id

            const productDeletionResponse = await requester
                .delete('/api/products/' + deletionId)
                .set('Cookie', adminCookie)

            const actualProduct = await requester
                .get('/api/products/' + deletionId)

            expect(productDeletionResponse.body.status).to.eq("success")
            expect(actualProduct.body.payload).to.be.null
        })

    })

    describe('User products', () => {

        let userThreeCookie;

        const userThree = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: faker.number.int(),
            password: "asd",
        };

        before(async function () {
            this.timeout(9000);

            //userThreeCookie
            const registeredUserResponse = await requester
                .post('/api/session/register')
                .send(userThree);
            const loginResponse = await requester
                .post('/api/session/login')
                .send({
                    email: userThree.email,
                    password: userThree.password
                });
            userThreeCookie = loginResponse.headers['set-cookie']

            //adminCookie
            const adminLoginResponse = await requester
                .post('/api/session/login')
                .send({
                    email: admin.email,
                    password: admin.password
                });
            adminCookie = adminLoginResponse.headers['set-cookie']

            //productMockId
            const adminProductResponse = await requester
                .post('/api/products')
                .send(productMock)
                .set('Cookie', adminCookie)
            productMockId = adminProductResponse.body.payload._id

        });

        it('Should not be able to create a product', async () => {

            const userProductResponse = await requester
                .post('/api/products')
                .set('Cookie', userThreeCookie)
                .send(productMock);

            expect(userProductResponse.status).to.be.eq(403);
            expect(userProductResponse.body.error).to.be.eq('No permission');
        });

        it('Can not modify a product', async () => {
            const oldProduct = await requester
                .get('/api/products/' + productMockId)


            const changesToBeMade = {
                price: 1111,
                title: "Title changed by user",
            }

            const userProductResponse = await requester
                .put('/api/products/' + productMockId)
                .send(changesToBeMade)
                .set('Cookie', userThreeCookie)

            const actualProduct = await requester
                .get('/api/products/' + productMockId)

            expect(oldProduct.body.payload.price).to.eq(actualProduct.body.payload.price)
            expect(oldProduct.body.payload.title).to.eq(actualProduct.body.payload.title)

            expect(userProductResponse.status).to.be.eq(403);
            expect(userProductResponse.body.error).to.be.eq('No permission');

        })

        it('Can not delete a product', async () => {
            const productPost = await requester
                .post('/api/products')
                .send(productMockForUserDeletion)
                .set('Cookie', adminCookie)

            const deletionId = productPost.body.payload._id

            const productDeletionResponse = await requester
                .delete('/api/products/' + deletionId)
                .set('Cookie', userThreeCookie)

            const actualProduct = await requester
                .get('/api/products/' + deletionId)

            expect(productDeletionResponse.status).to.be.eq(403);
            expect(productDeletionResponse.body.error).to.be.eq('No permission');
            expect(actualProduct.body.payload).to.be.ok
            expect(actualProduct.body.payload._id).to.be.ok
        })
    });

    describe('Carts', () => {

        let cidOne;
        let cidTwo
        let cidThree;
        let pidOne;
        let pidTwo;

        const cartUserOne = {
            first_name: "cartUserOne",
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: 11,
            password: "asd",
        };

        const cartUserTwo = {
            first_name: "cartUserTwo",
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: 22,
            password: "asd",
        };

        const cartUserThree = {
            first_name: "cartUserTwo",
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: 22,
            password: "asd",
        };

        const cartProductOne = {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.number.int(),
            category: faker.commerce.department(),
            stock: faker.number.int(),
            thumbnail: [faker.image.url()],
        };

        const cartProductTwo = {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.number.int(),
            category: faker.commerce.department(),
            stock: faker.number.int(),
            thumbnail: [faker.image.url()],
        };


        before(async function () {
            this.timeout(9000);
            //Register users to get carts Ids to use.

            //cidOne
            const registerUserOne = await requester
                .post('/api/session/register')
                .send(cartUserOne);

            cidOne = registerUserOne.body.payload.cartid

            //cidTwo
            const registerUserTwo = await requester
                .post('/api/session/register')
                .send(cartUserTwo);

            cidTwo = registerUserTwo.body.payload.cartid


            //cidTwo
            const registerUserThree = await requester
                .post('/api/session/register')
                .send(cartUserThree);

            cidThree = registerUserThree.body.payload.cartid

            //Admin login for cookies to have permission
            //to create products to use in carts

            //adminCookie
            const adminLoginResponse = await requester
                .post('/api/session/login')
                .send({
                    email: admin.email,
                    password: admin.password
                });
            adminCookie = adminLoginResponse.headers['set-cookie']

            //pidOne
            const cartProductOneResponse = await requester
                .post('/api/products')
                .send(cartProductOne)
                .set('Cookie', adminCookie)
            pidOne = cartProductOneResponse.body.payload._id

            //pidTwo
            const cartProductTwoResponse = await requester
                .post('/api/products')
                .send(cartProductTwo)
                .set('Cookie', adminCookie)
            pidTwo = cartProductTwoResponse.body.payload._id

        });

        it('User starts with empty cart', async () => {

            let cartUserOneResponse = await requester
                .get('/api/carts/' + cidOne)

            expect(cartUserOneResponse.body.payload).to.be.ok
            expect(cartUserOneResponse.body.payload._id).to.be.ok
            expect(cartUserOneResponse.body.payload.products).to.be.an('array').that.is.empty

        })

        it('Adding different products is permitted', async function () {
            this.timeout(9000);

            const firstProductResponse = await requester
                .post('/api/carts/' + cidOne + '/products/' + pidOne)
                .send({ quantity: 1 })

            const secondProductResponse = await requester
                .post('/api/carts/' + cidOne + '/products/' + pidTwo)
                .send({ quantity: 1 })

            const cartResponse = await requester
                .get('/api/carts/' + cidOne)

            expect(firstProductResponse.body.payload).to.be.ok
            expect(secondProductResponse.body.payload).to.be.ok
            expect(cartResponse.body.payload.products.length).to.be.eq(2)

            expect(cartResponse.body.payload.products[0].pid).to.be.eq(pidOne)
            expect(cartResponse.body.payload.products[0].quantity).to.be.eq(1)

            expect(cartResponse.body.payload.products[1].pid).to.be.eq(pidTwo)
            expect(cartResponse.body.payload.products[1].quantity).to.be.eq(1)
        })

        it('Adding an existing product increases the quantity in cart', async function () {
            this.timeout(9000);

            let firstProductResponse = await requester
                .post('/api/carts/' + cidTwo + '/products/' + pidOne)
                .send({ quantity: 1 })

            let secondProductResponse = await requester
                .post('/api/carts/' + cidTwo + '/products/' + pidTwo)
                .send({ quantity: 1 })

            let cartFirstResponse = await requester
                .get('/api/carts/' + cidTwo)

            let firstProductSecondAddition = await requester
                .post('/api/carts/' + cidTwo + '/products/' + pidOne)
                .send({ quantity: 1 })

            let cartSecondResponse = await requester
                .get('/api/carts/' + cidTwo)

            expect(cartFirstResponse.body.payload.products[0].quantity).to.be.eq(1)

            expect(firstProductSecondAddition.body.payload).to.be.ok
            expect(cartSecondResponse.body.payload.products.length).to.be.eq(2)
            expect(cartSecondResponse.body.payload.products[0].quantity).to.be.eq(2)
            expect(cartSecondResponse.body.payload.products[1].quantity).to.be.eq(1)

        })

        it('A user may delete a product of the cart', async function () {
            this.timeout(9000);

            let firstProductResponse = await requester
                .post('/api/carts/' + cidThree + '/products/' + pidOne)
                .send({ quantity: 1 })

            let secondProductResponse = await requester
                .post('/api/carts/' + cidThree + '/products/' + pidTwo)
                .send({ quantity: 1 })


            let firstProductSecondAddition = await requester
                .post('/api/carts/' + cidThree + '/products/' + pidOne)
                .send({ quantity: 1 })


            let productDeletionResponse = await requester
                .delete('/api/carts/' + cidThree + '/products/' + pidOne)

            let cartResponse = await requester
                .get('/api/carts/' + cidThree)

            expect(productDeletionResponse.body.payload).to.be.ok
            expect(cartResponse.body.payload.products.length).to.be.eq(1)
            expect(cartResponse.body.payload.products[0].pid).to.be.eq(pidTwo)
        })


    })

    describe('Ticket', () => {

        let cidOne;
        let cidTwo
        let cidThree;
        let cidFour;
        let cidFive;
        let pidOne;
        let pidTwo;
        let pidTwoStockProduct
        let pidOneStockProduct

        const cartUserOne = {
            first_name: "cartUserOne",
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: 11,
            password: "asd",
        };

        const cartUserTwo = {
            first_name: "cartUserTwo",
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: 22,
            password: "asd",
        };

        const cartUserThree = {
            first_name: "cartUserTwo",
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: 22,
            password: "asd",
        };

        const cartUserFour = {
            first_name: "cartUserFour",
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: 44,
            password: "asd",
        };

        const cartUserFive = {
            first_name: "cartUserFive",
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: 55,
            password: "asd",
        };

        const cartProductOne = {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: 100,
            category: faker.commerce.department(),
            stock: faker.number.int(),
            thumbnail: [faker.image.url()],
        };

        const cartProductTwo = {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: 200,
            category: faker.commerce.department(),
            stock: faker.number.int(),
            thumbnail: [faker.image.url()],
        };

        const twoStockProduct = {
            title: faker.commerce.productName(),
            description: "Initial two stock, price 22",
            price: 22,
            category: faker.commerce.department(),
            stock: 2,
            thumbnail: [faker.image.url()],
        };

        const oneStockProduct = {
            title: faker.commerce.productName(),
            description: "Initial one stock, price 11",
            price: 11,
            category: faker.commerce.department(),
            stock: 1,
            thumbnail: [faker.image.url()],
        };

        before(async function () {
            this.timeout(900000);
            //Register users to get carts Ids to use.

            //cidOne
            const registerUserOne = await requester
                .post('/api/session/register')
                .send(cartUserOne);

            cidOne = registerUserOne.body.payload.cartid

            //cidTwo
            const registerUserTwo = await requester
                .post('/api/session/register')
                .send(cartUserTwo);

            cidTwo = registerUserTwo.body.payload.cartid


            //cidThree
            const registerUserThree = await requester
                .post('/api/session/register')
                .send(cartUserThree);

            cidThree = registerUserThree.body.payload.cartid


            //cidFour
            const registerUserFour = await requester
                .post('/api/session/register')
                .send(cartUserFour);

            cidFour = registerUserFour.body.payload.cartid

            //cidFive
            const registerUserFive = await requester
                .post('/api/session/register')
                .send(cartUserFive);

            cidFive = registerUserFive.body.payload.cartid

            // Admin login for cookies to have permission
            // to create products to use in carts

            //adminCookie
            const adminLoginResponse = await requester
                .post('/api/session/login')
                .send({
                    email: admin.email,
                    password: admin.password
                });
            adminCookie = adminLoginResponse.headers['set-cookie']

            //pidOne
            const cartProductOneResponse = await requester
                .post('/api/products')
                .send(cartProductOne)
                .set('Cookie', adminCookie)
            pidOne = cartProductOneResponse.body.payload._id

            //pidTwo
            const cartProductTwoResponse = await requester
                .post('/api/products')
                .send(cartProductTwo)
                .set('Cookie', adminCookie)
            pidTwo = cartProductTwoResponse.body.payload._id

            //pidTwoStockProduct
            const twoStockProductResponse = await requester
                .post('/api/products')
                .send(twoStockProduct)
                .set('Cookie', adminCookie)
            pidTwoStockProduct = twoStockProductResponse.body.payload._id

            //pidOneStockProduct
            const oneStockProductResponse = await requester
                .post('/api/products')
                .send(oneStockProduct)
                .set('Cookie', adminCookie)
            pidOneStockProduct = oneStockProductResponse.body.payload._id

        });

        it('The route POST api/carts/:cid/purchase triggers the cart purchase',
            async function () {

                const sut = await requester
                    .post('/api/session/login')
                    .send({
                        email: cartUserOne.email,
                        password: cartUserOne.password
                    });

                const sutCookieResult = sut.header['set-cookie']

                const purchaseResponse = await requester
                    .post('/api/carts/' + cidOne + '/purchase')
                    .set('Cookie', sutCookieResult)

                expect(purchaseResponse.body.payload).to.be.ok
            })

        it('The purchase must decrease the product stock',
            async function () {
                //Initial stock
                const productOneInfoResponse = await requester
                    .get('/api/products/' + pidOne)
                const initialStock = productOneInfoResponse.body.payload.stock

                const addingProductToCartResponse = await requester
                    .post('/api/carts/' + cidOne + '/products/' + pidOne)
                    .send({ quantity: 1 })

                //login for purchase and purchase
                const sut = await requester
                    .post('/api/session/login')
                    .send({
                        email: cartUserOne.email,
                        password: cartUserOne.password
                    });
                const sutCookieResult = sut.header['set-cookie']
                const purchaseResponse = await requester
                    .post('/api/carts/' + cidOne + '/purchase')
                    .set('Cookie', sutCookieResult)

                //Final stock
                const productOneInfoResponseAfterPurchase = await requester
                    .get('/api/products/' + pidOne)
                const finalStock = productOneInfoResponseAfterPurchase.body.payload.stock

                expect(initialStock).to.be.eq(finalStock + 1)
            })


        it('Only available stock may be purchased', async function () {

            const twoStockProductAddToCartResponse = await requester
                .post('/api/carts/' + cidTwo + '/products/' + pidTwoStockProduct)
                .send({ quantity: 3 })

            const cartStatus = await requester
                .get('/api/carts/' + cidTwo)


            //login for purchase and purchase
            const sut = await requester
                .post('/api/session/login')
                .send({
                    email: cartUserTwo.email,
                    password: cartUserTwo.password
                });
            const sutCookieResult = sut.header['set-cookie']
            const purchaseResponse = await requester
                .post('/api/carts/' + cidTwo + '/purchase')
                .set('Cookie', sutCookieResult)


            const productInfoResponse = await requester
                .get('/api/products/' + pidTwoStockProduct)

            expect(twoStockProductAddToCartResponse.body.status).to.eq('success')
            expect(cartStatus.body.payload.products[0].quantity).to.be.eq(3)
            expect(purchaseResponse.body.payload.amount).to.be.eq(productInfoResponse.body.payload.price * 2)
            expect(productInfoResponse.body.payload.stock).to.be.eq(0)
        })

        it('The ticket should have id, code, purchase_datetime, amount and purchaser ', async function () {

            const cartResponse = await requester
                .post('/api/carts/' + cidFour + '/products/' + pidOne)
                .send({ quantity: 1 })

            const userFourLoginResponse = await requester
                .post('/api/session/login')
                .send(cartUserFour);

            const userFourCookie = userFourLoginResponse.headers['set-cookie']

            const ticket = await requester
                .post('/api/carts/' + cidFour + '/purchase')
                .set("Cookie", userFourCookie)

            expect(ticket.body.payload._id).to.be.ok
            expect(ticket.body.payload.code).to.be.a('string').that.is.not.empty
            expect(new Date(ticket.body.payload.purchase_datetime)).to.be.a('date')
            expect(ticket.body.payload.amount).to.be.a('number').that.is.at.least(0)
            expect(ticket.body.payload.purchaser).to.eq(cartUserFour.email)
        })

        it('After the purchase, the cart should only contain the products that could not be bought', async function () {

            await requester
                .post('/api/carts/' + cidFive + '/products/' + pidOne)
                .send({ quantity: 1 })

            await requester
                .post('/api/carts/' + cidFive + '/products/' + pidTwo)
                .send({ quantity: 1 })

            await requester
                .post('/api/carts/' + cidFive + '/products/' + pidOneStockProduct)
                .send({ quantity: 2 })

            const cartBeforePurchase = await requester
                .get('/api/carts/' + cidFive)

            const userFiveLoginResponse = await requester
                .post('/api/session/login')
                .send(cartUserFive);

            const userFiveCookie = userFiveLoginResponse.headers['set-cookie']

            const ticket = await requester
                .post('/api/carts/' + cidFive + '/purchase')
                .set("Cookie", userFiveCookie)

            const cartAfterPurchase = await requester
                .get('/api/carts/' + cidFive)

            //creo que es porque queda con cosas raras el arreglo debido al $Pull.
            //imprimir respuesta
           
            const expectedTotalAmount = cartProductOne.price + cartProductTwo.price + oneStockProduct.price

            expect(ticket.body.payload.amount).to.eq(expectedTotalAmount)
            expect(cartAfterPurchase.body.payload.products.length).to.be.eq(1)
            expect(cartAfterPurchase.body.payload.products[0].pid).to.be.eq(pidOneStockProduct)
        })

    });

})

