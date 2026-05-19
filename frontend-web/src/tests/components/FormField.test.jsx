import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormField from '../../components/forms/FormField';

describe('FormField Component', () => {
    const mockValidation = {
        values: { email: '', password: '' },
        errors: {},
        touched: {},
        handleChange: vi.fn(() => vi.fn()),
        handleBlur: vi.fn(() => vi.fn()),
        registerField: vi.fn(() => vi.fn())
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // CP-008 | components/FormField | renderiza la etiqueta y el input correctamente

    it('renderiza la etiqueta y el input correctamente', () => {
        render(<FormField name="email" label="Email" type="email" validation={mockValidation} />);
        
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    // CP-009 | components/FormField | muestra el mensaje de error cuando el campo ha sido tocado y tiene error

    it('muestra el mensaje de error cuando el campo ha sido tocado y tiene error', () => {
        const errorValidation = {
            ...mockValidation,
            errors: { email: 'Este campo es obligatorio' },
            touched: { email: true }
        };

        render(<FormField name="email" label="Email" validation={errorValidation} />);
        
        const errorSpan = screen.getByText('Este campo es obligatorio');
        expect(errorSpan).toBeInTheDocument();
        expect(errorSpan).toHaveClass('auth-field__error');
        expect(screen.getByRole('textbox')).toHaveClass('error');
    });

    // CP-010 | components/FormField | alterna la visibilidad de la contraseña al hacer clic en el botón del ojo

    it('alterna la visibilidad de la contraseña al hacer clic en el botón del ojo', async () => {
        render(<FormField name="password" label="Contraseña" type="password" validation={mockValidation} />);
        
        // El input inicialmente debería ser de tipo password
        const passwordInput = screen.getByLabelText('Contraseña');
        expect(passwordInput).toHaveAttribute('type', 'password');

        // Buscar el botón de alternar visibilidad
        const toggleButton = screen.getByRole('button', { name: /Mostrar contraseña/i });
        
        // Simular clic
        const user = userEvent.setup();
        await user.click(toggleButton);

        // Ahora el input debería ser tipo texto
        expect(passwordInput).toHaveAttribute('type', 'text');
        
        // El aria-label del botón debería haber cambiado
        expect(screen.getByRole('button', { name: /Ocultar contraseña/i })).toBeInTheDocument();
    });
});
