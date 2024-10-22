import React, { createContext, useState, useContext } from 'react';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState([]);

    // Puedes agregar funciones para manipular el carrito aquí

    return (
        <CarritoContext.Provider value={{ carrito, setCarrito }}>
            {children}
        </CarritoContext.Provider>
    );
};

export const useCarrito = () => useContext(CarritoContext);
