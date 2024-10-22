import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ReservaLocal = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    correo: '',
    numero_documento: '',
    numeroPersonas: '',
    fecha: '',
    horaInicio: '',
    decoracion: '',
    actividades: '',
    comentarios: '',
    estado_reserva: 'Activa',
    tipo_reserva: 'reserva_mesa',
    terminos: false,
    userId:'',
  });
  const [errors, setErrors] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const userId = localStorage.getItem('userId'); // Sustituye esto con el ID del usuario actual (por ejemplo, desde el contexto o almacenamiento local)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/usuarios/${userId}`);
        const userData = response.data;

        setFormData((prevFormData) => ({
          ...prevFormData,
          nombre: userData.nombre || '',
          celular: userData.telefono || '',
          correo: userData.email || '',
          userId: userData.id || '',
          numero_documento: userData.numero_documento || '',
        }));
      } catch (error) {
        console.error('Error al obtener los datos del usuario', error);
        Swal.fire('Error', 'No se pudo cargar los datos del usuario', 'error');
      }
    };

    fetchUserData();
  }, [userId]);

  const validateForm = async () => {
    const newErrors = {};
  
    if (!formData.nombre.trim() || !/^[A-Za-z\s]+$/.test(formData.nombre)) {
      newErrors.nombre = 'El nombre es obligatorio y solo debe contener letras y espacios';
    }
    if (!formData.celular.trim() || !/^\d{10}$/.test(formData.celular)) {
      newErrors.celular = 'El celular es obligatorio y debe tener 10 dígitos';
    }
    if (!formData.correo.trim() || !/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'El correo es obligatorio y debe ser válido';
    }
    if (!formData.numero_documento.trim() || !/^\d{10}$/.test(formData.numero_documento)) {
      newErrors.numero_documento = 'El número de documento debe ser válido';
    }
    if (!formData.numeroPersonas.trim() || formData.numeroPersonas <= 0 || formData.numeroPersonas > 12) {
      newErrors.numeroPersonas = 'El número de personas debe ser entre 1 y 12';
    }
    if (!formData.fecha.trim()) {
      newErrors.fecha = 'La fecha es obligatoria';
    }
    if (!formData.horaInicio.trim()) {
      newErrors.horaInicio = 'La hora de inicio es obligatoria';
    }
    if (!formData.actividades.trim()) {
      newErrors.actividades = 'Elige un tipo de servicio';
    }
  
    // Verificar disponibilidad
    const esDisponible = await checkAvailability();
    if (!esDisponible) {
      newErrors.fecha = 'La fecha y hora seleccionadas ya están reservadas';
    }
  
    if (!formData.terminos) {
      newErrors.terminos = 'Debes aceptar los términos y condiciones';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const checkAvailability = async () => {
    try {
      const response = await axios.get('http://localhost:3000/reservas');
      const reservas = response.data;
  
      const fechaSolicitud = new Date(formData.fecha);
      const horaInicioSolicitud = new Date(`${formData.fecha}T${formData.horaInicio}`);
      
      // Ajustar la duración si tienes un tiempo de reserva fijo
      const duracionReserva = 2 * 60 * 60 * 1000; // 2 horas en milisegundos
      const horaFinSolicitud = new Date(horaInicioSolicitud.getTime() + duracionReserva);
  
      // Verificar si hay conflictos con la reserva solicitada
      const esDisponible = reservas.every((reserva) => {
        const reservaFecha = new Date(reserva.fecha);
        const reservaHoraInicio = new Date(`${reserva.fecha}T${reserva.horaInicio}`);
        // Asumimos que las reservas existentes también tienen una duración fija
        const reservaHoraFin = new Date(reservaHoraInicio.getTime() + duracionReserva);
  
        return (
          (horaFinSolicitud <= reservaHoraInicio) || // La solicitud termina antes de que comience la reserva
          (horaInicioSolicitud >= reservaHoraFin)    // La solicitud comienza después de que termina la reserva
        );
      });
  
      return esDisponible;
    } catch (error) {
      console.error('Error al verificar disponibilidad', error);
      Swal.fire('Error', 'No se pudo verificar la disponibilidad', 'error');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  // Evitar el comportamiento predeterminado del formulario
  
    if (!validateForm()) return; // Validar el formulario
    const esFormularioValido = await validateForm(); // Espera la validación
  
    if (!esFormularioValido) return; // Validar el formulario
  
    try {
      // Verificar la disponibilidad antes de enviar
      const disponibilidad = await checkAvailability();
  
      if (!disponibilidad) {
        Swal.fire('No disponible', 'La fecha y hora seleccionadas no están disponibles. Por favor, elija otra.', 'error');
        return;
      }
      const reservaData = {
        ...formData,
        userId: userId, // Incluye la userId aquí
      };

      
      // Agregar un log para depurar
      console.log('Enviando datos:', formData);
  
      // Enviar los datos del formulario a la API
      const response = await axios.post('http://localhost:3000/reservas', formData);
      const response2 = await axios.get(`http://localhost:3000/usuarios/${userId}`);
      const userData = response2.data;
  
      // Mostrar un mensaje de éxito
      Swal.fire('¡Éxito!', 'La reserva ha sido registrada correctamente', 'success');
  
      // Limpiar el formulario después del envío
      setFormData({
        nombre: userData.nombre || '',
        celular: userData.telefono || '',
        correo: userData.email || '',
        numero_documento: userData.numero_documento || '',
        numeroPersonas: '',
        fecha: '',
        horaInicio: '',
        decoracion: '',
        actividades: '',
        comentarios: '',
        estado_reserva: 'Activa',
        tipo_reserva: 'reserva_local',
        terminos: false,
        userId: userData.id,
      });
  
    } catch (error) {
      console.error('Hubo un error al registrar la reserva', error);
      Swal.fire('Error', 'Hubo un problema al registrar la reserva', 'error');
    }
  };
  
  const manejarAceptarTerminos = () => {
    setFormData((prevFormData) => ({ ...prevFormData, terminos: true }));
    setMostrarModal(false);
  };

  const manejarCancelarTerminos = () => {
    setMostrarModal(false);
  };

  return (
    <div>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Formulario de Reserva local</title>
      <link rel="icon" type="image/png" href="https://i.ibb.co/gj0Bpcc/logo-empresa-mila.png" />
      <section className="min-h-screen relative mt-12">
        <div className="background-overlay"></div>
        <div className="reservation-form">
          <h2 className='titulo'>Personaliza tu reserva de mesa</h2>
          <form id="reservation-form" className='reservation-form' onSubmit={handleSubmit}>
            <div className="container select-people-container">
              <h2>Datos del Usuario</h2>
              <label>Nombre:</label>
              <input
                className="block appearance-none w-full bg-gray-200 border border-[#D2B48C] text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#D2B48C] text-center"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                required
                readOnly
              />
              {errors.nombre && <p className="error">{errors.nombre}</p>}

              <label>Celular:</label>
              <input
                className="text-center block appearance-none w-full bg-gray-200 border border-[#D2B48C] text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#D2B48C]"
                name="celular"
                type="text"
                value={formData.celular}
                onChange={handleChange}
                required
                readOnly
              />
              {errors.celular && <p className="error">{errors.celular}</p>}

              <label>Correo:</label>
              <input
                className="text-center block appearance-none w-full bg-gray-200 border border-[#D2B48C] text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#D2B48C]"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                required
                readOnly
              />
              {errors.correo && <p className="error">{errors.correo}</p>}
              
              <label>Número de Documento:</label>
              <input
                className="text-center block appearance-none w-full bg-gray-200 border border-[#D2B48C] text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#D2B48C]"
                name="numero_documento"
                type="text"
                value={formData.numero_documento}
                onChange={handleChange}
                required
                readOnly
              />
              {errors.numero_documento && <p className="error">{errors.numero_documento}</p>}
            </div>

            <div className="container select-date-container">
              <h2>Información de la Reserva</h2>
              <label>Número de personas:</label>
              <select
                className="input-field"
                name="numeroPersonas"
                type="number"
                max = "12"
                min = "1"
                value={formData.numeroPersonas}
                onChange={handleChange}
                required
              >
                  <option value="">Seleccione</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>


                </select>
              {errors.numeroPersonas && <p className="error">{errors.numeroPersonas}</p>}

              <label>Fecha:</label>
              <input
                className="input-field"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}  // No permitir fechas pasadas
                max={`${new Date().getFullYear()}-12-31`}     // No permitir fechas fuera del año actual
                required
              />
              {errors.fecha && <p className="error">{errors.fecha}</p>}

              <label>Hora de Inicio:</label>
              <input
                className="input-field"
                name="horaInicio"
                type="time"
                value={formData.horaInicio}
                onChange={handleChange}
                required
              />
              {errors.horaInicio && <p className="error">{errors.horaInicio}</p>}

              <label>Elige la decoracion</label>
                <select 
                  className="block appearance-none w-full bg-gray-200 border border-[#D2B48C] text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#D2B48C]" 
                  id="grid-services"
                  name="decoracion"
                  value={formData.decoracion}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  <option value="Fecha_especial">Fecha especial</option>
                  <option value="Aniversario">Aniversario</option>
                  <option value="Cumpleanos">Cumpleaños</option>
                  <option value="Otro">Otro</option>
                </select>
              {errors.decoracion && <p className="error">{errors.decoracion}</p>}
            </div>
            <div className="container select-date-container">
              <div className="relative">
                <label>Tipo de Servicio</label>
                <select 
                  className="block appearance-none w-full bg-gray-200 border border-[#D2B48C] text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#D2B48C]" 
                  id="grid-services"
                  name="actividades"
                  value={formData.actividades}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  <option value="Pintura_escultura">Pintura de escultura</option>
                  <option value="Parques">Parques</option>
                  <option value="Dibujo_colores">Dibujo con colores</option>
                </select>
                {errors.actividades && <p className="error">{errors.actividades}</p>}
              </div>
              
              <div>
                <label>
                  <i className="fas fa-comments icon mr-2" />
                  Comentarios:
                </label>
                <input 
                  className='input-field'
                  id="grid-comments"
                  type="text"
                  name='comentarios' 
                  value={formData.comentarios}
                  onChange={handleChange} 
                />
                <p className="text-black-500 text-xs italic">Puedes escribir observaciones sobre tu reserva o peticiones adicionales(No estamos obligados a realizar estas peticiones extra)</p>
              </div>
            </div>

            <div className="terminos">
              <input
                id="aceptaTerminos"
                type="checkbox"
                name="terminos"
                checked={formData.terminos}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-black-100"
              />
              <label htmlFor="aceptaTerminos" className="text-gray-700 text-sm">
                Acepto los{' '}
                <button type="button" onClick={() => setMostrarModal(true)} className="text-black underline">
                  términos y condiciones
                </button>
              </label>
              {errors.terminos && <p className="error">{errors.terminos}</p>}
            </div>

            <button type="submit" className="continue-btn">Continuar</button>
          </form>
        </div>
      </section>

      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Términos y Condiciones</h2>
            <ul className="list-disc pl-4 text-sm mb-4 space-y-2">
              <li><strong>Reservas:</strong> Las reservas están sujetas a la disponibilidad y deben ser confirmadas por el restaurante. Puedes modificar o cancelar tu reserva con al menos 24 horas de antelación sin incurrir en penalizaciones. Cancelaciones tardías o no presentaciones pueden estar sujetas a cargos.</li>
              <li><strong>Pedidos:</strong> Los pedidos realizados a través del sistema son definitivos una vez confirmados. El restaurante no se hace responsable por errores en los pedidos debido a información incorrecta proporcionada por el usuario.</li>
              <li><strong>Productos:</strong> Los productos mostrados en el sistema están sujetos a disponibilidad. El restaurante se reserva el derecho de modificar o descontinuar productos sin previo aviso.</li>
              <li><strong>Eventos:</strong> La participación en eventos organizados por el restaurante está sujeta a los términos específicos del evento, que pueden incluir políticas de cancelación y reembolso.</li>
              <li><strong>Privacidad:</strong> Toda la información personal recopilada a través de este sistema será utilizada exclusivamente para gestionar tus reservas, pedidos, y participación en eventos. Nos comprometemos a proteger tu información y no compartirla con terceros sin tu consentimiento, excepto cuando sea necesario para el funcionamiento del sistema.</li>
              <li><strong>Cambios en los Términos:</strong> El restaurante se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Es tu responsabilidad revisar estos términos periódicamente para estar al tanto de cualquier cambio.</li>
            </ul>
            <p className="text-sm mb-4">
              Al continuar utilizando este sistema, confirmas que has leído y aceptado estos términos y condiciones.
            </p>

            <div className="flex justify-end space-x-4">
              <button onClick={manejarCancelarTerminos} className="bg-gray-500 text-white py-1 px-3 rounded-lg text-sm">Cancelar</button>
              <button onClick={manejarAceptarTerminos} className="bg-yellow-500 text-white py-1 px-3 rounded-lg text-sm">Aceptar</button>
            </div>
          </div>
        </div>
      )}
    
      <style>{`
        /* Estilos generales */
        .nombre {
          background-color: #f8f8f8;
        }

        .error {
          color: red;
          font-size: 0.875rem;
          margin-top: -10px;
          margin-bottom: 10px;
        }
        
        body {
            position: relative;
            margin: 0;
            height: 100%;
            width: 100%; /* Asegúrate de que el body ocupe toda la altura de la ventana */
        }

        .titulo {
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            font-size: 80px;
            color: Black;
            text-align: center;
            position: absolute;
            margin-top: -150px;
        }

        .background-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          filter: brightness(50%);
          z-index: -1;
        }

        .reservation-form {
          display: flex;
          justify-content: center; /* Alinea horizontalmente los cuadros */
          gap: 20px; /* Espacio entre los cuadros */
          padding-top: 10%; /* Ajuste para mover los cuadros hacia el centro verticalmente */
          padding-bottom: 60px; /* Espacio para que el botón no interfiera */
          position: relative;
          
        }
        
        .terminos {
            background-color: rgba(255, 255, 255, 0.5);
            padding: 20px;
            border: 2px solid gold;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            backdrop-filter: blur(10px);
            width: 300px; /* Ajuste consistente de tamaño */
            height: 80px;
            position: absolute;
            margin-top: 300px;
        }

        .container {
            background-color: rgba(255, 255, 255, 0.5);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            backdrop-filter: blur(10px);
            width: 400px; /* Ajuste consistente de tamaño */
            margin-top: -170px;
            margin-left: 50px;
            border: 2px solid gold;
        }

        h2 {
          color: #000;
          margin-bottom: 10px;
        }

        label {
          color: #000;
          display: block;
          margin-bottom: 5px;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 5px;
          border: 1px solid #ccc;
          text-align: center;
        }

        /* Botón de continuar */
        .continue-btn {
          position: absolute; /* Fijo en la parte inferior de la pantalla */
          bottom: 0;
          width: 100%; /* Ocupa todo el ancho */
          background-color: gold;
          color: #000000;
          padding: 15px 0;
          border: none;
          border-radius: 0;
          cursor: pointer;
          text-align: center;
          margin: -120px;
        }

        .continue-btn:hover {
           background-color: rgb(253, 216, 53);
        }
      `}</style>
    
    </div>
  );
};

export default ReservaLocal;
