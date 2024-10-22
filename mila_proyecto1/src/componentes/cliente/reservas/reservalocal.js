import React, { useEffect, useState } from 'react';
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
    horaFin: '',
    comentarios: '',
    tipoServicios: '',
    estado_reserva: 'Activa',
    tipo_reserva: 'reserva_local',
    terminos: false,
    userId: " ",
  });
  const [errors, setErrors] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const userId = localStorage.getItem('userId'); 

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
          numero_documento: userData.numero_documento || '',
          userId: userData.id || ''
        }));
      } catch (error) {
        console.error('Error al obtener los datos del usuario', error);
        Swal.fire('Error', 'No se pudo cargar los datos del usuario', 'error');
      }
    };
    fetchUserData();
  }, [userId]);

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();

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
    if (!formData.numeroPersonas.trim() || formData.numeroPersonas <= 0) {
      newErrors.numeroPersonas = 'El número de personas debe ser mayor a 0';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida.';
    } else {
      const selectedDate = new Date(formData.fecha);

      if (selectedDate.getDay() === 0) {
        newErrors.fecha = 'No se pueden hacer reservas en domingos.';
      }

      if (selectedDate < today.setHours(0, 0, 0, 0)) {
        newErrors.fecha = 'La fecha no puede ser en el pasado.';
      }
    }

    if (!formData.horaInicio.trim()) {
      newErrors.horaInicio = 'La hora de inicio es obligatoria';
    }
    if (!formData.horaFin.trim()) {
      newErrors.horaFin = 'La hora de fin es obligatoria';
    }

    if (formData.horaInicio && formData.horaFin) {
      const [inicioHours, inicioMinutes] = formData.horaInicio.split(':').map(Number);
      const [finHours, finMinutes] = formData.horaFin.split(':').map(Number);

      const selectedDate = new Date(formData.fecha); // Usa selectedDate aquí
      const inicio = new Date(selectedDate);
      inicio.setHours(inicioHours, inicioMinutes);

      const fin = new Date(selectedDate); // Usa selectedDate aquí
      fin.setHours(finHours, finMinutes);

      if (fin <= inicio) {
        newErrors.horaFin = 'La hora de fin debe ser después de la hora de inicio';
      }
    }

    if (!formData.tipoServicios.trim()) {
      newErrors.tipoServicios = 'Elige un tipo de servicio';
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

      const esDisponible = reservas.every((reserva) => {
        const reservaFecha = new Date(reserva.fecha);
        const reservaHoraInicio = new Date(reserva.fecha + 'T' + reserva.horaInicio);
        const reservaHoraFin = new Date(reserva.fecha + 'T' + reserva.horaFin);

        const fechaSolicitud = new Date(formData.fecha);
        const horaInicioSolicitud = new Date(formData.fecha + 'T' + formData.horaInicio);
        const horaFinSolicitud = new Date(formData.fecha + 'T' + formData.horaFin);

        return (
          (horaFinSolicitud <= reservaHoraInicio) || 
          (horaInicioSolicitud >= reservaHoraFin)    
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
    e.preventDefault();

    if (!validateForm()) return;

    const disponibilidad = await checkAvailability();
    if (!disponibilidad) {
      Swal.fire('Error', 'La fecha y hora solicitadas no están disponibles', 'error');
      return;
    }

    const reservaData = {
      ...formData,
      userId: userId,
    };

    try {
      console.log('Enviando datos:', formData);

      const response = await axios.post('http://localhost:3000/reservas', reservaData);

      Swal.fire('¡Éxito!', 'La reserva ha sido registrada correctamente', 'success');

      setFormData({
        nombre: '',
        celular: '',
        correo: '',
        numero_documento: '',
        numeroPersonas: '',
        fecha: '',
        horaInicio: '',
        horaFin: '',
        comentarios: '',
        tipoServicios: '',
        estado_reserva: 'Activa',
        tipo_reserva: 'reserva_local',
        terminos: false,
        userId: userId,
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
      <section className="min-h-screen relative">
        <div className="background-overlay"></div>
        <div className="reservation-form">
          <h2 className='titulo'>Personaliza la reserva del local</h2>
          <form id="reservation-form" className='reservation-form' onSubmit={handleSubmit}>
            <div className="container select-people-container">
              <h2>Datos del Usuario</h2>
              <label>Nombre:</label>
              <input
                className="text-center block appearance-none w-full bg-gray-200 border border-[#D2B48C] text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#D2B48C]"
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
              <input
                className="input-field"
                name="numeroPersonas"
                type="number"
                min="15"
                max="50"
                value={formData.numeroPersonas}
                onChange={handleChange}
                required
              />
              {errors.numeroPersonas && <p className="error">{errors.numeroPersonas}</p>}

              <label>Fecha:</label>
              <input
                className="input-field"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]} // Fecha de hoy
                max={new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]} // Último día del año
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

              <label>Hora Fin:</label>
              <input
                className="input-field"
                name="horaFin"
                type="time"
                value={formData.horaFin}
                onChange={handleChange}
                required
              />
              {errors.horaFin && <p className="error">{errors.horaFin}</p>}
            </div>
            <div className="container select-date-container">
              <div className="relative">
                <label>Tipo de Servicio</label>
                <select 
                  className="block appearance-none w-full bg-gray-200 border border-[#D2B48C] text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#D2B48C]" 
                  id="grid-services"
                  name="tipoServicios"
                  value={formData.tipoServicios}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  <option value="Licoreria">Licorería</option>
                  <option value="Decoracion">Decoración</option>
                  <option value="Iluminacion">Iluminación - Sonido</option>
                  <option value="Ninguno">Ninguno</option>
                </select>
                {errors.tipoServicios && <p className="error">{errors.tipoServicios}</p>}
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
