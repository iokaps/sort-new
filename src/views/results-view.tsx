import { config } from '@/config';
import { kmClient } from '@/services/km-client';
import { globalActions } from '@/state/actions/global-actions';
import { globalStore } from '@/state/stores/global-store';
import { playerStore } from '@/state/stores/player-store';
import { KmPodiumTable } from '@kokimoki/shared';
import { CheckCircle, XCircle } from 'lucide-react';
import * as React from 'react';
import { useSnapshot } from 'valtio';

export const ResultsView: React.FC = () => {
	const globalState = useSnapshot(globalStore.proxy);
	const playerState = useSnapshot(playerStore.proxy);
	const isHost = kmClient.clientContext.mode === 'host';
	const isPlayer = kmClient.clientContext.mode === 'player';

	// Convert scores to podium format
	const podiumData = React.useMemo(() => {
		return Object.entries(globalState.scores)
			.map(([clientId, scoreData]) => ({
				id: clientId,
				name: scoreData.name,
				points: scoreData.score,
				color: '#6366f1'
			}))
			.sort((a, b) => b.points - a.points);
	}, [globalState.scores]);

	const playerScore = globalState.scores[kmClient.id];

	// Calculate fallback score if not in global store
	const fallbackScore = React.useMemo(() => {
		let correctCount = 0;
		let totalSorted = 0;

		Object.entries(playerState.sortedItems).forEach(([idx, chosenCategory]) => {
			const itemIndex = Number.parseInt(idx);
			const item = globalState.items[itemIndex];
			if (item) {
				totalSorted++;
				if (item.category === chosenCategory) {
					correctCount++;
				}
			}
		});

		return {
			name: playerState.name,
			score: correctCount,
			sortedItems: totalSorted
		};
	}, [playerState.sortedItems, playerState.name, globalState.items]);

	// Use playerScore from global store or fallback to calculated score
	const displayScore = React.useMemo(() => {
		if (playerScore && playerScore.name) {
			return playerScore;
		}
		return fallbackScore;
	}, [playerScore, fallbackScore]);

	// Create breakdown of player's answers
	const answerBreakdown = React.useMemo(() => {
		return Object.entries(playerState.sortedItems)
			.map(([itemIndex, chosenCategory]) => {
				const index = Number.parseInt(itemIndex);
				const item = globalState.items[index];
				const isCorrect = item && item.category === chosenCategory;

				return {
					itemIndex: index,
					text: item?.text || '',
					correctCategory: item?.category || 0,
					chosenCategory,
					isCorrect
				};
			})
			.sort((a, b) => a.itemIndex - b.itemIndex);
	}, [playerState.sortedItems, globalState.items]);

	return (
		<div className="w-full max-w-4xl space-y-6">
			<div className="rounded-game border-card-border shadow-game border-2 bg-white p-6">
				<h2 className="font-heading text-navy mb-6 text-center text-3xl font-bold">
					{config.resultsTitle}
				</h2>

				{/* Player's Personal Score - Only show for players */}
				{isPlayer && (
					<div className="rounded-game bg-brand/10 border-brand/20 mb-6 border-2 p-4 text-center">
						<p className="font-heading text-brand text-xl font-bold">
							{config.yourScore.replace(
								'{score}',
								String(displayScore.score || 0)
							)}
						</p>
						<div className="text-navy/70 mt-2 flex justify-center gap-6 text-sm font-semibold">
							<span>
								{config.correctSorts}: {displayScore.score || 0}
							</span>
							<span>
								{config.totalSorts}: {displayScore.sortedItems || 0}
							</span>
						</div>
					</div>
				)}

				{/* Detailed Answer Breakdown - Only show for players */}
				{isPlayer && answerBreakdown.length > 0 && (
					<div className="rounded-game border-card-border bg-cream mb-6 border-2 p-4">
						<h3 className="font-heading text-navy mb-4 text-center text-lg font-bold">
							{config.answerBreakdownTitle}
						</h3>
						<div className="max-h-60 space-y-2 overflow-y-auto">
							{answerBreakdown.map((answer) => (
								<div
									key={answer.itemIndex}
									className={`flex items-center justify-between rounded-lg p-3 ${
										answer.isCorrect
											? 'border border-green-200 bg-green-100'
											: 'border border-red-200 bg-red-100'
									}`}
								>
									<div className="flex items-center gap-3">
										{answer.isCorrect ? (
											<CheckCircle className="h-5 w-5 text-green-600" />
										) : (
											<XCircle className="h-5 w-5 text-red-600" />
										)}
										<span className="text-navy font-medium">{answer.text}</span>
									</div>
									<div className="text-sm">
										<span
											className={`rounded-full px-2 py-1 text-xs font-bold ${
												answer.chosenCategory === 0
													? 'bg-cat-left/15 text-cat-left-dark'
													: 'bg-cat-right/15 text-cat-right-dark'
											}`}
										>
											{globalState.categories[answer.chosenCategory]}
										</span>
										{!answer.isCorrect && (
											<span className="text-navy-light ml-2">
												({config.correctLabel}{' '}
												{globalState.categories[answer.correctCategory]})
											</span>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Podium/Leaderboard */}
				{podiumData.length > 0 && (
					<KmPodiumTable
						entries={podiumData}
						pointsLabel={config.correctSorts}
					/>
				)}

				{/* Host Controls */}
				{isHost && (
					<div className="mt-6 flex gap-3">
						<button
							type="button"
							onClick={globalActions.startNewRound}
							className="rounded-game bg-brand font-heading shadow-btn hover:bg-brand-dark flex-1 px-6 py-3 font-bold text-white transition-all hover:scale-105"
						>
							{config.newRoundButton}
						</button>
						<button
							type="button"
							onClick={globalActions.stopGame}
							className="rounded-game bg-navy-light font-heading shadow-game hover:bg-navy flex-1 px-6 py-3 font-bold text-white transition-all hover:scale-105"
						>
							{config.endGameButton}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
