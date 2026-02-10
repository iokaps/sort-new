import { config } from '@/config';
import * as React from 'react';

interface NameLabelProps {
	name: string;
}

/**
 * A label component to display the player's name
 * This example is **optional** and can be removed if not needed
 */
export const NameLabel: React.FC<NameLabelProps> = ({ name }) => {
	return (
		<div className="flex items-center gap-2">
			<div className="bg-brand font-heading flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white">
				{name.charAt(0).toUpperCase()}
			</div>
			<span className="text-navy/60 text-sm">{config.playerNameLabel}</span>
			<span className="font-heading text-navy font-bold">{name}</span>
		</div>
	);
};
