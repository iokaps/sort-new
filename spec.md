# Sorting Mania - Game Specification

## Overview

Sorting Mania is a fast-paced competitive sorting game where players categorize items by swiping cards left or right into two categories. Players compete against each other, and the winner is the one with the most correct sorts.

## Game Flow

### 1. Setup Phase (Host)

- Host can create game content in two ways:
  - **AI Generation**: Enter a theme, AI generates categories and items
  - **Manual Setup**: Manually input theme, two categories, and items with their correct categories
- Host sets the round duration (time limit)
- Host can preview the generated/created content before starting

### 2. Lobby Phase

- Players join using the player link
- Players enter their name
- Players wait in lobby, seeing other connected players
- Host sees all connected players and can start the game when ready

### 3. Game Phase

- All players simultaneously sort items
- Each player sees one item at a time as a card in the center of their screen
- Players swipe LEFT or RIGHT to categorize the item
- Categories are labeled on the left and right sides
- Timer shows remaining time
- Players can sort as many items as possible within the time limit
- Items are randomly ordered for each player

### 4. Results Phase

- Game ends when timer reaches zero
- Scores are calculated based on correct sorts
- Results show:
  - Podium (top 3 players)
  - Full leaderboard with scores
  - Player's individual performance
- Host can start a new round with different content or end the game

## Game Mechanics

### Scoring

- +1 point for each correct sort
- 0 points for incorrect sort
- Winner is the player with the most correct sorts

### Item Structure

Each item has:

- Text/label (the item to be sorted)
- Correct category (0 = left, 1 = right)

### Categories

- Two categories per game
- Categories are displayed on left and right sides of the screen
- Examples: "Pop" vs "Rock", "Marvel" vs "DC", "City A" vs "City B"

### Theme

- Overall context for the sorting task
- Examples: "Music Artists", "Superheroes", "Football Teams"

## User Roles

### Host

- Creates game content (AI or manual)
- Configures game settings
- Starts and stops the game
- Views real-time player progress
- Controls game flow

### Player

- Enters name to join
- Waits in lobby
- Sorts items by swiping during game
- Views personal results and leaderboard

### Presenter

- Read-only display for large screen
- Shows current game state
- Displays live leaderboard
- Shows player count

## AI Integration

### Theme Generation

- Host inputs a theme description
- AI generates:
  - Refined theme title
  - Two related categories
  - 20-30 items with correct category assignments
- Example Input: "Music artists"
- Example Output:
  - Theme: "Music Genre Sorting"
  - Categories: ["Pop Artists", "Rock Artists"]
  - Items: [{"text": "Taylor Swift", "category": 0}, {"text": "AC/DC", "category": 1}, ...]

## State Management

### Global Store (Shared)

- Game phase: setup, lobby, playing, results
- Theme, categories, items
- Round duration
- Current round start timestamp
- Player scores: Record<clientId, {name: string, score: number, sortedItems: number}>
- Game started flag

### Player Store (Local)

- Current view
- Player name
- Current item index
- Sorted items (for tracking progress)

## UI Components

### Host Setup View

- AI Generation Form:
  - Theme input field
  - Generate button
  - Loading state
  - Preview generated content
- Manual Setup Form:
  - Theme input
  - Category 1 & 2 inputs
  - Dynamic item list (add/remove items, assign categories)
- Round duration selector
- Start game button

### Player Game View

- Category labels (fixed on left/right)
- Swipeable card in center with item text
- Visual feedback for swipe direction
- Progress indicator (items sorted / total items)
- Timer countdown

### Results View

- Podium (top 3)
- Full leaderboard table
- Personal stats
- Next round / End game buttons (host only)

## Technical Implementation

### Swipe Mechanics

- Touch and mouse support
- Threshold for swipe detection (e.g., 100px)
- Visual feedback (card rotation/translation)
- Snap back if swipe is too short
- Animate to left/right if swipe is valid

### Round Timer

- Uses server timestamp for synchronization
- Global controller manages round progression
- Auto-transitions to results when time expires

### Item Randomization

- Each player gets items in random order
- Randomization seed based on player ID for consistency on refresh
