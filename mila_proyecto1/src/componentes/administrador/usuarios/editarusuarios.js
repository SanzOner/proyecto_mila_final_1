import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditarUsuario = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nombre: '',
        nombreUsuario: '',
        tipoDocumento: '',
        numeroDocumento: '',
        correo: '',
        telefono: '',
        direccion: '',
        rol: '',
        titulo: '',
        horario: '',
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/usuarios/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error al obtener el usuario', error);
                setError('No se pudo cargar el usuario.');
            }
        };

        fetchUsuario();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.put(`http://localhost:3000/usuarios/${id}`, formData);
            alert('Usuario actualizado exitosamente.');
            navigate('/consultausariosl');
        } catch (error) {
            console.error('Error al actualizar el usuario', error);
            setError('No se pudo actualizar el usuario.');
        }
    };

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto my-10 lg:py-0">
                <h1 className="text-3xl font-bold mb-4">Editar Usuario</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="w-full bg-white rounded-xl shadow-2xl md:mt-0 sm:max-w-4xl xl:p-0 border border-gray-200">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <form className="grid grid-cols-1 gap-6 md:grid-cols-4" onSubmit={handleSubmit}>
                            {/* Nombre */}
                            <div className="col-span-2">
                                <label className="block font-semibold text-black mb-1">
                                    <i className="fas fa-user text-black"></i> Nombre
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    className="w-full border-b-2 border-gold bg-gray-100 p-2 focus:outline-none"
                                    value={formData.nombre}
                                    disabled
                                />
                            </div>

                            {/* Teléfono */}
                            <div className="col-span-2">
                                <label className="block font-semibold text-black mb-1">
                                    <i className="fas fa-phone text-black"></i> Teléfono
                                </label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    className="w-full border-b-2 border-gold bg-gray-100 p-2 focus:outline-none"
                                    value={formData.telefono}
                                    disabled
                                />
                            </div>

                            {/* Correo */}
                            <div className="col-span-2">
                                <label className="block font-semibold text-black mb-1">
                                    <i className="fas fa-envelope text-black"></i> Correo
                                </label>
                                <input
                                    type="email"
                                    name="correo"
                                    className="w-full border-b-2 border-gold bg-gray-100 p-2 focus:outline-none"
                                    value={formData.correo}
                                    disabled
                                />
                            </div>

                            {/* Número de documento */}
                            <div className="col-span-2">
                                <label className="block font-semibold text-black mb-1">
                                    <i className="fas fa-id-card text-black"></i> Número de documento
                                </label>
                                <input
                                    type="text"
                                    name="numeroDocumento"
                                    className="w-full border-b-2 border-gold bg-gray-100 p-2 focus:outline-none"
                                    value={formData.numeroDocumento}
                                    disabled
                                />
                            </div>

                            {/* Tipo de documento */}
                            <div className="col-span-2">
                                <label className="block font-semibold text-black mb-1">
                                    <i className="fas fa-file-alt text-black"></i> Tipo de documento
                                </label>
                                <select
                                    name="tipoDocumento"
                                    className="w-full border-b-2 border-gold bg-gray-100 p-2 focus:outline-none"
                                    value={formData.tipoDocumento}
                                    disabled
                                >
                                    <option value="">{formData.tipoDocumento}</option>
                                </select>
                            </div>

                            {/* Dirección */}
                            <div className="col-span-2">
                                <label className="block font-semibold text-black mb-1">
                                    <i className="fas fa-map-marker-alt text-black"></i> Dirección
                                </label>
                                <input
                                    type="text"
                                    name="direccion"
                                    className="w-full border-b-2 border-gold bg-gray-100 p-2 focus:outline-none"
                                    value={formData.direccion}
                                    disabled
                                />
                            </div>

                            {/* Título (Solo para administrador) */}
                            {formData.rol === 'administrador' && (
                                <div className="col-span-2">
                                    <label className="block font-semibold text-black mb-1">
                                        <i className="fas fa-briefcase text-black"></i> Título
                                    </label>
                                    <input
                                        type="text"
                                        name="titulo"
                                        className="w-full border-b-2 border-gold bg-gray-100 p-2 focus:outline-none"
                                        value={formData.titulo}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            {/* Horario (Solo para mesero) */}
                            {formData.rol === 'mesero' && (
                                <div className="col-span-2">
                                    <label className="block font-semibold text-black mb-1">
                                        <i className="fas fa-clock text-black"></i> Horario
                                    </label>
                                    <input
                                        type="text"
                                        name="horario"
                                        className="w-full border-b-2 border-gold bg-gray-100 p-2 focus:outline-none"
                                        value={formData.horario}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}



                            <div className="col-span-4 flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/gestion-usuarios')}
                                    className="px-8 py-4 bg-gradient-to-r from-red-400 to-red-700 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-gradient-to-r from-green-400 to-green-700  text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Actualizar Usuario
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EditarUsuario;
