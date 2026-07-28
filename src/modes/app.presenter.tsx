import { config } from '@/config';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useGlobalController } from '@/hooks/useGlobalController';
import { useRemoveLoadingOverlay } from '@/hooks/useRemoveLoadingOverlay';
import { useServerTimer } from '@/hooks/useServerTime';
import { generateLink } from '@/kit/generate-link';
import { HostPresenterLayout } from '@/layouts/host-presenter';
import { kmClient } from '@/services/km-client';
import { globalStore } from '@/state/stores/global-store';
import { ResultsView } from '@/views/results-view';
import { KmQrCode, KmTimeCountdown } from '@kokimoki/shared';
import * as React from 'react';
import { useSnapshot } from 'valtio';

const App: React.FC = () => {
	const { title } = config;
	const globalState = useSnapshot(globalStore.proxy);
	const connections = useSnapshot(globalStore.connections);
	const serverTime = useServerTimer(100);

	useGlobalController();
	useRemoveLoadingOverlay();
	useDocumentTitle(title);

	if (kmClient.clientContext.mode !== 'presenter') {
		throw new Error('App presenter rendered in non-presenter mode');
	}

	const playerLink = generateLink(kmClient.clientContext.playerCode, {
		mode: 'player'
	});

	// Calculate time remaining
	const timeElapsed = serverTime - globalState.roundStartTime;
	const timeRemaining = Math.max(0, globalState.roundDuration - timeElapsed);

	return (
		<HostPresenterLayout.Root>
			<HostPresenterLayout.Header>
				<div className="text-sm text-white/50">{config.presenterLabel}</div>
			</HostPresenterLayout.Header>

			<HostPresenterLayout.Main>
				{/* Player Join Section */}
				{globalState.gamePhase === 'setup' ||
				globalState.gamePhase === 'lobby' ? (
					<div className="rounded-game border-card-border shadow-game border-2 bg-white">
						<div className="flex flex-col items-center gap-4 p-8">
							<h2 className="font-heading text-navy text-2xl font-bold">
								{config.playerLinkLabel}
							</h2>
							<KmQrCode data={playerLink} size={300} interactive={false} />
							<a
								href={playerLink}
								target="_blank"
								rel="noreferrer"
								className="text-brand hover:text-brand-dark text-xl font-semibold break-all underline"
							>
								{playerLink}
							</a>
							<div className="text-navy mt-4 text-lg">
								<strong>{config.players}:</strong> {connections.clientIds.size}
							</div>
						</div>
					</div>
				) : null}{' '}
				{/* Playing State */}
				{globalState.gamePhase === 'playing' && (
					<div className="space-y-6">
						<div className="rounded-game border-card-border shadow-game border-2 bg-white p-8">
							<h2 className="font-heading text-navy mb-4 text-center text-4xl font-bold">
								{globalState.theme}
							</h2>
							<div className="mb-6 flex justify-center gap-12 text-2xl">
								<div className="font-heading text-cat-left font-bold">
									{globalState.categories[0]}
								</div>
								<div className="font-heading text-cat-right font-bold">
									{globalState.categories[1]}
								</div>
							</div>
							<div className="font-heading text-navy text-center text-3xl font-bold">
								<KmTimeCountdown ms={timeRemaining} />
							</div>
						</div>

						{/* Live Scores */}
						<div className="rounded-game border-card-border shadow-game border-2 bg-white p-6">
							<h3 className="font-heading text-navy mb-4 text-2xl font-bold">
								{config.liveScores}
							</h3>
							<div className="space-y-2">
								{Object.entries(globalState.scores)
									.sort((a, b) => b[1].score - a[1].score)
									.map(([clientId, scoreData]) => (
										<div
											key={clientId}
											className="rounded-game bg-cream flex items-center justify-between p-4"
										>
											<span className="text-navy text-lg font-medium">
												{scoreData.name}
											</span>
											<div className="text-navy-light flex gap-6 text-sm">
												<span>
													{config.scoreLabel} <strong>{scoreData.score}</strong>
												</span>
												<span>
													{config.sortedLabel}{' '}
													<strong>{scoreData.sortedItems}</strong>
												</span>
											</div>
										</div>
									))}
							</div>
						</div>
					</div>
				)}
				{/* Results State */}
				{globalState.gamePhase === 'results' && (
					<div className="flex justify-center">
						<ResultsView />
					</div>
				)}
			</HostPresenterLayout.Main>
		</HostPresenterLayout.Root>
	);
};

export default App;
