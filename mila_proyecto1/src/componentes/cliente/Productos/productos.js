import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';

const ProductosCliente = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const { role } = useContext(UserContext); 
  const [categoria, setCategoria] = useState('');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('asc');
  const [productosNoEncontrados, setProductosNoEncontrados] = useState(false);
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  useEffect(() => {
    axios.get('http://localhost:3000/productos')
      .then(respuesta => {
        setProductos(respuesta.data);
        setProductosNoEncontrados(false);
      })
      .catch(error => {
        console.error('Error al cargar productos:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar los productos.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }, []);

  const productosFiltrados = productos
    .filter(producto => {
      const coincideCategoria = categoria ? producto.categoria === categoria : true;
      const coincideBusqueda = producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    })
    .sort((a, b) => {
      if (ordenamiento === 'asc') {
        return a.precio - b.precio;
      } else {
        return b.precio - a.precio;
      }
    });

  useEffect(() => {
    setProductosNoEncontrados(terminoBusqueda && productosFiltrados.length === 0);
  }, [terminoBusqueda, productosFiltrados]);

  const productosAgrupadosPorCategoria = productosFiltrados.reduce((acumulador, producto) => {
    if (!acumulador[producto.categoria]) {
      acumulador[producto.categoria] = [];
    }
    acumulador[producto.categoria].push(producto);
    return acumulador;
  }, {});

  const ordenCategorias = [
    'entradas',
    'plato fuerte',
    'cocteles',
    'bebidas calientes',
    'bebidas frías',
    'postres'
  ];

  const TarjetaProducto = ({ producto }) => {
    const [cantidad, setCantidad] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);

    const abrirModal = () => setModalOpen(true);
    const cerrarModal = () => setModalOpen(false);
  

    const aumentarCantidad = () => {
      if (cantidad < 10) {
        setCantidad(cantidad + 1);
      }
    };

    const disminuirCantidad = () => {
      if (cantidad > 1) {
        setCantidad(cantidad - 1);
      }
    };

    const agregarAlCarrito = () => {
      // Obtiene el carrito guardado en el localStorage
      const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    
      // Busca si el producto ya existe en el carrito
      const productoExistente = carritoGuardado.find(item => item.id === producto.id);
    
      if (productoExistente) {
        // Si el producto ya existe, aumenta la cantidad
        productoExistente.cantidad += cantidad;
      } else {
        // Si el producto no existe, lo agrega al carrito
        const nuevoProducto = { ...producto, cantidad };
        carritoGuardado.push(nuevoProducto);
      }
    
      // Actualiza el carrito en el estado y en el localStorage
      setCarrito(carritoGuardado);
      localStorage.setItem('carrito', JSON.stringify(carritoGuardado));
    
      Swal.fire({
        title: `¡${producto.nombre} añadido al carrito!`,
        icon: 'success',
        confirmButtonText: 'Ir al carrito',
        showCancelButton: true,
        cancelButtonText: 'Seguir comprando',
        confirmButtonColor: '#f59e0b', // Color dorado para el botón de ir al carrito
        cancelButtonColor: '#1f2937', // Color negro para el botón de seguir comprando
        // Puedes ajustar los estilos y colores a tu preferencia
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/carrito'); // Redirige al carrito si el usuario hace clic en 'Ir al carrito'
        } else if (result.isDismissed) {
          // Aquí puedes manejar la acción si el usuario hace clic en 'Seguir comprando'
          console.log('Usuario decidió seguir comprando');
        }
      });
    };
    


    return (
      <div>
      <div className="rounded overflow-hidden shadow-lg flex flex-col transform hover:scale-105 transition duration-300 ease-in-out h-[450px] cursor-pointer">
        <div  onClick={abrirModal} className='-mb-8'>

        
          <div className="relative">
            <img
              className="w-full h-64 object-cover"
              src={producto.imagen}
              alt={producto.nombre}
            />
            <div className="absolute inset-0 bg-gray-900 opacity-25 hover:bg-transparent transition duration-300"></div>
            <span className="text-xs absolute top-0 right-0 bg-yellow-500 px-4 py-2 text-black mt-3 mr-3 transition duration-500 ease-in-out no-underline">
              {producto.categoria}
            </span>
          </div>

          <div className="px-6 py-4 flex-1 overflow-hidden">
            <p className="font-medium text-lg inline-block hover:text-yellow-500 transition duration-500 ease-in-out mb-2">{producto.nombre}</p>
            <p className="text-gray-500 text-sm mb-2 truncate">
              {producto.descripcion}
            </p>
            <p className="text-gray-900 font-semibold text-lg"> $ {producto.precio} COP</p>
          </div>
        </div>
        <div className="px-6 py-3 flex items-center justify-between bg-gray-100">
          <div className="flex items-center">
            <button
              onClick={disminuirCantidad}
              className="text-lg px-3 py-1 text-gray-900 border border-gray-400 rounded hover:bg-gray-200 transition duration-300"
            >
              -
            </button>
            <span className="mx-2">{cantidad}</span>
            <button
              onClick={aumentarCantidad}
              className="text-lg px-3 py-1 text-gray-900 border border-gray-400 rounded hover:bg-gray-200 transition duration-300"
            >
              +
            </button>
          </div>
            <button
              onClick={agregarAlCarrito}
              className="flex items-center bg-yellow-500 hover:bg-yellow-300 text-black px-4 py-2 rounded transition duration-500 ease-in-out"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13h.4m12 0a1 1 0 01-1 1H9m4 6a2 2 0 100-4 2 2 0 000 4zm0 0h4m-4 0H9"></path>
              </svg>
              Añadir al carrito
            </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
            <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-800" onClick={cerrarModal}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <img
              className="w-full h-48 object-cover rounded"
              src={producto.imagen}
              alt={producto.nombre}
            />
            <h2 className="text-2xl font-bold mt-4">{producto.nombre}</h2>
            <p className="text-gray-600 mt-2">{producto.descripcion}</p>
            <p className="text-gray-900 font-semibold text-lg mt-4"> $ {producto.precio} COP</p>
          </div>
        </div>
      )}
    </div>
    );
  };

  return (
  <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
    
    <div className="border-b mb-5 flex justify-between text-sm">
      <div className="text-black flex items-center pb-2 pr-2 border-b-2 border-black uppercase">
        <span className="font-semibold inline-block">Seleccione una Categoría</span>
      </div>
      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="text-black hover:underline"
      >
        <option value="">Todas</option>
        {ordenCategorias.map(cat => (
          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
        ))}
      </select>
    </div>

    {/* Contenedor para el input de búsqueda y el botón de ordenar */}
    <div className="mb-5 flex justify-between items-center space-x-4"> 
      <div className="flex-1 relative">
        <input
          type="text"
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
          placeholder="Buscar por nombre"
          className="w-full p-2 border border-gray-300 rounded"
        />
        {terminoBusqueda && (
          <button
            onClick={() => setTerminoBusqueda('')}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            X
          </button>
        )}
      </div>
      <button 
        onClick={() => setOrdenamiento(ordenamiento === 'asc' ? 'desc' : 'asc')}
        className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-300 transition duration-500 ease-in-out"
      >
        Ordenar por precio: {ordenamiento === 'asc' ? 'Menor a Mayor' : 'Mayor a Menor'}
      </button>
    </div>

    {/* Mostrar mensaje si no se encontraron productos después de la búsqueda */}
    {productosNoEncontrados ? (
      <p className="text-center text-gray-500 text-lg">No se encontraron productos con el término de búsqueda.</p>
    ) : (
      <>
        {/* Mostrar todas las categorías con sus productos en el orden deseado */}
        {ordenCategorias.map(cat => (
          productosAgrupadosPorCategoria[cat] && (
            <div key={cat} className="mb-8">
              <h2 className="text-3xl font-bold mb-4 text-center text-black capitalize">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </h2>
              <div className="border-b-2 border-yellow-500 mb-6"></div> {/* Línea amarilla más delgada */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {productosAgrupadosPorCategoria[cat].map(producto => (
                  <TarjetaProducto key={producto.id} producto={producto} />
                ))}
              </div>
            </div>
          )
        ))}
        
        {/* Mostrar productos filtrados por categoría */}
        {categoria && !Object.keys(productosAgrupadosPorCategoria).includes(categoria) && (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-center text-black">
              {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
            </h2>
            <div className="border-b-2 border-yellow-500 mb-6"></div> {/* Línea amarilla más delgada */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map(producto => (
                  <TarjetaProducto key={producto.id} producto={producto} />
                ))
              ) : (
                <p className="text-center text-gray-500 text-lg">No se encontraron productos.</p> 
              )}
            </div>
          </div>
        )}
      </>
      
    )}
    
  </div>
  );
};

export default ProductosCliente;
