import { useState } from "react";

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

    const [showPassword, setShowPassword] = useState(false);

    const hasError = touched[name] && errors[name];
    const errorId = `${name}-error`;
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="auth-field">
            <label htmlFor={name}>{label}</label>
            <div className="auth-field__input-wrapper">
                <input
                    ref={registerField(name)}
                    id={name}
                    name={name}
                    type={inputType}
                    className={hasError ? 'error' : ''}
                    value={values[name] || ''}
                    onChange={handleChange(name)}
                    onBlur={handleBlur(name)}
                    placeholder={placeholder}
                    aria-invalid={hasError ? 'true' : 'false'}
                    aria-describedby={errors[name] ? errorId : undefined}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="auth-field__toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        tabIndex="-1"
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                    </button>
                )}
            </div>
            {hasError && (
                <span id={errorId} className="auth-field__error">
                    {errors[name]}
                </span>
            )}
        </div>
    );
}

export default FormField;
