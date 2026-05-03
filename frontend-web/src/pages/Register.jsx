import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/forms/FormField";
import { useAuth } from "../hooks/useAuth";
import { useFormValidation } from "../hooks/useFormValidation";
import { REGISTER_INITIAL_VALUES, REGISTER_VALIDATION_SCHEMA } from "../utils/validationSchemas";

function Register() {
    const [serverError, setServerError] = useState("");
    const navigate = useNavigate();
    const { register } = useAuth();

    const validation = useFormValidation(REGISTER_INITIAL_VALUES, REGISTER_VALIDATION_SCHEMA);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setServerError("");

        const isValid = validation.validateAll();
        if (!isValid) {
            validation.focusFirstError();
            return;
        }

        try {
            await register(validation.values.name, validation.values.email, validation.values.password);
            navigate("/home");
        } catch {
            setServerError("No se pudo registrar la cuenta. Prueba con otro email.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-image" aria-hidden="true" />
            <div className="auth-form-wrapper">
                <div className="auth-form">
                    <h1 className="auth-title">Crear cuenta</h1>

                    <form onSubmit={handleSubmit} noValidate>
                        <FormField name="name" label="Nombre de usuario" type="text" validation={validation} />
                        <FormField name="email" label="Email" type="email" validation={validation} />
                        <FormField name="password" label="Contrasena" type="password" validation={validation} />
                        <FormField name="confirmPassword" label="Repite contrasena" type="password" validation={validation} />

                        {serverError && <p className="auth-error" role="alert">{serverError}</p>}

                        <button type="submit" className="auth-submit" disabled={!validation.isFormValid()}>
                            Crear cuenta
                        </button>
                    </form>

                    <p className="auth-link">
                        Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
