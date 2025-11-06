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
			'grid max-h-dvh min-h-dvh grid-rows-[auto_1fr_auto] overflow-hidden bg-slate-100',
			className
		)}
	>
		{children}
	</main>
);

const PlayerHeader: React.FC<LayoutProps> = ({ children, className }) => (
	<header
		className={cn(
			'sticky top-0 z-10 flex-shrink-0 bg-white py-3 shadow-sm',
			className
		)}
	>
		<div className="container mx-auto flex flex-wrap items-center justify-between px-4">
			<div className="text-lg font-bold">{config.title}</div>

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
			'safe-area-inset-bottom sticky bottom-0 z-10 flex-shrink-0 bg-white p-3 text-gray-900',
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
