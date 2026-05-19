import { describe, it, expect } from "vitest";
import { formatStatus, formatDate, formatPrice } from "../../utils/formatters";

describe("Formatters Utility", () => {
    describe("formatStatus", () => {
        // CP-026 | utils/formatters | debería retornar Desconocido para estado vacío o nulo
        it("debería retornar Desconocido para estado vacío o nulo", () => {
            expect(formatStatus(null)).toBe("Desconocido");
            expect(formatStatus(undefined)).toBe("Desconocido");
            expect(formatStatus("")).toBe("Desconocido");
        });

        // CP-027 | utils/formatters | debería traducir estados conocidos al español

        it("debería traducir estados conocidos al español", () => {
            expect(formatStatus("CREATED")).toBe("Creada");
            expect(formatStatus("PAID")).toBe("Pagada");
            expect(formatStatus("CANCELLED")).toBe("Cancelada");
        });

        // CP-028 | utils/formatters | debería volver al formato de texto crudo para estados desconocidos

        it("debería volver al formato de texto crudo para estados desconocidos", () => {
            expect(formatStatus("PROCESSING_ORDER")).toBe("PROCESSING ORDER");
            expect(formatStatus("SHIPPED")).toBe("SHIPPED");
        });
    });

    describe("formatDate", () => {
        // CP-029 | utils/formatters | debería retornar un string vacío para entradas vacías
        it("debería retornar un string vacío para entradas vacías", () => {
            expect(formatDate("")).toBe("");
            expect(formatDate(null)).toBe("");
            expect(formatDate(undefined)).toBe("");
        });

        // CP-030 | utils/formatters | debería formatear fechas válidas correctamente en formato es-ES

        it("debería formatear fechas válidas correctamente en formato es-ES", () => {
            // "2025-03-15" resultará en la presentación de fecha local estándar en español
            const formatted = formatDate("2025-03-15T12:00:00");
            expect(formatted).toContain("15");
            expect(formatted).toContain("2025");
        });

        // CP-031 | utils/formatters | debería retornar el string original si el parseo falla

        it("debería retornar el string original si el parseo falla", () => {
            expect(formatDate("not-a-date")).toBe("not-a-date");
        });
    });

    describe("formatPrice", () => {
        // CP-032 | utils/formatters | debería retornar un string vacío para null/undefined
        it("debería retornar un string vacío para null/undefined", () => {
            expect(formatPrice(null)).toBe("");
            expect(formatPrice(undefined)).toBe("");
        });

        // CP-033 | utils/formatters | debería formatear números con formato de moneda para EUR

        it("debería formatear números con formato de moneda para EUR", () => {
            const formatted = formatPrice(12.5);
            // En formato español, esto contiene 12,50 y el símbolo de la moneda
            expect(formatted).toContain("12,50");
            expect(formatted).toContain("€");
        });
    });
});
