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
				color: '#3b82f6'
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
			<div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-white via-purple-50 to-pink-50 p-6 shadow-xl">
				<h2 className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-center text-3xl font-bold text-transparent">
					{config.resultsTitle}
				</h2>

				{/* Player's Personal Score - Only show for players */}
				{isPlayer && (
					<div className="mb-6 rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 p-4 text-center">
						<p className="bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-xl font-bold text-transparent">
							{config.yourScore.replace(
								'{score}',
								String(displayScore.score || 0)
							)}
						</p>
						<div className="mt-2 flex justify-center gap-6 text-sm font-medium text-purple-700">
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
					<div className="mb-6 rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4">
						<h3 className="mb-4 text-center text-lg font-bold text-purple-700">
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
										<span className="font-medium text-gray-800">
											{answer.text}
										</span>
									</div>
									<div className="text-sm">
										<span
											className={`rounded-full px-2 py-1 text-xs font-medium ${
												answer.chosenCategory === 0
													? 'bg-blue-100 text-blue-700'
													: 'bg-green-100 text-green-700'
											}`}
										>
											{globalState.categories[answer.chosenCategory]}
										</span>
										{!answer.isCorrect && (
											<span className="ml-2 text-gray-500">
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
							className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105"
						>
							{config.newRoundButton}
						</button>
						<button
							type="button"
							onClick={globalActions.stopGame}
							className="flex-1 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105"
						>
							{config.endGameButton}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
