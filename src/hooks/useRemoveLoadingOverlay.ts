import * as React from 'react';

const loadingOverlayIds = ['connecting', 'km-loading'];

export const removeLoadingOverlays = () => {
	for (const id of loadingOverlayIds) {
		document.getElementById(id)?.remove();
	}
};

export const watchLoadingOverlays = () => {
	removeLoadingOverlays();

	const observer = new MutationObserver(removeLoadingOverlays);
	observer.observe(document.documentElement, {
		childList: true,
		subtree: true
	});

	window.setTimeout(() => {
		observer.disconnect();
	}, 10000);
};

export const useRemoveLoadingOverlay = () => {
	React.useEffect(() => {
		removeLoadingOverlays();
	}, []);
};
