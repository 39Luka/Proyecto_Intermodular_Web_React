import { useState, useRef, useCallback, useMemo } from 'react';
import { validators as validatorFunctions } from '../utils/validators';

/**
 * Hook personalizado para validación de formularios en tiempo real
 * 
 * Proporciona una solución completa de validación con:
 * - Validación en tiempo real (onChange) solo después de tocar el campo
 * - Validación al salir del campo (onBlur)
 * - Mensajes de error individuales por campo
 * - Gestión automática de enfoque en errores
 * - Control de estado disabled para botones
 * - Reseteo de formulario
 * 
 * El hook mantiene tres estados principales:
 * 1. values: Los valores actuales de todos los campos
 * 2. errors: Los mensajes de error de cada campo (si tienen)
 * 3. touched: Qué campos ha tocado el usuario (para no mostrar errores prematuros)
 * 
 * @param {Object} initialValues - Valores iniciales del formulario
 *   Objeto con pares clave-valor donde la clave es el nombre del campo
 *   Ejemplo: { email: '', password: '' }
 * 
 * @param {Object} validationRules - Reglas de validación por campo
 *   Objeto donde cada clave es un campo y su valor es un array de reglas
 *   Las reglas pueden ser:
 *   - String: nombre del validador ('required', 'email')
 *   - Object: validador con parámetros ({ type: 'minLength', value: 6 })
 *   - Function: validador personalizado (value, allValues) => error|null
 * 
 * @returns {Object} Objeto con valores, errores, y funciones de manejo
 *   - values: Objeto con todos los valores del formulario
 *   - errors: Objeto con mensajes de error por campo
 *   - touched: Objeto indicando campos que el usuario ha tocado
 *   - handleChange: Function factory para manejar onChange de campos
 *   - handleBlur: Function factory para manejar onBlur de campos
 *   - validateAll: Valida todos los campos y retorna si es válido
 *   - focusFirstError: Enfoca el primer campo con error
 *   - registerField: Registra la referencia de un campo
 *   - isFormValid: Retorna si el formulario es válido actualmente
 *   - resetForm: Resetea el formulario a valores iniciales
 *   - setValues: Setter directo de valores (uso avanzado)
 * 
 * @example
 * // Uso básico
 * const validation = useFormValidation(
 *   { email: '', password: '' },
 *   {
 *     email: ['required', 'email'],
 *     password: ['required', { type: 'minLength', value: 6 }]
 *   }
 * );
 * 
 * // En el JSX
 * <input
 *   value={validation.values.email}
 *   onChange={validation.handleChange('email')}
 *   onBlur={validation.handleBlur('email')}
 * />
 * 
 * // Validar al enviar
 * const handleSubmit = (e) => {
 *   e.preventDefault();
 *   if (!validation.validateAll()) {
 *     validation.focusFirstError();
 *     return;
 *   }
 *   // Proceder con envío...
 * };
 * 
 * @example
 * // Con validador personalizado
 * const validation = useFormValidation(
 *   { age: '' },
 *   {
 *     age: [
 *       'required',
 *       (value) => value >= 18 ? null : 'Debes ser mayor de edad'
 *     ]
 *   }
 * );
 */
export const useFormValidation = (initialValues, validationRules) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const fieldRefs = useRef({});

    // Memoizar validadores para evitar recreación en cada render
    const validators = useMemo(() => validatorFunctions, []);

    /**
     * Valida un campo específico
     * @param {string} fieldName - Nombre del campo a validar
     * @param {*} value - Valor del campo
     * @param {Object} allValues - Todos los valores del formulario
     * @returns {string|null} Mensaje de error o null si es válido
     */
    const validateField = useCallback((fieldName, value, allValues) => {
        const rules = validationRules[fieldName];
        if (!rules) return null;

        for (const rule of rules) {
            let error = null;

            if (typeof rule === 'function') {
                // Regla personalizada
                error = rule(value, allValues);
            } else if (typeof rule === 'string') {
                // Regla predefinida simple (ej: 'required', 'email')
                error = validators[rule]?.(value, allValues);
            } else if (typeof rule === 'object') {
                // Regla con parámetros (ej: {type: 'minLength', value: 6})
                const { type, value: param } = rule;
                error = validators[type]?.(param)(value, allValues);
            }

            if (error) return error;
        }

        return null;
    }, [validationRules, validators]);

    /**
     * Valida todos los campos del formulario
     * @returns {boolean} True si el formulario es válido
     */
    const validateAll = useCallback(() => {
        const newErrors = {};
        let isValid = true;

        Object.keys(validationRules).forEach(fieldName => {
            const error = validateField(fieldName, values[fieldName], values);
            if (error) {
                newErrors[fieldName] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    }, [values, validationRules, validateField]);

    /**
     * Maneja el cambio de valor de un campo
     * @param {string} fieldName - Nombre del campo
     * @returns {Function} Handler de evento onChange
     */
    const handleChange = useCallback((fieldName) => (e) => {
        const value = e.target.value;
        setValues(prev => ({ ...prev, [fieldName]: value }));

        // Validar en tiempo real solo si el campo ya fue tocado
        if (touched[fieldName]) {
            const error = validateField(fieldName, value, { ...values, [fieldName]: value });
            setErrors(prev => ({
                ...prev,
                [fieldName]: error
            }));
        }
    }, [touched, values, validateField]);

    /**
     * Maneja el evento blur (campo tocado)
     * @param {string} fieldName - Nombre del campo
     * @returns {Function} Handler de evento onBlur
     */
    const handleBlur = useCallback((fieldName) => () => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));

        // Validar el campo al perder el foco
        const error = validateField(fieldName, values[fieldName], values);
        setErrors(prev => ({
            ...prev,
            [fieldName]: error
        }));
    }, [values, validateField]);

    /**
     * Enfoca el primer campo con error
     */
    const focusFirstError = useCallback(() => {
        const firstErrorField = Object.keys(errors).find(key => errors[key]);
        if (firstErrorField && fieldRefs.current[firstErrorField]) {
            fieldRefs.current[firstErrorField].focus();
        }
    }, [errors]);

    /**
     * Registra la referencia de un campo
     * @param {string} fieldName - Nombre del campo
     * @returns {Function} Función callback ref
     */
    const registerField = useCallback((fieldName) => (ref) => {
        fieldRefs.current[fieldName] = ref;
    }, []);

    /**
     * Verifica si el formulario es válido
     * @returns {boolean} True si todos los campos son válidos
     */
    const isFormValid = useCallback(() => {
        return Object.keys(validationRules).every(fieldName => {
            const error = validateField(fieldName, values[fieldName], values);
            return !error;
        });
    }, [values, validationRules, validateField]);

    /**
     * Resetea el formulario a sus valores iniciales
     */
    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateAll,
        focusFirstError,
        registerField,
        isFormValid,
        resetForm,
        setValues
    };
};
