import { PlayerMenu } from '@/components/player/menu';
import { NameLabel } from '@/components/player/name-label';
import { config } from '@/config';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useGlobalController } from '@/hooks/useGlobalController';
import { PlayerLayout } from '@/layouts/player';
import { playerActions } from '@/state/actions/player-actions';
import { globalStore } from '@/state/stores/global-store';
import { playerStore } from '@/state/stores/player-store';
import { ConnectionsView } from '@/views/connections-view';
import { CreateProfileView } from '@/views/create-profile-view';
import { GameLobbyView } from '@/views/game-lobby-view';
import { PlayerGameView } from '@/views/player-game-view';
import { ResultsView } from '@/views/results-view';
import { KmModalProvider } from '@kokimoki/shared';
import * as React from 'react';
import { useSnapshot } from 'valtio';

const App: React.FC = () => {
	const { title } = config;
	const { name, currentView } = useSnapshot(playerStore.proxy);
	const { started, gamePhase } = useSnapshot(globalStore.proxy);

	useGlobalController();
	useDocumentTitle(title);

	// Auto-transition views based on game phase
	React.useEffect(() => {
		if (gamePhase === 'playing') {
			playerActions.setCurrentView('game');
		} else if (gamePhase === 'results') {
			playerActions.setCurrentView('results');
		} else if (!started) {
			playerActions.setCurrentView('lobby');
		}
	}, [started, gamePhase]);

	// Reset player progress when returning to lobby (new round)
	React.useEffect(() => {
		if (gamePhase === 'lobby' || gamePhase === 'setup') {
			playerActions.resetPlayerProgress();
		}
	}, [gamePhase]);

	if (!name) {
		return (
			<PlayerLayout.Root>
				<PlayerLayout.Header />
				<PlayerLayout.Main className="flex items-center justify-center p-4">
					<CreateProfileView />
				</PlayerLayout.Main>
			</PlayerLayout.Root>
		);
	}

	return (
		<KmModalProvider>
			<PlayerLayout.Root>
				<PlayerLayout.Header>
					{currentView === 'lobby' && <PlayerMenu />}
				</PlayerLayout.Header>
				<PlayerLayout.Main>
					{currentView === 'lobby' && (
						<div className="flex items-center justify-center p-4">
							<GameLobbyView />
						</div>
					)}
					{currentView === 'connections' && <ConnectionsView />}
					{currentView === 'game' && <PlayerGameView />}
					{currentView === 'results' && <ResultsView />}
				</PlayerLayout.Main>{' '}
				<PlayerLayout.Footer>
					<NameLabel name={name} />
				</PlayerLayout.Footer>
			</PlayerLayout.Root>
		</KmModalProvider>
	);
};

export default App;
