import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faUser, faIdCard, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    numero_documento: '',
    direccion: '',
    barrio: ''
  });
  const navigate = useNavigate();

  const isButtonDisabled = () => {
    return carrito.length === 0 || formData.direccion.trim() === '' || formData.barrio.trim() === '';
  };

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
    setCarrito(carritoGuardado);
    setUsuario(usuarioGuardado);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/usuarios/${userId}`);
          const userData = response.data;

          setFormData((prevFormData) => ({
            ...prevFormData,
            nombre: userData.nombre || '',
            apellido: userData.apellido || '',
            telefono: userData.telefono || '',
            barrio: userData.barrio || '',
            numero_documento: userData.numero_documento || '',
            direccion: userData.direccion || '',
            id: userData.id || '',
          }));

          // Guardar los datos del usuario en el localStorage
          localStorage.setItem('usuario', JSON.stringify(userData));
        } catch (error) {
          console.error('Error al obtener los datos del usuario', error);
          Swal.fire('Error', 'No se pudo cargar los datos del usuario', 'error');
        }
      };
      fetchUserData();
    }
  }, []);

  const eliminarProducto = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));

    Swal.fire({
      title: 'Producto eliminado del carrito',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  };

  const aumentarCantidad = (index) => {
    const nuevoCarrito = [...carrito];
    if (nuevoCarrito[index].cantidad < 10) {
      nuevoCarrito[index].cantidad += 1;
      setCarrito(nuevoCarrito);
      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    } else {
      Swal.fire({
        title: 'Cantidad máxima alcanzada',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
  };

  const disminuirCantidad = (index) => {
    const nuevoCarrito = [...carrito];
    if (nuevoCarrito[index].cantidad > 1) {
      nuevoCarrito[index].cantidad -= 1;
      setCarrito(nuevoCarrito);
      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    } else {
      Swal.fire({
        title: 'La cantidad mínima es 1',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem('carrito'); // O puedes mantenerlo, según tus necesidades
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validar dirección
    const direccionValida = /^(Calle|Cll|Carrera|Cra|Avenida|Av|Transversal|Tv|Diagonal|Dg|Autopista|Aut|Circular|Cr)\s/i.test(formData.direccion);
    if (!direccionValida) {
      Swal.fire({
        title: 'Error',
        text: 'La dirección debe comenzar con un tipo de vía válido (Calle, Carrera, Avenida, etc.) o su abreviación.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return; // Detener si no es válida
    }
  
    // Validar barrio (solo letras)
    const barrioValido = /^[A-Za-z\s]+$/.test(formData.barrio);
    if (!barrioValido) {
      Swal.fire({
        title: 'Error',
        text: 'El barrio solo debe contener letras.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return; // Detener si no es válido
    }
  
    // Si las validaciones son correctas, proceder
    navigate('/detalles-pedido', {
      state: {
        carrito,
        usuario,
        formData,
        total: calcularSubtotal(),
      }
    });
  
    // Limpiar el carrito y el total en localStorage
    setCarrito([]);
    localStorage.removeItem('carrito');
  };


  const calcularSubtotal = () => {
    return carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen mt-12">
    {/* Left side: Carrito de Compras con scroll */}
    <div className="w-full md:w-1/2 p-4 overflow-y-auto h-screen mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Carrito de Compras</h2>
      {carrito.length > 0 ? (
        carrito.map((producto, index) => (
          <div
            key={index}
            className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-xs md:max-w-2xl mx-auto border border-white bg-white mb-8"
          >
            <div className="w-full md:w-1/3 bg-white grid place-items-center">
              <img
                src={producto.imagen }
                alt={producto.nombre}
                className="rounded-xl"
              />
            </div>
  
            <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-black">{producto.nombre}</h3>
                <p className="text-sm text-gray-500">Categoría: {producto.categoria}</p>
              </div>
  
              <div className="flex justify-between items-center">
                <p className="text-gray-500">Precio: ${producto.precio} COP</p>
                <p className="text-gray-600 font-bold text-sm">
                  {producto.cantidad} unidad(es)
                </p>
              </div>
  
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => disminuirCantidad(index)}
                    className="text-sm text-gray-700 bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold">{producto.cantidad}</span>
                  <button
                    type="button"
                    onClick={() => aumentarCantidad(index)}
                    className="text-sm text-gray-700 bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
                  >
                    +
                  </button>
                </div>
  
                <button
                  type="button"
                  onClick={() => eliminarProducto(index)}
                  className="flex items-center justify-center text-sm text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded"
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="mr-2" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">El carrito está vacío</p>
      )}
    </div>
  
    {/* Right side: Datos del Cliente sin scroll */}
    <div className="w-full md:w-1/2 bg-white p-8 shadow-md h-auto md:h-screen md:sticky top-0 mb-8">
      <form onSubmit={handleSubmit}>
        <h5 className="text-2xl font-semibold mb-4 text-center">Datos del Cliente</h5>
  
        {/* Mostrar total y subtotal */}
        <div className="mb-20">
          <p className="text-lg font-medium text-gray-700">
            Subtotal: ${calcularSubtotal().toFixed(3)} COP
          </p>
          <p className="text-lg font-medium text-gray-700 mt-2">
            Total: ${calcularSubtotal().toFixed(3)} COP
          </p>
        </div>
  
        <div className="grid grid-cols-2 gap-4 ">


          <input
            type="hidden"
            id="userId"
            name="userId"
            value={usuario ? usuario.id : ''} // Asegúrate de que el ID del usuario esté disponible
          />

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              <FontAwesomeIcon icon={faUser} className="text-yellow-500 mr-2" /> Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="mt-1 p-2 w-full border border-yellow-500 rounded-md bg-gray-200 cursor-not-allowed"
              placeholder="Nombre"
              value={formData.nombre}
              readOnly
            />
          </div>
  
          <div>
            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
              <FontAwesomeIcon icon={faUser} className="text-yellow-500 mr-2" /> Apellido
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              className="mt-1 p-2 w-full border border-yellow-500 rounded-md bg-gray-200 cursor-not-allowed"
              placeholder="Apellido"
              value={formData.apellido}
              readOnly
            />
          </div>
        </div>
  
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="numero_documento" className="block text-sm font-medium text-gray-700 ">
              <FontAwesomeIcon icon={faIdCard} className="text-yellow-500 mr-2" /> Número de Documento
            </label>
            <input
              type="text"
              id="numero_documento"
              name="numero_documento"
              className="mt-1 p-2 w-full border border-yellow-500 rounded-md bg-gray-200 cursor-not-allowed"
              placeholder="Número de Documento"
              value={formData.numero_documento}
              readOnly
            />
          </div>
  
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
              <FontAwesomeIcon icon={faUser} className="text-yellow-500 mr-2" /> Teléfono
              <span className="text-red-500 text-lg ml-1">*</span> {/* Asterisco rojo */}
            </label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              className="mt-1 p-2 w-full border border-yellow-500 rounded-md"
              placeholder="Teléfono"
              onChange={handleChange}
              value={formData.telefono}
              required
            />
          </div>
        </div>
  
        <div className="mt-4">
          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-yellow-500 mr-2" /> Dirección
            <span className="text-red-500 text-lg ml-1">*</span> {/* Asterisco rojo */}

          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            className="mt-1 p-2 w-full border border-yellow-500 rounded-md"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
        </div>
  
        <div className="mt-4">
          <label htmlFor="barrio" className="block text-sm font-medium text-gray-700">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-yellow-500 mr-2" /> Barrio
            <span className="text-red-500 text-lg ml-1">*</span> {/* Asterisco rojo */}
          </label>
          <input
            type="text"
            id="barrio"
            name="barrio"
            className="mt-1 p-2 w-full border border-yellow-500 rounded-md"
            placeholder="Barrio"
            value={formData.barrio}
            onChange={handleChange}
            required
          />
        </div>
  
        <div className="mt-6">
          <button
            type="submit"
            className={`w-full py-2 px-4 ${isButtonDisabled() ? 'bg-yellow-200' : 'bg-yellow-500 hover:bg-yellow-600'} font-semibold rounded-lg`}
            disabled={isButtonDisabled()} // Deshabilitar el botón si la función lo determina
          >
            <span className={`text-${isButtonDisabled() ? 'black' : 'black'} flex items-center justify-center`}>
              <FontAwesomeIcon icon={faArrowRight} className="mr-2" /> {/* Ícono antes del texto */}
              Continuar
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
  
  );
};

export default Carrito;
