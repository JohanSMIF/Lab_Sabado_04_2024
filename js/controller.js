// js/controllers.js
class Controller {
    constructor(database) {
        this.db = database;
    }

    login(username, password) {
        return this.db.queryUsers(username, password);
    }

    registrarCliente(cliente) {
        const existingCliente = this.db.getCliente(cliente.numeroDocumento);
        if (existingCliente) {
            this.db.updateCliente(existingCliente.id, cliente);
        } else {
            cliente.id = this.db.clientes.length + 1;
            this.db.addCliente(cliente);
        }
    }

    obtenerProductos() {
        return this.db.getProductos();
    }

    generarFactura(cliente, productos) {
        const referencia = 'FAC' + new Date().getTime();
        const fecha = new Date().toISOString();
        const estado = 'Pagada';
        const total = productos.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
        let descuento = 0;
        if (total > 200000) {
            descuento = 0.10;
        } else if (total > 100000) {
            descuento = 0.05;
        }
        const totalConDescuento = total * (1 - descuento);

        const facturaId = this.db.facturas.length + 1;
        const factura = {
            id: facturaId,
            referencia,
            fecha,
            estado,
            clienteId: cliente.id,
            total: totalConDescuento
        };
        this.db.addFactura(factura);

        productos.forEach(producto => {
            const detalle = {
                facturaId,
                productoId: producto.id,
                cantidad: producto.cantidad,
                precioUnitario: producto.precio,
                total: producto.precio * producto.cantidad
            };
            this.db.addDetalleFactura(detalle);
        });

        return facturaId;
    }

    consultarFactura(id) {
        return this.db.getFactura(id);
    }
}

const controller = new Controller(db);
