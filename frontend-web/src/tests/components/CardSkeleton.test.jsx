import React from 'react';
import { render } from '@testing-library/react';
import CardSkeleton from '../../components/cards/CardSkeleton';

describe('CardSkeleton Component', () => {
    // CP-005 | components/CardSkeleton | debería renderizarse sin errores
    it('debería renderizarse sin errores', () => {
        const { container } = render(<CardSkeleton />);
        expect(container.firstChild).toBeInTheDocument();
    });

    // CP-006 | components/CardSkeleton | debería tener las clases correctas en el contenedor principal

    it('debería tener las clases correctas en el contenedor principal', () => {
        const { container } = render(<CardSkeleton />);
        const wrapper = container.firstChild;
        
        expect(wrapper).toHaveClass('card-vertical');
        expect(wrapper).toHaveClass('card--static');
    });

    // CP-007 | components/CardSkeleton | debería contener los elementos del skeleton

    it('debería contener los elementos del skeleton', () => {
        const { container } = render(<CardSkeleton />);
        
        // Verifica que los elementos internos del skeleton estén presentes
        const figure = container.querySelector('.card__figure.skeleton');
        const content = container.querySelector('.card__content');
        const textSkeletons = container.querySelectorAll('.skeleton-text');
        
        expect(figure).toBeInTheDocument();
        expect(content).toBeInTheDocument();
        expect(textSkeletons.length).toBeGreaterThan(0);
    });
});
