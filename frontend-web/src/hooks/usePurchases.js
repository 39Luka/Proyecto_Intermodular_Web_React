import { useState, useEffect, useCallback } from "react";
import { purchaseService } from "../services/purchaseService";
import { useAuth } from "./useAuth";

/**
 * Hook para obtener el historial de compras del usuario autenticado.
 *
 * Filtra opcionalmente por rango de fechas. Las fechas se formatean automáticamente
 * añadiendo horas (`T00:00:00` / `T23:59:59`) para abarcar el día completo.
 * La petición se omite si no hay usuario autenticado.
 *
 * @param {string|null} [startDate=null] - Fecha de inicio en formato `YYYY-MM-DD`.
 * @param {string|null} [endDate=null]   - Fecha de fin en formato `YYYY-MM-DD`.
 * @returns {{
 *   purchases: Array,
 *   loading: boolean,
 *   error: string|null,
 *   refetch: () => void
 * }} Estado de las compras y función para refrescar manualmente.
 *
 * @example
 * const { purchases, loading, refetch } = usePurchases(startDate, endDate);
 */
export function usePurchases(startDate = null, endDate = null) {
    const { user } = useAuth();
    const [state, setState] = useState({ purchases: [], loading: true, error: null });

    const fetch = useCallback(async () => {
        if (!user) return;
        try {
            setState(s => ({ ...s, loading: true, error: null }));
            const start = startDate ? `${startDate}T00:00:00` : null;
            const end = endDate ? `${endDate}T23:59:59` : null;
            const data = await purchaseService.getAllPurchases(0, 50, user.id, start, end);
            setState({ purchases: data.purchases || [], loading: false, error: null });
        } catch (err) {
            setState({ purchases: [], loading: false, error: err.message });
        }
    }, [user, startDate, endDate]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { ...state, refetch: fetch };
}
