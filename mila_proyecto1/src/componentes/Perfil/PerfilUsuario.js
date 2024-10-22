import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhoneAlt, faIdCard, faHome, faMapMarkerAlt, faEnvelope, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const PerfilUsuario = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    numero_documento: '',
    tipo_documento: 'Cedula de ciudadania',
    direccion: '',
    barrio: '',
    email: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:3000/usuarios/${userId}`);
        const user = response.data;
        setFormData({
          nombre: user.nombre || '',
          apellido: user.apellido || '',
          telefono: user.telefono || '',
          numero_documento: user.numero_documento || '',
          tipo_documento: user.tipo_documento || 'Cedula de ciudadania',
          direccion: user.direccion || '',
          barrio: user.barrio || '',
          email: user.email || ''
        });
        setOriginalData({
          nombre: user.nombre || '',
          apellido: user.apellido || '',
          telefono: user.telefono || '',
          numero_documento: user.numero_documento || '',
          tipo_documento: user.tipo_documento || 'Cedula de ciudadania',
          direccion: user.direccion || '',
          barrio: user.barrio || '',
          email: user.email || ''
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        setIsLoading(false);
      }
    };

    obtenerDatosUsuario();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Validación condicional para el campo número de documento
    if (name === 'tipo_documento') {
      validateNumeroDocumento(formData.numero_documento, value);
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
      setErrors(prevErrors => ({
        ...prevErrors,
        numero_documento: tipoDocumento === 'Cedula de extranjeria' 
          ? 'Número de documento para cédula de extranjería debe tener entre 7 y 10 caracteres.' 
          : 'Número de documento debe tener entre 8 y 12 caracteres.'
      }));
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        numero_documento: ''
      }));
    }
  };

  const validateForm = () => {
    const { nombre, apellido, telefono, numero_documento, direccion, barrio, email } = formData;
    const newErrors = {};

    // Validación de nombre
    if (nombre.length > 15) newErrors.nombre = 'El nombre debe tener máximo 15 caracteres.';

    // Validación de apellido
    if (apellido.length > 20) newErrors.apellido = 'El apellido debe tener máximo 20 caracteres.';

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = 'El correo electrónico no es válido.';

    // Validación de teléfono
    if (!/^[0-9]{10}$/.test(telefono)) newErrors.telefono = 'El teléfono debe tener 10 dígitos.';

    // Validación de dirección
    const direccionRegex = /^(Calle|Cll|Carrera|Cra|Avenida|Av|Transversal|Tv|Diagonal|Dg)\s.*$/i;
    const caracteresValidos = /^[a-zA-Z0-9\s#.-]*$/;
    if (!direccionRegex.test(direccion)) {
      newErrors.direccion = 'La dirección debe comenzar con una palabra clave válida como Calle, Carrera, Avenida, etc.';
    } else if (!caracteresValidos.test(direccion)) {
      newErrors.direccion = 'La dirección contiene caracteres no válidos.';
    }

    // Validación de barrio
    if (/[^a-zA-Z\s]/.test(barrio)) newErrors.barrio = 'El barrio solo debe contener letras.';

    // Validación de número de documento
    if (formData.tipo_documento === 'Cedula de extranjeria') {
      if (numero_documento.length < 7 || numero_documento.length > 10) {
        newErrors.numero_documento = 'El número de documento para cédula de extranjería debe tener entre 7 y 10 caracteres.';
      }
    } else {
      if (numero_documento.length < 8 || numero_documento.length > 12) {
        newErrors.numero_documento = 'El número de documento debe tener entre 8 y 12 caracteres.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkIfDataExists = async () => {
    try {
      const response = await axios.get('http://localhost:3000/usuarios', {
        params: {
          numero_documento: formData.numero_documento,
          email: formData.email
        }
      });
      const { exists } = response.data;
      if (exists) {
        setErrors({
          ...errors,
          numero_documento: 'Número de documento ya registrado',
          email: 'Email ya registrado'
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error al verificar los datos:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const isDataUnique = await checkIfDataExists();
    if (!isDataUnique) return;

    axios.put(`http://localhost:3000/usuarios/${localStorage.getItem('userId')}`, formData)
      .then(() => {
        Swal.fire({
          title: 'Éxito',
          text: 'Datos actualizados correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        setIsEditing(false);
      })
      .catch(error => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al actualizar los datos',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.error("Hubo un error al actualizar los datos:", error);
      });
  };

  const handleCancel = () => {
    setFormData(originalData); // Restablece los datos originales
    setIsEditing(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h2 className="text-3xl font-semibold mb-4 text-gray-800 text-center">Perfil de Usuario</h2>
      <p className="text-gray-600 text-center mb-6">Aquí puedes actualizar tu información personal. Asegúrate de que todos los campos sean correctos antes de guardar.</p>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg border border-yellow-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="form-group relative">
            <FontAwesomeIcon icon={faUser} className="absolute top-3 left-3 text-gray-500" />
            <label className="block text-gray-700 font-medium mb-2 ml-12">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`mt-1 p-3 border ${errors.nombre ? 'border-red-500' : 'border-yellow-500'} rounded-lg w-full focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out`}
            />
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
          </div>
          <div className="form-group relative">
            <FontAwesomeIcon icon={faUser} className="absolute top-3 left-3 text-gray-500" />
            <label className="block text-gray-700 font-medium mb-2 ml-12">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className={`mt-1 p-3 border ${errors.apellido ? 'border-red-500' : 'border-yellow-500'} rounded-lg w-full focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out`}
            />
            {errors.apellido && <p className="text-red-500 text-sm">{errors.apellido}</p>}
          </div>

          <div className="form-group relative">
            <FontAwesomeIcon icon={faIdCard} className="absolute top-3 left-3 text-gray-500" />
            <label className="block text-gray-700 font-medium mb-2 ml-12">Tipo de Documento</label>
            <select
              name="tipo_documento"
              value={formData.tipo_documento}
              onChange={handleChange}
              className={`mt-1 p-3 border ${errors.tipo_documento ? 'border-red-500' : 'border-yellow-500'} rounded-lg w-full focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out`}
            >
              <option value="Cedula de ciudadania">Cédula de ciudadanía</option>
              <option value="Cedula de extranjeria">Cédula de extranjería</option>
              {/* Agrega más opciones según sea necesario */}
            </select>
            {errors.tipo_documento && <p className="text-red-500 text-sm">{errors.tipo_documento}</p>}
          </div>
          <div className="form-group relative">
            <FontAwesomeIcon icon={faIdCard} className="absolute top-3 left-3 text-gray-500" />
            <label className="block text-gray-700 font-medium mb-2 ml-12">Número de Documento</label>
            <input
              type="text"
              name="numero_documento"
              value={formData.numero_documento}
              onChange={handleChange}
              className={`mt-1 p-3 border ${errors.numero_documento ? 'border-red-500' : 'border-yellow-500'} rounded-lg w-full focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out`}
            />
            {errors.numero_documento && <p className="text-red-500 text-sm">{errors.numero_documento}</p>}
          </div>
          
          <div className="form-group relative">
            <FontAwesomeIcon icon={faPhoneAlt} className="absolute top-3 left-3 text-gray-500" />
            <label className="block text-gray-700 font-medium mb-2 ml-12">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className={`mt-1 p-3 border ${errors.telefono ? 'border-red-500' : 'border-yellow-500'} rounded-lg w-full focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out`}
            />
            {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
          </div>
          <div className="form-group relative">
            <FontAwesomeIcon icon={faHome} className="absolute top-3 left-3 text-gray-500" />
            <label className="block text-gray-700 font-medium mb-2 ml-12">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className={`mt-1 p-3 border ${errors.direccion ? 'border-red-500' : 'border-yellow-500'} rounded-lg w-full focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out`}
            />
            {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion}</p>}
          </div>
          <div className="form-group relative">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute top-3 left-3 text-gray-500" />
            <label className="block text-gray-700 font-medium mb-2 ml-12">Barrio</label>
            <input
              type="text"
              name="barrio"
              value={formData.barrio}
              onChange={handleChange}
              className={`mt-1 p-3 border ${errors.barrio ? 'border-red-500' : 'border-yellow-500'} border-2 rounded-lg w-full focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out`}
            />
            {errors.barrio && <p className="text-red-500 text-sm">{errors.barrio}</p>}
          </div>

          <div className="form-group relative">
            <FontAwesomeIcon icon={faEnvelope} className="absolute top-3 left-3 text-gray-500" />
            <label className="block text-gray-700 font-medium mb-2 ml-12">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 p-3 border ${errors.email ? 'border-red-500' : 'border-yellow-500'} rounded-lg w-full focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button type="button" onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Cancelar
          </button>
          <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PerfilUsuario;
