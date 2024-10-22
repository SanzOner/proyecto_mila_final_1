import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const MisReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30;

    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('userId'); // Cambiar a userId
            console.log("User ID recuperado en MisReservas:", userId);

            if (userId) {
                try {
                    const response = await Axios.get('http://localhost:3000/reservas');
                    const misReservas = response.data.filter(reserva => reserva.userId === userId); // Filtrar por userId
                    setReservas(misReservas);
                } catch (error) {
                    setError("Error al recuperar reservas: " + error.message);
                } finally {
                    setLoading(false);
                }
            } else {
                setError("User ID no encontrado en localStorage.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const paginatedReservas = reservas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(reservas.length / itemsPerPage);

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>Hubo un error: {error}</p>;

    return (
        <div>
            <div className="w-full bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Mis Reservas</h2>
                <p className="text-gray-600 mb-6">Visualiza tus reservas realizadas</p>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left text-sm text-gray-600">
                                <th className="py-2 px-4 border-b border-yellow-400">Nombre</th>
                                <th className="py-2 px-4 border-b border-yellow-400">User ID</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Teléfono</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Correo</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Número de Personas</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Fecha</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Hora de Inicio</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Estado</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Tipo de Reserva</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedReservas.length > 0 ? (
                                paginatedReservas.map(reserva => (
                                    <tr key={reserva.id} className="border-t border-yellow-400">
                                        <td className="py-2 px-4">{reserva.nombre}</td>
                                        <td className="py-2 px-4">{reserva.userId}</td>
                                        <td className="py-2 px-4">{reserva.celular}</td>
                                        <td className="py-2 px-4">{reserva.correo}</td>
                                        <td className="py-2 px-4">{reserva.numeroPersonas}</td>
                                        <td className="py-2 px-4">{reserva.fecha}</td>
                                        <td className="py-2 px-4">{reserva.horaInicio}</td>
                                        <td className="py-2 px-4">{reserva.estado_reserva}</td>
                                        <td className="py-2 px-4">{reserva.tipo_reserva}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-2">No hay reservas para mostrar.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    >
                        Anterior
                    </button>
                    <span className="px-4 py-2 text-gray-600">Página {currentPage} de {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MisReservas;
