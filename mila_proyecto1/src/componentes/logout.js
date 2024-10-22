import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Logout = () => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // Cierra sesión
    navigate('/', { replace: true }); // Redirige a la página de inicio
    window.location.reload(); // Recarga la página para asegurar que el estado se actualice
  }, [logout, navigate]);

  return null; // O un mensaje de carga si prefieres
};

export default Logout;
