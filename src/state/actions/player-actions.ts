import { kmClient } from '@/services/km-client';
import { globalStore } from '../stores/global-store';
import { playerStore, type PlayerState } from '../stores/player-store';
import { globalActions } from './global-actions';

export const playerActions = {
	async setCurrentView(view: PlayerState['currentView']) {
		await kmClient.transact([playerStore], ([playerState]) => {
			playerState.currentView = view;
		});
	},

	async setPlayerName(name: string) {
		await kmClient.transact(
			[playerStore, globalStore],
			([playerState, globalState]) => {
				playerState.name = name;
				globalState.players[kmClient.id] = { name };
			}
		);
	},

	async sortItem(itemIndex: number, category: 0 | 1) {
		await kmClient.transact([playerStore], ([playerState]) => {
			playerState.sortedItems[itemIndex] = category;
		});

		// Calculate and update score
		const globalSnap = globalStore.proxy;
		const playerSnap = playerStore.proxy;

		let correctCount = 0;
		let totalSorted = 0;

		Object.entries(playerSnap.sortedItems).forEach(([idx, chosenCategory]) => {
			const itemIndex = Number.parseInt(idx);
			const item = globalSnap.items[itemIndex];
			if (item) {
				totalSorted++;
				if (item.category === chosenCategory) {
					correctCount++;
				}
			}
		});

		await globalActions.updateScore(kmClient.id, correctCount, totalSorted);
	},

	async resetPlayerProgress() {
		await kmClient.transact([playerStore], ([playerState]) => {
			playerState.currentItemIndex = 0;
			playerState.sortedItems = {};
			playerState.currentView = 'lobby';
		});
	}
};
