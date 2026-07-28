import { config } from '@/config';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useGlobalController } from '@/hooks/useGlobalController';
import { useRemoveLoadingOverlay } from '@/hooks/useRemoveLoadingOverlay';
import { generateLink } from '@/kit/generate-link';
import { HostPresenterLayout } from '@/layouts/host-presenter';
import { kmClient } from '@/services/km-client';
import { globalActions } from '@/state/actions/global-actions';
import { globalStore } from '@/state/stores/global-store';
import { HostSetupView } from '@/views/host-setup-view';
import { ResultsView } from '@/views/results-view';
import { KmQrCode } from '@kokimoki/shared';
import * as React from 'react';
import { useSnapshot } from 'valtio';

const App: React.FC = () => {
	useGlobalController();
	useRemoveLoadingOverlay();
	const { title } = config;
	const globalState = useSnapshot(globalStore.proxy);
	const connections = useSnapshot(globalStore.connections);
	useDocumentTitle(title);

	if (kmClient.clientContext.mode !== 'host') {
		throw new Error('App host rendered in non-host mode');
	}

	const playerLink = generateLink(kmClient.clientContext.playerCode, {
		mode: 'player'
	});

	const presenterLink = generateLink(kmClient.clientContext.presenterCode, {
		mode: 'presenter',
		playerCode: kmClient.clientContext.playerCode
	});

	return (
		<HostPresenterLayout.Root>
			<HostPresenterLayout.Header>
				<div className="text-sm text-white/50">{config.hostLabel}</div>
			</HostPresenterLayout.Header>

			<HostPresenterLayout.Main>
				{/* Game Links */}
				<div className="rounded-game border-card-border shadow-game border-2 bg-white">
					<div className="flex flex-col gap-2 p-6">
						<h2 className="font-heading text-navy text-xl font-bold">
							{config.gameLinksTitle}
						</h2>
						<KmQrCode data={playerLink} size={200} interactive={false} />
						<div className="flex gap-2">
							<a
								href={playerLink}
								target="_blank"
								rel="noreferrer"
								className="text-brand hover:text-brand-dark font-semibold break-all underline"
							>
								{config.playerLinkLabel}
							</a>
							<span className="text-navy/30">|</span>
							<a
								href={presenterLink}
								target="_blank"
								rel="noreferrer"
								className="text-brand hover:text-brand-dark font-semibold break-all underline"
							>
								{config.presenterLinkLabel}
							</a>
						</div>
						<div className="text-navy mt-2">
							<strong>{config.players}:</strong> {connections.clientIds.size}
						</div>
					</div>
				</div>{' '}
				{/* Setup Phase */}
				{(globalState.gamePhase === 'setup' ||
					globalState.gamePhase === 'lobby') && <HostSetupView />}
				{/* Playing Phase */}
				{globalState.gamePhase === 'playing' && (
					<div className="rounded-game border-card-border shadow-game border-2 bg-white">
						<div className="p-6">
							<h2 className="font-heading text-navy mb-4 text-2xl font-bold">
								{config.gameInProgress}
							</h2>
							<div className="text-navy mb-4 space-y-2">
								<p>
									<strong>{config.themeLabel}:</strong> {globalState.theme}
								</p>
								<p>
									<strong>{config.categories}:</strong>{' '}
									{globalState.categories[0]} {config.vs}{' '}
									{globalState.categories[1]}
								</p>
							</div>

							{/* Live Scores */}
							<div className="space-y-2">
								<h3 className="font-heading text-navy text-lg font-bold">
									{config.liveScores}
								</h3>
								{Object.entries(globalState.scores).length > 0 ? (
									Object.entries(globalState.scores)
										.sort((a, b) => b[1].score - a[1].score)
										.map(([clientId, scoreData]) => (
											<div
												key={clientId}
												className="rounded-game bg-cream flex items-center justify-between p-3"
											>
												<span className="text-navy font-medium">
													{scoreData.name}
												</span>
												<div className="text-navy-light flex gap-4 text-sm">
													<span>
														{config.scoreLabel} {scoreData.score}
													</span>
													<span>
														{config.sortedLabel} {scoreData.sortedItems}
													</span>
												</div>
											</div>
										))
								) : (
									<p className="text-navy-light">{config.noScoresYet}</p>
								)}
							</div>

							<button
								type="button"
								onClick={globalActions.stopGame}
								className="rounded-game font-heading mt-6 w-full bg-red-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-red-600"
							>
								{config.stopButton}
							</button>
						</div>
					</div>
				)}
				{/* Results Phase */}
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
