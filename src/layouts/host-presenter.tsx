import { config } from '@/config';
import { cn } from '@/utils/cn';
import * as React from 'react';

interface LayoutProps {
	children?: React.ReactNode;
	className?: string;
}

const HostPresenterRoot: React.FC<LayoutProps> = ({ children, className }) => (
	<div className={cn('bg-cream text-navy min-h-screen', className)}>
		{children}
	</div>
);

const HostPresenterHeader: React.FC<LayoutProps> = ({
	children,
	className
}) => (
	<header className={cn('bg-host-bar mb-8 px-8 py-6 text-white', className)}>
		<div className="mx-auto max-w-screen-xl">
			<h1 className="font-heading text-3xl font-bold text-white">
				{config.title}
			</h1>
			{children}
		</div>
	</header>
);

const HostPresenterMain: React.FC<LayoutProps> = ({ children, className }) => (
	<main
		className={cn('mx-auto grid max-w-screen-xl gap-6 px-8 pb-8', className)}
	>
		{children}
	</main>
);

/**
 * Layout components for the 'host' and 'presenter' modes
 */
export const HostPresenterLayout = {
	Root: HostPresenterRoot,
	Header: HostPresenterHeader,
	Main: HostPresenterMain
};
