import { describe, it, expect } from "vitest";
import { required, email, minLength, maxLength, match, pattern } from "../../utils/validators";

describe("Validators Utility", () => {
    describe("required", () => {
        // CP-043 | utils/validators | debería retornar un mensaje de error para valores vacíos
        it("debería retornar un mensaje de error para valores vacíos", () => {
            expect(required("")).toBe("Este campo es obligatorio");
            expect(required("   ")).toBe("Este campo es obligatorio");
            expect(required(null)).toBe("Este campo es obligatorio");
            expect(required(undefined)).toBe("Este campo es obligatorio");
        });

        // CP-044 | utils/validators | debería retornar nulo para valores válidos no vacíos

        it("debería retornar nulo para valores válidos no vacíos", () => {
            expect(required("valor")).toBeNull();
            expect(required("a")).toBeNull();
            expect(required("  valor  ")).toBeNull();
        });
    });

    describe("email", () => {
        // CP-045 | utils/validators | debería retornar nulo para valores vacíos
        it("debería retornar nulo para valores vacíos", () => {
            expect(email("")).toBeNull();
            expect(email(null)).toBeNull();
        });

        // CP-046 | utils/validators | debería retornar un error si el valor tiene espacios

        it("debería retornar un error si el valor tiene espacios", () => {
            expect(email("test @example.com")).toBe("No debe contener espacios en blanco");
            expect(email("test ")).toBe("No debe contener espacios en blanco");
        });

        // CP-047 | utils/validators | debería retornar nulo para strings sin espacios en blanco

        it("debería retornar nulo para strings sin espacios en blanco", () => {
            expect(email("test@example.com")).toBeNull();
            expect(email("usuario123")).toBeNull();
        });
    });

    describe("minLength", () => {
        // CP-048 | utils/validators | debería retornar nulo para valores vacíos
        it("debería retornar nulo para valores vacíos", () => {
            const validator = minLength(6);
            expect(validator("")).toBeNull();
            expect(validator(null)).toBeNull();
        });

        // CP-049 | utils/validators | debería retornar un error si el string es más corto que la longitud mínima

        it("debería retornar un error si el string es más corto que la longitud mínima", () => {
            const validator = minLength(6);
            expect(validator("12345")).toBe("Debe tener al menos 6 caracteres");
        });

        // CP-050 | utils/validators | debería retornar nulo si el string iguala o supera la longitud mínima

        it("debería retornar nulo si el string iguala o supera la longitud mínima", () => {
            const validator = minLength(6);
            expect(validator("123456")).toBeNull();
            expect(validator("1234567")).toBeNull();
        });
    });

    describe("match", () => {
        // CP-051 | utils/validators | debería retornar un error si los campos no coinciden
        it("debería retornar un error si los campos no coinciden", () => {
            const validator = match("password");
            expect(validator("123", { password: "456" })).toBe("Los campos no coinciden");
        });

        // CP-052 | utils/validators | debería retornar nulo si los campos coinciden

        it("debería retornar nulo si los campos coinciden", () => {
            const validator = match("password");
            expect(validator("123", { password: "123" })).toBeNull();
        });
    });

    describe("pattern", () => {
        // CP-053 | utils/validators | debería retornar nulo para valores vacíos
        it("debería retornar nulo para valores vacíos", () => {
            const validator = pattern(/^[a-z]+$/, "Solo letras minúsculas");
            expect(validator("")).toBeNull();
            expect(validator(null)).toBeNull();
        });

        // CP-054 | utils/validators | debería retornar un error si el valor no coincide con la expresión regular

        it("debería retornar un error si el valor no coincide con la expresión regular", () => {
            const validator = pattern(/^[a-z]+$/, "Solo letras minúsculas");
            expect(validator("123")).toBe("Solo letras minúsculas");
            expect(validator("abc1")).toBe("Solo letras minúsculas");
        });

        // CP-055 | utils/validators | debería retornar nulo si el valor coincide con la expresión regular

        it("debería retornar nulo si el valor coincide con la expresión regular", () => {
            const validator = pattern(/^[a-z]+$/, "Solo letras minúsculas");
            expect(validator("abc")).toBeNull();
        });
    });

    describe("maxLength", () => {
        // CP-056 | utils/validators | debería retornar nulo para valores vacíos
        it("debería retornar nulo para valores vacíos", () => {
            const validator = maxLength(10);
            expect(validator("")).toBeNull();
            expect(validator(null)).toBeNull();
        });

        // CP-057 | utils/validators | debería retornar un error si el string es más largo que la longitud máxima
        it("debería retornar un error si el string es más largo que la longitud máxima", () => {
            const validator = maxLength(5);
            expect(validator("123456")).toBe("Debe tener como máximo 5 caracteres");
        });

        // CP-058 | utils/validators | debería retornar nulo si el string es menor o igual a la longitud máxima
        it("debería retornar nulo si el string es menor o igual a la longitud máxima", () => {
            const validator = maxLength(5);
            expect(validator("12345")).toBeNull();
            expect(validator("1234")).toBeNull();
        });
    });
});
