import { SwipeableCard } from '@/components/swipeable-card';
import { config } from '@/config';
import { useServerTimer } from '@/hooks/useServerTime';
import { playerActions } from '@/state/actions/player-actions';
import { globalStore } from '@/state/stores/global-store';
import { playerStore } from '@/state/stores/player-store';
import { KmTimeCountdown } from '@kokimoki/shared';
import * as React from 'react';
import { useSnapshot } from 'valtio';

export const PlayerGameView: React.FC = () => {
	const globalState = useSnapshot(globalStore.proxy);
	const playerState = useSnapshot(playerStore.proxy);
	const serverTime = useServerTimer(100);

	// Calculate time remaining
	const timeElapsed = serverTime - globalState.roundStartTime;
	const timeRemaining = Math.max(0, globalState.roundDuration - timeElapsed);

	// Get items that haven't been sorted yet
	const unsortedItems = React.useMemo(() => {
		return globalState.items
			.map((item, index) => ({ item, index }))
			.filter(({ index }) => !(index in playerState.sortedItems));
	}, [globalState.items, playerState.sortedItems]);

	const currentItem = unsortedItems[0];

	const handleSwipeLeft = async () => {
		if (currentItem) {
			await playerActions.sortItem(currentItem.index, 0);
		}
	};

	const handleSwipeRight = async () => {
		if (currentItem) {
			await playerActions.sortItem(currentItem.index, 1);
		}
	};

	// Check if game is over
	if (timeRemaining === 0 || !currentItem) {
		return (
			<div className="flex h-full w-full items-center justify-center p-8 text-center">
				<div className="space-y-4">
					<h2 className="text-2xl font-bold">{config.resultsTitle}</h2>
					<p className="text-lg">
						{config.yourScore.replace(
							'{score}',
							String(globalState.scores[playerState.name]?.score || 0)
						)}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full w-full flex-col items-center justify-center p-4">
			{/* Timer */}
			<div className="mb-4 text-center">
				<div className="text-lg font-bold">
					<KmTimeCountdown ms={timeRemaining} />
				</div>
			</div>

			{/* Progress */}
			<div className="mb-4 text-center text-sm text-gray-600">
				{config.itemsProgress
					.replace(
						'{current}',
						String(Object.keys(playerState.sortedItems).length)
					)
					.replace('{total}', String(globalState.items.length))}
			</div>

			{/* Category Labels */}
			<div className="mb-6 flex w-full max-w-md justify-between px-4 text-center text-sm font-bold">
				<div className="text-blue-600">
					{globalState.categories[0]}
					<div className="mt-1 text-xs text-gray-500">
						{config.swipeLeftHint}
					</div>
				</div>
				<div className="text-green-600">
					{globalState.categories[1]}
					<div className="mt-1 text-xs text-gray-500">
						{config.swipeRightHint}
					</div>
				</div>
			</div>

			{/* Swipeable Card */}
			<div className="relative w-full max-w-md">
				<SwipeableCard
					onSwipeLeft={handleSwipeLeft}
					onSwipeRight={handleSwipeRight}
					className="w-full"
				>
					<div className="flex h-64 items-center justify-center rounded-2xl bg-white p-8 text-center shadow-2xl">
						<p className="text-2xl font-bold">{currentItem.item.text}</p>
					</div>
				</SwipeableCard>
			</div>

			{/* Visual Indicators */}
			<div className="mt-6 flex gap-4">
				<button
					type="button"
					onClick={handleSwipeLeft}
					className="rounded-full bg-blue-600 px-6 py-3 text-white shadow-lg transition-colors hover:bg-blue-700"
				>
					← {globalState.categories[0]}
				</button>
				<button
					type="button"
					onClick={handleSwipeRight}
					className="rounded-full bg-green-600 px-6 py-3 text-white shadow-lg transition-colors hover:bg-green-700"
				>
					{globalState.categories[1]} →
				</button>
			</div>
		</div>
	);
};
