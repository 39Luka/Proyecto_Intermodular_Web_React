import { describe, it, expect } from "vitest";
import { mapProduct, mapPromotion, mapPurchase, mapPurchaseDetail, DEFAULT_PRODUCT_IMAGE } from "../../utils/mappers";

describe("Mappers Utility", () => {
    describe("mapProduct", () => {
        // CP-034 | utils/mappers | debería retornar nulo para entradas vacías
        it("debería retornar nulo para entradas vacías", () => {
            expect(mapProduct(null)).toBeNull();
            expect(mapProduct(undefined)).toBeNull();
        });

        // CP-035 | utils/mappers | debería mapear producto del backend y añadir valores por defecto correctamente

        it("debería mapear producto del backend y añadir valores por defecto correctamente", () => {
            const backend = {
                id: 1,
                name: "Croissant",
                price: 2.5,
                stock: 10,
                active: true
            };
            const mapped = mapProduct(backend);
            expect(mapped.title).toBe("Croissant");
            expect(mapped.price).toBe(2.5);
            expect(mapped.image).toBe(DEFAULT_PRODUCT_IMAGE); // Porque no se proveyó imagen
            expect(mapped.description).toBe("");
        });

        // CP-036 | utils/mappers | debería formatear imagen base64 correctamente

        it("debería formatear imagen base64 correctamente", () => {
            const backend = {
                id: 2,
                imageBase64: "iVBORw0KGgoAAA"
            };
            const mapped = mapProduct(backend);
            expect(mapped.image).toBe("data:image/jpeg;base64,iVBORw0KGgoAAA");
        });
    });

    describe("mapPromotion", () => {
        // CP-037 | utils/mappers | debería retornar nulo para entradas vacías
        it("debería retornar nulo para entradas vacías", () => {
            expect(mapPromotion(null)).toBeNull();
        });

        // CP-038 | utils/mappers | debería formatear descuentos y etiquetas de promoción

        it("debería formatear descuentos y etiquetas de promoción", () => {
            const backend = {
                id: 1,
                description: "Oferta Verano",
                discountPercentage: 15,
                endDate: "2025-08-31T00:00:00"
            };
            const mapped = mapPromotion(backend);
            expect(mapped.title).toBe("Oferta Verano");
            expect(mapped.description).toBe("Descuento: 15%");
            expect(mapped.detailRight).toContain("Hasta:");
            expect(mapped.discountPercentage).toBe(15);
        });
    });

    describe("mapPurchase", () => {
        // CP-039 | utils/mappers | debería retornar nulo para entradas vacías
        it("debería retornar nulo para entradas vacías", () => {
            expect(mapPurchase(null)).toBeNull();
        });

        // CP-040 | utils/mappers | debería formatear pedido y su estado correctamente

        it("debería formatear pedido y su estado correctamente", () => {
            const backend = {
                id: 101,
                status: "CREATED",
                total: 45.5,
                createdAt: "2025-03-15T12:00:00"
            };
            const mapped = mapPurchase(backend);
            expect(mapped.title).toContain("Compra #101");
            expect(mapped.description).toContain("Creada");
            expect(mapped.detailRight).toContain("45,50");
        });
    });

    describe("mapPurchaseDetail", () => {
        // CP-041 | utils/mappers | debería retornar nulo para entradas vacías
        it("debería retornar nulo para entradas vacías", () => {
            expect(mapPurchaseDetail(null)).toBeNull();
        });

        // CP-042 | utils/mappers | debería mapear detalles del pedido con seguridad

        it("debería mapear detalles del pedido con seguridad", () => {
            const backend = {
                id: 1,
                purchaseId: 101,
                productId: 5,
                productName: "Tarta",
                quantity: 2,
                unitPrice: 20
            };
            const mapped = mapPurchaseDetail(backend);
            expect(mapped.quantity).toBe(2);
            expect(mapped.subtotal).toBe(0); // Si el backend no lo provee, por defecto es 0
            expect(mapped.productName).toBe("Tarta");
        });
    });
});
