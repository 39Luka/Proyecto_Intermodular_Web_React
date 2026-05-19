import React from 'react';

import PropTypes from 'prop-types';

import './button.css';

/** Componente de interfaz de usuario principal para la interacción del usuario */
export const Button = ({
  primary = false,
  backgroundColor = null,
  size = 'medium',
  label,
  ...props
}) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  return (
    <button
      type="button"
      className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
      style={backgroundColor && { backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  /** ¿Es este el botón de llamada a la acción principal de la página? */
  primary: PropTypes.bool,
  /** Qué color de fondo utilizar */
  backgroundColor: PropTypes.string,
  /** Qué tamaño debe tener el botón */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Contenido del botón */
  label: PropTypes.string.isRequired,
  /** Manejador de clic opcional */
  onClick: PropTypes.func,
};
