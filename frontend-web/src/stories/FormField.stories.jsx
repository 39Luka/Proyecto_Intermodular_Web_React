import FormField from "../components/forms/FormField";


/**
 * Campo de formulario reutilizable con validación integrada.
 *
 * Encapsula label, input, mensajes de error y toggle de contraseña.
 */
export default {
    title: "Forms/FormField",
    component: FormField,
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component:
                    "Componente reutilizable para campos de formulario. Integra label, input con estilos de error, toggle de visibilidad para contraseñas y atributos ARIA para accesibilidad.",
            },
        },
    },
};

/** Helper para crear una validación mock interactiva */
const createMockValidation = (initialValues = {}) => {
    const values = { ...initialValues };
    return {
        values,
        errors: {},
        touched: {},
        handleChange: () => () => {},
        handleBlur: () => () => {},
        registerField: () => () => {},
    };
};

/** Campo de texto básico */
export const TextoBasico = {
    args: {
        name: "username",
        label: "Nombre de usuario",
        type: "text",
        placeholder: "Introduce tu nombre",
        validation: createMockValidation({ username: "" }),
    },
};

/** Campo de email */
export const Email = {
    args: {
        name: "email",
        label: "Correo electrónico",
        type: "email",
        placeholder: "tu@email.com",
        validation: createMockValidation({ email: "" }),
    },
};

/** Campo de contraseña (con toggle de visibilidad) */
export const Password = {
    args: {
        name: "password",
        label: "Contraseña",
        type: "password",
        placeholder: "••••••••",
        validation: createMockValidation({ password: "" }),
    },
};

/** Campo con error de validación visible */
export const ConError = {
    args: {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "tu@email.com",
        validation: {
            values: { email: "test" },
            errors: { email: "Introduce un email válido" },
            touched: { email: true },
            handleChange: () => () => {},
            handleBlur: () => () => {},
            registerField: () => () => {},
        },
    },
};

/** Campo con valor rellenado */
export const ConValor = {
    args: {
        name: "email",
        label: "Email",
        type: "email",
        validation: {
            values: { email: "usuario@lacroassantina.es" },
            errors: {},
            touched: {},
            handleChange: () => () => {},
            handleBlur: () => () => {},
            registerField: () => () => {},
        },
    },
};
