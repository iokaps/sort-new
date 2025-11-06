// Sound utility for generating fun swipe sounds
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
	if (!audioContext) {
		audioContext = new (window.AudioContext ||
			(window as any).webkitAudioContext)();
	}
	return audioContext;
}

export const sounds = {
	// Fun "whoosh" sound for left swipe
	playSwipeLeft() {
		try {
			const ctx = getAudioContext();
			const now = ctx.currentTime;

			// Create oscillator for the whoosh effect
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.connect(gain);
			gain.connect(ctx.destination);

			// Descending frequency for left swipe (higher to lower)
			osc.frequency.setValueAtTime(800, now);
			osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);

			// Quick fade out
			gain.gain.setValueAtTime(0.3, now);
			gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

			osc.type = 'sine';
			osc.start(now);
			osc.stop(now + 0.15);
		} catch (error) {
			console.warn('Could not play swipe left sound:', error);
		}
	},

	// Fun "pop" sound for right swipe
	playSwipeRight() {
		try {
			const ctx = getAudioContext();
			const now = ctx.currentTime;

			// Create oscillator for the pop effect
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.connect(gain);
			gain.connect(ctx.destination);

			// Ascending frequency for right swipe (lower to higher)
			osc.frequency.setValueAtTime(300, now);
			osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);

			// Quick fade out
			gain.gain.setValueAtTime(0.3, now);
			gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

			osc.type = 'sine';
			osc.start(now);
			osc.stop(now + 0.12);
		} catch (error) {
			console.warn('Could not play swipe right sound:', error);
		}
	},

	// Success sound for completing all items
	playSuccess() {
		try {
			const ctx = getAudioContext();
			const now = ctx.currentTime;

			// Create a cheerful ascending arpeggio
			const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (major chord)

			frequencies.forEach((freq, index) => {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();

				osc.connect(gain);
				gain.connect(ctx.destination);

				const startTime = now + index * 0.1;
				osc.frequency.setValueAtTime(freq, startTime);

				gain.gain.setValueAtTime(0.2, startTime);
				gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

				osc.type = 'sine';
				osc.start(startTime);
				osc.stop(startTime + 0.3);
			});
		} catch (error) {
			console.warn('Could not play success sound:', error);
		}
	}
};
