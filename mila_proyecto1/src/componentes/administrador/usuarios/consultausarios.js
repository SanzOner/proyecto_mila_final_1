import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarraAdmin from "../../barras/BarraAdministrador";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../componentes/Footer/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const ConsultaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolFiltro, setRolFiltro] = useState(''); // Filter by role
  const [docFiltro, setDocFiltro] = useState(''); // Filter by document number
  const [apellidoFiltro, setApellidoFiltro] = useState(''); // Filter by last name
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:3000/usuarios');
        // Filtrar solo usuarios con roles específicos y activos
        const usuariosFiltrados = response.data.filter(usuario =>
          (usuario.rol === 'administrador' || usuario.rol === 'mesero' ) && usuario.estado === 'Activo'
        );
        setUsuarios(usuariosFiltrados);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching usuarios:', error);
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleEliminar = async (usuarioId) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Una vez eliminado, no podrás recuperar este usuario!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'Cancelar'
      });
  
      if (result.isConfirmed) {
        await axios.put(`http://localhost:3000/usuarios/${usuarioId}`, { estado: 'inactivo' });
        
        // Re-fetch the users after deletion
        const response = await axios.get('http://localhost:3000/usuarios');
        const usuariosFiltrados = response.data.filter(usuario =>
          (usuario.rol === 'administrador' || usuario.rol === 'mesero' ) && usuario.estado === 'Activo'
        );
        setUsuarios(usuariosFiltrados);
  
        Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
      }
    } catch (error) {
      console.error('Error updating usuario:', error);
    }
  };

  const handleActualizar = (usuarioId) => {
    navigate(`/editarusuarios/${usuarioId}`);
  };

  if (loading) return <p>Loading...</p>;

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesRol = rolFiltro ? usuario.rol === rolFiltro : true;
    const matchesDoc = docFiltro ? (usuario.numero_documento || '').includes(docFiltro) : true;
    const matchesApellido = apellidoFiltro ? (usuario.apellido || '').includes(apellidoFiltro) : true;

    return matchesRol && matchesDoc && matchesApellido;
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      <meta charSet="UTF-8" />
      <link rel="icon" type="image/png" href="https://i.ibb.co/gj0Bpcc/logo-empresa-mila.png" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Mostrar Registros</title>
      <BarraAdmin />
      <div className="p-6">

        <h1 className="text-2xl font-bold text-center mb-4 text-black">Lista de Registros</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Filtrar por número de documento"
            value={docFiltro}
            onChange={(e) => setDocFiltro(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg mr-4"
          />
          <input
            type="text"
            placeholder="Filtrar por apellido"
            value={apellidoFiltro}
            onChange={(e) => setApellidoFiltro(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg mr-4"
          />
          <select
            value={rolFiltro}
            onChange={(e) => setRolFiltro(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg"
          >
            <option value="">Todos los roles</option>
            <option value="administrador">Administrador</option>
            <option value="mesero">Mesero</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md mb-12">
            <thead className="bg-[#f7e1ae] text-black">
              <tr>
                <th className="py-2 px-4 border-b">Nombre</th>
                <th className="py-2 px-4 border-b">Apellido</th>
                <th className="py-2 px-4 border-b">Teléfono</th>
                <th className="py-2 px-4 border-b">Número de Documento</th>
                <th className="py-2 px-4 border-b">Tipo de Documento</th>
                <th className="py-2 px-4 border-b">Correo Electrónico</th>
                <th className="py-2 px-4 border-b">Rol</th>
                <th className="py-2 px-4 border-b">Título</th>
                <th className="py-2 px-4 border-b">Horario</th>
                <th className="py-2 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="py-2 px-4 border-b">{usuario.nombre}</td>
                  <td className="py-2 px-4 border-b">{usuario.apellido}</td>
                  <td className="py-2 px-4 border-b">{usuario.telefono}</td>
                  <td className="py-2 px-4 border-b">{usuario.numero_documento}</td>
                  <td className="py-2 px-4 border-b">{usuario.tipo_documento}</td>
                  <td className="py-2 px-4 border-b">{usuario.email}</td>
                  <td className="py-2 px-4 border-b">{usuario.rol}</td>
                  <td className="py-2 px-4 border-b">{usuario.titulo}</td>
                  <td className="py-2 px-4 border-b">{usuario.horario}</td>

                  <td className="py-2 px-4 border-b flex justify-center items-center space-x-2">
                    {usuario.estado === 'Activo' && (
                      <>
                        <button 
                          className="bg-[#f7e1ae] text-black px-2 py-1 rounded shadow-md hover:bg-[#d4b99e] flex items-center"
                          onClick={() => handleEliminar(usuario.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-1" /> Eliminar
                        </button>
                        <button 
                          className="bg-[#f7e1ae] text-black px-2 py-1 rounded shadow-md hover:bg-[#d4b99e] flex items-center"
                          onClick={() => handleActualizar(usuario.id)}
                        >
                          <FontAwesomeIcon icon={faEdit} className="mr-1" />
                          Editar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConsultaUsuarios;
