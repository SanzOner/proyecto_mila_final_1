import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [ordenPrecio, setOrdenPrecio] = useState('asc');

  useEffect(() => {
    axios.get('http://localhost:3000/productos')
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar los productos.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }, []);

  const filtrarProductos = () => {
    let productosFiltrados = productos.filter(producto => {
      const porCategoria = filtroCategoria ? producto.categoria === filtroCategoria : true;
      const porNombre = producto.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      return porCategoria && porNombre && producto.estado === 'activo';
    });

    productosFiltrados.sort((a, b) => {
      return ordenPrecio === 'asc' ? a.precio - b.precio : b.precio - a.precio;
    });

    return productosFiltrados;
  };

  const eliminarProducto = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción desactivará el producto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.patch(`http://localhost:3000/productos/${id}`, { estado: 'inactivo' })
          .then(() => {
            setProductos(productos.map(producto =>
              producto.id === id ? { ...producto, estado: 'inactivo' } : producto
            ));
            Swal.fire(
              'Desactivado!',
              'El producto ha sido desactivado.',
              'success'
            );
          })
          .catch(error => {
            console.error('Error al desactivar el producto:', error);
            Swal.fire(
              'Error',
              'No se pudo desactivar el producto.',
              'error'
            );
          });
      }
    });
  };

  const productosFiltrados = filtrarProductos();

  const TarjetaProducto = ({ producto }) => (
    <div className="rounded overflow-hidden shadow-lg flex flex-col transform hover:scale-105 transition duration-300 ease-in-out mt-12">
      <div className="relative">
        <img className="w-full" src={producto.imagen} alt={producto.nombre} />
        <div className="absolute inset-0 bg-gray-900 opacity-25 hover:bg-transparent transition duration-300"></div>
        <Link to="#" className="text-xs absolute top-0 right-0 bg-yellow-500 px-4 py-2 text-black mt-3 mr-3 hover:bg-white hover:text-yellow-500 transition duration-500 ease-in-out">
          {producto.categoria}
        </Link>
      </div>
      <div className="px-6 py-4 flex-1">
        <Link to="#" className="font-medium text-lg inline-block hover:text-yellow-500 transition duration-500 ease-in-out mb-2">
          {producto.nombre}
        </Link>
        <p className="text-gray-500 text-sm mb-2">{producto.descripcion}</p>
        <p className="text-gray-900 font-semibold text-lg"> $ {producto.precio} COP</p>
      </div>
      <div className="px-6 py-3 flex items-center justify-between bg-gray-100">
        <button 
          onClick={() => eliminarProducto(producto.id)} 
          className="flex items-center bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-500 ease-in-out">
          <FontAwesomeIcon icon={faTrash} className="mr-2 text-yellow-500" />
          Desactivar
        </button>
        <button 
          className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded transition duration-500 ease-in-out">
          <FontAwesomeIcon icon={faEdit} className="mr-2 text-white" />
          Editar
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
      
      <div className="border-b mb-5 flex justify-between text-sm">
        <div className="text-black flex items-center pb-2 pr-2 border-b-2 border-black uppercase">
          <span className="font-semibold inline-block">Filtrar por categoría</span>
        </div>
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="text-black hover:underline"
        >
          <option value="">Todas</option>
          <option value="entradas">Entradas</option>
          <option value="plato fuerte">Plato Fuerte</option>
          <option value="cocteles">Cocteles</option>
          <option value="bebidas calientes">Bebidas Calientes</option>
          <option value="bebidas frías">Bebidas Frías</option>
          <option value="postres">Postres</option>
        </select>
      </div>

      {/* Filtros por nombre y botón de ordenar por precio */}
      <div className="mb-5 flex justify-between items-center space-x-4">
        <input
          type="text"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          placeholder="Buscar por nombre"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={() => setOrdenPrecio(ordenPrecio === 'asc' ? 'desc' : 'asc')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded transition duration-500 ease-in-out"
        >
          Ordenar por precio: {ordenPrecio === 'asc' ? 'Menor a Mayor' : 'Mayor a Menor'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {productosFiltrados.map(producto => (
          <TarjetaProducto key={producto.id} producto={producto} />
        ))}
      </div>
      
    </div>
  );
};

export default GestionProductos;
