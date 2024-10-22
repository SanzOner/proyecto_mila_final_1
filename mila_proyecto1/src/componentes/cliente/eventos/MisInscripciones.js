import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MisInscripciones = () => {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const userId = localStorage.getItem('userId');
    const itemsPerPage = 30;

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/eventos');
                const eventosInscritos = response.data.filter(evento =>
                    evento.inscritos.some(inscrito => inscrito.userId === userId)
                );

                setEventos(eventosInscritos);
            } catch (error) {
                setError("Error al recuperar eventos: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();
    }, [userId]);

    const paginatedEventos = eventos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(eventos.length / itemsPerPage);

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>Hubo un error: {error}</p>;

    return (
        <div>
            <div className="w-full bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Mis Inscripciones a Eventos</h2>
                <p className="text-gray-600 mb-6">Visualiza los eventos a los que te has inscrito</p>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left text-sm text-gray-600">
                                <th className="py-2 px-4 border-b border-yellow-400">Nombre del Evento</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Fecha</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Método de Pago</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedEventos.length > 0 ? paginatedEventos.map(evento => {
                                const inscrito = evento.inscritos.find(inscrito => inscrito.userId === userId);
                                return (
                                    <tr key={evento.id} className="border-t border-yellow-400">
                                        <td className="py-2 px-4">{evento.nombre}</td>
                                        <td className="py-2 px-4">{evento.fecha}</td>
                                        <td className="py-2 px-4">{inscrito ? inscrito.metodoPago : 'No disponible'}</td>
                                        <td className="py-2 px-4">{inscrito ? inscrito.total : 'No disponible'}</td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-2">No tienes inscripciones a eventos.</td>
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

export default MisInscripciones;
