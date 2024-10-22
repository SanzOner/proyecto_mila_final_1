import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import BarraAdmin from '../../barras/BarraAdministrador';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const RegistroEventosAdmin = () => {
  // Estados
  const [eventos, setEventos] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('asc');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [eventosNoEncontrados, setEventosNoEncontrados] = useState(false);

  // Cargar eventos
  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const respuesta = await axios.get('http://localhost:3000/eventos');
        setEventos(respuesta.data);
        setEventosNoEncontrados(false);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar los eventos.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    };

    cargarEventos();
  }, []);

  // Filtrar y ordenar eventos
  const eventosFiltrados = eventos
    .filter(evento => {
      const coincideCategoria = categoria ? evento.categoria === categoria : true;
      const coincideBusqueda = evento.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase());
      const coincideEstado = estadoFiltro ? evento.estadoEvento === estadoFiltro : true;
      return coincideCategoria && coincideBusqueda && coincideEstado;
    })
    .sort((a, b) => {
      return ordenamiento === 'asc'
        ? new Date(a.fecha) - new Date(b.fecha)
        : new Date(b.fecha) - new Date(a.fecha);
    });

  // Actualizar estado de eventos no encontrados
  useEffect(() => {
    setEventosNoEncontrados(terminoBusqueda && eventosFiltrados.length === 0);
  }, [terminoBusqueda, eventosFiltrados]);

  // Manejar eliminación de eventos
  const handleDelete = async (eventoId) => {
    const confirmDelete = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Este evento se eliminará permanentemente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/eventos/${eventoId}`);
        setEventos(eventos.filter(evento => evento.id !== eventoId));
        Swal.fire('Éxito', 'Evento eliminado exitosamente', 'success');
      } catch (error) {
        console.error('Error al eliminar evento:', error);
        Swal.fire('Error', 'Ocurrió un error al eliminar el evento', 'error');
      }
    }
  };

  // Generar reporte PDF
  const handleGenerateReport = () => {
    if (eventosFiltrados.length === 0) {
      Swal.fire('No hay eventos para generar el reporte', '', 'info');
      return;
    }

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Configuración de fuentes y colores
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);

    // Agregar logo
    const logoWidth = 30;
    const logoHeight = 30;
    // Reemplazar con tu logo real
    const logoUrl = 'https://i.ibb.co/gj0Bpcc/logo-empresa-mila.png';
    doc.addImage(logoUrl, 'PNG', 10, 10, logoWidth, logoHeight);

    // Título del documento con información de filtros
    doc.setFontSize(22);
    doc.setFont('helvetica', 'normal');
    doc.text('Reporte de Eventos', 105, 25, { align: 'center' });

    // Subtítulo con filtros aplicados
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    let filtrosAplicados = [];
    if (categoria) filtrosAplicados.push(`Categoría: ${categoria}`);
    if (estadoFiltro) filtrosAplicados.push(`Estado: ${estadoFiltro}`);
    if (terminoBusqueda) filtrosAplicados.push(`Búsqueda: "${terminoBusqueda}"`);
    if (filtrosAplicados.length > 0) {
      doc.text(`Filtros aplicados: ${filtrosAplicados.join(' | ')}`, 105, 35, { align: 'center' });
    }

    // Fecha y hora del reporte
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleString()}`, 105, 42, { align: 'center' });

    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(10, 45, 200, 45);

    // Configurar la tabla
    const tableColumn = ["Nombre", "Fecha", "Estado", "Cupos", "Categoría"];
    const tableRows = eventosFiltrados.map(evento => [
      evento.nombre,
      new Date(evento.fecha).toLocaleDateString(),
      evento.estadoEvento,
      evento.cantidadCupos.toString(),
      evento.categoria
    ]);

    // Agregar tabla con estilo
    doc.autoTable({
      startY: 50,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [241, 196, 15],
        textColor: [0, 0, 0],
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [51, 51, 51],
        lineWidth: 0.5,
        lineColor: [200, 200, 200]
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 50, bottom: 50 },
      didDrawPage: function (data) {
        // Agregar número de página
        doc.setFontSize(10);
        doc.text(
          `Página ${data.pageNumber} de ${doc.internal.getNumberOfPages()}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      }
    });

    // Agregar resumen al final
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Resumen:`, 10, finalY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total de eventos: ${eventosFiltrados.length}`, 10, finalY + 7);

    // Guardar el PDF
    const fileName = `Reporte_Eventos${categoria ? '_' + categoria : ''}${estadoFiltro ? '_' + estadoFiltro : ''}.pdf`;
    doc.save(fileName);
  };

  // Componente de Tarjeta de Evento
  const TarjetaEvento = ({ evento }) => {
    return (
      <div className="rounded overflow-hidden shadow-lg flex flex-col transform hover:scale-105 transition duration-300 ease-in-out mt-12">
        <div className="relative">
          <img className="w-full h-48 object-cover" src={evento.imagen} alt={evento.nombre} />
          <div className="absolute inset-0 bg-gray-900 opacity-25 hover:bg-transparent transition duration-300"></div>
          <span className="text-xs absolute top-0 right-0 bg-yellow-500 px-4 py-2 text-black mt-3 mr-3 rounded-lg">
            {evento.categoria}
          </span>
        </div>
        <div className="px-6 py-4 flex-1">
          <h3 className="font-medium text-lg inline-block hover:text-yellow-500 transition duration-500 ease-in-out mb-2">
            {evento.nombre}
          </h3>
          <p className="text-gray-500 text-sm mb-2">{evento.descripcion}</p>
          <p className="text-gray-900 font-semibold text-lg">
            {new Date(evento.fecha).toLocaleDateString()}
          </p>
          <p className="text-gray-500 text-sm mt-2">Estado: {evento.estadoEvento}</p>
          <p className="text-gray-500 text-sm mt-2">Cupos Disponibles: {evento.cantidadCupos}</p>
        </div>
        <div className="px-6 py-3 flex items-center justify-between bg-gray-100">
          <Link
            to={`/EditarEventos/${evento.id}`}
            className="flex items-center bg-yellow-500 hover:bg-yellow-300 text-black px-4 py-2 rounded transition duration-500 ease-in-out"
          >
            <FontAwesomeIcon icon={faEdit} className="h-5 w-5 mr-2" />
            Editar
          </Link>
          <button
            onClick={() => handleDelete(evento.id)}
            className="flex items-center bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded transition duration-500 ease-in-out"
          >
            <FontAwesomeIcon icon={faTrash} className="h-5 w-5 mr-2" />
            Eliminar
          </button>
        </div>
      </div>
    );
  };

  // Renderizado principal
  return (
    <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
      <BarraAdmin />

      {/* Selector de Categoría */}
      <div className="border-b mb-5 flex justify-between text-sm">
        <div className="text-black flex items-center pb-2 pr-2 border-b-2 border-black uppercase">
          <span className="font-semibold inline-block">Seleccione una Categoría</span>
        </div>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="text-black hover:underline px-4 py-2 rounded border border-gray-300"
        >
          <option value="">Todas</option>
          {['charlas', 'teatro', 'deportes', 'culturales', 'festivales'].map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Barra de Filtros y Búsqueda */}
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
          onClick={() => setOrdenamiento(ordenamiento === 'asc' ? 'desc' : 'asc')}
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-300 transition duration-500 ease-in-out whitespace-nowrap"
        >
          Ordenar por fecha: {ordenamiento === 'asc' ? '↑' : '↓'}
        </button>

        <button
          onClick={handleGenerateReport}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 transition duration-500 ease-in-out flex items-center"
        >
          <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
          Generar Reporte PDF
        </button>
      </div>

      {/* Mensaje de No Resultados */}
      {eventosNoEncontrados ? (
        <p className="text-center text-gray-500 text-lg mt-8">
          No se encontraron eventos con el término de búsqueda.
        </p>
      ) : (
        <>
          {/* Lista de Eventos por Categoría */}
          {['charlas', 'teatro', 'deportes', 'culturales', 'festivales'].map(cat => (
            eventosFiltrados.filter(evento => evento.categoria === cat).length > 0 && (
              <div key={cat} className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-center text-black capitalize">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                  {eventosFiltrados
                    .filter(evento => evento.categoria === cat)
                    .map(evento => (
                      <TarjetaEvento key={evento.id} evento={evento} />
                    ))}
                </div>
              </div>
            )
          ))}
        </>
      )}
    </div>
  );
};

export default RegistroEventosAdmin;