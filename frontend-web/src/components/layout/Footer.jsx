import { Link } from "react-router-dom";

/**
 * Pie de página global de la aplicación.
 *
 * Muestra tres columnas con información de marca, enlaces de exploración
 * y datos de contacto. Incluye el año actual calculado dinámicamente.
 * No acepta props.
 *
 * @component
 * @returns {JSX.Element} Elemento `<footer>` con columnas informativas.
 *
 * @example
 * // Se incluye en el layout principal de la app
 * <Footer />
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__column">
          <h3 className="footer__title">La Croassantina</h3>
          <p className="footer__text">
            Hojaldre, café y productos recién hechos con una experiencia digital más cuidada.
          </p>
        </div>

        <div className="footer__column">
          <h3 className="footer__title">Explorar</h3>
          <Link className="footer__link" to="/home">Inicio</Link>
          <Link className="footer__link" to="/products">Catálogo</Link>
          <Link className="footer__link" to="/promo">Promociones</Link>
        </div>

        <div className="footer__column">
          <h3 className="footer__title">Taller</h3>
          <p className="footer__text">Madrid</p>
          <p className="footer__text">Pedidos diarios y recogida preparada</p>
          <p className="footer__text">hola@lacroassantina.es</p>
        </div>
      </div>

      <div className="footer__bottom">
        &copy; {new Date().getFullYear()} La Croassantina. Hecho para vender mejor y verse mejor.
      </div>
    </footer>
  );
}
