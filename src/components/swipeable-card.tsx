import { cn } from '@/utils/cn';
import * as React from 'react';

interface SwipeableCardProps {
	children: React.ReactNode;
	onSwipeLeft?: () => void;
	onSwipeRight?: () => void;
	className?: string;
	swipeThreshold?: number;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
	children,
	onSwipeLeft,
	onSwipeRight,
	className,
	swipeThreshold = 100
}) => {
	const cardRef = React.useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = React.useState(false);
	const [startX, setStartX] = React.useState(0);
	const [currentX, setCurrentX] = React.useState(0);
	const [translateX, setTranslateX] = React.useState(0);

	const handleStart = (clientX: number) => {
		setIsDragging(true);
		setStartX(clientX);
		setCurrentX(clientX);
	};

	const handleMove = (clientX: number) => {
		if (!isDragging) return;
		setCurrentX(clientX);
		const delta = clientX - startX;
		setTranslateX(delta);
	};

	const handleEnd = () => {
		if (!isDragging) return;
		setIsDragging(false);

		const delta = currentX - startX;

		// Check if swipe threshold is met
		if (Math.abs(delta) >= swipeThreshold) {
			if (delta < 0 && onSwipeLeft) {
				// Swiped left
				animateOut('left', onSwipeLeft);
				return;
			}
			if (delta > 0 && onSwipeRight) {
				// Swiped right
				animateOut('right', onSwipeRight);
				return;
			}
		}

		// Snap back to center
		setTranslateX(0);
	};

	const animateOut = (direction: 'left' | 'right', callback: () => void) => {
		const targetX =
			direction === 'left' ? -window.innerWidth : window.innerWidth;
		setTranslateX(targetX);

		setTimeout(() => {
			callback();
			setTranslateX(0);
			setStartX(0);
			setCurrentX(0);
		}, 300);
	};

	// Mouse events
	const handleMouseDown = (e: React.MouseEvent) => {
		handleStart(e.clientX);
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		handleMove(e.clientX);
	};

	const handleMouseUp = () => {
		handleEnd();
	};

	const handleMouseLeave = () => {
		if (isDragging) {
			handleEnd();
		}
	};

	// Touch events
	const handleTouchStart = (e: React.TouchEvent) => {
		handleStart(e.touches[0].clientX);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		handleMove(e.touches[0].clientX);
	};

	const handleTouchEnd = () => {
		handleEnd();
	};

	const rotation = translateX / 20; // Subtle rotation effect
	const opacity = 1 - Math.abs(translateX) / 300;

	return (
		<div
			ref={cardRef}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseLeave}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			className={cn(
				'cursor-grab touch-none select-none active:cursor-grabbing',
				className
			)}
			style={{
				transform: `translateX(${translateX}px) rotate(${rotation}deg)`,
				opacity: opacity,
				transition: isDragging ? 'none' : 'all 0.3s ease-out'
			}}
		>
			{children}
		</div>
	);
};
