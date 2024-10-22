import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faList, faCamera, faTimes } from "@fortawesome/free-solid-svg-icons";
import BarraAdmin from "../../barras/BarraAdministrador";
import Footer from "../../../componentes/Footer/footer";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import axios from "axios";

const EditarEventos = () => {
  const { id } = useParams(); // Cambié eventoId a id
  
  const [formData, setFormData] = useState({
    nombre: "",
    fecha: "",
    descripcion: "",
    imagen: "",
    categoria: "",
    estado: "activo",
    fechaRegistro: new Date().toISOString(),
    estadoEvento: "abierto",
    cantidadCupos: "",
    inscritos: [],
    precioins: "",
  });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/eventos/${id}`); // Usando id directamente
        const eventData = response.data;

        setFormData((prevFormData) => ({
          ...prevFormData,
          nombre: eventData.nombre || '',
          fecha: eventData.fecha || '',
          descripcion: eventData.descripcion || '',
          imagen: eventData.imagen || '',
          categoria: eventData.categoria || '',
          fechaRegistro: eventData.fechaRegistro || '',
          estadoEvento: eventData.estadoEvento || '',
          cantidadCupos: eventData.cantidadCupos || '',
          inscritos: eventData.inscritos || [],
          precioins: eventData.precioins || '',
        }));
      } catch (error) {
        console.error('Error al obtener los datos del evento', error);
        Swal.fire('Error', 'No se pudo cargar los datos del evento', 'error');
      }
    };

    if (id) { // Asegúrate de que id no sea null
      fetchEventData();
    } else {
      Swal.fire('Error', 'ID del evento no válido', 'error');
    }
  }, [id]); // Asegúrate de que se use id


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleClearImageURL = () => {
    setFormData((prevState) => ({ ...prevState, imagen: "" }));
  };

  const isValidURL = (url) => {
    try {
      const parsedUrl = new URL(url);
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
      const urlExtension = parsedUrl.pathname.split('.').pop().toLowerCase();
      return imageExtensions.includes(urlExtension);
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.fecha || !formData.categoria || !formData.descripcion || !formData.imagen || !formData.estadoEvento || !formData.cantidadCupos) {
      Swal.fire("Error", "Por favor completa todos los campos", "error");
      return;
    }

    const selectedDate = new Date(formData.fecha);
    if (selectedDate.getDay() === 0) {
      return Swal.fire('Error', 'No se pueden seleccionar eventos en domingo.', 'error');
    }

    if (!isValidURL(formData.imagen)) {
      Swal.fire("Error", "El enlace de la imagen no es válido", "error");
      return;
    }

    if (formData.descripcion.length > 300) {
      Swal.fire("Error", "La descripción no puede exceder los 300 caracteres", "error");
      return;
    }

    if (/[^a-zA-Z\s]/.test(formData.nombre) || formData.nombre.length > 70) {
      Swal.fire("Error", "El nombre solo puede contener letras y no exceder los 70 caracteres", "error");
      return;
    }

    if (isNaN(formData.cantidadCupos) || formData.cantidadCupos < 12 || formData.cantidadCupos > 50) {
      Swal.fire("Error", "La cantidad de cupos debe ser mayor a 12 y menor a 50", "error");
      return;
    }

    if (isNaN(formData.precioins) || formData.precioins < 15000 || formData.precioins > 200000) {
      Swal.fire("Error", "El precio de inscripción debe estar dentro de los parámetros establecidos (15.000 y 200.000)", "error");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/eventos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire("Éxito", "Evento actualizado exitosamente", "success");
      } else {
        Swal.fire("Error", "Ocurrió un error al actualizar el evento", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error en la conexión con el servidor", "error");
    }
  };

  return (
    <div className="min-w-screen min-h-screen bg-gray-100 flex flex-col justify-between">
      <BarraAdmin />
      <div className="bg-white text-gray-700 -mt-8 border-2 border-yellow-400 rounded-3xl shadow-xl w-full max-w-7xl mx-auto overflow-hidden my-6">
        <div className="md:flex w-full">
          <div className="w-full md:w-1/2 h-64 py-6 px-6 flex justify-center items-center mt-48">
            {formData.imagen ? (
              <img
                src={formData.imagen}
                alt="Evento"
                className="w-full h-auto object-cover"
              />
            ) : (
              <p className="text-center text-gray-900 text-2xl">Previsualización de imagen</p>
            )}
          </div>

          <div className="w-full md:w-1/2 py-6 px-4 md:px-6 shadow-lg">
            <div className="text-center mb-6">
              <h1 className="font-bold text-2xl text-yellow-600">Editar Evento</h1>
              <p className="mt-1 text-gray-600">Modifica los detalles del evento</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full md:w-1/3 px-3 mb-4 relative">
                  <label htmlFor="nombre" className="text-gray-900 font-semibold px-1">Nombre</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faCalendar} className="absolute left-3 top-3 text-yellow-500" />
                    <input
                      type="text"
                      name="nombre"
                      id="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                      placeholder="Ej. Cumpleaños mila"
                      maxLength="70"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/3 px-3 mb-4 relative">
                  <label htmlFor="fecha" className="text-gray-900 font-semibold px-1">Fecha</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faCalendar} className="absolute left-3 top-3 text-yellow-500" />
                    <input
                      type="date"
                      name="fecha"
                      id="fecha"
                      value={formData.fecha}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      max={new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/3 px-3 mb-4 relative">
                  <label htmlFor="categoria" className="text-gray-900 font-semibold px-1">Categoría</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faList} className="absolute left-3 top-3 text-yellow-500" />
                    <select
                      name="categoria"
                      id="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                    >
                      <option value="">Seleccione una categoría</option>
                      <option value="charlas">Charlas</option>
                      <option value="teatro">Teatro</option>
                      <option value="deportes">Deportes</option>
                      <option value="culturales">Culturales</option>
                      <option value="festivales">Infantiles</option>
                    </select>
                  </div>
                </div>
                <div className="w-full md:w-1/2 px-3 mb-4 relative">
                  <label htmlFor="estadoEvento" className="text-gray-900 font-semibold px-1">Estado del Evento</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faList} className="absolute left-3 top-3 text-yellow-500" />
                    <select
                      name="estadoEvento"
                      id="estadoEvento"
                      value={formData.estadoEvento}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                    >
                      <option value="abierto">Abierto</option>
                      <option value="cerrado">Cerrado</option>
                      <option value="proximo">Próximo</option>
                    </select>
                  </div>
                </div>
                <div className="w-full md:w-1/2 px-3 mb-4 relative">
                  <label htmlFor="cantidadCupos" className="text-gray-900 font-semibold px-1">Cantidad de Cupos</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faList} className="absolute left-3 top-3 text-yellow-500" />
                    <input
                      type="number"
                      name="cantidadCupos"
                      id="cantidadCupos"
                      value={formData.cantidadCupos}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                      placeholder="Cantidad de cupos disponibles"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 px-3 mb-4 relative">
                  <label htmlFor="precioins" className="text-gray-900 font-semibold px-1">Precio Inscripción</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faList} className="absolute left-3 top-3 text-yellow-500" />
                    <input
                      type="number"
                      name="precioins"
                      id="precioins"
                      value={formData.precioins}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                      placeholder="Define un precio de inscripción"
                    />
                  </div>
                </div>
                <div className="w-full px-3 mb-4 relative">
                  <label htmlFor="descripcion" className="text-gray-900 font-semibold px-1">Descripción</label>
                  <textarea
                    name="descripcion"
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="w-full h-32 pl-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                    placeholder="Descripción del evento"
                    maxLength="300"
                  />
                  <p className="text-gray-600 mt-1 text-sm">Máximo 300 caracteres</p>
                </div>
                <div className="w-full px-3 mb-4 relative">
                  <label htmlFor="imagen" className="text-gray-900 font-semibold px-1">Imagen</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faCamera} className="absolute left-3 top-3 text-yellow-500" />
                    <input
                      type="text"
                      name="imagen"
                      id="imagen"
                      value={formData.imagen}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                      placeholder="https://example.com/imagen.jpg"
                    />
                    {formData.imagen && (
                      <button
                        type="button"
                        onClick={handleClearImageURL}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="bg-yellow-500 text-black px-6 py-2 rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300"
                >
                  Actualizar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarEventos;
