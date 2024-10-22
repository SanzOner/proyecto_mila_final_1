import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import BarraNormal from '../../barras/barra_normal'
import BarraCliente from '../../barras/BarraCliente';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const RegistroEventosCliente = () => {
  const [eventos, setEventos] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('asc'); // Estado para el orden (ascendente o descendente)
  const [estadoFiltro, setEstadoFiltro] = useState(''); // Filtro para el estado del evento
  const [eventosNoEncontrados, setEventosNoEncontrados] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para manejar autenticación
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    // Verifica si el usuario está autenticado (puedes modificar esto según tu lógica)
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);

    axios.get('http://localhost:3000/eventos') 
      .then(respuesta => {
        setEventos(respuesta.data);
        setEventosNoEncontrados(false); // Reiniciar el estado cuando se cargan eventos
      })
      .catch(error => {
        console.error('Error al cargar eventos:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar los eventos.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }, []);

  const eventosFiltrados = eventos
    .filter(evento => {
      const coincideCategoria = categoria ? evento.categoria === categoria : true;
      const coincideBusqueda = evento.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase());
      const coincideEstado = estadoFiltro ? evento.estadoEvento === estadoFiltro : true;
      return coincideCategoria && coincideBusqueda && coincideEstado;
    })
    .sort((a, b) => { // Ordenar eventos por fecha
      if (ordenamiento === 'asc') {
        return new Date(a.fecha) - new Date(b.fecha); // Orden ascendente
      } else {
        return new Date(b.fecha) - new Date(a.fecha); // Orden descendente
      }
    });

  useEffect(() => {
    setEventosNoEncontrados(terminoBusqueda && eventosFiltrados.length === 0);
  }, [terminoBusqueda, eventosFiltrados]);

  const eventosAgrupadosPorCategoria = eventosFiltrados.reduce((acumulador, evento) => {
    if (!acumulador[evento.categoria]) {
      acumulador[evento.categoria] = [];
    }
    acumulador[evento.categoria].push(evento);
    return acumulador;
  }, {});

  const handleInscripcion = async (evento) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Debes iniciar sesión',
        text: 'Por favor, regístrate o inicia sesión para inscribirte en eventos.',
        icon: 'warning',
        confirmButtonText: 'OK',
        preConfirm: () => {
          navigate('/FormularioRegistro'); // Redirige al formulario de registro
        }
      });
      return;
    }

    try {
      if (evento.cantidadCupos > 0) {
        const nuevaCantidadCupos = evento.cantidadCupos - 1;

        const response = await axios.put(`http://localhost:3000/eventos/${evento.id}`, {
          ...evento,
          cantidadCupos: nuevaCantidadCupos,
        });

        if (response.status === 200) {
          Swal.fire({
            title: 'Inscripción exitosa',
            text: 'Has ocupado un cupo del evento.',
            icon: 'success',
            confirmButtonText: 'OK'
          });

          setEventos(prevEventos =>
            prevEventos.map(ev =>
              ev.id === evento.id ? { ...ev, cantidadCupos: nuevaCantidadCupos } : ev
            )
          );
        }
      } else {
        Swal.fire({
          title: 'Lo sentimos',
          text: 'No hay cupos disponibles para este evento.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error al inscribirse:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo procesar tu inscripción.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const ordenCategorias = [
    'charlas',
    'teatro',
    'deportes',
    'culturales',
    'festivales'
  ];

  const TarjetaEvento = ({ evento }) => {
    



    return (
      
      <div className="rounded overflow-hidden shadow-lg flex flex-col transform hover:scale-105 transition duration-300 ease-in-out mt-12"> 
        
        
        <div className="relative">
          <img className="w-full" src={evento.imagen} alt={evento.nombre} />
          <div className="absolute inset-0 bg-gray-900 opacity-25 hover:bg-transparent transition duration-300"></div>
          <Link className="text-xs absolute top-0 right-0 bg-yellow-500 px-4 py-2 text-black mt-3 mr-3 no-underline transition duration-500 ease-in-out">
            {evento.categoria}
          </Link>
        </div>
        <div className="px-6 py-4 flex-1">
          <p className="font-medium text-lg inline-block transition duration-500 ease-in-out mb-2">{evento.nombre}</p>
          <p className="text-gray-500 text-sm mb-2">
            {evento.descripcion}
          </p>
          <p className="text-gray-900 font-semibold text-lg"> {new Date(evento.fecha).toLocaleDateString()} </p>
          <p className="text-gray-500 text-sm mt-2">Estado: {evento.estadoEvento}</p> {/* Mostrar estado del evento */}
          <p className="text-gray-500 text-sm mt-2">Cupos Disponibles: {evento.cantidadCupos}</p> {/* Mostrar cantidad de cupos */}
          <p className="text-gray-500 text-sm mt-2 hidden">ID: {evento.id}</p> 
        </div>
        <div className="px-6 py-3 flex items-center justify-between bg-gray-100">
        <button className="flex items-center bg-yellow-500 hover:bg-yellow-300 text-black px-4 py-2 rounded transition duration-500 ease-in-out"
          onClick={() => {
            localStorage.setItem('id', evento.id); 
            // Guardar el id del evento

            const nuevosCupos = parseInt(evento.cantidadCupos) - 1;

            if (nuevosCupos >= 0) {
              axios
                .patch(`http://localhost:3000/eventos/${evento.id}`, { cantidadCupos: nuevosCupos.toString() })
                .then(() => {
                  console.log('Cupo actualizado correctamente.');
                  // Redirigir al formulario de inscripción después de actualizar los cupos
                })
                .catch(error => {
                  console.error('Error al actualizar los cupos:', error);
                });
            } else {
              alert('No hay cupos disponibles.');
            }
          }}
        >
          <Link
            to="/FormularioInscripcion"
            className="flex items-center no-underline rounded text-black transition duration-500 ease-in-out"
          >
            <FontAwesomeIcon icon={faUserPlus} className="h-5 w-5 mr-2 text-black" />
            Inscribirse
          </Link>
        </button>
        </div>
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

      {/* Contenedor para el input de búsqueda, filtro por estado y el botón de ordenar */}
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
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className="text-black border border-gray-300 rounded px-4 py-2"
        >
          <option value="">Todos los estados</option>
          <option value="abierto">Abierto</option>
          <option value="cerrado">Cerrado</option>
          <option value="proximo">Próximo</option>
        </select>
        <button 
          onClick={() => setOrdenamiento(ordenamiento === 'asc' ? 'desc' : 'asc') }
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-300 transition duration-500 ease-in-out"
        >
          Ordenar por fecha: {ordenamiento === 'asc' ? 'Más Cercano a Más Lejano' : 'Más Lejano a Más Cercano'}
        </button>
      </div>

      {/* Mostrar mensaje si no se encontraron eventos después de la búsqueda */}
      {eventosNoEncontrados ? (
        <p className="text-center text-gray-500 text-lg">No se encontraron eventos con el término de búsqueda.</p>
      ) : (
        <>
          {/* Mostrar todas las categorías con sus eventos en el orden deseado */}
          {ordenCategorias.map(cat => (
            eventosAgrupadosPorCategoria[cat] && (
              <div key={cat} className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-center text-black capitalize">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </h2>
                <div className="border-b-2 border-yellow-500 mb-6"></div> {/* Línea amarilla más delgada */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                  {eventosAgrupadosPorCategoria[cat].map(evento => (
                    <TarjetaEvento key={evento.id} evento={evento} />
                  ))}
                </div>
              </div>
            )
          ))}
          
          {/* Mostrar eventos filtrados por categoría */}
          {categoria && !Object.keys(eventosAgrupadosPorCategoria).includes(categoria) && (
            <div>
              <h2 className="text-3xl font-bold mb-4 text-center text-black">
                {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
              </h2>
              <div className="border-b-2 border-yellow-500 mb-6"></div> {/* Línea amarilla más delgada */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {eventosFiltrados.length > 0 ? (
                  eventosFiltrados.map(evento => (
                    <TarjetaEvento key={evento.id} evento={evento} />
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-lg">No se encontraron eventos.</p> 
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RegistroEventosCliente;
