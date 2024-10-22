import React, { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { UserProvider, UserContext } from './context/UserContext';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from './componentes/ProtectedRouter';
import Logout from './componentes/logout';
import Carrito from './componentes/cliente/Pedidos/Carrito';
import Index from "./paginas/auth/inicio";
import Login from './componentes/auth/login';
import BarraAdmin from './componentes/barras/BarraAdministrador';
import BarraCliente from './componentes/barras/BarraCliente';
import BarraMesero from './componentes/barras/BarraMesero';
import FormularioRegistro from './componentes/auth/registrocliente';
import BarraNormal from "./componentes/barras/barra_normal";
import ConsultaUsuarios from "./componentes/administrador/usuarios/consultausarios";
import Footer from "./componentes/Footer/footer";
import InicioMesa from "./componentes/cliente/reservas/InicioReservaMesa";
import ReservaLocal from "./componentes/cliente/reservas/reservalocal";
import FormularioRegiEmp from './componentes/administrador/usuarios/regsitroempleados';
import EditarUsuario from './componentes/administrador/usuarios/editarusuarios';
import RegistroProductos from './componentes/administrador/Productos/RegistrarProductos';
import GestionReservaMesa from "./componentes/administrador/Reservas/GestionReservaMesa";
import GestionReservasCliente from "./componentes/cliente/reservas/reservascliente";
import RegistroEventosCliente from "./componentes/cliente/eventos/EventosCliente";
import RegistroEventos from "./componentes/administrador/eventos/RegistroEventos";
import FormularioInscripcion from "./componentes/cliente/eventos/FormularioInscripcion";
import ProductosCliente from './componentes/cliente/Productos/productos';
import GestionProductos from './componentes/administrador/Productos/GestionProductos';
import Servicios from './componentes/servicios';
import PerfilUsuario from './componentes/Perfil/PerfilUsuario';
import DetallesPedido from './componentes/cliente/Pedidos/DetallesPedido';
import Pedido from './componentes/cliente/Pedidos/verpedido';
import MisInscripciones from './componentes/cliente/eventos/MisInscripciones';
import EditarEventos from './componentes/administrador/eventos/EditarEventos';
import GestionEventos from "./componentes/administrador/eventos/ModificarEventos";
import GestionPedidos from './componentes/mesero/gestionPedidos';
import RecuperarContraseña from './componentes/auth/RecuperarContraseña';
import EnviarCorreoRestablecimiento from './componentes/auth/EnviarCorreoRestablecimiento';
import { Router } from 'react-router-dom';


const contraseñas = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Enviar-Corre-Restablecimiento" element={<EnviarCorreoRestablecimiento />} />
        <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />
        {/* Otras rutas */}
      </Routes>
    </Router>
  );
};

const App = () => {
  const { role, setRole } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const publicPaths = ['/', '/login', '/RegistroCliente', '/servicios', '/productos', '/EventosCliente'];

    if (!storedRole && !publicPaths.includes(window.location.pathname)) {
      navigate('/login'); // Redirige a la página de inicio de sesión si no hay rol y la ruta no es pública
    } else if (storedRole) {
      setRole(storedRole);
    }
  }, [setRole, navigate]);

  // Determina el componente de la barra de navegación según el rol
  let NavBarComponent = BarraNormal; // Valor por defecto
  if (role === 'administrador') {
    NavBarComponent = BarraAdmin;
  } else if (role === 'Cliente') {
    NavBarComponent = BarraCliente;
  } else if (role === 'mesero') {
    NavBarComponent = BarraMesero;
  }

  return (
    <UserProvider>
      <NavBarComponent />
      <main>
        <Routes>
          {/* Rutas públicas */}
          <Route path='/' element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/RegistroCliente" element={<FormularioRegistro />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/productos" element={<ProductosCliente />} />
          <Route path="/EventosCliente" element={<RegistroEventosCliente />} />
          <Route path="/RecuperarContraseña" element={<RecuperarContraseña />} />
          <Route path="/EnviarCorreoRestablecimiento" element={<EnviarCorreoRestablecimiento />} />


          {/* Rutas protegidas */}
          <Route path="/consultausarios" element={
            <ProtectedRoute>
              <ConsultaUsuarios />
            </ProtectedRoute>
          } />
          <Route path="/gestionPedidos" element={
            <ProtectedRoute>
              <GestionPedidos />
            </ProtectedRoute>
          } />
          <Route path="/regsitroempleados" element={
            <ProtectedRoute>
              <FormularioRegiEmp />
            </ProtectedRoute>
          } />
          <Route path="/editarusuarios/:usuarioId" element={
            <ProtectedRoute>
              <EditarUsuario />
            </ProtectedRoute>
          } />
          <Route path="/RegistrarProductos" element={
            <ProtectedRoute>
              <RegistroProductos />
            </ProtectedRoute>
          } />
          <Route path="/GestionProductos" element={
            <ProtectedRoute>
              <GestionProductos />
            </ProtectedRoute>
          } />
          <Route path="/InicioReservaMesa" element={
            <ProtectedRoute>
              <InicioMesa />
            </ProtectedRoute>
          } />
          <Route path="/reservalocal" element={
            <ProtectedRoute>
              <ReservaLocal />
            </ProtectedRoute>
          } />
          <Route path="/Carrito" element={
            <ProtectedRoute>
              <Carrito />
            </ProtectedRoute>
          } />
          <Route path="/GestionReservaMesa" element={
            <ProtectedRoute>
              <GestionReservaMesa />
            </ProtectedRoute>
          } />
          <Route path="/reservascliente" element={
            <ProtectedRoute>
              <GestionReservasCliente />
            </ProtectedRoute>
          } />
          <Route path="/RegistroEventos" element={
            <ProtectedRoute>
              <RegistroEventos />
            </ProtectedRoute>
          } />
          <Route path="/FormularioInscripcion" element={
            <ProtectedRoute>
              <FormularioInscripcion />
            </ProtectedRoute>
          } />
          <Route path="/perfilusuario" element={
            <ProtectedRoute>
              <PerfilUsuario />
            </ProtectedRoute>
          } />
          <Route path="/detalles-pedido" element={
            <ProtectedRoute>
              <DetallesPedido />
            </ProtectedRoute>
          } />
          <Route path="/pedidos" element={
            <ProtectedRoute>
              <Pedido />
            </ProtectedRoute>
          } />
          <Route path="/MisInscripciones" element={
            <ProtectedRoute>
              <MisInscripciones />
            </ProtectedRoute>
          } />
          <Route path="/EditarEventos/:id" element={
            <ProtectedRoute>
              <EditarEventos />
            </ProtectedRoute>
          } />
          <Route path="/ModificarEventos" element={
            <ProtectedRoute>
              <GestionEventos />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer />
      </main>
    </UserProvider>
  );
};

export default App;
