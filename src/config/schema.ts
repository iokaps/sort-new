import { z } from 'zod/v4';

export const schema = z.object({
	// translations
	title: z.string().default('Sorting Mania'),

	// Setup & Lobby
	setupTitle: z.string().default('Game Setup'),
	aiGenerationTab: z.string().default('AI Generation'),
	manualSetupTab: z.string().default('Manual Setup'),

	themeLabel: z.string().default('Theme'),
	themePlaceholder: z
		.string()
		.default('e.g., Music Artists, Football Teams, Superheroes'),
	categoryLeftLabel: z.string().default('Left Category'),
	categoryRightLabel: z.string().default('Right Category'),
	categoryLeftPlaceholder: z.string().default('e.g., Pop'),
	categoryRightPlaceholder: z.string().default('e.g., Rock'),

	itemsLabel: z.string().default('Items'),
	itemTextPlaceholder: z.string().default('Item text'),
	addItemButton: z.string().default('Add Item'),
	removeItemButton: z.string().default('Remove'),

	roundDurationLabel: z.string().default('Round Duration (seconds)'),
	generateButton: z.string().default('Generate with AI'),
	generatingText: z.string().default('Generating...'),
	previewTitle: z.string().default('Preview'),

	aiSystemPrompt: z
		.string()
		.default(
			'You are a game content generator. Generate engaging sorting game content based on the theme provided. IMPORTANT: Return ONLY valid JSON without any markdown formatting or code blocks. The JSON format must be: {"theme": "string", "categories": ["string", "string"], "items": [{"text": "string", "category": 0 or 1}]}. Generate 20-30 items with balanced distribution between categories (roughly 50/50 split).'
		),

	gameLobbyMd: z
		.string()
		.default(
			'# Waiting for game to start...\nThe game will start once the host presses the start button.'
		),

	// Game
	swipeLeftHint: z.string().default('← Swipe Left'),
	swipeRightHint: z.string().default('Swipe Right →'),
	itemsProgress: z.string().default('Items: {current} / {total}'),
	timeRemaining: z.string().default('Time: {time}'),

	// Results
	resultsTitle: z.string().default('Game Results'),
	yourScore: z.string().default('Your Score: {score}'),
	correctSorts: z.string().default('Correct Sorts'),
	totalSorts: z.string().default('Total Sorted'),
	newRoundButton: z.string().default('New Round'),
	endGameButton: z.string().default('End Game'),

	players: z.string().default('Players'),
	timeElapsed: z.string().default('Time elapsed'),
	startButton: z.string().default('Start Game'),
	stopButton: z.string().default('Stop Game'),
	loading: z.string().default('Loading...'),

	menuTitle: z.string().default('Menu'),
	menuConnections: z.string().default('Connections'),
	menuGameLobby: z.string().default('Lobby'),

	playerNameTitle: z.string().default('Enter Your Name'),
	playerNamePlaceholder: z.string().default('Your name...'),
	playerNameLabel: z.string().default('Name:'),
	playerNameButton: z.string().default('Continue'),

	hostLabel: z.string().default('Host'),
	presenterLabel: z.string().default('Presenter'),

	gameLinksTitle: z.string().default('Game Links'),
	playerLinkLabel: z.string().default('Player Link'),
	presenterLinkLabel: z.string().default('Presenter Link'),

	menuAriaLabel: z.string().default('Open menu drawer')
});

export type Config = z.infer<typeof schema>;
