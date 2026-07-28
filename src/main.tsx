import React from 'react';
import ReactDOM from 'react-dom/client';
import { config } from './config';
import { watchLoadingOverlays } from './hooks/useRemoveLoadingOverlay';
import { launchApp } from './kit/app-launcher.tsx';

function renderComponent(component: React.ReactNode) {
	ReactDOM.createRoot(document.getElementById('root')!).render(
		<React.StrictMode>{component}</React.StrictMode>
	);
}

watchLoadingOverlays();

const appImports = {
	host: () => import('./modes/app.host.tsx'),
	presenter: () => import('./modes/app.presenter.tsx'),
	player: () => import('./modes/app.player.tsx'),
	dev: () => import('./kit/dev.tsx')
};

launchApp(config, appImports, renderComponent);
