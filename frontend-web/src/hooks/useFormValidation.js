import { useState, useRef, useCallback, useMemo } from 'react';
import { validators as validatorFunctions } from '../utils/validators';

/**
 * Hook para gestión de formularios con validación integrada.
 *
 * Centraliza el estado (values, errors, touched), la validación campo a campo
 * y la validación completa del formulario. Soporta tres formatos de regla:
 * - `string`: nombre de un validador predefinido (ej. `"required"`, `"email"`).
 * - `{ type, value }`: validador factory (ej. `{ type: "minLength", value: 6 }`).
 * - `Function`: validador personalizado `(value, allValues) => error|null`.
 *
 * @param {Object.<string, any>} initialValues
 *   Valores iniciales del formulario. Las claves deben coincidir con los nombres de campo.
 * @param {Object.<string, Array>} validationRules
 *   Reglas de validación por campo. Cada valor es un array de reglas en cualquiera de los tres formatos.
 * @returns {{
 *   values: Object,
 *   errors: Object,
 *   touched: Object,
 *   handleChange: (fieldName: string) => (e: Event) => void,
 *   handleBlur: (fieldName: string) => () => void,
 *   validateAll: () => boolean,
 *   focusFirstError: () => void,
 *   registerField: (fieldName: string) => (ref: HTMLElement) => void,
 *   isFormValid: () => boolean,
 *   resetForm: () => void,
 *   setValues: Function
 * }} Objeto con estado y utilidades del formulario.
 *
 * @example
 * const validation = useFormValidation(
 *   { email: '', password: '' },
 *   { email: ['required', 'email'], password: ['required', { type: 'minLength', value: 6 }] }
 * );
 *
 * const handleSubmit = (e) => {
 *   e.preventDefault();
 *   if (!validation.validateAll()) {
 *     validation.focusFirstError();
 *     return;
 *   }
 *   // procesar formulario…
 * };
 */
export const useFormValidation = (initialValues, validationRules) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const fieldRefs = useRef({});

    const validators = useMemo(() => validatorFunctions, []);

    const validateField = useCallback((fieldName, value, allValues) => {
        const rules = validationRules[fieldName];
        if (!rules) return null;

        for (const rule of rules) {
            let error = null;
            if (typeof rule === 'function') {
                error = rule(value, allValues);
            } else if (typeof rule === 'string') {
                error = validators[rule]?.(value, allValues);
            } else if (typeof rule === 'object') {
                const { type, value: param } = rule;
                error = validators[type]?.(param)(value, allValues);
            }
            if (error) return error;
        }
        return null;
    }, [validationRules, validators]);

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

    const handleChange = useCallback((fieldName) => (e) => {
        const value = e.target.value;
        setValues(prev => ({ ...prev, [fieldName]: value }));

        if (touched[fieldName]) {
            const error = validateField(fieldName, value, { ...values, [fieldName]: value });
            setErrors(prev => ({ ...prev, [fieldName]: error }));
        }
    }, [touched, values, validateField]);

    const handleBlur = useCallback((fieldName) => () => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        const error = validateField(fieldName, values[fieldName], values);
        setErrors(prev => ({ ...prev, [fieldName]: error }));
    }, [values, validateField]);

    const focusFirstError = useCallback(() => {
        const firstErrorField = Object.keys(errors).find(key => errors[key]);
        if (firstErrorField && fieldRefs.current[firstErrorField]) {
            fieldRefs.current[firstErrorField].focus();
        }
    }, [errors]);

    const registerField = useCallback((fieldName) => (ref) => {
        fieldRefs.current[fieldName] = ref;
    }, []);

    const isFormValid = useCallback(() => {
        return Object.keys(validationRules).every(fieldName => {
            const error = validateField(fieldName, values[fieldName], values);
            return !error;
        });
    }, [values, validationRules, validateField]);

    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    return {
        values, errors, touched, handleChange, handleBlur,
        validateAll, focusFirstError, registerField, isFormValid, resetForm, setValues
    };
};

