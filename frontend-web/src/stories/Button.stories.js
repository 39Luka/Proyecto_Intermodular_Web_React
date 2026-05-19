import { fn } from 'storybook/test';

import { Button } from './Button';

// Más información sobre cómo configurar historias en: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Ejemplos/Button',
  component: Button,
  parameters: {
    // Parámetro opcional para centrar el componente en el lienzo. Más info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // Este componente tendrá una entrada de Autodocs generada automáticamente: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // Más información sobre argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  // Usar `fn` para espiar el argumento onClick, que aparecerá en el panel de acciones una vez invocado: https://storybook.js.org/docs/essentials/actions#story-args
  args: { onClick: fn() },
};

// Más información sobre cómo escribir historias con argumentos: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    label: 'Button',
  },
};

export const Large = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Small = {
  args: {
    size: 'small',
    label: 'Button',
  },
};
