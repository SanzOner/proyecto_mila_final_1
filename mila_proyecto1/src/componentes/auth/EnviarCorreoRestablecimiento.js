import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const EnviarCorreoRestablecimiento = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/enviar-correo', { email });

            if (response.data.success) {
                Swal.fire({
                    title: 'Correo enviado',
                    text: 'Se ha enviado un correo para restablecer tu contraseña.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/'); // Redirige al login después de un envío exitoso
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: response.data.message,
                    icon: 'error',
                    confirmButtonText: 'Reintentar'
                });
            }
        } catch (error) {
            console.error('Error al enviar el correo', error);
            Swal.fire({
                title: 'Error del sistema',
                text: 'Ocurrió un error al intentar enviar el correo. Intenta nuevamente más tarde.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <div className="bg-white shadow-2xl rounded-lg p-12 max-w-lg w-full border-2 border-yellow-300">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Ingresa tu Correo Electrónico</h2>
                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="mb-6 relative">
                        <label htmlFor="email" className="block text-gray-700 mb-2 font-semibold">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Introduce tu correo electrónico"
                            className="border-2 border-yellow-300 focus:border-yellow-500 focus:ring focus:ring-yellow-300 rounded-lg w-full py-3 px-10 transition duration-300 text-lg"
                            value={email}
                            onChange={handleChange}
                            required
                        />
                        <i className="fas fa-envelope absolute left-3 top-3 text-yellow-400"></i>
                    </div>
                    <button type="submit" className="bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 transition duration-300 w-full text-lg transform hover:scale-105">
                        Enviar Correo de Restablecimiento
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    ¿Recordaste tu contraseña?
                    <a href="/" className="text-yellow-500 hover:underline font-semibold"> Volver al inicio de sesión</a>
                </p>
            </div>
        </div>
    );
};

export default EnviarCorreoRestablecimiento;
