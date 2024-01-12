import axios from 'axios';

const API_URL = 'http://localhost:3000/api/';

class Service {
    login(user) {
        return axios
            .post(API_URL + 'login', {
                email: user.email,
                password: user.password
            })
            .then(response => {
                if (response.data && response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            }).catch(error => {
                if (error.response && error.response.status === 401) {
                    console.log('error data: ', error.response.data);
                    return error.response.data;
                }
            });
    }

    register(user) {
        return axios
            .post(API_URL + 'usuarios', {
                usuario: user.usuario,
                email: user.email,
                password: user.password,
                nombre: user.nombre,
                domicilio: user.domicilio
            })
            .then(response => {
                if (response.data && response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            })
    }

    articulos(offset, limit = 5) {
        return axios
            .get(API_URL + 'articulos/', {
                params: {
                    offset: offset,
                    limit: limit
                }
            })
            .then(response => {
                return response.data;
            });
    }

    buscarArticulos(offset, limit = 5, palabra_clave) {
        return axios
            .get(API_URL + 'articulos/' + palabra_clave, {
                params: {
                    palabra_clave: palabra_clave,
                    offset: offset,
                    limit: limit
                }
            }).then(response => {
                return response.data;
            })
    }

    crearArticulos(user, articulo) {
        return axios
            .post(API_URL + 'crearArticulo', {
                num_articulo: articulo.productNumber,
                nombre: articulo.name,
                descripcion: articulo.description,
                precio: articulo.price,
                stock: articulo.stock,
                palabra_clave: articulo.keyWord
            },
                {
                    headers: {
                        'Authorization': user.token,
                        'type': 'text'
                    }
                }).then(response => {
                    return response.data;
                })
    }

    detallesArticulo(numArticulo) {
        return axios
            .get(API_URL + 'articulos/consultar/' + numArticulo)
            .then(response => {
                return response.data;
            })
    }

    editarArticulo(user, articulo) {
        const cuerpoSolicitud = {
            num_articulo: articulo.num_articulo,
            nombre: articulo.nombre,
            precio: articulo.precio,
            stock: articulo.stock,
            palabra_clave: articulo.palabra_clave,
            descripcion: articulo.descripcion
        };
        return axios
            .put(API_URL + 'articulos/editar/' + articulo.num_articulo, cuerpoSolicitud,
                {
                    headers: {
                        'Authorization': user.token
                    }

                }).then(response => {
                    return response.data;
                })
    }

    eliminarArticulo(user, numArticulo) {
        return axios
            .delete(API_URL + 'articulos/eliminar/' + numArticulo, {
                headers: {
                    'Authorization': user.token
                }
            }).then(response => {
                return response.data;
            })
    }

    logout() {
        localStorage.removeItem('user');
    }

}
export default new Service();