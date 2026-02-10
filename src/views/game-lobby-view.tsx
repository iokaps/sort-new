import { config } from '@/config';
import { cn } from '@/utils/cn';
import React from 'react';
import Markdown from 'react-markdown';

interface Props {
	className?: string;
}

/**
 * View to display the game lobby information before the game starts
 * This example is **optional** and can be removed if not needed
 */
export const GameLobbyView: React.FC<React.PropsWithChildren<Props>> = ({
	className
}) => {
	return (
		<div
			className={cn(
				'border-card-border rounded-game shadow-game animate-float w-full max-w-screen-sm border-2 bg-white',
				className
			)}
		>
			<div className="prose prose-headings:font-heading prose-headings:text-navy p-6">
				<Markdown>{config.gameLobbyMd}</Markdown>
			</div>
		</div>
	);
};
