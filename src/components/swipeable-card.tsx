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
	swipeThreshold = 80
}) => {
	const cardRef = React.useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = React.useState(false);
	const [startX, setStartX] = React.useState(0);
	const [startY, setStartY] = React.useState(0);
	const [currentX, setCurrentX] = React.useState(0);
	const [currentY, setCurrentY] = React.useState(0);
	const [translateX, setTranslateX] = React.useState(0);

	const handleStart = (clientX: number, clientY: number) => {
		setIsDragging(true);
		setStartX(clientX);
		setStartY(clientY);
		setCurrentX(clientX);
		setCurrentY(clientY);
	};

	const handleMove = (clientX: number, clientY: number) => {
		if (!isDragging) return;
		setCurrentX(clientX);
		setCurrentY(clientY);
		const deltaX = clientX - startX;
		const deltaY = clientY - startY;

		// Only move horizontally if horizontal movement is dominant
		if (Math.abs(deltaX) > Math.abs(deltaY)) {
			setTranslateX(deltaX);
		}
	};

	const handleEnd = () => {
		if (!isDragging) return;
		setIsDragging(false);

		const deltaX = currentX - startX;
		const deltaY = currentY - startY;

		// Check if swipe is primarily horizontal
		if (
			Math.abs(deltaX) > Math.abs(deltaY) &&
			Math.abs(deltaX) >= swipeThreshold
		) {
			if (deltaX < 0 && onSwipeLeft) {
				// Swiped left
				animateOut('left', onSwipeLeft);
				return;
			}
			if (deltaX > 0 && onSwipeRight) {
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
			setStartY(0);
			setCurrentX(0);
			setCurrentY(0);
		}, 250);
	};

	// Mouse events
	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		handleStart(e.clientX, e.clientY);
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (isDragging) {
			e.preventDefault();
		}
		handleMove(e.clientX, e.clientY);
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
		handleStart(e.touches[0].clientX, e.touches[0].clientY);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		// Prevent page scroll when swiping
		if (isDragging && Math.abs(currentX - startX) > 10) {
			e.preventDefault();
		}
		handleMove(e.touches[0].clientX, e.touches[0].clientY);
	};

	const handleTouchEnd = () => {
		handleEnd();
	};

	const rotation = translateX / 25; // Subtle rotation effect
	const opacity = Math.max(0.5, 1 - Math.abs(translateX) / 400);

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
				transition: isDragging ? 'none' : 'all 0.25s ease-out'
			}}
		>
			{children}
		</div>
	);
};
