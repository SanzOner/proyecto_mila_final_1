import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt, faCheck, faFilter } from '@fortawesome/free-solid-svg-icons';

const GestionPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [filteredPedidos, setFilteredPedidos] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        horaInicio: '11:00',
        horaFin: '18:00',
        tipoEntrega: 'todos',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const pedidosPerPage = 15;

    useEffect(() => {
        fetchPedidos();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [pedidos, filters]);

    const fetchPedidos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/pedidos');
            setPedidos(response.data);
        } catch (error) {
            console.error("Error al obtener los pedidos:", error);
            setError(`Error al obtener los pedidos: ${error.message}`);
        }
    };

    const aplicarFiltros = () => {
        let pedidosFiltrados = [...pedidos];

        pedidosFiltrados = pedidosFiltrados.filter((pedido) => {
            if (!pedido.hora) return true;
            const hora = new Date(`1970-01-01T${pedido.hora}`).getHours();
            const horaInicio = parseInt(filters.horaInicio.split(':')[0], 10);
            const horaFin = parseInt(filters.horaFin.split(':')[0], 10);
            return hora >= horaInicio && hora <= horaFin;
        });

        if (filters.tipoEntrega !== 'todos') {
            pedidosFiltrados = pedidosFiltrados.filter(
                (pedido) => pedido.tipoEntrega.trim().toLowerCase() === filters.tipoEntrega.trim().toLowerCase()
            );
        }

        setFilteredPedidos(pedidosFiltrados);
        setCurrentPage(1); // Reiniciar a la primera página al aplicar filtros
    };

    const handleEntregarPedido = async (pedidoId) => {
        try {
            await axios.patch(`http://localhost:3000/pedidos/${pedidoId}`, { estado: 'entregado' });

            setPedidos((prevPedidos) =>
                prevPedidos.map((pedido) =>
                    pedido.id === pedidoId ? { ...pedido, estado: 'entregado' } : pedido
                )
            );
            setOpen(false);
        } catch (error) {
            console.error("Error al actualizar el estado del pedido:", error);
            setError(`Error al actualizar el pedido: ${error.message}`);
        }
    };

    const handleVerMas = (pedido) => {
        setSelectedPedido(pedido);
        setOpen(true);
    };

    const PedidoCard = ({ pedido }) => (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 bg-yellow-50">
                <div className="flex items-center space-x-4">
                    <div className="bg-yellow-500 text-white p-3 rounded-full">
                        <FontAwesomeIcon icon={faReceipt} className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Pedido #{pedido.id}</h2>
                        <p className="text-gray-500">{pedido.fecha} {pedido.hora}</p>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${pedido.estado === 'entregado' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {pedido.estado || 'pendiente'}
                </div>
            </div>

            <div className="p-6 space-y-4">
                <InfoRow label="Tipo de Entrega" value={pedido.tipoEntrega} />
                <InfoRow label="Total" value={`$${pedido.total}`} />
                <InfoRow label="Cantidad" value={`${pedido.cantidad} items`} />
            </div>

            <div className="p-4 bg-gray-50 flex justify-between items-center">
                <button
                    onClick={() => handleVerMas(pedido)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300"
                >
                    Ver Detalles
                </button>
                {pedido.estado !== 'entregado' && (
                    <button
                        onClick={() => handleEntregarPedido(pedido.id)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300 flex items-center space-x-2"
                    >
                        <FontAwesomeIcon icon={faCheck} />
                        <span>Marcar como entregado</span>
                    </button>
                )}
            </div>
        </div>
    );

    const InfoRow = ({ label, value }) => (
        <div className="flex items-center justify-between">
            <span className="text-gray-600">{label}:</span>
            <span className="font-semibold">{value}</span>
        </div>
    );

    const FilterSection = () => (
        <div className="mb-8 bg-white p-4 rounded-lg shadow">
            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faFilter} className="text-yellow-500" />
                    <span className="font-semibold">Filtros:</span>
                </div>

                <select
                    value={filters.tipoEntrega}
                    onChange={(e) => setFilters((prev) => ({ ...prev, tipoEntrega: e.target.value }))}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                    <option value="todos">Todos los tipos</option>
                    <option value="envio">Domicilio</option>
                    <option value="recogida">Recogido en tienda</option>
                </select>

                <div className="flex items-center space-x-2">
                    <input
                        type="time"
                        value={filters.horaInicio}
                        onChange={(e) => setFilters((prev) => ({ ...prev, horaInicio: e.target.value }))}
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <span>a</span>
                    <input
                        type="time"
                        value={filters.horaFin}
                        onChange={(e) => setFilters((prev) => ({ ...prev, horaFin: e.target.value }))}
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>
            </div>
        </div>
    );

    const paginatePedidos = () => {
        const indexOfLastPedido = currentPage * pedidosPerPage;
        const indexOfFirstPedido = indexOfLastPedido - pedidosPerPage;
        return filteredPedidos.slice(indexOfFirstPedido, indexOfLastPedido);
    };

    const totalPages = Math.ceil(filteredPedidos.length / pedidosPerPage);

    return (
        <div className="max-w-7xl mx-auto mb-24 mt-32">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Pedidos</h1>

            <FilterSection />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatePedidos().map((pedido) => (
                    <PedidoCard key={pedido.id} pedido={pedido} />
                ))}
            </div>

            <div className="flex justify-center mt-8">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        className={`mx-1 px-4 py-2 rounded ${index + 1 === currentPage ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {open && selectedPedido && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-4/5 md:w-3/4 lg:w-2/3 h-auto max-h-[80vh] p-4 overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">Detalles del Pedido #{selectedPedido.id}</h2>
                        <p className="mb-4"><strong>Cliente:</strong> {selectedPedido.usuario.nombre} {selectedPedido.usuario.apellido}</p>
                        <p className="mb-4"><strong>Número de Documento:</strong> {selectedPedido.usuario.numero_documento}</p>
                        <p className="mb-4"><strong>Dirección:</strong> {selectedPedido.usuario.direccion}</p>
                        <p className="mb-4"><strong>Barrio:</strong> {selectedPedido.usuario.barrio}</p>
                        <p className="mb-4"><strong>Total:</strong> ${selectedPedido.total}</p>
                        <p className="mb-4"><strong>Descripción:</strong> {selectedPedido.descripcion}</p>

                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Detalles de los productos</h3>
                            {selectedPedido.carrito.map(item => (
                                <div key={item.id} className="mt-2">
                                    <h4 className="font-semibold">{item.nombre}</h4>
                                    <p><strong>Precio:</strong> ${item.precio}</p>
                                    <p><strong>Cantidad:</strong> {item.cantidad}</p>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 mt-4"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionPedidos;