import { config } from '@/config';
import { cn } from '@/utils/cn';
import * as React from 'react';

interface LayoutProps {
	children?: React.ReactNode;
	className?: string;
}

const PlayerRoot: React.FC<LayoutProps> = ({ children, className }) => (
	<main
		className={cn(
			'bg-cream grid max-h-dvh min-h-dvh grid-rows-[auto_1fr_auto] overflow-hidden',
			className
		)}
	>
		{children}
	</main>
);

const PlayerHeader: React.FC<LayoutProps> = ({ children, className }) => (
	<header
		className={cn(
			'border-card-border sticky top-0 z-10 flex-shrink-0 border-b-2 bg-white/80 py-3 backdrop-blur-md',
			className
		)}
	>
		<div className="container mx-auto flex flex-wrap items-center justify-between px-4">
			<div className="font-heading text-navy text-xl font-bold">
				{config.title}
			</div>

			{children}
		</div>
	</header>
);

const PlayerMain: React.FC<LayoutProps> = ({ children, className }) => (
	<main className={cn('flex-1 overflow-x-hidden overflow-y-auto', className)}>
		{children}
	</main>
);

const PlayerFooter: React.FC<LayoutProps> = ({ children, className }) => (
	<footer
		className={cn(
			'safe-area-inset-bottom border-card-border text-navy sticky bottom-0 z-10 flex-shrink-0 border-t-2 bg-white/80 p-3 backdrop-blur-md',
			className
		)}
	>
		{children}
	</footer>
);

/**
 * Layout components for the 'player' mode
 */
export const PlayerLayout = {
	Root: PlayerRoot,
	Header: PlayerHeader,
	Main: PlayerMain,
	Footer: PlayerFooter
};
