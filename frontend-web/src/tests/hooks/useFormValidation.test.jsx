import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from '../../hooks/useFormValidation';



describe('useFormValidation', () => {
    const initialValues = {
        name: '',
        email: ''
    };

    const rules = {
        name: ['required'],
        email: ['required', 'email']
    };

    // CP-021 | hooks/useFormValidation | debería inicializarse con valores y sin errores

    it('debería inicializarse con valores y sin errores', () => {
        const { result } = renderHook(() => useFormValidation(initialValues, rules));
        
        expect(result.current.values).toEqual(initialValues);
        expect(result.current.errors).toEqual({});
        expect(result.current.touched).toEqual({});
    });

    // CP-022 | hooks/useFormValidation | debería validar todos los campos y actualizar el estado correctamente

    it('debería validar todos los campos y actualizar el estado correctamente', () => {
        const { result } = renderHook(() => useFormValidation(initialValues, rules));

        let isValid;
        act(() => {
            isValid = result.current.validateAll();
        });

        expect(isValid).toBe(false);
        expect(result.current.errors).toHaveProperty('name', 'Este campo es obligatorio');
        expect(result.current.errors).toHaveProperty('email', 'Este campo es obligatorio');
    });

    // CP-023 | hooks/useFormValidation | debería manejar cambios y reiniciar validación si no ha sido tocado

    it('debería manejar cambios y reiniciar validación si no ha sido tocado', () => {
        const { result } = renderHook(() => useFormValidation(initialValues, rules));

        act(() => {
            result.current.handleChange('name')({ target: { value: 'John' } });
        });

        expect(result.current.values.name).toBe('John');
        expect(result.current.errors.name).toBeUndefined(); // Porque el campo no ha sido tocado aún
    });

    // CP-024 | hooks/useFormValidation | debería validar en el evento blur

    it('debería validar en el evento blur', () => {
        const { result } = renderHook(() => useFormValidation(initialValues, rules));

        act(() => {
            result.current.handleBlur('name')();
        });

        expect(result.current.touched.name).toBe(true);
        expect(result.current.errors.name).toBe('Este campo es obligatorio');
    });

    // CP-025 | hooks/useFormValidation | debería restablecer el formulario correctamente

    it('debería restablecer el formulario correctamente', () => {
        const { result } = renderHook(() => useFormValidation(initialValues, rules));

        act(() => {
            result.current.handleChange('name')({ target: { value: 'John' } });
            result.current.handleBlur('name')();
            result.current.resetForm();
        });

        expect(result.current.values).toEqual(initialValues);
        expect(result.current.errors).toEqual({});
        expect(result.current.touched).toEqual({});
    });
});
