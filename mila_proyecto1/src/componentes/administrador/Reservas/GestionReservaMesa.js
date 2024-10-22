import React, { useState, useEffect } from 'react';
import Axios from 'axios';


const GestionReservaMesa = () => {
    const [reservas, setReservas] = useState([]);
    const [filteredReservas, setFilteredReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30;
    
    // Filtros de búsqueda
    const [filters, setFilters] = useState({
        numerodoc: '',
        fecha: '',
        horaInicio: '',
        numeroPersonas: '',
        tipo_reserva:''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get('http://localhost:3000/reservas');
                setReservas(response.data);
                setFilteredReservas(response.data); // Inicialmente, mostrar todas las reservas
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const applyFilters = () => {
        const {
            numerodoc,
            fecha,
            horaInicio,
            numeroPersonas,
            tipo_reserva
        } = filters;
    
        const filtered = reservas.filter(reserva => {
            return (
                (numerodoc ? reserva.numerodoc.toLowerCase().includes(numerodoc.toLowerCase()) : true) &&
                (fecha ? reserva.fecha === fecha : true) &&
                (horaInicio ? reserva.horaInicio === horaInicio : true) &&
                (numeroPersonas ? reserva.numeroPersonas === Number(numeroPersonas) : true) &&
                (tipo_reserva === "todos" ? true : reserva.tipo_reserva === tipo_reserva)
            );
        });
    
        setFilteredReservas(filtered);
        setCurrentPage(1); // Resetear la página actual al aplicar filtros
    };
    
    const paginatedReservas = filteredReservas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    
    const totalPages = Math.ceil(filteredReservas.length / itemsPerPage);
    
    

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await Axios.patch(`http://localhost:3000/reservas/${id}`, { estado_reserva: newStatus });
            // Actualizar la reserva en el estado local para reflejar el cambio
            setReservas(prevReservas =>
                prevReservas.map(reserva =>
                    reserva.id === id ? { ...reserva, estado_reserva: newStatus } : reserva
                )
            );
        } catch (error) {
            console.error('Error actualizando el estado:', error);
        }
    };

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>Hubo un error: {error}</p>;

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
            <div>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Reserva Mesa</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
                <div className="w-full bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Reserva Mesa</h2>
                    <p className="text-gray-600 mb-6">Visualiza las reservas realizadas</p>
                    <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        <input type="text" name="numerodoc" placeholder="Filtrar por numerodoc" onChange={handleFilterChange} className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                        <input type="date" name="fecha" placeholder="Filtrar por fecha" onChange={handleFilterChange} className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                        <input type="time" name="horaInicio" placeholder="Filtrar por hora de inicio" onChange={handleFilterChange} className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                        <input type="number" name="numeroPersonas" placeholder="Filtrar por número de personas" onChange={handleFilterChange} className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                        <select name="tipo_reserva" onChange={handleFilterChange} className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500">
                            <option value="todos">Todos</option>
                            <option value="reserva_mesa">Mesa</option>
                            <option value="reserva_local">Local</option>
                        </select>
                        <button onClick={applyFilters} className="absolute top-0.30 right-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Aplicar Filtros</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-200 text-left text-sm text-gray-600">
                                    <th className="py-2 px-4 border-b border-yellow-400">Nombre</th>
                                    <th className="py-2 px-4 border-b border-yellow-400">numerodoc</th>
                                    <th className="py-2 px-4 border-b border-yellow-400">Teléfono</th>
                                    <th className="py-2 px-4 border-b border-yellow-400">Correo</th>
                                    <th className="py-2 px-4 border-b border-yellow-400">Número de personas</th>
                                    <th className="py-2 px-4 border-b border-yellow-400">Fecha</th>
                                    <th className="py-2 px-4 border-b border-yellow-400">Hora de inicio</th>
                                    <th className="py-2 px-4 border-b border-yellow-400">Decoración</th>
                                    <th className="py-2 px-4 border-b border-yellow-400">Actividades</th>
                                    <th className="py-2 px-4 border-b border-yellow-400">Comentarios</th>
                                    <th className="py-2 px-4 border-b border-yellow-400">Estado</th>
                                    <th className="py-2 px-4 border-b border-yellow-400">Tipo de Reserva</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReservas.map(reserva => (
                                    <tr key={reserva.id} className="border-t border-yellow-400">
                                        <td className="py-2 px-4">{reserva.nombre}</td>
                                        <td className="py-2 px-4">{reserva.numerodoc}</td>
                                        <td className="py-2 px-4">{reserva.celular}</td>
                                        <td className="py-2 px-4">{reserva.correo}</td>
                                        <td className="py-2 px-4">{reserva.numeroPersonas}</td>
                                        <td className="py-2 px-4">{reserva.fecha}</td>
                                        <td className="py-2 px-4">{reserva.horaInicio}</td>
                                        <td className="py-2 px-4">{reserva.decoracion}</td>
                                        <td className="py-2 px-4">{reserva.actividades}</td>
                                        <td className="py-2 px-4">{reserva.comentarios}</td>
                                        <td className="py-2 px-4">
                                            <select
                                                value={reserva.estado_reserva}
                                                onChange={(e) => handleStatusChange(reserva.id, e.target.value)}
                                                className="px-2 py-1 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            >
                                                <option value="activa">Activa</option>
                                                <option value="pendiente">Pendiente</option>
                                                <option value="cancelada">Cancelada</option>
                                                <option value="completada">Completada</option>
                                            </select>
                                        </td>
                                        <td className="py-2 px-4">{reserva.tipo_reserva}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <br></br>
                        <br></br>
                    </div>
                        <div className="flex justify-center mt-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2 text-gray-600">Página {currentPage} de {totalPages}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                        >
                            Siguiente
                        </button>
                        </div>
                        <br></br>
                        <br></br>
                        <br></br>
                    
                </div>
            </div>
        );
        
};

export default GestionReservaMesa;
