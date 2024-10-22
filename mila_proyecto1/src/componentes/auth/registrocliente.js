import React, {  useContext,useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs';


const FormularioRegistro = () => {
  const { setRole } = useContext(UserContext); 

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    numero_documento: '',
    tipo_documento: 'Cedula de ciudadania',
    direccion: '',
    barrio: '',
    email: '',
    contrasena: '',
    rol: 'Cliente',
    estado: 'Activo',
    aceptaTerminos: false,
  });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const navigate = useNavigate();

  const manejarAceptarTerminos = () => {
    setFormData({ ...formData, aceptaTerminos: true });
    setMostrarModal(false);
  };
  
  const manejarCancelarTerminos = () => {
    setMostrarModal(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Validación condicional para el campo número de documento
    if (name === 'tipo_documento') {
      // Si el tipo de documento es "Cedula de extranjeria", aplicar validación especial
      if (value === 'Cedula de extranjeria') {
        validateNumeroDocumento(formData.numero_documento, 'Cedula de extranjeria');
      }
    }
  };

  const validateNumeroDocumento = (numeroDocumento, tipoDocumento) => {
    let regex;
    if (tipoDocumento === 'Cedula de extranjeria') {
      regex = /^[A-Z0-9]{7,10}$/i; // Ajusta según el formato específico para "Cédula de extranjería"
    } else {
      regex = /^\d{8,12}$/; // Para otros tipos de documentos
    }
    if (!regex.test(numeroDocumento)) {
      // Manejo de error o estado de validación
      console.error('Número de documento inválido para el tipo de documento seleccionado.');
    }
  };


  const validateForm = () => {
    const { nombre, apellido, telefono, numero_documento, direccion, barrio, email, contrasena } = formData;
    const errors = [];

    // Validación de nombre
    if (nombre.length > 15) errors.push('El nombre debe tener máximo 15 caracteres.');
    
    // Validación de apellido
    if (apellido.length > 20) errors.push('El apellido debe tener máximo 20 caracteres.');

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.push('El correo electrónico no es válido.');

    // Validación de teléfono
    if (!/^[0-9]{10}$/.test(telefono)) errors.push('El teléfono debe tener 10 dígitos.');

    const direccionRegex = /^(Calle|Cll|Carrera|Cra|Avenida|Av|Transversal|Tv|Diagonal|Dg)\s.*$/i;
    const caracteresValidos = /^[a-zA-Z0-9\s#.-]*$/;

    if (!direccionRegex.test(direccion)) {
      errors.push('La dirección debe comenzar con una palabra clave válida como Calle, Carrera, Avenida, etc.');
    } else if (!caracteresValidos.test(direccion)) {
      errors.push('La dirección contiene caracteres no válidos.');
    }
    
    // Validación de barrio
    if (/[^a-zA-Z\s]/.test(barrio)) errors.push('El barrio solo debe contener letras.');

    // Validación de número de documento
    if (formData.tipo_documento === 'Cedula de extranjeria') {
      if (numero_documento.length < 7 || numero_documento.length > 10) errors.push('El número de documento para cédula de extranjería debe tener entre 7 y 10 caracteres.');
    } else {
      if (numero_documento.length < 8 || numero_documento.length > 12) errors.push('El número de documento debe tener entre 8 y 12 caracteres.');
    }
    // Validación de contraseña
    const contrasenaRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{6,10}$/;
    if (!contrasenaRegex.test(contrasena)) errors.push('La contraseña debe tener entre 6 y 10 caracteres e incluir letras, números y símbolos.');

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Errores de Validación',
        text: validationErrors.join(' '),
      });
      return;
    }

    if (!formData.aceptaTerminos) {
      setMostrarModal(true);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/usuarios?email=${encodeURIComponent(formData.email)}`);
      const existingEmails = response.data;

      const documentoResponse = await axios.get(`http://localhost:3000/usuarios?numero_documento=${encodeURIComponent(formData.numero_documento)}`);
      const existingDocumentos = documentoResponse.data;

      if (existingEmails.length > 0 || existingDocumentos.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El usuario ya está registrado. Por favor, usa otro correo electrónico o número de documento.',
        });
        setFormData({
          nombre: '',
          apellido: '',
          telefono: '',
          numero_documento: '',
          tipo_documento: 'Cedula de ciudadania',
          direccion: '',
          barrio: '',
          email: '',
          contrasena: '',
          aceptaTerminos: false,
        });
      } else {
          // Encripta la contraseña antes de enviarla
        const contrasenaEncriptada = await bcrypt.hash(formData.contrasena, 10);
        
        // Establece el rol como 'Cliente'
        const formDataWithRole = { ...formData, rol: 'Cliente', contrasena: contrasenaEncriptada };


        const registerResponse = await axios.post('http://localhost:3000/usuarios', formDataWithRole);

        if (registerResponse.status === 201) {
          const { id, nombre, rol } = registerResponse.data;
      
          
          localStorage.setItem('userId', id);
          localStorage.setItem('name', nombre);
          localStorage.setItem('role', rol);
      
          
          setRole(rol);
      
          Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Registro exitoso.',
          }).then(() => {
              navigate('/'); 
          });
      }
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema con la verificación del usuario.',
      });
    }
  };

  return (
    <div>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/png" href="https://i.ibb.co/gj0Bpcc/logo-empresa-mila.png" />
      <title>Pagina de Registro -- Mila GastroFusion</title>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@400;700&display=swap" rel="stylesheet" />
      <link href="https://cdn.tailwindcss.com" rel="stylesheet" />
      <link rel="stylesheet" type="text/css" href="../estilos/estilos_barra.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      <style>
        {`
          .espacio_imagen1 {
            background: linear-gradient(rgba(2,2,2,.7),rgba(0,0,0,.7)),url(https://i.ibb.co/j5LRZmB/Captura-de-pantalla-2024-07-29-135007.png) center center;
          }
          .imagen_formulario {
            background: linear-gradient(rgba(2, 2, 2, .7), rgba(0, 0, 0, .7)),url(https://i.ibb.co/nRVNh1H/En-mila-nuestras-tardes-se-ven-asi-ya-nos-conoces.jpg) center center;
          }
          body {
            font-family: 'Lato', sans-serif;
          }
        `}
      </style>
      <div className="h-screen flex flex-col lg:flex-row mt-0  mb-6" style={{ height:'150%' }} >
        <div className="hidden lg:flex w-full lg:w-1/2 espacio_imagen1 justify-around items-center ">
          <div className="bg-black opacity-20 inset-0 z-0" />
          <div className="w-full mx-auto px-6 lg:px-16 flex-col items-center space-y-6 mb-4">
            <h1 className="text-white font-bold text-4xl font-sans ml-8 lg:ml-28 font-normal text-yellow-300">Beneficios de Registrarse</h1>
            <ul className="text-white list-none list-inside text-xl font-normal ml-8 lg:ml-28">
              <li><i className="fa-solid fa-check" style={{ color: '#FFD43B', marginRight: '3%' }} /> Invitaciones a Eventos Especiales</li>
              <li><i className="fa-solid fa-check" style={{ color: '#FFD43B', marginRight: '3%' }} /> Notificaciones y Recordatorios</li>
              <li><i className="fa-solid fa-check" style={{ color: '#FFD43B', marginRight: '3%' }} /> Podrás realizar tus reservas y cotizaciones</li>
              <li><i className="fa-solid fa-check" style={{ color: '#FFD43B', marginRight: '3%' }} /> Realizaras mas rapido tus pedidos </li>
            </ul>
          </div>
        </div>
        <div className="flex w-full lg:w-1/2 justify-center items-center imagen_formulario p-4 lg:p-6">
          <div className="w-full max-w-lg lg:max-w-2xl px-4 lg:px-6 bg-white rounded-lg shadow-lg p-4 space-y-4 overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <h1 className="text-gray-800 font-bold text-2xl col-span-2 text-center mb-0">¡Regístrate!</h1>
              <p className="text-xs font-normal text-gray-600 col-span-2 text-center mt-0">Ingresa tus datos personales</p>

              {/* Nombre */}
              <div className="flex flex-col space-y-1 relative">
                <label htmlFor="nombre" className="text-gray-700 font-semibold text-xs">Nombre</label>
                <div className="relative">
                  <i className="fa-solid fa-user absolute left-2 top-2/4 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    onInput={(e) => {
                      // Elimina cualquier caracter no válido (números, caracteres especiales, etc.)
                      e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    }}
                    minLength={4}
                    maxLength={15}
                    pattern="^[A-Za-z\s]+$"
                    title="Solo letras, entre 4 y 15 caracteres"
                    className="pl-10 pr-2 border-2 border-yellow-300 py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1 relative">
                <label htmlFor="apellido" className="text-gray-700 font-semibold text-xs">Apellido</label>
                <div className="relative">
                  <i className="fa-solid fa-user-tag absolute left-3 top-2/4 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="apellido"
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    onInput={(e) => {
                      // Elimina cualquier caracter no válido (números, caracteres especiales, etc.)
                      e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    }}
                    minLength={4}
                    maxLength={20}
                    pattern="^[A-Za-z\s]+$"
                    title="Solo letras, entre 4 y 20 caracteres"
                    className="pl-12 pr-2 border-2 border-yellow-300 py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full"
                    required
                  />
                </div>
              </div>


              <div className="flex flex-col space-y-1 relative">
                <label htmlFor="telefono" className="text-gray-700 font-semibold text-xs">Celular</label>
                <div className="relative">
                  <i className="fa-solid fa-phone absolute left-2 top-2/4 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="telefono"
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    onInput={(e) => {
                      // Permitir solo números y limitar a un máximo de 10 caracteres
                      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    }}
                    maxLength={10}
                    pattern="^3\d{9}$"
                    title="Número de teléfono de 10 dígitos que comience con 3"
                    className="pl-10 pr-2 border-2 border-yellow-300 py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1 relative">
                <label htmlFor="tipo_documento" className="text-gray-700 font-semibold text-xs">Tipo de Documento</label>
                <select
                  id="tipo_documento"
                  name="tipo_documento"
                  value={formData.tipo_documento}
                  onChange={handleChange}
                  required
                  className="border-2 border-yellow-300 py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full"
                >
                  <option value="Cedula de ciudadania">Cédula de Ciudadanía</option>
                  <option value="Cedula de extranjeria">Cédula de Extranjería</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1 relative">
                <label htmlFor="numero_documento" className="text-gray-700 font-semibold text-xs">Número de Documento</label>
                <div className="relative">
                  <i className="fa-solid fa-id-card absolute left-2 top-2/4 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="numero_documento"
                    type="text"
                    name="numero_documento"
                    value={formData.numero_documento}
                    onChange={(e) => {
                      handleChange(e);
                      const tipoDocumento = formData.tipo_documento;
                      if (tipoDocumento === 'Cedula de extranjeria') {
                        validateNumeroDocumento(e.target.value, tipoDocumento);
                      }
                    }}
                    onInput={(e) => {
                      const tipoDocumento = formData.tipo_documento;
                      let value = e.target.value;

                      if (tipoDocumento === 'Cedula de extranjeria') {
                        // Permitir letras y números, limitar a 12 caracteres
                        value = value.replace(/[^A-Z0-9]/gi, '').slice(0, 12);
                      } else {
                        // Permitir solo números, limitar a 12 caracteres
                        value = value.replace(/[^0-9]/g, '').slice(0, 12);
                      }

                      e.target.value = value;
                    }}
                    minLength={8}
                    maxLength={12}
                    pattern={formData.tipo_documento === 'Cedula de extranjeria' ? '[A-Z0-9]{7,12}' : '[0-9]{8,12}'}
                    title={formData.tipo_documento === 'Cedula de extranjeria' ? 'Número de documento válido entre 7 y 12 caracteres alfanuméricos' : 'Número de documento válido entre 8 y 12 dígitos'}
                    className="pl-10 pr-2 border-2 border-yellow-300 py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full"
                    required
                  />
                </div>
              </div>




              <div className="flex flex-col space-y-1 relative">
                <label htmlFor="direccion" className="text-gray-700 font-semibold text-xs">Dirección</label>
                <div className="relative">
                  <i className="fa-solid fa-home absolute left-2 top-2/4 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="direccion"
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    onInput={(e) => {
                      // Permitir solo caracteres válidos para direcciones
                      e.target.value = e.target.value.replace(/[^a-zA-Z0-9\s#.-]/g, '');
                    }}
                    maxLength={50}
                    className="pl-10 pr-2 border-2 border-yellow-300 py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full"
                    required
                  />
                </div>
              </div>




              <div className="flex flex-col space-y-1 relative">
                <label htmlFor="barrio" className="text-gray-700 font-semibold text-xs">Barrio</label>
                <div className="relative">
                  <i className="fa-solid fa-map-marker-alt absolute left-2 top-2/4 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="barrio"
                    type="text"
                    name="barrio"
                    value={formData.barrio}
                    onChange={handleChange}
                    onInput={(e) => {
                      // Elimina cualquier caracter no válido (números, caracteres especiales, etc.)
                      e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    }}
                    maxLength={30}
                    className="pl-10 pr-2 border-2 border-yellow-300 py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1 relative">
                <label htmlFor="email" className="text-gray-700 font-semibold text-xs">Email</label>
                <div className="relative">
                  <i className="fa-solid fa-envelope absolute left-2 top-2/4 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onInput={(e) => {
                      // Limita la longitud del campo de entrada
                      const value = e.target.value;
                      if (value.length > 55) {
                        e.target.value = value.slice(0, 55);
                      }
                    }}
                    minLength={5}
                    maxLength={55}
                    pattern=".{15,55}"
                    title="El email debe tener entre 15 y 55 caracteres"
                    className="pl-10 pr-2 border-2 border-yellow-300 py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full"
                    required
                  />
                </div>
              </div>


              <div className="flex flex-col space-y-1 relative">
                <label htmlFor="contrasena" className="text-gray-700 font-semibold text-xs">Contraseña</label>
                <div className="flex items-start space-x-4">
                  <div className="relative flex-1">
                    <i
                      className={`fa-solid ${mostrarContrasena ? 'fa-eye-slash' : 'fa-eye'} absolute left-2 top-2/4 transform -translate-y-1/2 text-gray-400 cursor-pointer`}
                      onClick={() => setMostrarContrasena(!mostrarContrasena)}
                    />
                    <input
                      id="contrasena"
                      type={mostrarContrasena ? 'text' : 'password'}
                      name="contrasena"
                      value={formData.contrasena}
                      onChange={handleChange}
                      minLength={6}
                      maxLength={10}
                      pattern=".{6,10}"
                      title="La contraseña debe tener entre 6 y 10 caracteres"
                      className="pl-10 pr-2 border-2 border-yellow-300 py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full"
                      required
                    />
                  </div>
                </div>
              </div>


              <div className="flex flex-col text-xs text-gray-800 space-y-1 mt-2">
                <p className="font-semibold text-sm">Requisitos de la contraseña:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li className="text-xs">Entre 6 y 10 caracteres, incluir letras, números y símbolos.</li>
                </ul>
              </div>


              <div className="flex flex-col space-y-4 col-span-2 mt-2">
                <div className="flex items-center space-x-4">
                  <input
                    id="aceptaTerminos"
                    type="checkbox"
                    name="aceptaTerminos"
                    checked={formData.aceptaTerminos}
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4 text-yellow-600"
                  />
                  <label htmlFor="aceptaTerminos" className="text-gray-700 text-sm">
                    Acepto los{' '}
                    <button type="button" onClick={() => setMostrarModal(true)} className="text-yellow-500 underline">
                      términos y condiciones
                    </button>
                  </label>
                </div>

                <p className="text-sm text-center">
                  ¿Ya tienes una cuenta?{' '}
                  <a href="/login" className="text-yellow-500 font-semibold hover:underline flex items-center justify-center">
                    <i className="fa-solid fa-sign-in-alt mr-2"></i> Ingresa aquí
                  </a>
                </p>

                <button
                  type="submit"
                  disabled={!formData.aceptaTerminos}
                  className={`bg-yellow-500 text-white py-2 px-12 rounded-lg font-semibold text-sm mx-auto ${!formData.aceptaTerminos ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  Registrarse
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/2 lg:w-1/3 ml-20 " style={{ width:'45%' }}>
            <h2 className="text-lg font-bold mb-4">Términos y Condiciones</h2>
            <p className="text-sm mb-4">Al utilizar este sistema, aceptas los siguientes términos y condiciones:</p>
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

    </div>
  );
};

export default FormularioRegistro;
