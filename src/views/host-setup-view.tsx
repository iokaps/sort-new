import { config } from '@/config';
import { globalActions } from '@/state/actions/global-actions';
import type { GameItem } from '@/state/stores/global-store';
import { globalStore } from '@/state/stores/global-store';
import { cn } from '@/utils/cn';
import * as React from 'react';
import { useSnapshot } from 'valtio';

export const HostSetupView: React.FC = () => {
	const [activeTab, setActiveTab] = React.useState<'ai' | 'manual'>('ai');
	const globalState = useSnapshot(globalStore.proxy);

	return (
		<div className="rounded-game border-card-border shadow-game border-2 bg-white">
			<div className="border-card-border border-b-2 p-6">
				<h2 className="font-heading text-navy text-2xl font-bold">
					{config.setupTitle}
				</h2>
			</div>

			<div className="p-6">
				{/* Tabs */}
				<div className="mb-6 flex gap-2">
					<button
						type="button"
						onClick={() => setActiveTab('ai')}
						className={cn(
							'rounded-game font-heading px-4 py-2 font-bold transition-all',
							activeTab === 'ai'
								? 'bg-brand shadow-btn scale-105 text-white'
								: 'bg-cream-dark text-navy hover:bg-accent-gold-light'
						)}
					>
						{config.aiGenerationTab}
					</button>
					<button
						type="button"
						onClick={() => setActiveTab('manual')}
						className={cn(
							'rounded-game font-heading px-4 py-2 font-bold transition-all',
							activeTab === 'manual'
								? 'bg-brand shadow-btn scale-105 text-white'
								: 'bg-cream-dark text-navy hover:bg-accent-gold-light'
						)}
					>
						{config.manualSetupTab}
					</button>
				</div>

				{/* Tab Content */}
				{activeTab === 'ai' ? <AIGenerationTab /> : <ManualSetupTab />}

				{/* Preview Section */}
				{(globalState.theme || globalState.items.length > 0) && (
					<div className="rounded-game border-card-border bg-cream mt-6 border-2 p-4">
						<h3 className="font-heading text-navy mb-3 text-lg font-bold">
							{config.previewTitle}
						</h3>
						<div className="text-navy space-y-2 text-sm">
							<p>
								<strong>{config.themeLabel}:</strong> {globalState.theme}
							</p>
							<p>
								<strong>{config.categoryLeftLabel}:</strong>{' '}
								{globalState.categories[0]}
							</p>
							<p>
								<strong>{config.categoryRightLabel}:</strong>{' '}
								{globalState.categories[1]}
							</p>
							<p>
								<strong>{config.itemsLabel}:</strong> {globalState.items.length}
							</p>
							<p>
								<strong>{config.roundDurationLabel}:</strong>{' '}
								{globalState.roundDuration / 1000}s
							</p>
						</div>
					</div>
				)}

				{/* Start Button */}
				{globalState.items.length > 0 && (
					<button
						type="button"
						onClick={globalActions.startGame}
						className="rounded-game bg-brand font-heading shadow-btn hover:bg-brand-dark mt-6 w-full px-6 py-3 font-bold text-white transition-all hover:scale-105"
					>
						{config.startButton}
					</button>
				)}
			</div>
		</div>
	);
};

const AIGenerationTab: React.FC = () => {
	const [themeInput, setThemeInput] = React.useState('');
	const [isGenerating, setIsGenerating] = React.useState(false);
	const [error, setError] = React.useState('');

	const handleGenerate = async () => {
		if (!themeInput.trim()) return;

		setIsGenerating(true);
		setError('');

		const result = await globalActions.generateWithAI(themeInput);

		if (!result.success) {
			setError(result.error || config.generationFailed);
		}

		setIsGenerating(false);
	};

	return (
		<div className="space-y-4">
			<div>
				<label className="text-navy-light mb-2 block text-sm font-medium">
					{config.themeLabel}
				</label>
				<input
					type="text"
					value={themeInput}
					onChange={(e) => setThemeInput(e.target.value)}
					placeholder={config.themePlaceholder}
					className="border-card-border text-navy focus:border-brand w-full rounded-lg border-2 px-4 py-2 focus:outline-none"
				/>
			</div>

			<button
				type="button"
				onClick={handleGenerate}
				disabled={!themeInput.trim() || isGenerating}
				className="rounded-game bg-brand font-heading shadow-btn hover:bg-brand-dark w-full px-6 py-3 font-bold text-white transition-all hover:scale-105 disabled:scale-100 disabled:bg-gray-400 disabled:shadow-none"
			>
				{isGenerating ? config.generatingText : config.generateButton}
			</button>

			{error && (
				<div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
					{error}
				</div>
			)}
		</div>
	);
};

const ManualSetupTab: React.FC = () => {
	const globalState = useSnapshot(globalStore.proxy);
	const [theme, setTheme] = React.useState(globalState.theme);
	const [categoryLeft, setCategoryLeft] = React.useState(
		globalState.categories[0]
	);
	const [categoryRight, setCategoryRight] = React.useState(
		globalState.categories[1]
	);
	const [items, setItems] = React.useState<GameItem[]>(
		globalState.items.length > 0
			? globalState.items
			: [{ text: '', category: 0 }]
	);
	const [roundDuration, setRoundDuration] = React.useState(
		globalState.roundDuration / 1000
	);

	const addItem = () => {
		setItems([...items, { text: '', category: 0 }]);
	};

	const removeItem = (index: number) => {
		setItems(items.filter((_, i) => i !== index));
	};

	const updateItem = (
		index: number,
		field: 'text' | 'category',
		value: string | number
	) => {
		const newItems = [...items];
		if (field === 'text') {
			newItems[index].text = value as string;
		} else {
			newItems[index].category = value as 0 | 1;
		}
		setItems(newItems);
	};

	const handleSave = async () => {
		const validItems = items.filter((item) => item.text.trim());
		if (
			validItems.length === 0 ||
			!theme.trim() ||
			!categoryLeft.trim() ||
			!categoryRight.trim()
		) {
			return;
		}

		await globalActions.setGameContent(
			theme,
			[categoryLeft, categoryRight],
			validItems,
			roundDuration * 1000
		);
	};

	return (
		<div className="space-y-4">
			<div>
				<label className="text-navy-light mb-2 block text-sm font-medium">
					{config.themeLabel}
				</label>
				<input
					type="text"
					value={theme}
					onChange={(e) => setTheme(e.target.value)}
					placeholder={config.themePlaceholder}
					className="border-card-border text-navy focus:border-brand w-full rounded-lg border-2 px-4 py-2 focus:outline-none"
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="text-navy-light mb-2 block text-sm font-medium">
						{config.categoryLeftLabel}
					</label>
					<input
						type="text"
						value={categoryLeft}
						onChange={(e) => setCategoryLeft(e.target.value)}
						placeholder={config.categoryLeftPlaceholder}
						className="border-card-border text-navy focus:border-brand w-full rounded-lg border-2 px-4 py-2 focus:outline-none"
					/>
				</div>
				<div>
					<label className="text-navy-light mb-2 block text-sm font-medium">
						{config.categoryRightLabel}
					</label>
					<input
						type="text"
						value={categoryRight}
						onChange={(e) => setCategoryRight(e.target.value)}
						placeholder={config.categoryRightPlaceholder}
						className="border-card-border text-navy focus:border-brand w-full rounded-lg border-2 px-4 py-2 focus:outline-none"
					/>
				</div>
			</div>

			<div>
				<label className="text-navy-light mb-2 block text-sm font-medium">
					{config.roundDurationLabel}
				</label>
				<input
					type="number"
					min="10"
					max="300"
					value={roundDuration}
					onChange={(e) => setRoundDuration(Number(e.target.value))}
					className="border-card-border text-navy focus:border-brand w-full rounded-lg border-2 px-4 py-2 focus:outline-none"
				/>
			</div>

			<div>
				<label className="text-navy-light mb-2 block text-sm font-medium">
					{config.itemsLabel}
				</label>
				<div className="space-y-2">
					{items.map((item, index) => (
						<div key={index} className="flex gap-2">
							<input
								type="text"
								value={item.text}
								onChange={(e) => updateItem(index, 'text', e.target.value)}
								placeholder={config.itemTextPlaceholder}
								className="border-card-border text-navy focus:border-brand flex-1 rounded-lg border-2 px-4 py-2 focus:outline-none"
							/>
							<select
								value={item.category}
								onChange={(e) =>
									updateItem(index, 'category', Number(e.target.value))
								}
								className="border-card-border text-navy focus:border-brand rounded-lg border-2 px-4 py-2 focus:outline-none"
							>
								<option value={0}>
									{categoryLeft || config.categoryLeftDropdown}
								</option>
								<option value={1}>
									{categoryRight || config.categoryRightDropdown}
								</option>
							</select>
							{items.length > 1 && (
								<button
									type="button"
									onClick={() => removeItem(index)}
									className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-600"
								>
									{config.removeItemButton}
								</button>
							)}
						</div>
					))}
				</div>
				<button
					type="button"
					onClick={addItem}
					className="border-card-border bg-cream-dark text-navy hover:bg-brand-light mt-2 rounded-lg border-2 px-4 py-2 font-semibold transition-colors hover:text-white"
				>
					{config.addItemButton}
				</button>
			</div>

			<button
				type="button"
				onClick={handleSave}
				className="rounded-game bg-brand font-heading shadow-btn hover:bg-brand-dark w-full px-6 py-3 font-bold text-white transition-all hover:scale-105"
			>
				{config.saveConfigurationButton}
			</button>
		</div>
	);
};
