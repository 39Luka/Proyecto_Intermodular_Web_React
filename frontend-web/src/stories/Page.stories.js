import { expect, userEvent, within } from 'storybook/test';

import { Page } from './Page';

export default {
  title: 'Ejemplos/Page',
  component: Page,
  parameters: {
    // Más información sobre cómo posicionar historias en: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
};

export const LoggedOut = {};

// Más información sobre pruebas de componentes: https://storybook.js.org/docs/writing-tests/interaction-testing
export const LoggedIn = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = canvas.getByRole('button', { name: /Iniciar sesión/i });
    await expect(loginButton).toBeInTheDocument();
    await userEvent.click(loginButton);
    await expect(loginButton).not.toBeInTheDocument();

    const logoutButton = canvas.getByRole('button', { name: /Cerrar sesión/i });
    await expect(logoutButton).toBeInTheDocument();
  },
};
