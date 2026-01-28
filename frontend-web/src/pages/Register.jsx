import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFormValidation } from "../hooks/useFormValidation";
import { REGISTER_VALIDATION_SCHEMA, REGISTER_INITIAL_VALUES } from "../utils/validationSchemas";
import FormField from "../components/forms/FormField";

function Register() {
    const [serverError, setServerError] = useState("");
    const navigate = useNavigate();
    const { register } = useAuth();

    // Configurar validación del formulario
    const validation = useFormValidation(
        REGISTER_INITIAL_VALUES,
        REGISTER_VALIDATION_SCHEMA
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        // Validar todos los campos
        const isValid = validation.validateAll();

        if (!isValid) {
            validation.focusFirstError();
            return;
        }

        try {
            await register(validation.values.name, validation.values.email, validation.values.password);
            navigate("/");
        } catch (err) {
            setServerError("Error al registrarse. Intenta con otro email.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-image">
                {/* Placeholder for bread image */}
            </div>
            <div className="auth-form-wrapper">
                <div className="auth-form">
                    <div className="auth-icon">
                        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30 40 Q20 30 30 20 L50 15 L70 20 Q80 30 70 40 L50 50 Z" stroke="#5B21B6" strokeWidth="3" fill="none" />
                            <ellipse cx="35" cy="28" rx="8" ry="10" stroke="#5B21B6" strokeWidth="2" fill="none" />
                            <ellipse cx="50" cy="25" rx="8" ry="10" stroke="#5B21B6" strokeWidth="2" fill="none" />
                            <ellipse cx="65" cy="28" rx="8" ry="10" stroke="#5B21B6" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                    <h1 className="auth-title">Registrarse</h1>

                    <form onSubmit={handleSubmit} noValidate>
                        <FormField
                            name="name"
                            label="Nombre Usuario"
                            type="text"
                            validation={validation}
                        />

                        <FormField
                            name="email"
                            label="Email"
                            type="email"
                            validation={validation}
                        />

                        <FormField
                            name="password"
                            label="Contraseña"
                            type="password"
                            validation={validation}
                        />

                        <FormField
                            name="confirmPassword"
                            label="Repetir contraseña"
                            type="password"
                            validation={validation}
                        />

                        {serverError && <p className="auth-error">{serverError}</p>}

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={!validation.isFormValid()}
                        >
                            Registrar
                        </button>
                    </form>

                    <p className="auth-link">
                        ¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
