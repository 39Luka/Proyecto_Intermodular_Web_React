import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__column">
          <h3 className="footer__title">La Croassantina</h3>
          <p className="footer__text">
            Hojaldre, cafe y productos recien hechos con una experiencia digital mas cuidada.
          </p>
        </div>

        <div className="footer__column">
          <h3 className="footer__title">Explorar</h3>
          <Link className="footer__link" to="/home">Inicio</Link>
          <Link className="footer__link" to="/products">Catalogo</Link>
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
