import React from 'react';

import { Header } from './Header';
import './page.css';

export const Page = () => {
  const [user, setUser] = React.useState();

  return (
    <article>
      <Header
        user={user}
        onLogin={() => setUser({ name: 'Jane Doe' })}
        onLogout={() => setUser(undefined)}
        onCreateAccount={() => setUser({ name: 'Jane Doe' })}
      />

      <section className="storybook-page">
        <h2>Páginas en Storybook</h2>
        <p>
          Recomendamos construir interfaces de usuario con un proceso{' '}
          <a href="https://componentdriven.org" target="_blank" rel="noopener noreferrer">
            <strong>basado en componentes (component-driven)</strong>
          </a>{' '}
          empezando con componentes atómicos y terminando con páginas.
        </p>
        <p>
          Renderiza páginas con datos ficticios (mock data). Esto facilita la construcción y revisión de los estados de la página sin necesidad de navegar a ellos en tu aplicación. Aquí tienes algunos patrones prácticos para gestionar datos de páginas en Storybook:
        </p>
        <ul>
          <li>
            Usa un componente conectado de nivel superior. Storybook te ayuda a componer dichos datos a partir de los "args" de las historias de los componentes hijo.
          </li>
          <li>
            Reúne datos en el componente de página a partir de tus servicios. Puedes simular (mock) estos servicios usando Storybook.
          </li>
        </ul>
        <p>
          Accede a un tutorial guiado sobre desarrollo basado en componentes en{' '}
          <a href="https://storybook.js.org/tutorials/" target="_blank" rel="noopener noreferrer">
            Tutoriales de Storybook
          </a>
          . Lee más en la{' '}
          <a href="https://storybook.js.org/docs" target="_blank" rel="noopener noreferrer">
            documentación
          </a>
          .
        </p>
        <div className="tip-wrapper">
          <span className="tip">Consejo</span> Ajusta el ancho del lienzo con el{' '}
          <svg width="10" height="10" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <path
                d="M1.5 5.2h4.8c.3 0 .5.2.5.4v5.1c-.1.2-.3.3-.4.3H1.4a.5.5 0 01-.5-.4V5.7c0-.3.2-.5.5-.5zm0-2.1h6.9c.3 0 .5.2.5.4v7a.5.5 0 01-1 0V4H1.5a.5.5 0 010-1zm0-2.1h9c.3 0 .5.2.5.4v9.1a.5.5 0 01-1 0V2H1.5a.5.5 0 010-1zm4.3 5.2H2V10h3.8V6.2z"
                id="a"
                fill="#999"
              />
            </g>
          </svg>{' '}
          complemento de Viewports en la barra de herramientas.
        </div>
      </section>
    </article>
  );
};
