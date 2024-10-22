import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const RestablecerContraseña = () => {
    const [nuevaContrasena, setNuevaContrasena] = useState('');

    const handleChange = (e) => {
        setNuevaContrasena(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones de contraseña
        if (nuevaContrasena.length < 6 || nuevaContrasena.length > 10) {
            Swal.fire({
                title: 'Error de validación',
                text: 'La contraseña debe tener entre 6 y 10 caracteres.',
                icon: 'error',
                confirmButtonText: 'Reintentar'
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/restablecer-contrasena', { nuevaContrasena });

            if (response.data.success) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Tu contraseña ha sido restablecida.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                // Redirigir al login o realizar otra acción
            } else {
                Swal.fire({
                    title: 'Error',
                    text: response.data.message,
                    icon: 'error',
                    confirmButtonText: 'Reintentar'
                });
            }
        } catch (error) {
            console.error('Error al restablecer la contraseña', error);
            Swal.fire({
                title: 'Error del sistema',
                text: 'Ocurrió un error al intentar restablecer la contraseña. Intenta nuevamente más tarde.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <div className="bg-white shadow-2xl rounded-lg p-12 max-w-lg w-full border-2 border-yellow-300">
                <h2 className="text-4xl font-semibold text-center text-gray-800 mb-8">Restablecer Contraseña</h2>
                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="mb-6 relative">
                        <label htmlFor="nueva-contrasena" className="block text-gray-700 mb-2 font-semibold">Nueva Contraseña</label>
                        <input
                            type="password"
                            id="nueva-contrasena"
                            placeholder="Introduce tu nueva contraseña"
                            className="border-2 border-yellow-300 focus:border-yellow-500 focus:ring focus:ring-yellow-300 rounded-lg w-full py-3 px-10 transition duration-300 text-lg"
                            value={nuevaContrasena}
                            onChange={handleChange}
                            required
                        />
                        <i className="fas fa-lock absolute left-3 top-3 text-yellow-400"></i>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Tu contraseña debe tener entre 6 y 10 caracteres, incluir al menos un número y un símbolo.</p>
                    <button type="submit" className="bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 transition duration-300 w-full text-lg transform hover:scale-105">
                        Restablecer Contraseña
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RestablecerContraseña;
