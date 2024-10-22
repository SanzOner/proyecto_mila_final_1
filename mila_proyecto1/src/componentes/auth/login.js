import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faLock, faEye, faEyeSlash, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const [formData, setFormData] = useState({
        numero_documento: '',
        contrasena: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'numero_documento') {
            const regex = /^[0-9]{0,12}$/;
            if (regex.test(value)) {
                setFormData({ ...formData, [name]: value });
            }
        } else if (name === 'contrasena') {
            if (value.length <= 10) {
                setFormData({ ...formData, [name]: value });
            }
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        navigate('/EnviarCorreoRestablecimiento');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { numero_documento, contrasena } = formData;

        if (numero_documento.length < 8 || numero_documento.length > 12) {
            Swal.fire({
                title: 'Error de validación',
                text: 'El número de documento debe tener entre 8 y 12 dígitos.',
                icon: 'error',
                confirmButtonText: 'Reintentar'
            });
            return;
        }

        if (contrasena.length < 6 || contrasena.length > 10) {
            Swal.fire({
                title: 'Error de validación',
                text: 'La contraseña debe tener entre 6 y 10 caracteres.',
                icon: 'error',
                confirmButtonText: 'Reintentar'
            });
            return;
        }

        try {
            const response = await axios.get('http://localhost:3000/usuarios', {
                params: { numero_documento, contrasena }
            });

            const user = response.data[0];
            if (user) {
                if (user.estado === 'Activo') {
                    localStorage.setItem('userId', user.id);
                    localStorage.setItem('role', user.rol);
                    localStorage.setItem('name', user.nombre);

                    Swal.fire({
                        title: '¡Bienvenido!',
                        text: `Hola ${user.nombre}, has iniciado sesión correctamente.`,
                        icon: 'success',
                        confirmButtonText: 'Continuar'
                    }).then(() => {
                        navigate('/');
                    });
                } else {
                    Swal.fire({
                        title: 'Cuenta inactiva',
                        text: 'Tu cuenta no está activa. Contacta con soporte.',
                        icon: 'warning',
                        confirmButtonText: 'Entendido'
                    });
                }
            } else {
                Swal.fire({
                    title: 'Error de autenticación',
                    text: 'Número de documento o contraseña incorrectos. Inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Reintentar'
                });
            }
        } catch (error) {
            console.error('Error al iniciar sesión', error);
            Swal.fire({
                title: 'Error del sistema',
                text: 'Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo más tarde.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow flex items-center justify-center bg-gray-100 h-full mb-6">
                <div className="flex flex-col lg:flex-row items-center justify-center w-full h-full">
                    <div className="lg:w-2/5 w-full h-full hidden lg:block">
                        <img
                            src="https://i.ibb.co/Y3GKdC1/Conoce-nuestros-espacios-Co-working.jpg"
                            alt="Espacio de Coworking"
                            className="object-cover w-full h-full rounded-l-lg shadow-lg"
                        />
                    </div>

                    <div className="lg:w-2/5 w-full flex items-center justify-center bg-white rounded-r-lg shadow-lg p-8 lg:p-16 h-152 border border-yellow-500">
                        <div className="w-full max-w-md">
                            <h1 className="text-3xl font-bold mb-12 text-center text-gray-800">Iniciar Sesión</h1>
                            <form onSubmit={handleSubmit} id="login-form">
                                <div className="mb-5">
                                    <label htmlFor="numero_documento" className="block text-gray-700 font-semibold mb-2">Número de documento</label>
                                    <div className="relative">
                                        <FontAwesomeIcon icon={faIdCard} className="text-yellow-500 absolute left-3 top-5" />
                                        <input
                                            type="text"
                                            id="numero_documento"
                                            name="numero_documento"
                                            placeholder="Ingrese su número de documento"
                                            value={formData.numero_documento}
                                            onChange={handleChange}
                                            className="w-full border border-yellow-500 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-600"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="relative mt-10">
                                    <label htmlFor="contrasena" className="block text-gray-700 font-semibold mb-2">Contraseña</label>
                                    <FontAwesomeIcon icon={faLock} className="text-yellow-500 absolute left-3 top-14" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="contrasena"
                                        name="contrasena"
                                        placeholder="Ingrese su contraseña"
                                        value={formData.contrasena}
                                        onChange={handleChange}
                                        onCopy={(e) => e.preventDefault()}
                                        onPaste={(e) => e.preventDefault()}
                                        onCut={(e) => e.preventDefault()}
                                        className="w-full border border-yellow-500 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-600"
                                        required
                                    />
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEyeSlash : faEye}
                                        onClick={handleTogglePassword}
                                        className="absolute right-3 top-14 cursor-pointer text-gray-500"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-sm flex items-center justify-end mt-12 text-black no-underline hover:underline w-full"
                                >
                                    <FontAwesomeIcon icon={faLock} className="text-black mr-2" />
                                    ¿Olvidaste tu contraseña?
                                </button>

                                <button
                                    type="submit"
                                    className="bg-yellow-500 border border-black text-black font-semibold rounded-full py-2 mt-8 px-4 w-full transition duration-150 ease-in-out hover:bg-yellow-600 hover:text-white"
                                >
                                    Ingresar
                                </button>
                            </form>

                            <div className="mt-6 text-gray-900 text-center">
                                <Link to="/RegistroCliente" className="text-sm flex items-center justify-center mt-12 text-black no-underline hover:underline">
                                    <FontAwesomeIcon icon={faUserPlus} className="text-black mr-2" />
                                    Si no tienes cuenta "Regístrate aquí"
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;