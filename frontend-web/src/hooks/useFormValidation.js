import { useState, useRef, useCallback, useMemo } from 'react';
import { validators as validatorFunctions } from '../utils/validators';

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

