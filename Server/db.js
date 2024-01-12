const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  usuario: String,
  email: String,
  password: String,
  nombre: String,
  domicilio: String
});

const pedidoSchema = new mongoose.Schema({
  num_pedido: Number,
  fecha: Date,
  estado: String,
  usuario: String,
  cesta: Number,
  total: Number
});

const cestaSchema = new mongoose.Schema({
  id_cesta: Number,
  usuario: String,
  items: [{
    num_articulo: Number,
    cantidad: Number,
    subtotal: Number
  }],
  total: Number
});

const articuloSchema = new mongoose.Schema({
  num_articulo: Number,
  palabra_clave: String,
  nombre: String,
  descripcion: String,
  stock: Number,
  precio: Number
});

const Usuario = mongoose.model('Usuario', userSchema);
const Articulo = mongoose.model('Articulo', articuloSchema);
const Cesta = mongoose.model('Cesta', cestaSchema);
const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = {
  Usuario, Articulo, Cesta, Pedido
}

//INICIALIZAMOS BD CON 1 usuario, 1 cesta,5 ARTICULOS
const usuario = new Usuario({
  usuario: "arfw2",
  email: "12345@gmail.com",
  password: "123",
  nombre: "Adam Roy",
  domicilio: "mi casa en crevillente"
});
usuario.save();

const cesta = new Cesta({
  id_cesta: 1,
  usuario: "arfw2",
  items: [],
  total: 0
});
cesta.save();

const articulo1 = new Articulo({
  num_articulo: 1,
  palabra_clave: 'electrónica',
  nombre: 'Teléfono inteligente',
  descripcion: 'Un teléfono inteligente de última generación.',
  stock: 100,
  precio: 699.99
});
const articulo2 = new Articulo({
  num_articulo: 2,
  palabra_clave: 'moda',
  nombre: 'Zapatos deportivos',
  descripcion: 'Zapatos deportivos de alta calidad.',
  stock: 50,
  precio: 89.99
});
const articulo3 = new Articulo({
  num_articulo: 3,
  palabra_clave: 'hogar',
  nombre: 'Aspiradora robot',
  descripcion: 'Una aspiradora robot para mantener tu hogar limpio.',
  stock: 30,
  precio: 249.99
});
const articulo4 = new Articulo({
  num_articulo: 4,
  palabra_clave: 'electrónica',
  nombre: 'Auriculares inalámbricos',
  descripcion: 'Auriculares inalámbricos con cancelación de ruido.',
  stock: 80,
  precio: 129.99
});
const articulo5 = new Articulo({
  num_articulo: 5,
  palabra_clave: 'moda',
  nombre: 'Bolso de cuero',
  descripcion: 'Un elegante bolso de cuero de alta calidad.',
  stock: 40,
  precio: 199.99
});
articulo1.save();
articulo2.save();
articulo3.save();
articulo4.save();
articulo5.save();

const articulo6 = new Articulo({
  num_articulo: 6,
  palabra_clave: 'bebidas',
  nombre: 'Botella de agua',
  descripcion: 'Botella de agua',
  stock: 40,
  precio: 1.99
})
articulo6.save();

const articulo7 = new Articulo({
  num_articulo: 7,
  palabra_clave: 'electronica',
  nombre: 'Airpods',
  descripcion: 'Airpods pro 2a generacion',
  stock: 100,
  precio: 275
});
articulo7.save();
const articulo8 = new Articulo({
  num_articulo: 8,
  palabra_clave:'bebida',
  nombre: 'Cocacola',
  descripcion: 'Botella Cocacola 500ml',
  stock: 70,
  precio: 1.50
});
articulo8.save();