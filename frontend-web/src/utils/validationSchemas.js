/**
 * Esquemas de validación predefinidos para formularios
 * 
 * Este módulo contiene las configuraciones de validación y valores iniciales
 * para los diferentes formularios de la aplicación. Centralizar estos esquemas
 * facilita el mantenimiento y la reutilización de lógica de validación.
 * 
 * @module validationSchemas
 */

/**
 * Esquema de validación para formulario de login
 * 
 * Define las reglas de validación para cada campo del formulario de inicio de sesión.
 * Estas reglas se aplican automáticamente por el hook useFormValidation.
 * 
 * @constant {Object}
 * @property {Array} email - Reglas para el campo email
 *   - 'required': Campo obligatorio
 *   - 'email': Debe tener formato de email válido
 * @property {Array} password - Reglas para el campo contraseña
 *   - 'required': Campo obligatorio
 *   - minLength(6): Debe tener al menos 6 caracteres
 * 
 * @example
 * const validation = useFormValidation(
 *   LOGIN_INITIAL_VALUES,
 *   LOGIN_VALIDATION_SCHEMA
 * );
 */
export const LOGIN_VALIDATION_SCHEMA = {
    email: ['required', 'email'],
    password: ['required', { type: 'minLength', value: 6 }]
};

/**
 * Esquema de validación para formulario de registro
 * 
 * Define las reglas de validación para cada campo del formulario de registro.
 * Incluye validación de coincidencia de contraseñas.
 * 
 * @constant {Object}
 * @property {Array} name - Reglas para el campo nombre
 *   - 'required': Campo obligatorio
 *   - minLength(3): Debe tener al menos 3 caracteres
 * @property {Array} email - Reglas para el campo email
 *   - 'required': Campo obligatorio
 *   - 'email': Debe tener formato de email válido
 * @property {Array} password - Reglas para el campo contraseña
 *   - 'required': Campo obligatorio
 *   - minLength(6): Debe tener al menos 6 caracteres
 * @property {Array} confirmPassword - Reglas para confirmación de contraseña
 *   - 'required': Campo obligatorio
 *   - match('password'): Debe coincidir con el campo password
 * 
 * @example
 * const validation = useFormValidation(
 *   REGISTER_INITIAL_VALUES,
 *   REGISTER_VALIDATION_SCHEMA
 * );
 */
export const REGISTER_VALIDATION_SCHEMA = {
    name: ['required', { type: 'minLength', value: 3 }],
    email: ['required', 'email'],
    password: ['required', { type: 'minLength', value: 6 }],
    confirmPassword: ['required', { type: 'match', value: 'password' }]
};

/**
 * Valores iniciales para formulario de login
 * 
 * Objeto con los valores por defecto de todos los campos del formulario de login.
 * Se pasa como primer parámetro al hook useFormValidation.
 * 
 * @constant {Object}
 * @property {string} email - Email vacío por defecto
 * @property {string} password - Contraseña vacía por defecto
 * 
 * @example
 * const validation = useFormValidation(
 *   LOGIN_INITIAL_VALUES,  // { email: '', password: '' }
 *   LOGIN_VALIDATION_SCHEMA
 * );
 */
export const LOGIN_INITIAL_VALUES = {
    email: '',
    password: ''
};

/**
 * Valores iniciales para formulario de registro
 * 
 * Objeto con los valores por defecto de todos los campos del formulario de registro.
 * Incluye todos los campos necesarios para el proceso de registro de usuario.
 * 
 * @constant {Object}
 * @property {string} name - Nombre vacío por defecto
 * @property {string} email - Email vacío por defecto
 * @property {string} password - Contraseña vacía por defecto
 * @property {string} confirmPassword - Confirmación vacía por defecto
 * 
 * @example
 * const validation = useFormValidation(
 *   REGISTER_INITIAL_VALUES,
 *   REGISTER_VALIDATION_SCHEMA
 * );
 */
export const REGISTER_INITIAL_VALUES = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
};
