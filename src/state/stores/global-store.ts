import { kmClient } from '@/services/km-client';

export type GamePhase = 'setup' | 'lobby' | 'playing' | 'results';

export interface GameItem {
	text: string;
	category: 0 | 1; // 0 = left, 1 = right
}

export interface PlayerScore {
	name: string;
	score: number;
	sortedItems: number;
}

export interface GlobalState {
	controllerConnectionId: string;
	started: boolean;
	startTimestamp: number;
	players: Record<string, { name: string }>;

	// Game content
	gamePhase: GamePhase;
	theme: string;
	categories: [string, string]; // [left category, right category]
	items: GameItem[];
	roundDuration: number; // in milliseconds
	roundStartTime: number; // server timestamp

	// Scoring
	scores: Record<string, PlayerScore>;
}

const initialState: GlobalState = {
	controllerConnectionId: '',
	started: false,
	startTimestamp: 0,
	players: {},

	// Game content
	gamePhase: 'setup',
	theme: '',
	categories: ['', ''],
	items: [],
	roundDuration: 60000, // 60 seconds default
	roundStartTime: 0,

	// Scoring
	scores: {}
};

export const globalStore = kmClient.store<GlobalState>('global', initialState);
