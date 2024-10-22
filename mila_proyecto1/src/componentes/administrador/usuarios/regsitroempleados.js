import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const FormularioRegiEmp = () => {
  const [formData, setFormData] = useState({
    rol: '',
    nombre: '',
    apellido: '',
    telefono: '',
    numero_documento: '',
    tipo_documento: 'Cedula de ciudadania',
    barrio: '',
    email: '',
    contrasena: '',
    horario: '',
    titulo: '',
    estado: 'Activo'
  });

  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [showFields, setShowFields] = useState({
    horario: false,
    titulo: false
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'rol') {
      // Update showFields based on selected role
      setShowFields({
        horario: value === 'mesero',
        titulo: value === 'administrador'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Check if the user is already registered
      const response = await axios.get('http://localhost:3000/usuarios', {
        params: {
          numero_documento: formData.numero_documento,
          email: formData.email
        }
      });

      if (response.data.length > 0) {
        // User already exists
        Swal.fire({
          icon: 'error',
          title: 'Registro Fallido',
          text: 'El usuario ya está registrado con este número de documento o correo electrónico.',
          confirmButtonColor: '#3085d6',
        });
      } else {
        // Register new user
        await axios.post('http://localhost:3000/usuarios', formData);
        Swal.fire({
          icon: 'success',
          title: 'Registro Exitoso',
          text: 'Registro empleado exitoso .',
          confirmButtonColor: '#FFD700',
        }).then(() => {
          navigate('/consultausarios'); // Redirige al login o a donde sea necesario
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al registrar el usuario. Intenta nuevamente.',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  return (
    <div>


      <link rel="stylesheet" type="text/css" href="../estilos/estilos_barra.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      <style dangerouslySetInnerHTML={{ __html: `
        .espacio_imagen1 {
          background: linear-gradient(rgba(2,2,2,.7),rgba(0,0,0,.7)),url(https://i.ibb.co/j5LRZmB/Captura-de-pantalla-2024-07-29-135007.png) center center;
        }

        .imagen_formulario {
          background: linear-gradient(rgba(2, 2, 2, .7), rgba(0, 0, 0, .7)),url(https://i.ibb.co/nRVNh1H/En-mila-nuestras-tardes-se-ven-asi-ya-nos-conoces.jpg) center center;
        }
      `}} />
      <div className="h-screen flex flex-col lg:flex-row mt-36 mb-12">
        {/* Imagen de fondo */}
        <div className="hidden lg:flex w-full lg:w-1/2 espacio_imagen1 justify-around items-center mt-0">
          <div className="bg-black opacity-20 inset-0 z-0" />
          <div className="w-full mx-auto px-20 flex-col items-center space-y-6 mb-4 mt-32">
            <h1 className="text-white font-bold text-4xl font-sansc ml-28 font-normal text-yellow-300">Beneficios de Registrarse</h1>
            <ul className="text-white list-inside ml-20 text-1xl font-normal ml-28">
              <li><i className="fa-solid fa-check" style={{color: '#FFD43B', marginRight: '3%'}} />Invitaciones a Eventos Especiales</li>
              <li><i className="fa-solid fa-check" style={{color: '#FFD43B', marginRight: '3%'}} />Notificaciones y Recordatorios</li>
              <li><i className="fa-solid fa-check" style={{color: '#FFD43B', marginRight: '3%'}} />Podrás realizar tus reservas y cotizaciones</li>
              <li><i className="fa-solid fa-check" style={{color: '#FFD43B', marginRight: '3%'}} />Obtendrás descuentos al realizar tu pedido en línea</li>
            </ul>
          </div>
        </div>
        <div className="flex w-full lg:w-1/2 justify-center items-center imagen_formulario space-y-4 p-4 lg:p-6 mt-0">
          <div className="w-full max-w-2xl px-4 lg:px-6">
            <form id="registerForm" className="bg-white rounded-lg shadow-lg p-4 lg:p-6 space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-4 border border-gray-200 mt-6" onSubmit={handleSubmit}>
              <h1 className="text-gray-800 font-bold text-2xl col-span-2 text-center mb-0 pb-0">¡Regístrate!</h1>
              <p className="text-xs font-normal text-gray-600 col-span-2 text-center mb-0 pb-0">Ingresa tus datos personales</p>
              {/* Campo de selección de rol */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="rol" className="text-gray-700 font-semibold text-xs">Rol</label>
                <div className="flex items-center border-2 border-yellow-300 py-1 px-2 rounded-md w-full">
                  <select id="rol" name="rol" className="pl-2 w-full outline-none border-none rounded-md text-sm" value={formData.rol} onChange={handleChange} required>
                    <option value="" disabled>Selecciona tu rol</option>
                    <option value="mesero">Mesero</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>
              </div>
              {showFields.titulo && (
                <div className="flex flex-col space-y-1">
                  <label htmlFor="titulo" className="text-gray-700 font-semibold text-xs">Título</label>
                  <div className="flex items-center border-2 border-yellow-300 py-1 px-2 rounded-md w-full">
                    <i className="fas fa-tag text-gray-400" />
                    <input id="titulo" name="titulo" type="text" className="pl-2 w-full outline-none border-none rounded-md text-sm" value={formData.titulo} onChange={handleChange} required />
                  </div>
                </div>
              )}
            
              {showFields.horario && (
                <div className="flex flex-col space-y-1">
                  <label htmlFor="horario" className="text-gray-700 font-semibold text-xs">Horario</label>
                  <div className="flex items-center border-2 border-yellow-300 py-1 px-2 rounded-md w-full">
                    <i className="fas fa-clock text-gray-400" />
                    <input id="horario" name="horario" type="text" className="pl-2 w-full outline-none border-none rounded-md text-sm" value={formData.horario} onChange={handleChange} required />
                  </div>
                </div>
              )}
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
                <label htmlFor="telefono" className="text-gray-700 font-semibold text-xs">Teléfono</label>
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
                <label htmlFor="numero_documento" className="text-gray-700 font-semibold text-xs">Número de Documento</label>
                <div className="relative">
                  <i className="fa-solid fa-id-card absolute left-2 top-2/4 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="numero_documento"
                    type="text"  // Cambiar a tipo "text" para permitir validación personalizada
                    name="numero_documento"
                    value={formData.numero_documento}
                    onChange={handleChange}
                    onInput={(e) => {
                      // Permitir solo números y limitar la longitud
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      if (value.length <= 12) {
                        e.target.value = value;
                      } else {
                        e.target.value = value.slice(0, 12);
                      }
                    }}
                    minLength={8}
                    maxLength={12}
                    pattern="\d{8,12}"  // Asegura que el valor tenga entre 8 y 12 dígitos
                    title="Número de documento válido entre 8 y 12 dígitos"
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
                  <option value="Cedula de extranjeria">Cedula de extranjeria</option>
                </select>
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
                    minLength={15}
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


              <div className="flex flex-col text-xs text-gray-600 space-y-1  ">
                <p>Requisitos de la contraseña:</p>
                  <ul className="list-disc pl-4">
                    <li>Entre 6 y 10 caracteres, incluir letras, numeros y simbolos </li>
                  </ul>
              </div>

              {/* Submit button */}
              <div className="col-span-2 flex justify-center">
                <button type="submit" className="bg-yellow-400 text-white font-bold py-2 px-4 rounded-md hover:bg-yellow-500">
                  Registrarse
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FormularioRegiEmp;
