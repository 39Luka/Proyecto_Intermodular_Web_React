/**
 * Validadores predefinidos para formularios
 * 
 * Este módulo contiene funciones de validación reutilizables que pueden
 * aplicarse a cualquier campo de formulario. Cada validador sigue el mismo
 * patrón: recibe un valor y retorna null si es válido, o un mensaje de error.
 * 
 * @module validators
 * @example
 * // Usar un validador directamente
 * const error = required(''); // "Este campo es obligatorio"
 * const noError = required('valor'); // null
 */

/**
 * Valida que un campo no esté vacío
 * 
 * Comprueba que el valor no sea null, undefined, o una cadena vacía/espacios.
 * Es el validador más común para campos obligatorios.
 * 
 * @param {string} value - Valor del campo a validar
 * @returns {string|null} Mensaje de error si es inválido, null si es válido
 * 
 * @example
 * required('');          // "Este campo es obligatorio"
 * required('   ');       // "Este campo es obligatorio"
 * required('valor');     // null
 * required(null);        // "Este campo es obligatorio"
 */
export const required = (value) => {
    return value && value.trim() !== '' ? null : 'Este campo es obligatorio';
};

/**
 * Valida formato de email
 * 
 * Comprueba que el email tenga un formato válido básico:
 * - Tiene caracteres antes del @
 * - Tiene un @ en el medio
 * - Tiene un dominio después del @
 * - Tiene un punto en el dominio
 * 
 * Nota: No valida si el email existe, solo el formato.
 * 
 * @param {string} value - Valor del campo a validar
 * @returns {string|null} Mensaje de error si es inválido, null si es válido
 * 
 * @example
 * email('test@example.com');  // null (válido)
 * email('test@example');      // "Introduce un email válido"
 * email('test');              // "Introduce un email válido"
 * email('');                  // null (permite vacío, combinar con required)
 */
export const email = (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Introduce un email válido';
};

/**
 * Crea un validador de longitud mínima
 * 
 * Factory function que retorna un validador configurado con una longitud mínima.
 * Útil para contraseñas, nombres de usuario, etc.
 * 
 * @param {number} min - Longitud mínima requerida en caracteres
 * @returns {Function} Función validadora que acepta (value) => error|null
 * 
 * @example
 * const validatePassword = minLength(6);
 * validatePassword('12345');     // "Debe tener al menos 6 caracteres"
 * validatePassword('123456');    // null
 * 
 * // Uso en esquema de validación:
 * password: [{ type: 'minLength', value: 6 }]
 */
export const minLength = (min) => (value) => {
    if (!value) return null;
    return value.length >= min ? null : `Debe tener al menos ${min} caracteres`;
};

/**
 * Crea un validador de coincidencia de campos
 * 
 * Factory function que retorna un validador que compara dos campos.
 * Útil para confirmación de contraseña, email, etc.
 * 
 * @param {string} fieldName - Nombre del campo con el que debe coincidir
 * @returns {Function} Función validadora que acepta (value, allValues) => error|null
 * 
 * @example
 * const validateConfirmPassword = match('password');
 * 
 * // En el formulario:
 * validateConfirmPassword('abc123', { password: 'abc123' });  // null
 * validateConfirmPassword('abc123', { password: 'xyz789' });  // "Los campos no coinciden"
 * 
 * // Uso en esquema de validación:
 * confirmPassword: [{ type: 'match', value: 'password' }]
 */
export const match = (fieldName) => (value, allValues) => {
    return value === allValues[fieldName] ? null : 'Los campos no coinciden';
};

/**
 * Crea un validador de patrón regex personalizado
 * 
 * Factory function para validaciones personalizadas usando expresiones regulares.
 * Permite crear validadores para formatos específicos (teléfono, código postal, etc.)
 * 
 * @param {RegExp} regex - Expresión regular a validar
 * @param {string} message - Mensaje de error personalizado
 * @returns {Function} Función validadora que acepta (value) => error|null
 * 
 * @example
 * // Validar solo letras
 * const validateOnlyLetters = pattern(/^[a-zA-Z]+$/, 'Solo se permiten letras');
 * validateOnlyLetters('abc');    // null
 * validateOnlyLetters('abc123'); // "Solo se permiten letras"
 * 
 * // Validar código postal español
 * const validateCP = pattern(/^\d{5}$/, 'Código postal debe tener 5 dígitos');
 * validateCP('28001');    // null
 * validateCP('2800');     // "Código postal debe tener 5 dígitos"
 */
export const pattern = (regex, message) => (value) => {
    if (!value) return null;
    return regex.test(value) ? null : message;
};

/**
 * Objeto con todos los validadores disponibles
 * 
 * Exportación conveniente para importar todos los validadores a la vez.
 * Usado internamente por el hook useFormValidation.
 * 
 * @constant {Object}
 * @property {Function} required - Valida campo obligatorio
 * @property {Function} email - Valida formato email
 * @property {Function} minLength - Factory para validación de longitud mínima
 * @property {Function} match - Factory para validación de coincidencia
 * @property {Function} pattern - Factory para validación por regex
 * 
 * @example
 * import { validators } from './validators';
 * const error = validators.required('');
 */
export const validators = {
    required,
    email,
    minLength,
    match,
    pattern
};
