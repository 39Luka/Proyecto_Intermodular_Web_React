/**
 * @fileoverview Contexto global de búsqueda y filtrado por fechas.
 *
 * Expone `SearchProvider` y el hook `useSearch`. Gestiona el término de búsqueda
 * de texto y el rango de fechas para filtrar pedidos. Los valores se resetean
 * automáticamente al cambiar de ruta.
 *
 * @module SearchContext
 */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [appliedDates, setAppliedDates] = useState({ start: null, end: null });
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    // Restablecer los estados de búsqueda de forma dinámica cada vez que el usuario navega a una nueva página
    useEffect(() => {
        setSearchTerm("");
        setStartDate("");
        setEndDate("");
        setAppliedDates({ start: null, end: null });
        setLoading(false);
    }, [location.pathname]);

    return (
        <SearchContext.Provider value={{
            searchTerm,
            setSearchTerm,
            startDate,
            setStartDate,
            endDate,
            setEndDate,
            appliedDates,
            setAppliedDates,
            loading,
            setLoading
        }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch debe ser utilizado dentro de un SearchProvider");
    }
    return context;
}
