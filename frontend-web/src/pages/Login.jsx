import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/forms/FormField";
import { useAuth } from "../hooks/useAuth";
import { useFormValidation } from "../hooks/useFormValidation";
import { LOGIN_INITIAL_VALUES, LOGIN_VALIDATION_SCHEMA } from "../utils/validationSchemas";

function Login() {
    const [serverError, setServerError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const validation = useFormValidation(LOGIN_INITIAL_VALUES, LOGIN_VALIDATION_SCHEMA);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setServerError("");

        const isValid = validation.validateAll();
        if (!isValid) {
            validation.focusFirstError();
            return;
        }

        setIsLoading(true);
        try {
            await login(validation.values.email, validation.values.password);
            navigate("/home");
        } catch {
            setServerError("No se pudo iniciar sesión. Revisa tus credenciales.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-image" aria-hidden="true" />
            <div className="auth-form-wrapper">
                <div className={`auth-form ${isLoading ? "form-loading" : ""}`}>
                    <h1 className="auth-title">Iniciar sesión</h1>

                    <form onSubmit={handleSubmit} noValidate>
                        <FormField name="email" label="Email" type="email" validation={validation} />
                        <FormField name="password" label="Contraseña" type="password" validation={validation} />

                        {serverError && <p className="auth-error" role="alert">{serverError}</p>}

                        <button type="submit" className="auth-submit" disabled={isLoading || !validation.isFormValid()}>
                            {isLoading ? (
                                <span className="loading-wrapper">
                                    <span className="spinner-mini"></span>
                                    Entrando...
                                </span>
                            ) : (
                                "Entrar"
                            )}
                        </button>
                    </form>

                    <p className="auth-link">
                        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
