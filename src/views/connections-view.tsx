import { config } from '@/config';
import { globalStore } from '@/state/stores/global-store';
import { cn } from '@/utils/cn';
import React from 'react';
import Markdown from 'react-markdown';
import { useSnapshot } from 'valtio';

interface Props {
	className?: string;
}

/**
 * View to display players who have joined the game and their online status.
 * This example is **optional** and can be removed if not needed
 */
export const ConnectionsView: React.FC<React.PropsWithChildren<Props>> = ({
	className
}) => {
	const players = useSnapshot(globalStore.proxy).players;
	const onlinePlayerIds = useSnapshot(globalStore.connections).clientIds;
	const playersList = Object.entries(players).map(([id, player]) => ({
		id,
		name: player.name,
		isOnline: onlinePlayerIds.has(id)
	}));
	const onlinePlayersCount = playersList.filter((p) => p.isOnline).length;

	return (
		<div
			className={cn(
				'border-card-border rounded-game shadow-game w-full border-2 bg-white',
				className
			)}
		>
			<div className="p-6">
				<div className="prose prose-headings:font-heading prose-headings:text-navy">
					<Markdown>{config.connectionsMd}</Markdown>
				</div>

				<div className="bg-cream border-card-border rounded-game mt-4 border-2 p-6 shadow-sm">
					<div className="text-navy/60 text-sm font-semibold">
						{config.players}
					</div>
					<div className="font-heading text-navy mt-1 text-3xl font-bold">
						{onlinePlayersCount}
					</div>
				</div>

				{playersList.length > 0 && (
					<div className="mt-4">
						<h3 className="font-heading text-navy mb-2 text-lg font-bold">
							Player List
						</h3>
						<ul className="bg-cream rounded-game divide-card-border border-card-border divide-y border-2">
							{playersList.map((player) => (
								<li key={player.id} className="px-4 py-3">
									<div className="flex items-center justify-between">
										<span className="text-navy font-semibold">
											{player.name}
										</span>
										<span
											className={cn(
												'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
												player.isOnline
													? 'bg-green-100 text-green-800'
													: 'border-card-border text-navy-light border'
											)}
										>
											{player.isOnline ? 'Online' : 'Offline'}
										</span>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};
