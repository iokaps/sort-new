import { config } from '@/config';
import { kmClient } from '@/services/km-client';
import type { GameItem } from '../stores/global-store';
import { globalStore } from '../stores/global-store';

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

export const globalActions = {
	async startGame() {
		await kmClient.transact([globalStore], ([globalState]) => {
			globalState.started = true;
			globalState.startTimestamp = kmClient.serverTimestamp();
			globalState.gamePhase = 'playing';
			globalState.roundStartTime = kmClient.serverTimestamp();

			// Reset scores
			globalState.scores = {};
		});
	},

	async stopGame() {
		await kmClient.transact([globalStore], ([globalState]) => {
			globalState.started = false;
			globalState.startTimestamp = 0;
			globalState.gamePhase = 'setup';
		});
	},

	async generateWithAI(themePrompt: string) {
		try {
			const response = await kmClient.chat(
				config.aiSystemPrompt,
				`Generate sorting game content for the theme: ${themePrompt}`,
				0.7,
				2000
			);

			// Extract JSON from markdown code blocks if present
			let jsonContent = response.content.trim();
			const codeBlockMatch = jsonContent.match(
				/```(?:json)?\s*\n?([\s\S]*?)\n?```/
			);
			if (codeBlockMatch) {
				jsonContent = codeBlockMatch[1].trim();
			}

			const data = JSON.parse(jsonContent);

			await kmClient.transact([globalStore], ([globalState]) => {
				globalState.theme = data.theme;
				globalState.categories = [data.categories[0], data.categories[1]];
				// Shuffle items for random order
				globalState.items = shuffleArray(data.items);
			});

			return { success: true };
		} catch (error) {
			console.error('AI generation failed:', error);
			return { success: false, error: String(error) };
		}
	},

	async setGameContent(
		theme: string,
		categories: [string, string],
		items: GameItem[],
		roundDuration: number
	) {
		await kmClient.transact([globalStore], ([globalState]) => {
			globalState.theme = theme;
			globalState.categories = categories;
			// Shuffle items for random order
			globalState.items = shuffleArray(items);
			globalState.roundDuration = roundDuration;
		});
	},

	async setGamePhase(phase: typeof globalStore.proxy.gamePhase) {
		await kmClient.transact([globalStore], ([globalState]) => {
			globalState.gamePhase = phase;
		});
	},

	async updateScore(clientId: string, score: number, sortedItems: number) {
		await kmClient.transact([globalStore], ([globalState]) => {
			if (!globalState.scores[clientId]) {
				globalState.scores[clientId] = {
					name: globalState.players[clientId]?.name || 'Unknown',
					score: 0,
					sortedItems: 0
				};
			}

			globalState.scores[clientId].score = score;
			globalState.scores[clientId].sortedItems = sortedItems;
		});
	},

	async startNewRound() {
		await kmClient.transact([globalStore], ([globalState]) => {
			globalState.gamePhase = 'lobby';
			globalState.theme = '';
			globalState.categories = ['', ''];
			globalState.items = [];
			globalState.scores = {};
			globalState.started = false;
			globalState.roundStartTime = 0;
		});
	}
};
