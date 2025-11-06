import { config } from '@/config';
import { kmClient } from '@/services/km-client';
import { globalActions } from '@/state/actions/global-actions';
import { globalStore } from '@/state/stores/global-store';
import { KmPodiumTable } from '@kokimoki/shared';
import * as React from 'react';
import { useSnapshot } from 'valtio';

export const ResultsView: React.FC = () => {
	const globalState = useSnapshot(globalStore.proxy);
	const isHost = kmClient.clientContext.mode === 'host';

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

	return (
		<div className="w-full max-w-4xl space-y-6">
			<div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-white via-purple-50 to-pink-50 p-6 shadow-xl">
				<h2 className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-center text-3xl font-bold text-transparent">
					{config.resultsTitle}
				</h2>

				{/* Player's Personal Score */}
				{playerScore && (
					<div className="mb-6 rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 p-4 text-center">
						<p className="bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-xl font-bold text-transparent">
							{config.yourScore.replace('{score}', String(playerScore.score))}
						</p>
						<div className="mt-2 flex justify-center gap-6 text-sm font-medium text-purple-700">
							<span>
								{config.correctSorts}: {playerScore.score}
							</span>
							<span>
								{config.totalSorts}: {playerScore.sortedItems}
							</span>
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
