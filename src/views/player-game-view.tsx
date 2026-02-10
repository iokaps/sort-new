import { SwipeableCard } from '@/components/swipeable-card';
import { config } from '@/config';
import { useServerTimer } from '@/hooks/useServerTime';
import { kmClient } from '@/services/km-client';
import { playerActions } from '@/state/actions/player-actions';
import { globalStore } from '@/state/stores/global-store';
import { playerStore } from '@/state/stores/player-store';
import { cn } from '@/utils/cn';
import { sounds } from '@/utils/sounds';
import {
	KmTimeCountdown,
	useKmAnimatedValue,
	useKmConfettiContext
} from '@kokimoki/shared';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { useSnapshot } from 'valtio';

export const PlayerGameView: React.FC = () => {
	const globalState = useSnapshot(globalStore.proxy);
	const playerState = useSnapshot(playerStore.proxy);
	const serverTime = useServerTimer(100);
	const { triggerConfetti } = useKmConfettiContext();

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
	const [showResults, setShowResults] = React.useState(false);

	// Animated score value - calculate locally if not in global store
	const localScore = React.useMemo(() => {
		let correctCount = 0;
		Object.entries(playerState.sortedItems).forEach(([idx, chosenCategory]) => {
			const itemIndex = Number.parseInt(idx);
			const item = globalState.items[itemIndex];
			if (item && item.category === chosenCategory) {
				correctCount++;
			}
		});
		return correctCount;
	}, [playerState.sortedItems, globalState.items]);

	const finalScore = globalState.scores[kmClient.id]?.score ?? localScore;
	const { ref: scoreRef } = useKmAnimatedValue<HTMLSpanElement>(
		showResults ? finalScore : 0,
		0,
		{ duration: 2000 }
	);

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

	// Trigger results display with confetti
	React.useEffect(() => {
		if (timeRemaining === 0 || !currentItem) {
			setShowResults(true);
			// Trigger confetti after a small delay
			setTimeout(() => {
				triggerConfetti({ preset: 'standard' });
			}, 300);
		}
	}, [timeRemaining, currentItem, triggerConfetti]);

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
			<div className="bg-cream flex h-full w-full items-center justify-center p-8 text-center">
				<div className="animate-slide-up space-y-6">
					<h2 className="font-heading text-navy text-4xl font-bold">
						{config.resultsTitle}
					</h2>
					<div className="space-y-3">
						<p className="text-navy/60 text-lg font-semibold">
							{config.yourScoreLabel}
						</p>
						<div className="bg-brand shadow-btn inline-flex items-center justify-center rounded-2xl px-8 py-4">
							<span
								ref={scoreRef}
								className="font-heading text-6xl font-bold text-white"
							>
								{finalScore}
							</span>
						</div>
						<p className="text-navy/50 text-sm font-medium">
							{config.outOf} {globalState.items.length}
						</p>
					</div>
				</div>
			</div>
		);
	}

	const urgency =
		globalState.roundDuration > 0
			? timeRemaining / globalState.roundDuration
			: 1;

	return (
		<div className="pb-safe bg-cream flex h-full w-full flex-col items-center justify-center gap-4 p-4">
			{/* Timer */}
			<div className="text-center">
				<div
					className={cn(
						'font-heading inline-flex items-center rounded-2xl px-6 py-2 text-3xl font-bold shadow-lg transition-colors duration-500',
						urgency > 0.5 && 'bg-emerald-500 text-white',
						urgency > 0.25 && urgency <= 0.5 && 'text-navy bg-amber-400',
						urgency <= 0.25 && 'animate-timer-pulse bg-red-500 text-white'
					)}
				>
					<KmTimeCountdown ms={timeRemaining} />
				</div>
			</div>

			{/* Progress */}
			<div className="bg-navy/10 text-navy/70 rounded-full px-4 py-1 text-center text-sm font-semibold">
				{config.itemsProgress
					.replace(
						'{current}',
						String(Object.keys(playerState.sortedItems).length)
					)
					.replace('{total}', String(globalState.items.length))}
			</div>

			{/* Category Labels */}
			<div className="flex w-full max-w-md items-center justify-between px-2">
				<div className="bg-cat-left flex items-center gap-1.5 rounded-xl px-4 py-2 shadow-md">
					<ChevronLeft className="h-5 w-5 text-white" />
					<span className="font-heading text-sm font-bold text-white">
						{globalState.categories[0]}
					</span>
				</div>
				<div className="bg-cat-right flex items-center gap-1.5 rounded-xl px-4 py-2 shadow-md">
					<span className="font-heading text-sm font-bold text-white">
						{globalState.categories[1]}
					</span>
					<ChevronRight className="h-5 w-5 text-white" />
				</div>
			</div>

			{/* Swipeable Card */}
			<div className="relative flex w-full max-w-md flex-1 items-center justify-center">
				<SwipeableCard
					onSwipeLeft={handleSwipeLeft}
					onSwipeRight={handleSwipeRight}
					className="w-full"
				>
					<div className="rounded-game border-card-border shadow-card mx-auto flex min-h-[260px] w-full max-w-[320px] items-center justify-center border-3 bg-white p-8 text-center">
						<p className="font-heading text-navy text-2xl leading-tight font-bold break-words">
							{currentItem.item.text}
						</p>
					</div>
				</SwipeableCard>
			</div>

			{/* Swipe Hint */}
			<div className="text-navy/40 text-center text-sm font-medium">
				{config.swipeLeftHint} {config.or} {config.swipeRightHint}
			</div>
		</div>
	);
};
