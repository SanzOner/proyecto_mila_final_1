import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import BarraCliente from '../../barras/BarraCliente';
import Footer from "../../Footer/footer";

const FormularioInscripcion = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    numerodoc: "",
    celular: "",
    metodoPago: "",
    total: "",
  });
  
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); 
  const id = localStorage.getItem('id');

  useEffect(() => {
    const fetchEventData = async () => {
      console.log('ID del evento:', id);
      
      if (!id) {
        Swal.fire('Error', 'ID del evento no encontrado', 'error');
        navigate('/FormularioInscripcion'); // Cambia a la ruta deseada
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/eventos/${id}`);
        const eventData = response.data;

        if (!eventData || !eventData.precioins) {
          throw new Error('Datos del evento no válidos');
        }

        setFormData((prevFormData) => ({
          ...prevFormData,
          total: eventData.precioins || ''
        }));
      } catch (error) {
        console.error('Error al obtener los datos del evento', error);
        Swal.fire('Error', error.message || 'No se pudo cargar los datos del evento', 'error');
      }
    };
    
    fetchEventData();
  }, [id, navigate]); // Agregado navigate como dependencia

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/usuarios/${userId}`);
        const userData = response.data;

        setFormData((prevFormData) => ({
          ...prevFormData,
          nombre: userData.nombre || '',
          celular: userData.telefono || '',
          email: userData.email || '',
          numerodoc: userData.numero_documento || '',
        }));
      } catch (error) {
        console.error('Error al obtener los datos del usuario', error);
        Swal.fire('Error', 'No se pudo cargar los datos del usuario', 'error');
      }
    };
    
    fetchUserData();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.email || !formData.metodoPago || !formData.total || !formData.numerodoc) {
        return Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
    }

    try {
        // Primero, obtener el evento actual
        const eventResponse = await axios.get(`http://localhost:3000/eventos/${id}`);
        const eventData = eventResponse.data;

        // Verificar si hay cupos disponibles
        if (eventData.cantidadCupos === "0") {
            return Swal.fire('Error', 'No hay cupos disponibles para este evento.', 'error');
        }

        // Actualizar la lista de inscritos del evento
        const updatedInscritos = [...eventData.inscritos, {
            nombre: formData.nombre,
            celular: formData.celular,
            email: formData.email,
            numerodoc: formData.numerodoc,
            metodoPago: formData.metodoPago,
            total: formData.total,
            userId: userId // Agregar el userId aquí
        }];

        // Enviar la actualización del evento
        await axios.patch(`http://localhost:3000/eventos/${id}`, {
            inscritos: updatedInscritos,
            cantidadCupos: (parseInt(eventData.cantidadCupos) - 1).toString() // Disminuir el contador de cupos
        });

        Swal.fire('¡Éxito!', 'El registro se ha realizado correctamente.', 'success');
        navigate('/EventosCliente'); // Redirigir al usuario a la página de eventos
    } catch (error) {
        console.error('Error al inscribirse:', error.response ? error.response.data : error.message);
        Swal.fire('Error', 'No se pudo completar la inscripción. ' + (error.response ? error.response.data : ''), 'error');
    }
};



  return (
    <div>
      <div className="max-w-screen-md mx-auto p-5 sm:p-10 md:p-16">
        <BarraCliente />
        <h1 className="text-4xl font-bold text-center mb-6 text-black">Inscripción al Evento</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
              className="text-center block appearance-none w-full bg-gray-200 border border-[#D2B48C] text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#D2B48C]"
              required
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="numerodoc">Número de Documento</label>
            <input
              name="numerodoc"
              type="text"
              value={formData.numerodoc}
              onChange={(e) => setFormData((prev) => ({ ...prev, numerodoc: e.target.value }))}
              className="text-center block appearance-none w-full bg-gray-200 border border-[#D2B48C] text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#D2B48C]"
              required
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="celular">Número de Teléfono</label>
            <input
              name="celular"
              type="text"
              value={formData.celular}
              onChange={(e) => setFormData((prev) => ({ ...prev, celular: e.target.value }))}
              className="text-center block appearance-none w-full bg-gray-200 border border-[#D2B48C] text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#D2B48C]"
              required
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className="text-center block appearance-none w-full bg-gray-200 border border-[#D2B48C] text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#D2B48C]"
              readOnly
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="metodoPago">Método de Pago</label>
            <select
              id="metodoPago"
              value={formData.metodoPago}
              onChange={(e) => setFormData((prev) => ({ ...prev, metodoPago: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded"
              required
            >
              <option value="">Seleccione un método de pago</option>
              <option value="tarjeta">Tarjeta de Crédito/Débito</option>
              <option value="paypal">PayPal</option>
              <option value="transferencia">Transferencia Bancaria</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="total">Total</label>
            <input
              type="number"
              id="total"
              value={formData.total}
              onChange={(e) => setFormData((prev) => ({ ...prev, total: e.target.value }))}
              className="text-center block appearance-none w-full bg-gray-200 border border-[#D2B48C] text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#D2B48C]"
              required
              readOnly
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-300 transition duration-500 ease-in-out"
          >
            Inscribirse
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default FormularioInscripcion;
