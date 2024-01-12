const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');
var cors = require('cors')


const app = express();
const port = process.env.PORT || 3000;
const secretKey = 'f22387d9-unmu-4503-zitl-82a4275a672c';

mongoose.connect('mongodb://0.0.0.0/tienda_online', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = require('./db');
const e = require('express');
const Usuario = db.Usuario;
const Articulo = db.Articulo;
const Cesta = db.Cesta;
const Pedido = db.Pedido;
app.use(bodyParser.json());
app.use(cors())


const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  try {
    const decoded = jwt.decode(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalido' });
  }
}

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existeUSuario = await Usuario.findOne({ email });
    if (!existeUSuario) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
    if (existeUSuario.password == password) {
      const token = jwt.encode({ sub: existeUSuario._id }, secretKey);
      return res.status(201).json({ message: 'Autenticación exitosa', token });
    } else {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error de servidor" });
  }

});

app.post('/api/usuarios', async (req, res) => {
  try {
    const { usuario, email, password, nombre, domicilio } = req.body;

    const existeUsuario = await Usuario.findOne({ email: email });

    if (existeUsuario) {
      return res.status(400).json({ message: 'Ya existe ese usuario' });
    }

    const nuevoUsuario = new Usuario({ usuario, email, password, nombre, domicilio });
    await nuevoUsuario.save();

    return res.status(201).json({ message: 'Registrado correctamente' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.post('/api/crearArticulo', verifyToken, async (req, res) => {
  try {
    const { num_articulo, nombre, descripcion, precio, stock, palabra_clave } = req.body;
    const existeArticulo = await Articulo.findOne({ num_articulo: num_articulo });
    if (existeArticulo) {
      return res.status(400).json({ message: 'Ya existe ese articulo' });
    }
    const nuevoArticulo = new Articulo({ num_articulo, palabra_clave, nombre, descripcion, stock, precio });
    
    await nuevoArticulo.save();
  } catch (error) {
    return res.status(500).json({ message: error });
  }
})



app.put('/api/usuarios/:email_usuario', verifyToken, async (req, res) => {
  try {
    const usuarioEmail = req.params.email_usuario;
    const nuevaInfo = req.body;
    const usuarioActualizado = await Usuario.findOneAndUpdate(
      { email: usuarioEmail },
      { $set: nuevaInfo },
      { new: true });
    if (!usuarioActualizado) {
      return res.status(401).json({ message: 'Error encontrando el usuario' });
    }
    return res.status(200).json({ message: "usuario modificado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error de servidor" });
  }
});

app.put('/api/articulos/editar/:num_producto', verifyToken, async (req, res) => {
  try {
    const numArticulo = req.params.num_producto;
    const nuevaInfo = req.body;
    const articuloActualizado = await Articulo.findOneAndUpdate(
      { num_articulo: numArticulo },
      { $set: nuevaInfo },
      { new: true });
    if (!articuloActualizado) {
      return res.status(401).json({ message: 'Error encontrando el articulo' });
    }
    return res.status(200).json({ message: "articulo modificado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error de servidor" });
  }
});


app.delete('/api/usuarios/:email_usuario', verifyToken, async (req, res) => {
  try {
    const usuarioEmail = req.params.email_usuario;
    const usuarioEliminado = await Usuario.findOneAndDelete({ email: usuarioEmail });

    if (!usuarioEliminado) {
      return res.status(401).json({ message: 'Error encontrando el usuario' });
    }
    return res.status(204).json({ message: "Usuario eliminado correctamenre" });
  } catch (error) {
    return res.status(500).json({ message: "Error de servidor" });
  }
});

app.get('/api/articulos/', async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 5;
    const totalArticulos = await Articulo.countDocuments();
    const articulos = await Articulo.find().skip(offset).limit(limit);
    const resultadosEnPagina = articulos.length;
    const pagActual = offset / limit + 1;
    const baseUrl = req.protocol + '://' + req.get('host') + req.baseUrl;
    const pagAnterior = offset - limit >= 0 ? `${baseUrl}?offset=${offset - limit}&limit=${limit}` : null;
    const pagSiguiente = offset + limit < totalArticulos ? `${baseUrl}?offset=${offset + limit}&limit=${limit}` : null;

    const metadatos = {
      totalResultados: totalArticulos,
      resultadosEnPagina: resultadosEnPagina,
      pagActual: pagActual,
      pagAnterior: pagAnterior,
      pagSiguiente: pagSiguiente,
      nextOffset: offset + limit,
      previousOffset: offset - limit < 0 ? 0 : offset - limit
    }
    return res.status(200).json({ articulos, metadatos });
  } catch (error) {
    return res.status(500).json({ message: "Error de servidor" });
  }
});
app.get('/api/articulos/:palabra_clave', async (req, res) => {
  1
  var articulos;
  try {
    const palabra_clave = req.params.palabra_clave || '';
    const offset = parseInt(req.query.offset) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (offset - 1) * limit;
    const totalArticulos = await Articulo.find({ palabra_clave }).countDocuments();
    if (palabra_clave === '') {
      articulos = await Articulo.find().skip(offset).limit(limit);
    } else {
      articulos = await Articulo.find({ palabra_clave }).skip(startIndex).limit(limit);
    }
    const resultadosEnPagina = articulos.length;
    var pagActual = offset / limit;
    if (pagActual < 1) {
      pagActual = 1;
    }
    const baseUrl = req.protocol + '://' + req.get('host') + req.baseUrl;
    const pagAnterior = offset - limit >= 0 ? '${baseUrl}?offset=${offset - limit}&limit=${limit}' : null;
    const pagSiguiente = offset + limit < totalArticulos ? '${baseUrl}?offset=${offset + limit}&limit=${limit}' : null;

    const metadatos = {
      totalResultados: totalArticulos,
      resultadosEnPagina: resultadosEnPagina,
      pagActual: pagActual,
      pagAnterior: pagAnterior,
      pagSiguiente: pagSiguiente,
      nextOffset: offset + limit,
      previousOffset: offset - limit < 0 ? 0 : offset - limit
    }
    res.status(200).json({ articulos, metadatos });
  } catch (error) {
    return res.status(500).json({ message: "Error de servidor" });
  }
});



app.get('/api/articulos/consultar/:num_articulo', async (req, res) => {
  try {
    const num_articulo = parseInt(req.params.num_articulo);
    const articulo = await Articulo.findOne({ num_articulo });
    res.status(200).json(articulo);
  } catch (error) {
    return res.status(500).json({ message: "Error de servidor" });
  }
});

app.post('/api/usuarios/:email_usuario/cesta/:id_cesta/anadir/:num_articulo', verifyToken, async (req, res) => {
  const emailUsuario = req.params.email_usuario;
  const idCesta = req.params.id_cesta;
  const numArticulo = parseInt(req.params.num_articulo);

  try {
    const usuario = await Usuario.findOne({ email: emailUsuario });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const cesta = await Cesta.findOne({ usuario: usuario.usuario });
    if (!cesta) {
      return res.status(404).json({ message: 'Cesta no encontrada' });
    }
    const articulo = await Articulo.findOne({ num_articulo: numArticulo });
    if (!articulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    const cant = req.body.cantidad;
    const itemIndex = cesta.items.findIndex(item => item.num_articulo == articulo.num_articulo);
    if (itemIndex != -1) {
      cesta.items[itemIndex].cantidad += cant;
      cesta.items[itemIndex].subtotal = cesta.items[itemIndex].cantidad * articulo.precio;
    } else {
      cesta.items.push({
        num_articulo: articulo.num_articulo,
        cantidad: cant,
        subtotal: articulo.precio * cant,
      });
    }
    cesta.total = cesta.items.reduce((total, item) => total + item.subtotal, 0);
    await cesta.save();
    res.status(201).json({ message: 'Artículo añadido a la cesta' });
  } catch (error) {
    return res.status(500).json({ message: 'Error de servidor' });
  }
});

app.delete('/api/articulos/eliminar/:num_articulo', verifyToken, async (req, res) => {
  const numeroArticulo = parseInt(req.params.num_articulo);
  try {
    const articuloEliminado = await Articulo.findOneAndDelete({ num_articulo: numeroArticulo });
    if (!articuloEliminado) {
      return res.status(401).json({ message: 'Error encontrando el articulo' });
    }
    return res.status(204).json({ message: "Articulo eliminado correctamenre" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error de servidor" });
  }
})

app.delete('/api/usuarios/:email_usuario/cesta/:id_cesta/eliminar/:num_articulo', verifyToken, async (req, res) => {
  const emailUsuario = req.params.email_usuario;
  const idCesta = req.params.id_cesta;
  const numArticulo = parseInt(req.params.num_articulo);

  try {
    const usuario = await Usuario.findOne({ email: emailUsuario });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const cesta = await Cesta.findOne({ usuario: usuario.usuario });
    if (!cesta) {
      return res.status(404).json({ message: 'Cesta no encontrada' });
    }
    const articulo = await Articulo.findOne({ num_articulo: numArticulo });
    if (!articulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    const cant = req.body.cantidad;
    const itemIndex = cesta.items.findIndex(item => item.num_articulo == articulo.num_articulo);
    if (itemIndex != -1) {
      cesta.items[itemIndex].cantidad -= cant;
      if (cesta.items[itemIndex].cantidad <= 0) {
        cesta.items[itemIndex].subtotal = 0;
      } else {
        cesta.items[itemIndex].subtotal = cesta.items[itemIndex].cantidad * articulo.precio;
      }
    }
    if (cesta.items[itemIndex].cantidad <= 0) {
      cesta.items.splice(itemIndex, 1);
    }
    cesta.total = cesta.items.reduce((total, item) => total + item.subtotal, 0);
    await cesta.save();
    res.status(200).json({ message: 'Artículo eliminado de la cesta' });
  } catch (error) {
    return res.status(500).json({ message: 'Error de servidor' });
  }
});
app.get('/api/usuarios/:email_usuario/cesta/', verifyToken, async (req, res) => {
  const emailUsuario = req.params.email_usuario;
  const usuario = await Usuario.findOne({ email: emailUsuario });
  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  const cesta = await Cesta.findOne({ usuario: usuario.usuario });
  if (!cesta) {
    return res.status(404).json({ message: 'Cesta no encontrada' });
  }
  res.status(200).json(cesta);
});

app.post('/api/usuarios/:email_usuario/pedidos/', verifyToken, async (req, res) => {
  try {
    const email_usuario = req.params.email_usuario;
    const usuario = await Usuario.findOne({ email: email_usuario });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const cesta = await Cesta.findOne({ usuario: usuario.usuario });
    if (!cesta) {
      return res.status(404).json({ message: 'Cesta no encontrada' });
    }

    const pedido = new Pedido({
      num_pedido: req.body.num_pedido,
      fecha: new Date(),
      estado: "Enviado",
      usuario: usuario.usuario,
      cesta: cesta.id_cesta,
      total: cesta.total
    });

    pedido.save();
    return res.status(201).json({ message: 'pedido realizado correctamente' });
  } catch (error) {
    return res.status(500).json({ message: "Error de servidor" });
  }
});

app.put('/api/usuarios/:email_usuario/pedidos/:num_pedido', verifyToken, async (req, res) => {
  try {
    const nuevaInfo = req.body;
    const existepedido = await Pedido.findOneAndUpdate({ num_pedido: req.params.num_pedido }, { $set: nuevaInfo }, { new: true });
    if (!existepedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    return res.status(201).json({ message: 'pedido actualizado correctamente' });
  } catch (error) {
    return res.status(500).json({ message: "Error de servidor" });
  }
});

app.delete('/api/usuarios/:email_usuario/pedidos/:num_pedido', verifyToken, async (req, res) => {
  try {
    const existepedido = await Pedido.findOneAndDelete({ num_pedido: req.params.num_pedido });
    if (!existepedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    return res.status(200).json({ message: 'pedido eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ message: "Error de servidor" });
  }
});

app.get('/api/usuarios/:email_usuario/pedidos', verifyToken, async (req, res) => {


  const existeusuario = await Usuario.findOne({ email: req.params.email_usuario });
  if (!existeusuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  } else {

    const offset = parseInt(req.query.offset) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (offset - 1) * limit;
    const totalPedidos = await Pedido.find({ usuario: existeusuario.usuario }).countDocuments();
    const pedidos = await Pedido.find({ usuario: existeusuario.usuario }).skip(startIndex).limit(limit);
    const resultadosEnPagina = pedidos.length;
    var pagActual = offset / limit;
    if (pagActual < 1) {
      pagActual = 1;
    }
    const baseUrl = req.protocol + '://' + req.get('host') + req.baseUrl;
    const pagAnterior = offset - limit >= 0 ? '${baseUrl}?offset=${offset - limit}&limit=${limit}' : null;
    const pagSiguiente = offset + limit < totalPedidos ? '${baseUrl}?offset=${offset + limit}&limit=${limit}' : null;

    const metadatos = {
      totalResultados: totalPedidos,
      resultadosEnPagina: resultadosEnPagina,
      pagActual: pagActual,
      pagAnterior: pagAnterior,
      pagSiguiente: pagSiguiente
    }
    res.status(200).json({ pedidos, metadatos });
  }
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});




