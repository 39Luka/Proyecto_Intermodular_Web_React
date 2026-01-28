/**
 * Componente reutilizable para campos de formulario con validación
 * 
 * Este componente encapsula toda la lógica necesaria para renderizar un campo
 * de formulario con validación, incluyendo:
 * - Input con estilos de error dinámicos
 * - Label asociado correctamente
 * - Mensaje de error debajo del campo
 * - Atributos ARIA para accesibilidad
 * - Gestión automática de referencias (refs) para enfoque
 * 
 * Reduce el código repetitivo de ~20 líneas por campo a solo 1 línea,
 * manteniendo toda la funcionalidad de validación y accesibilidad.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * 
 * @param {string} props.name - Nombre único del campo
 *   Debe coincidir con la clave en initialValues y validationRules
 *   Se usa para el atributo 'name' e 'id' del input
 *   Ejemplo: "email", "password", "confirmPassword"
 * 
 * @param {string} props.label - Texto visible de la etiqueta
 *   Se muestra encima del input como label
 *   Debe ser descriptivo para el usuario
 *   Ejemplo: "Email", "Contraseña", "Repetir contraseña"
 * 
 * @param {string} [props.type='text'] - Tipo de input HTML
 *   Controla el comportamiento y teclado del input
 *   Valores comunes: 'text', 'email', 'password', 'number', 'tel'
 *   Por defecto: 'text'
 * 
 * @param {string} [props.placeholder=''] - Texto placeholder del input
 *   Texto de ayuda que aparece cuando el input está vacío
 *   Por defecto: cadena vacía
 * 
 * @param {Object} props.validation - Objeto retornado por useFormValidation
 *   REQUERIDO: Este objeto debe contener:
 *   - values: Objeto con valores del formulario
 *   - errors: Objeto con mensajes de error
 *   - touched: Objeto con campos tocados
 *   - handleChange: Función para manejar cambios
 *   - handleBlur: Función para manejar blur
 *   - registerField: Función para registrar referencias
 * 
 * @returns {JSX.Element} Campo de formulario completo con validación
 * 
 * @example
 * // Uso básico con tipo de texto
 * <FormField
 *   name="username"
 *   label="Nombre de usuario"
 *   type="text"
 *   validation={validation}
 * />
 * 
 * @example
 * // Campo de email
 * <FormField
 *   name="email"
 *   label="Email"
 *   type="email"
 *   placeholder="tu@email.com"
 *   validation={validation}
 * />
 * 
 * @example
 * // Campo de contraseña
 * <FormField
 *   name="password"
 *   label="Contraseña"
 *   type="password"
 *   validation={validation}
 * />
 * 
 * @example
 * // Uso completo en un formulario
 * function MyForm() {
 *   const validation = useFormValidation(
 *     { email: '', password: '' },
 *     { email: ['required', 'email'], password: ['required'] }
 *   );
 *   
 *   return (
 *     <form>
 *       <FormField name="email" label="Email" type="email" validation={validation} />
 *       <FormField name="password" label="Password" type="password" validation={validation} />
 *     </form>
 *   );
 * }
 */
function FormField({
    name,
    label,
    type = 'text',
    placeholder = '',
    validation
}) {
    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        registerField
    } = validation;

    const hasError = touched[name] && errors[name];
    const errorId = `${name}-error`;

    return (
        <div className="auth-field">
            <label htmlFor={name}>{label}</label>
            <input
                ref={registerField(name)}
                id={name}
                name={name}
                type={type}
                className={hasError ? 'error' : ''}
                value={values[name] || ''}
                onChange={handleChange(name)}
                onBlur={handleBlur(name)}
                placeholder={placeholder}
                aria-invalid={hasError ? 'true' : 'false'}
                aria-describedby={errors[name] ? errorId : undefined}
            />
            {hasError && (
                <span id={errorId} className="auth-field__error">
                    {errors[name]}
                </span>
            )}
        </div>
    );
}

export default FormField;
