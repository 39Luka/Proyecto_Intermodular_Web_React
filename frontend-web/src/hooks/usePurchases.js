import { useState, useEffect, useCallback } from "react";
import { purchaseService } from "../services/purchaseService";
import { useAuth } from "./useAuth";

export function usePurchases() {
    const { user } = useAuth();
    const [state, setState] = useState({ purchases: [], loading: true, error: null });

    const fetch = useCallback(async () => {
        if (!user) return;
        try {
            setState(s => ({ ...s, loading: true, error: null }));
            const data = await purchaseService.getAllPurchases(0, 50, user.id);
            setState({ purchases: data, loading: false, error: null });
        } catch (err) {
            setState({ purchases: [], loading: false, error: err.message });
        }
    }, [user]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { ...state, refetch: fetch };
}
