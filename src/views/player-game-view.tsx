import { SwipeableCard } from '@/components/swipeable-card';
import { config } from '@/config';
import { useServerTimer } from '@/hooks/useServerTime';
import { playerActions } from '@/state/actions/player-actions';
import { globalStore } from '@/state/stores/global-store';
import { playerStore } from '@/state/stores/player-store';
import { sounds } from '@/utils/sounds';
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
	const previousItemCount = React.useRef(unsortedItems.length);

	// Play success sound when all items are sorted
	React.useEffect(() => {
		if (
			previousItemCount.current > 0 &&
			unsortedItems.length === 0 &&
			currentItem === undefined
		) {
			sounds.playSuccess();
		}
		previousItemCount.current = unsortedItems.length;
	}, [unsortedItems.length, currentItem]);

	const handleSwipeLeft = async () => {
		if (currentItem) {
			sounds.playSwipeLeft();
			await playerActions.sortItem(currentItem.index, 0);
		}
	};

	const handleSwipeRight = async () => {
		if (currentItem) {
			sounds.playSwipeRight();
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
		<div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
			{/* Timer */}
			<div className="text-center">
				<div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
					<KmTimeCountdown ms={timeRemaining} />
				</div>
			</div>

			{/* Progress */}
			<div className="text-center text-sm font-medium text-purple-700">
				{config.itemsProgress
					.replace(
						'{current}',
						String(Object.keys(playerState.sortedItems).length)
					)
					.replace('{total}', String(globalState.items.length))}
			</div>

			{/* Category Labels - Fixed at top */}
			<div className="flex w-full max-w-md justify-between px-4 text-center">
				<div className="flex flex-col items-center gap-1">
					<div className="text-4xl">←</div>
					<div className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1 text-base font-bold text-white shadow-lg">
						{globalState.categories[0]}
					</div>
				</div>
				<div className="flex flex-col items-center gap-1">
					<div className="text-4xl">→</div>
					<div className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-base font-bold text-white shadow-lg">
						{globalState.categories[1]}
					</div>
				</div>
			</div>

			{/* Swipeable Round Chip */}
			<div className="relative flex w-full max-w-md flex-1 items-center justify-center">
				<SwipeableCard
					onSwipeLeft={handleSwipeLeft}
					onSwipeRight={handleSwipeRight}
					className="w-full"
				>
					<div className="mx-auto flex aspect-square w-[280px] items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100 p-8 text-center shadow-2xl">
						<p className="bg-gradient-to-br from-purple-700 to-pink-700 bg-clip-text text-xl leading-tight font-bold break-words text-transparent">
							{currentItem.item.text}
						</p>
					</div>
				</SwipeableCard>
			</div>

			{/* Swipe Hint */}
			<div className="pb-4 text-center text-sm font-medium text-purple-600">
				{config.swipeLeftHint} or {config.swipeRightHint}
			</div>
		</div>
	);
};
