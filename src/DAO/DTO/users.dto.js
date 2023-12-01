export default class UserDTO {

    constructor(user) {
        
        this.first_name = user?.first_name ?? 'NN'
        this.last_name = user?.last_name ?? 'NN'
        this.email = user?.email ?? ''
        this.age = user?.age ?? ''
        this.rol = user?.rol ?? 'user'
        this.password = user?.password ?? 'pass'
        this.orders = []
        this.cartid = user?.cartid ?? '0'
    }
}