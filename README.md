# FACEIT Player Notes

A Tampermonkey/Greasemonkey userscript that adds a note-taking system to FACEIT player profiles. Keep track of teammates, opponents, and other players with custom notes that persist across browsing sessions.

## Features

- ✨ Add custom notes to any FACEIT player
- 💾 Persistent storage using browser localStorage
- 🔄 Automatic detection of player cards across different FACEIT pages
- 🎯 Clean, non-intrusive UI that matches FACEIT's design
- ⚡ Real-time updates when navigating between pages
- 🛡️ Throttled processing to prevent performance issues

## Installation

### Prerequisites
- A userscript manager extension installed in your browser:
  - [Tampermonkey](https://tampermonkey.net/) (Chrome, Firefox, Safari, Edge)
  - [Greasemonkey](https://addons.mozilla.org/en-US/addon/greasemonkey/) (Firefox)
  - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

### Steps
1. Install a userscript manager if you haven't already
2. Click on the userscript manager icon in your browser
3. Select "Create a new script" or "Add a new script"
4. Copy and paste the entire script code
5. Save the script (Ctrl+S)
6. Navigate to any FACEIT page with player cards

## Usage

### Adding Notes
1. Visit any FACEIT page that displays player cards (match rooms, player profiles, etc.)
2. Look for the orange **"+"** button below each player's name/avatar
3. Click the button to open the note editor
4. Type your note and click OK
5. The button will change to **"NOTE"** to indicate a note exists

### Viewing Notes
- Hover over the **"NOTE"** button to see the note content in a tooltip
- Click the **"NOTE"** button to edit or view the full note

### Editing/Deleting Notes
- Click any note button (+ or NOTE)
- Modify the text in the popup dialog
- Leave empty and click OK to delete the note

## How It Works

The script automatically:
- Detects FACEIT player cards using `[data-testid="playerCard"]` selectors
- Extracts player names from the nickname elements
- Adds styled note buttons below each player's information
- Stores notes in browser localStorage with the key `faceit_player_notes_simple`
- Monitors page changes and updates buttons accordingly

## Supported Pages

The script works on all FACEIT pages including:
- Match rooms
- Player profiles
- Tournament brackets
- Leaderboards
- Any page with player cards

## Styling

The note buttons are styled to match FACEIT's orange theme:
- Orange background (`#ff6c00`)
- White text
- Hover effect with darker orange
- Small, non-intrusive size
- Positioned below player information

## Privacy

- All notes are stored locally in your browser
- No data is sent to external servers
- Notes persist until you clear browser data or manually delete them

## Troubleshooting

### Notes not appearing
1. Check if the userscript manager is enabled
2. Refresh the FACEIT page
3. Open browser console and look for "FACEIT NOTES:" messages
4. Try running `window.faceitNotesDebug.processElements()` in console

### Script not working after FACEIT updates
FACEIT may change their HTML structure. If the script stops working:
1. Check browser console for errors
2. Open an issue with details about which page isn't working
3. Include any console error messages

## Contributing

Feel free to submit issues or pull requests if you:
- Find bugs or compatibility issues
- Want to suggest new features
- Have improvements for the code

## License

This project is open source and available under the MIT License.

## Changelog

### v1.0
- Initial release
- Basic note-taking functionality
- Automatic player detection
- Persistent storage
- FACEIT design integration
