import { kmClient } from '@/services/km-client';

export interface PlayerState {
	name: string;
	currentView: 'lobby' | 'game' | 'results' | 'connections';
	currentItemIndex: number;
	sortedItems: Record<number, 0 | 1>; // itemIndex -> category chosen
}

const initialState: PlayerState = {
	name: '',
	currentView: 'lobby',
	currentItemIndex: 0,
	sortedItems: {}
};

export const playerStore = kmClient.localStore<PlayerState>(
	'player',
	initialState
);
