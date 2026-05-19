import { useState, useEffect } from "react";
import { categoryService } from "../services/categoryService";

/**
 * Hook para obtener todas las categorías de productos disponibles.
 *
 * Realiza la petición al montar el componente y no la repite a menos que
 * el componente se desmonte y vuelva a montar.
 *
 * @returns {{
 *   categories: Array<{ id: number, name: string }>,
 *   loading: boolean,
 *   error: string|null
 * }} Estado con el listado de categorías.
 *
 * @example
 * const { categories, loading } = useCategories();
 *
 * // Usarlo como opciones de un select:
 * categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)
 */
export function useCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const data = await categoryService.getCategories();
                setCategories(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    return { categories, loading, error };
}
