// js/models.js
class Database {
    constructor() {
        this.users = [
            { id: 1, username: 'admin', password: 'password' }
        ];
        this.clientes = [];
        this.productos = [
            { id: 1, nombre: 'Pelota de fútbol', precio: 50000, stock: 10 },
            { id: 2, nombre: 'Raqueta de tenis', precio: 150000, stock: 5 }
        ];
        this.facturas = [];
        this.detalleFacturas = [];
    }

    queryUsers(username, password) {
        return this.users.find(user => user.username === username && user.password === password);
    }

    addCliente(cliente) {
        this.clientes.push(cliente);
    }

    updateCliente(id, cliente) {
        const index = this.clientes.findIndex(c => c.id === id);
        if (index !== -1) {
            this.clientes[index] = cliente;
        }
    }

    getCliente(numeroDocumento) {
        return this.clientes.find(cliente => cliente.numeroDocumento === numeroDocumento);
    }

    getProductos() {
        return this.productos;
    }

    addFactura(factura) {
        this.facturas.push(factura);
        return factura.id;
    }

    addDetalleFactura(detalle) {
        this.detalleFacturas.push(detalle);
    }

    getFactura(id) {
        const factura = this.facturas.find(factura => factura.id === id);
        if (factura) {
            const detalles = this.detalleFacturas.filter(detalle => detalle.facturaId === id);
            return { ...factura, detalles };
        }
        return null;
    }
}

const db = new Database();
