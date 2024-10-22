import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from '../../context/UserContext'; // Importa el contexto de usuario
import '../../index.css';


// Importa los componentes de barra de navegación
import BarraAdmin from '../../componentes/barras/BarraAdministrador';
import BarraCliente from '../../componentes/barras/BarraCliente';
import BarraMesero from '../../componentes/barras/BarraMesero';
import BarraNormal from "../../componentes/barras/barra_normal";

const Index = () => {
  const { role, setRole } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = () => {
    window.open("https://wa.me/p/7007417162688189/573124875578", "_blank");
  };


  // Efecto para manejar la redirección al iniciar sesión
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    } else {
      navigate('/'); // Redirige a la página de inicio de sesión si no hay rol
    }
  }, [setRole, navigate]);
  
  // Maneja el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('role');
    setRole('normal'); // Restablece el rol al valor por defecto
    navigate('/'); // Redirige al inicio o página deseada
  };
  
  // Determina el componente de la barra de navegación según el rol
  let NavBarComponent = BarraNormal; // Valor por defecto
  if (role === 'administrador') {
    NavBarComponent = BarraAdmin;
  } else if (role === 'Cliente') {
    NavBarComponent = BarraCliente;
  } else if (role === 'mesero') {
    NavBarComponent = BarraMesero;
  }
  
  // Suponiendo que tienes un mecanismo para cambiar el rol tras el inicio de sesión o registro
  const handleLoginOrRegister = (newRole) => {
    localStorage.setItem('role', newRole);
    setRole(newRole); // Cambia el rol según la acción del usuario
    navigate('/'); // O redirige a la página deseada
  };
  
  // Datos del carrusel
  const images = [
    'https://media.istockphoto.com/id/1427778211/es/foto/comida-de-camarones-de-alta-cocina-en-el-plato.jpg?s=612x612&w=0&k=20&c=64-42xcRzHopOTV4NBo8mYCqdJpbs_v6z7K2JMhVNwY=',
    'https://media.istockphoto.com/id/1033045372/es/foto/camar%C3%B3n-frito-con-ajo-pimienta.jpg?s=612x612&w=0&k=20&c=B0-VyYS2qm3w_bO2BKwXE2KHbeZfhQbpmoBhMvRF2HA=',
    'https://media.istockphoto.com/id/1282748421/es/foto/tres-pasteles-de-postre-de-oto%C3%B1o-de-vacaciones-sobre-fondo-negro-semilla-de-amapola-caramelo.jpg?s=612x612&w=0&k=20&c=Fwg3OwXCpD_k-xUIxfFpMza4J0IXdSlwdByde5fIs48=',
    'https://media.istockphoto.com/id/1475100190/es/foto/desenfocado-mesa-oscura-borrosa-en-un-restaurante-o-bar.webp?a=1&b=1&s=612x612&w=0&k=20&c=UatF7bmQaazOckxN3P5ogElyudXnmzCteol5LC86MbA=',
    'https://media.istockphoto.com/id/1170693557/es/foto/c%C3%B3cteles-en-el-fondo-de-la-ciudad-nocturna-h.jpg?s=612x612&w=0&k=20&c=-ZtZt3dXbzrjb23uwPduJa29euIiZLmkzzbfMUnTTgc='
  ];

  const texts = [
    '¡Descubre los sabores únicos de Mila! Cada plato es una experiencia gastronómica inolvidable.',
    'Disfruta de una cena elegante en nuestro gastro bar con una selección de vinos exclusivos.',
    'Nuestra cocina innovadora fusiona ingredientes frescos para crear platillos sorprendentes.',
    'Ven y prueba nuestras deliciosas tapas, perfectas para compartir en un ambiente acogedor.',
    'En Mila, cada comida es una celebración. ¡Reserva tu mesa y vive una experiencia culinaria excepcional!'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const back = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const startAutoSlide = () => {
    const id = setInterval(next, 3000);
    setIntervalId(id);
  };

  const stopAutoSlide = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide(); // Limpiar intervalo al desmontar
  }, []);


  return (
    <div>
      {/* Renderiza la barra de navegación correspondiente */}
      <NavBarComponent />

      {/* Carrusel */}
      <article
        onMouseOver={stopAutoSlide}
        onMouseLeave={startAutoSlide}
        className="relative w-full h-[500px] overflow-hidden shadow-2xl"
      >
        {images.map((image, index) => (
          <figure
            key={index}
            className={`absolute inset-0 w-11/12 h-full mx-auto ${currentIndex === index ? 'block' : 'hidden'}`}
          >
            <img src={image} alt="Image" className="w-full h-full object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gray-900 bg-opacity-60 text-white p-4 text-center text-sm">
              <p>{texts[index]}</p>
            </figcaption>
          </figure>
        ))}

        {/* Botones de navegación */}
        <button onClick={back} className="absolute left-5 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 rounded-full p-3">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <button onClick={next} className="absolute right-5 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 rounded-full p-3">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        {/* Indicadores en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2">
          {images.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full cursor-pointer ${currentIndex === index ? 'bg-yellow-500' : 'bg-gray-400'}`}
            ></span>
          ))}
        </div>
      </article>

      {/* Nuestros Servicios */}
      <div className="container mx-auto pt-5" id="serviciosbarra">
      <div className="relative text-center py-[115px] pb-[35px]">
        <h4 className="tracking-widest text-black hover:text-yellow-500 transition-colors duration-300"><b>Nuestros Servicios</b></h4>
        <h1 className="text-4xl font-bold hover:text-yellow-500 transition-colors duration-300"><b>Comida Fresca & Natural</b></h1>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[2px] h-[100px] bg-[#DA9F5B]"></div>
      </div>
      <div className="flex flex-wrap -mx-4">
        {/* Organización de Eventos */}
        <div className="w-full lg:w-1/2 px-4 mb-5 transition-transform duration-300 ease-in-out transform hover:scale-105">
          <div className="flex items-center">
            <div className="w-2/5">
              <img className="w-full mb-3 lg:mb-0 transition-transform duration-300 ease-in-out hover:scale-105 hover:border-2 hover:border-yellow-400 rounded-lg" 
                   src="https://i.ibb.co/k4BnvTc/service-1-2.jpg" 
                   alt="Organización de Eventos" />
            </div>
            <div className="w-3/5 pl-4">
              <h4 className="text-xl mb-2 hover:text-yellow-500 transition-colors duration-300"><i className="fa fa-calendar service-icon"></i>Organización de Eventos</h4>
              <p className="m-0 transition-transform duration-300 ease-in-out hover:scale-105 hover:text-gray-700">
                En Mila, ofrecemos un servicio de organización de eventos para hacer de tu ocasión especial un momento inolvidable. Nos encargamos de todos los detalles para que tú puedas disfrutar.
              </p>
            </div>
          </div>
        </div>
        {/* Reservas */}
        <div className="w-full lg:w-1/2 px-4 mb-5 transition-transform duration-300 ease-in-out transform hover:scale-105">
          <div className="flex items-center">
            <div className="w-2/5">
              <img className="w-full mb-3 lg:mb-0 transition-transform duration-300 ease-in-out hover:scale-105 hover:border-2 hover:border-yellow-400 rounded-lg" 
                   src="https://i.ibb.co/XX5gPhT/service-2-1.jpg" 
                   alt="Reservas" />
            </div>
            <div className="w-3/5 pl-4">
              <h4 className="text-xl mb-2 hover:text-yellow-500 transition-colors duration-300"><i className="fa fa-book service-icon"></i>Reservas</h4>
              <p className="m-0 transition-transform duration-300 ease-in-out hover:scale-105 hover:text-gray-700">
                Facilitamos el proceso de reservas para que siempre tengas un lugar en nuestro restaurante. Ya sea para una cena con tu pareja o una reunión familiar, puedes reservar con antelación.
              </p>
            </div>
          </div>
        </div>
        {/* Pedidos */}
        <div className="w-full lg:w-1/2 px-4 mb-5 transition-transform duration-300 ease-in-out transform hover:scale-105">
          <div className="flex items-center">
            <div className="w-2/5">
              <img className="w-full mb-3 lg:mb-0 transition-transform duration-300 ease-in-out hover:scale-105 hover:border-2 hover:border-yellow-400 rounded-lg" 
                   src="https://i.ibb.co/sQJ2C9b/service-3-1.jpg" 
                   alt="Pedidos" />
            </div>
            <div className="w-3/5 pl-4">
              <h4 className="text-xl mb-2 hover:text-yellow-500 transition-colors duration-300"><i className="fa fa-bullhorn service-icon"></i>Pedidos</h4>
              <p className="m-0 transition-transform duration-300 ease-in-out hover:scale-105 hover:text-gray-700">
                Realiza tus pedidos de manera rápida y sencilla a través de nuestro sistema en línea. Ofrecemos un servicio eficiente para que disfrutes de tus comidas favoritas sin complicaciones.
              </p>
            </div>
          </div>
        </div>
        {/* Productos */}
        <div className="w-full lg:w-1/2 px-4 mb-5 transition-transform duration-300 ease-in-out transform hover:scale-105">
          <div className="flex items-center">
            <div className="w-2/5">
              <img className="w-full mb-3 lg:mb-0 transition-transform duration-300 ease-in-out hover:scale-105 hover:border-2 hover:border-yellow-400 rounded-lg" 
                   src="https://i.ibb.co/5x7QT98/service-4-1.jpg" 
                   alt="Disfruta con la Familia" />
            </div>
            <div className="w-3/5 pl-4">
              <h4 className="text-xl mb-2 hover:text-yellow-500 transition-colors duration-300"><i className="fa fa-cutlery service-icon"></i>Disfruta con la Familia</h4>
              <p className="m-0 transition-transform duration-300 ease-in-out hover:scale-105 hover:text-gray-700">
                Nuestro compromiso es ofrecerte los mejores productos para que disfrutes con tu familia. Cada plato está elaborado con ingredientes frescos y de calidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="container mx-auto py-5" id="nosotros">
      <div className="relative text-center py-[115px] pb-[35px]">
        <h4 className="tracking-widest text-black hover:text-yellow-500 transition-colors duration-300"><b>Sobre Nosotros</b></h4>
        <h1 className="text-4xl font-bold hover:text-yellow-500 transition-colors duration-300"><b>Sirviendo desde 2018</b></h1>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[2px] h-[100px] bg-[#DA9F5B]"></div>
      </div>
      <div className="flex flex-wrap -mx-4">
        {/* Misión */}
        <div className="w-full lg:w-1/3 px-4 py-5 transition-transform duration-300 ease-in-out transform hover:scale-105">
          <h1 className="text-2xl mb-3 hover:text-yellow-500">Nuestra Misión</h1>
          <p className="transition-all duration-300 ease-in-out hover:text-gray-700">
            En Luz Mila gastro fusión, nuestra misión es ofrecer una experiencia gastronómica única que combina la tradición culinaria con la innovación moderna. Nos comprometemos a utilizar ingredientes frescos y locales, preparados con pasión y creatividad, para deleitar a nuestros clientes con platos que celebran la riqueza de la cocina regional e internacional. Buscamos crear un ambiente acogedor y sofisticado donde cada visita sea memorable y cada plato cuente una historia.
          </p>
        </div>

        {/* Imagen con Efecto Dinámico */}
        <div className="w-full lg:w-1/3 px-4 py-5 relative overflow-hidden rounded-lg">
          <img
            className="w-full h-auto object-cover transform transition-transform duration-300 ease-in-out hover:scale-110"
            src="https://i.ibb.co/ryV7zTy/about-1.png"
            alt="Sobre Nosotros"
          />
          <div className="absolute inset-0 bg-white bg-opacity-80 transition-transform duration-300 ease-in-out transform -translate-y-full hover:translate-y-0 flex items-center justify-center p-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Nuestra Visión</h2>
              <p className="mb-4">
                Ser reconocidos como el gastrobar de referencia en nuestra comunidad, famoso por nuestra cocina excepcional, nuestro servicio al cliente impecable y nuestro compromiso con la sostenibilidad. Aspiramos a expandir nuestra marca y abrir nuevas ubicaciones, manteniendo siempre nuestros valores de calidad y excelencia. Queremos ser un lugar donde las personas se reúnan para celebrar momentos especiales y disfrutar de una experiencia culinaria inigualable.
              </p>
              <h5 className="flex items-center justify-center mb-2">
                <i className="fa fa-check text-yellow-400 mr-2"></i>Los mejores servicios
              </h5>
              <h5 className="flex items-center justify-center">
                <i className="fa fa-check text-yellow-400 mr-2"></i>La mejor calidad en nuestras comidas
              </h5>
            </div>
          </div>
        </div>

        {/* Visión */}
        <div className="w-full lg:w-1/3 px-4 py-5 transition-transform duration-300 ease-in-out transform hover:scale-105">
          <h1 className="text-2xl mb-3 hover:text-yellow-500">Nuestra Visión</h1>
          <p className="transition-all duration-300 ease-in-out hover:text-gray-700">
            Ser reconocidos como el gastrobar de referencia en nuestra comunidad, famoso por nuestra cocina excepcional, nuestro servicio al cliente impecable y nuestro compromiso con la sostenibilidad. Aspiramos a expandir nuestra marca y abrir nuevas ubicaciones, manteniendo siempre nuestros valores de calidad y excelencia. Queremos ser un lugar donde las personas se reúnan para celebrar momentos especiales y disfrutar de una experiencia culinaria inigualable.
          </p>
          <h5 className="flex items-center mb-3">
            <i className="fa fa-check text-yellow-400 mr-2"></i>Los mejores servicios
          </h5>
          <h5 className="flex items-center mb-3">
            <i className="fa fa-check text-yellow-400 mr-2"></i>La mejor calidad en nuestras comidas
          </h5>
        </div>
      </div>

      <div className="container mx-auto pt-5">
        <div className="relative text-center py-[115px] pb-[10px]">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[2px] h-[100px] bg-[#DA9F5B]"></div>
        </div>
      </div>
    </div>
    <div>
            <div className="relative text-center">
                <h4 className="tracking-widest text-black hover:text-yellow-500 transition-colors duration-300" id="porquemila">
                    Ven y visitanos unica sede
                </h4>
                <h1 className="text-4xl font-bold hover:text-yellow-500 transition-colors duration-300">
                    ¡Donde nos encontramos!
                </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                {/* Card 1 */}
                <div className="card border border-[#DAA520] rounded-lg overflow-hidden shadow-lg">
                    <img src="https://th.bing.com/th/id/OIP.hX7WtiaWT6A0qNzqqBq4lwHaEK?w=292&h=180&c=7&r=0&o=5&pid=1.7" 
                         alt="Ambiente Acogedor" 
                         className="w-full h-[200px] object-cover fade" />
                    <hr className="border-t-2 border-[#DAA520] mx-auto w-1/2 my-2" />
                    <div className="p-4">
                        <h3 className="font-bold text-lg fade-title">Ambiente Acogedor</h3>
                        <p className="fade-description">
                            Disfruta de un espacio diseñado para que cada visita sea especial, con una decoración que combina elegancia y confort.
                        </p>
                    </div>
                    <div className="text-right mt-4 w-11/12 h-[10vh]">
                        <a href="eventospasados.html" 
                           className="inline-block px-6 py-3 bg-[#DAA520] text-black font-semibold rounded-lg shadow-md hover:bg-[#d8a25d] transition-colors duration-300">
                            Eventos pasados
                        </a>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="card border border-[#DAA520] rounded-lg overflow-hidden shadow-lg">
                    <img src="https://images.unsplash.com/photo-1639667870348-ac4c31dd31f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGxhdG8lMjBkZSUyMGNvbWlkYXxlbnwwfDB8MHx8fDA%3D" 
                         alt="Menú Innovador" 
                         className="w-full h-[200px] object-cover fade" />
                    <hr className="border-t-2 border-[#DAA520] mx-auto w-1/2 my-2" />
                    <div className="p-4">
                        <h3 className="font-bold text-lg fade-title">Menú Innovador</h3>
                        <p className="fade-description">
                            Explora nuestra variedad de platos únicos que fusionan sabores tradicionales con un toque contemporáneo, perfectos para todos los paladares.
                        </p>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="card border border-[#DAA520] rounded-lg overflow-hidden shadow-lg">
                    <img src="https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEzfHx8ZW58MHx8fHx8" 
                         alt="Bebidas Exclusivas" 
                         className="w-full h-[200px] object-cover fade" />
                    <hr className="border-t-2 border-[#DAA520] mx-auto w-1/2 my-2" />
                    <div className="p-4">
                        <h3 className="font-bold text-lg fade-title">Bebidas Exclusivas</h3>
                        <p className="fade-description">
                            Disfruta de una selección de cócteles artesanales y vinos de alta calidad, ideales para complementar tu experiencia gastronómica.
                        </p>
                    </div>
                    <div className="text-right mt-4 w-11/12 h-[10vh]">
                        <a href="formulario comentarios.html" 
                           className="inline-block px-6 py-3 bg-[#DAA520] text-black font-semibold rounded-lg shadow-md hover:bg-[#d8a25d] transition-colors duration-300">
                            Comentarios
                        </a>
                    </div>
                </div>
            </div>

            <div className="container mx-auto pt-5">
                <div className="relative text-center py-[115px] pb-[10px]">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[2px] h-[100px] bg-[#DA9F5B]"></div>
                </div>
            </div>
      </div>
    
      <div className="relative text-center">
            <h4 className="tracking-widest text-black hover:text-yellow-500 transition-colors duration-300" id="ubicacion">Porque Mila</h4>
            <h1 className="text-4xl font-bold hover:text-yellow-500 transition-colors duration-300">¡Conocenos un poco más!</h1>
            
            <div id="contact" className="text-black py-8">
                <div className="flex flex-col lg:flex-row">
                    <div className="flex flex-col lg:flex-row items-start space-y-8 lg:space-y-0 lg:space-x-8">
                        {/* Mapa (aumentado de tamaño) */}
                        <div className="flex-1 h-[500px] lg:h-[500px] lg:min-h-[500px]">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.7467456711715!2d-74.06769082538494!3d4.639206095335593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a3a7f05c507%3A0xaec53f454f5a6c77!2zS3IgMTMgIzUyLTEwLCBCb2dvdMOh!5e0!3m2!1ses-419!2sco!4v1722490572590!5m2!1ses-419!2sco" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0, borderRadius: '0.5rem' }} 
                                title="Mapa de ubicación" 
                                allowFullScreen 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-cross-origin"
                            ></iframe>
                        </div>

                        {/* Información de contacto y video */}
                        <div className="lg:w-1/2 lg:pl-6">
                            {/* Información de contacto */}
                            <div className="mb-6">
                                <h3 className="text-2xl font-semibold mb-4" id="ubicacion">Ubicación</h3>
                                <p className="text-gray-800 mb-6">
                                    Ven y visítanos en nuestra única sede, comparte nuevas experiencias en nuestro restaurante con tus seres queridos y descubre nuestros sabores en nuestros platos y comidas. Al acudir, podrás disfrutar de diferentes eventos a los que puedes asistir, o tú mismo separar nuestro lugar o una mesa para que tu estadía aquí sea agradable y linda.
                                </p>
                                <div className="text-gray-800">
                                    <p className="flex items-center mb-4">
                                        <i className="fas fa-map-marker-alt mr-3 text-yellow-500"></i> Dirección: Carrera 13 #52 - 10, Bogotá, Colombia
                                    </p>
                                </div>
                            </div>

                            {/* Video */}
                            <div className="w-full">
                                <iframe 
                                    className="w-full h-64 rounded-lg shadow-lg" 
                                    src="https://www.youtube.com/embed/4X7TrySuoAQ?si=bPAWWOF_EWX9C2NV" 
                                    title="Video de presentación" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    referrerPolicy="strict-origin-when-cross-origin" 
                                    allowFullScreen
                                ></iframe>

                                <Link
                                      to="#" // Usamos "#" ya que el enlace real se maneja en onClick
                                      onClick={handleClick}
                                      className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition transform hover:scale-110 duration-300 flex items-center justify-center"
                                      aria-label="WhatsApp"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                      </svg>
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    </div>
  );
};

export default Index;
