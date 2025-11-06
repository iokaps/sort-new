import { config } from '@/config';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useGlobalController } from '@/hooks/useGlobalController';
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
				<div className="text-sm opacity-70">{config.hostLabel}</div>
			</HostPresenterLayout.Header>

			<HostPresenterLayout.Main>
				{/* Game Links */}
				<div className="rounded-lg border border-gray-200 bg-white shadow-md">
					<div className="flex flex-col gap-2 p-6">
						<h2 className="text-xl font-bold">{config.gameLinksTitle}</h2>
						<KmQrCode data={playerLink} size={200} interactive={false} />
						<div className="flex gap-2">
							<a
								href={playerLink}
								target="_blank"
								rel="noreferrer"
								className="break-all text-blue-600 underline hover:text-blue-700"
							>
								{config.playerLinkLabel}
							</a>
							|
							<a
								href={presenterLink}
								target="_blank"
								rel="noreferrer"
								className="break-all text-blue-600 underline hover:text-blue-700"
							>
								{config.presenterLinkLabel}
							</a>
						</div>
						<div className="mt-2">
							<strong>{config.players}:</strong> {connections.clientIds.size}
						</div>
					</div>
				</div>{' '}
				{/* Setup Phase */}
				{(globalState.gamePhase === 'setup' ||
					globalState.gamePhase === 'lobby') && <HostSetupView />}
				{/* Playing Phase */}
				{globalState.gamePhase === 'playing' && (
					<div className="rounded-lg border border-gray-200 bg-white shadow-md">
						<div className="p-6">
							<h2 className="mb-4 text-2xl font-bold">Game in Progress</h2>
							<div className="mb-4 space-y-2">
								<p>
									<strong>{config.themeLabel}:</strong> {globalState.theme}
								</p>
								<p>
									<strong>Categories:</strong> {globalState.categories[0]} vs{' '}
									{globalState.categories[1]}
								</p>
							</div>

							{/* Live Scores */}
							<div className="space-y-2">
								<h3 className="text-lg font-bold">Live Scores</h3>
								{Object.entries(globalState.scores).length > 0 ? (
									Object.entries(globalState.scores)
										.sort((a, b) => b[1].score - a[1].score)
										.map(([clientId, scoreData]) => (
											<div
												key={clientId}
												className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
											>
												<span className="font-medium">{scoreData.name}</span>
												<div className="flex gap-4 text-sm">
													<span>Score: {scoreData.score}</span>
													<span>Sorted: {scoreData.sortedItems}</span>
												</div>
											</div>
										))
								) : (
									<p className="text-gray-500">No scores yet</p>
								)}
							</div>

							<button
								type="button"
								onClick={globalActions.stopGame}
								className="mt-6 w-full rounded-lg bg-red-600 px-6 py-3 font-bold text-white transition-colors hover:bg-red-700"
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
