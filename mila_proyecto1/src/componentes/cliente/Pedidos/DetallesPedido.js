import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCreditCard, faClipboardList, faUser, faComment, faCalendar, faTruck } from '@fortawesome/free-solid-svg-icons';

const DetallesPedido = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { carrito, usuario } = state || { carrito: [], usuario: {} };

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    hora: '',
    metodoPago: '',
    total: '',
    tipoEntrega: '',
    cantidad: carrito.reduce((total, producto) => total + producto.cantidad, 0),
    detallesPedido: '',
    estado: 'activo',
    pedidoId: Math.floor(Math.random() * 1000000),
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const totalCarrito = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
    setFormData((prev) => ({ ...prev, total: totalCarrito.toFixed(3) }));
  }, [carrito]);
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleSubmit = async () => {
    // Validación de aceptación de términos
    if (!acceptedTerms) {
      Swal.fire({
        title: 'Error',
        text: 'Debes aceptar las políticas de privacidad.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return; // Detiene la ejecución si no se han aceptado los términos
    }
  
    // Validación de la hora
    if (!formData.hora || formData.hora < '11:00' || formData.hora > '18:00') {
      Swal.fire({
        title: 'Error',
        text: 'La hora debe estar entre 11:00 y 18:00.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return; // Detiene la ejecución si la hora es inválida
    }
  
    // Validación del método de pago
    if (!formData.metodoPago) {
      Swal.fire({
        title: 'Error',
        text: 'Debes seleccionar un método de pago.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return; // Detiene la ejecución si no se ha seleccionado un método de pago
    }
  
    // Validación del tipo de entrega
    if (!formData.tipoEntrega) {
      Swal.fire({
        title: 'Error',
        text: 'Debes seleccionar un tipo de entrega.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return; // Detiene la ejecución si no se ha seleccionado un tipo de entrega
    }
  
    // Si todas las validaciones pasan, se envía el pedido
    try {
      const response = await fetch('http://localhost:3000/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idpedido: formData.pedidoId,
          fecha: formData.fecha,
          hora: formData.hora,
          metodoPago: formData.metodoPago,
          total: formData.total,
          tipoEntrega: formData.tipoEntrega,
          cantidad: formData.cantidad,
          detallesPedido: formData.detallesPedido,
          estado: formData.estado,
          usuario: {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            numero_documento: usuario.numero_documento,
            direccion: usuario.direccion,
            barrio: usuario.barrio,
            idusuario: usuario.id,
          },
          carrito,
        }),
      });
  
      if (response.ok) {
        Swal.fire({
          title: 'Éxito',
          text: `Tu pedido ha sido enviado con éxito. Estado: Pendiente`,
          icon: 'success',
        }).then(() => {
          // Redirige a la página de ver pedido al dar clic en "OK"
          navigate('/pedidos'); // Cambia '/ver-pedido' por la ruta de la página que deseas.
        });
  
        // Reiniciar formulario
        setFormData({
          fecha: new Date().toISOString().split('T')[0],
          hora: '',
          metodoPago: '',
          total: '',
          tipoEntrega: '',
          cantidad: 0,
          detallesPedido: '',
          estado: 'activo',
          pedidoId: Math.floor(Math.random() * 1000000),
        });
        setAcceptedTerms(false); // Reseteamos el checkbox
        setModalVisible(false); // Cerramos el modal
      } else {
        throw new Error('Error al enviar el pedido');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al enviar tu pedido.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const acceptTerms = () => {
    setAcceptedTerms(true);
    toggleModal();
    handleSubmit();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 shadow-md w-full md:w-1/2 h-auto rounded-lg">
        <h5 className="text-2xl font-semibold mb-4">Detalles del Pedido</h5>

        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto">
          {/* Fecha (no editable) */}
          <div className="mb-4">
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
              <FontAwesomeIcon icon={faCalendar} className="text-yellow-500 mr-2" /> Fecha
              <span className="text-red-500 text-lg ml-1">*</span> {/* Asterisco rojo */}
            </label>
            <input type="date" id="fecha" name="fecha" value={formData.fecha} readOnly className="mt-1 p-2 w-full border border-yellow-500 rounded-md bg-gray-200 cursor-not-allowed" required />
          </div>

          {/* Hora */}
          <div className="mb-4">
            <label htmlFor="hora" className="block text-sm font-medium text-gray-700">
              <FontAwesomeIcon icon={faClock} className="text-yellow-500 mr-2" /> Hora
              <span className="text-red-500 text-lg ml-1">*</span> {/* Asterisco rojo */}
            </label>
            <input
              type="time"
              id="hora"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-yellow-500 rounded-md"
              required
            />
          </div>

          {/* Método de Pago y Total */}
          <div>
            <label htmlFor="metodoPago" className="block text-sm font-medium text-gray-700">
              <FontAwesomeIcon icon={faCreditCard} className="text-yellow-500 mr-2" /> Método de Pago
              <span className="text-red-500 text-lg ml-1">*</span> {/* Asterisco rojo */}
            </label>
            <select id="metodoPago" name="metodoPago" value={formData.metodoPago} onChange={handleChange} className="mt-1 p-2 w-full border border-yellow-500 rounded-md">
              <option value="credito">Tarjeta de Crédito</option>
              <option value="nequi">Nequi</option>
              <option value="Daviplata">Daviplata</option>
            </select>
          </div>

          <div>
            <label htmlFor="total" className="block text-sm font-medium text-gray-700 mt-1">
              <FontAwesomeIcon icon={faClipboardList} className="text-yellow-500 mr-2" /> Total
            </label>
            <input
              type="text"
              id="total"
              name="total"
              value={formData.total}
              readOnly
              className="mt-1 p-2 w-full border border-yellow-500 rounded-md bg-gray-200 cursor-not-allowed"
              placeholder="$0.00"
              required
            />
          </div>

          {/* Tipo de Entrega */}
          <div className="mt-4">
          <label htmlFor="tipoEntrega" className="block text-sm font-medium text-gray-700">
            <FontAwesomeIcon icon={faTruck} className="text-yellow-500 mr-2" /> Tipo de Entrega
            <span className="text-red-500 text-lg ml-1">*</span> {/* Asterisco rojo */}
          </label>            
            <select id="tipoEntrega" name="tipoEntrega" value={formData.tipoEntrega} onChange={handleChange} className="mt-1 p-2 w-full border border-yellow-500 rounded-md">
              <option value="recogida">Recogida en Tienda</option>
              <option value="envio">Envío a Domicilio</option>
            </select>
          </div>

          {/* Cantidad (no editable) */}
          <div className="mt-4">
            <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mt-1">
              <FontAwesomeIcon icon={faUser} className="text-yellow-500 mr-2" /> Cantidad
            </label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              value={formData.cantidad}
              readOnly
              className="mt-1 p-2 w-full border border-yellow-500 rounded-md bg-gray-200 cursor-not-allowed"               placeholder="0"
              required
            />
          </div>

          {/* Detalles del Pedido */}
          <div className="mt-4 col-span-2">
            <label htmlFor="detallesPedido" className="block text-sm font-medium text-gray-700">
              <FontAwesomeIcon icon={faComment} className="text-yellow-500 mr-2" /> Detalles del Pedido(opcional)
            </label>
            <textarea
              id="detallesPedido"
              name="detallesPedido"
              value={formData.detallesPedido}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-yellow-500 rounded-md"
              rows="2"
            />
          </div>

          {/* Checkbox de aceptación de políticas */}
          <div className="col-span-2 flex items-center mt-4">
            <input
              type="checkbox"
              id="aceptarPoliticas"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              className="mr-2"
            />
            <label htmlFor="aceptarPoliticas" className="text-sm text-gray-600 cursor-pointer" onClick={toggleModal}>
              Acepto las políticas de privacidad
            </label>
          </div>

          {/* Botón de Enviar */}
          <div className="col-span-2">
            <button
              type="button"
              onClick={handleSubmit}
              className={`w-full p-2 mt-4 text-white font-semibold bg-yellow-500 rounded-md ${!acceptedTerms ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!acceptedTerms}
            >
              Enviar Pedido
            </button>
          </div>
        </form>

        {/* Modal de políticas de privacidad */}
        {modalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-2">Políticas de Entrega de Pedidos</h2>
            <p className="mb-4">Por favor, revisa nuestras políticas de entrega:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Los pedidos serán entregados 15 minutos antes o despues de la fecha del pedido</li> 
              <li>Las entregas se realizarán de lunes a domingo, excluyendo festivos.</li>
              <li>Se recomienda proporcionar instrucciones específicas para la entrega, como ubicación exacta o puerta de acceso.</li>
              <li>Los pedidos se entregarán en condiciones óptimas de temperatura y presentación.</li>
              <li>Las tarifas de entrega pueden variar según la ubicación del cliente y se informarán antes de confirmar el pedido.</li>
            </ul>
            <div className="flex justify-end">
              <button
                onClick={acceptTerms}
                className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded mr-2 hover:bg-yellow-600 transition"
              >
                Aceptar
              </button>
              <button
                onClick={toggleModal}
                className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-600 transition"
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
        
        )}
      </div>
    </div>
  );
};

export default DetallesPedido;
