// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = 3000;

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL.');
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas para servir las vistas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register_cliente', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register_cliente.html'));
});

app.get('/generar_factura', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'generar_factura.html'));
});

app.get('/consultar_factura', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'consultar_factura.html'));
});

// Rutas para el manejo de datos (API)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM usuarios WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    });
});

app.post('/register_cliente', (req, res) => {
    const { nombre_completo, tipo_documento, numero_documento, telefono, email } = req.body;
    const query = 'INSERT INTO clientes (nombre_completo, tipo_documento, numero_documento, telefono, email) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nombre_completo, tipo_documento, numero_documento, telefono, email], (err, results) => {
        if (err) throw err;
        res.json({ success: true, id: results.insertId });
    });
});

app.get('/productos', (req, res) => {
    const query = 'SELECT * FROM productos';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/generar_factura', (req, res) => {
    const { cliente_id, productos } = req.body;
    const referencia = 'FAC' + Date.now();
    const fecha = new Date();
    const estado = 'Pagada';

    const facturaQuery = 'INSERT INTO facturas (referencia, fecha, estado, cliente_id) VALUES (?, ?, ?, ?)';
    db.query(facturaQuery, [referencia, fecha, estado, cliente_id], (err, result) => {
        if (err) throw err;
        const facturaId = result.insertId;
        
        productos.forEach((producto) => {
            const detalleQuery = 'INSERT INTO detalle_facturas (factura_id, producto_id, cantidad, precio_unitario, total) VALUES (?, ?, ?, ?, ?)';
            db.query(detalleQuery, [facturaId, producto.id, producto.cantidad, producto.precio, producto.precio * producto.cantidad], (err) => {
                if (err) throw err;
            });
        });

        res.json({ success: true, facturaId });
    });
});

app.get('/consultar_factura/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT f.referencia, f.fecha, f.estado, c.nombre_completo, c.tipo_documento, 
                  c.numero_documento, c.telefono, c.email, d.producto_id, p.nombre, 
                  d.cantidad, d.precio_unitario, d.total
                  FROM facturas f
                  JOIN clientes c ON f.cliente_id = c.id
                  JOIN detalle_facturas d ON f.id = d.factura_id
                  JOIN productos p ON d.producto_id = p.id
                  WHERE f.id = ?`;
    db.query(query, [id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
