import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBox, faCalendarAlt, faBookOpen } from '@fortawesome/free-solid-svg-icons';

const servicios = () => {
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: 'auto',
      textAlign: 'center',
      marginTop: '3rem', // Margen superior
      marginBottom: '3rem', // Margen inferior
    },
    h1: {
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '3rem',
      color: '#1f2937',
      fontFamily: 'Arial, Helvetica, sans-serif',
    },
    h1Span: {
      background: 'rgb(226, 173, 40)',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridTemplateRows: 'repeat(2, auto)',
      gap: '2rem',
    },
    card: {
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      background: '#fff',
    },
    cardHover: {
      transform: 'translateY(-0.5rem)',
      boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
    },
    cardHeader: {
      padding: '1.5rem 0',
      textAlign: 'center',
      position: 'relative',
    },
    cardIcon: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '4rem',
      height: '4rem',
      margin: 'auto',
      borderRadius: '50%',
      color: '#fff',
      marginBottom: '1rem',
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1f2937',
      fontFamily: 'Arial, Helvetica, sans-serif',
    },
    cardDescription: {
      padding: '0 1.5rem 1.5rem',
      color: '#4b5563',
      fontSize: '0.875rem',
      textAlign: 'justify',
      fontFamily: 'Arial, Helvetica, sans-serif',
    },
    bgPedidos: {
      background: 'linear-gradient(to bottom right, #f5d878, goldenrod)',
    },
    headerBar: {
      height: '0.5rem',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>
        Nuestros <span style={styles.h1Span}>servicios</span>
      </h1>
      <div style={styles.cardGrid}>
        {/* Tarjeta de Pedidos */}
        <div style={styles.card}>
          <div style={{ ...styles.headerBar, ...styles.bgPedidos }}></div>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.cardIcon, ...styles.bgPedidos }}>
              <FontAwesomeIcon icon={faShoppingCart} />
            </div>
            <div style={styles.cardTitle}>Pedidos</div>
          </div>
          <div style={styles.cardDescription}>
            Realiza tus pedidos de manera rápida y sencilla. Elige tus productos favoritos, personaliza tu
            orden, y nosotros nos encargamos del resto para que disfrutes sin preocupaciones.
          </div>
        </div>

        {/* Tarjeta de Productos */}
        <div style={styles.card}>
          <div style={{ ...styles.headerBar, ...styles.bgPedidos }}></div>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.cardIcon, ...styles.bgPedidos }}>
              <FontAwesomeIcon icon={faBox} />
            </div>
            <div style={styles.cardTitle}>Productos</div>
          </div>
          <div style={styles.cardDescription}>
            Explora nuestro catálogo de productos exclusivos, cuidadosamente seleccionados para ofrecerte la
            mejor calidad. Descubre novedades y ofertas diseñadas especialmente para ti.
          </div>
        </div>

        {/* Tarjeta de Eventos */}
        <div style={styles.card}>
          <div style={{ ...styles.headerBar, ...styles.bgPedidos }}></div>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.cardIcon, ...styles.bgPedidos }}>
              <FontAwesomeIcon icon={faCalendarAlt} />
            </div>
            <div style={styles.cardTitle}>Eventos</div>
          </div>
          <div style={styles.cardDescription}>
            Participa en nuestros eventos especiales y vive experiencias únicas. Reserva tu lugar en nuestras
            actividades y haz que cada ocasión sea memorable con amigos y familia.
          </div>
        </div>

        {/* Tarjeta de Reservas */}
        <div style={styles.card}>
          <div style={{ ...styles.headerBar, ...styles.bgPedidos }}></div>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.cardIcon, ...styles.bgPedidos }}>
              <FontAwesomeIcon icon={faBookOpen} />
            </div>
            <div style={styles.cardTitle}>Reservas</div>
          </div>
          <div style={styles.cardDescription}>
            Asegura tu mesa con anticipación y disfruta de un servicio personalizado. Haz tu reserva en pocos
            pasos y asegúrate de tener el mejor lugar para tu próxima visita.
          </div>
        </div>
      </div>
    </div>
  );
};

export default servicios;
