import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Cambiar useHistory por useNavigate

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState('normal'); // Valor por defecto
  const navigate = useNavigate(); // Cambiar a useNavigate para redireccionar

  useEffect(() => {
    // Al montar el componente, verifica si el rol está guardado en el localStorage
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole); 
    }
  }, []);


  const login = (userRole) => {
    // Guarda el rol en el estado y en localStorage
    localStorage.setItem('role', userRole);
    setRole(userRole);

    // Redirige al usuario a su página de perfil o página principal
    navigate('/login'); // Asegúrate de que la ruta '/perfil' esté configurada
  };

  const logout = () => {
    // Limpia el localStorage y restablece el rol
    localStorage.removeItem('role');
    setRole('normal');
    
    // Redirige a la página de login usando navigate
    navigate('/');
    
    // Aquí puedes agregar lógica adicional para el cierre de sesión, si es necesario
  };

  return (
    <UserContext.Provider value={{ role, setRole,login ,logout }}>
      {children}
    </UserContext.Provider>
  );
};
