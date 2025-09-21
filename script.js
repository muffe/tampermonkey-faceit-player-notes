// ==UserScript==
// @name         Faceit Player Notes
// @namespace    muffe
// @version      1.0
// @description  Add notes to Faceit players
// @author       muffe
// @match        https://www.faceit.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('FACEIT NOTES: Script loaded!');

    // Simple test to verify script is running
    setTimeout(() => {
        console.log('FACEIT NOTES: Test message after 2 seconds');
    }, 2000);

    // Storage functions
    function saveNotes(notes) {
        localStorage.setItem('faceit_player_notes_simple', JSON.stringify(notes));
    }

    function loadNotes() {
        const stored = localStorage.getItem('faceit_player_notes_simple');
        return stored ? JSON.parse(stored) : {};
    }

    function setNote(playerName, note) {
        const notes = loadNotes();
        if (note.trim() === '') {
            delete notes[playerName];
        } else {
            notes[playerName] = note;
        }
        saveNotes(notes);
    }

    function getNote(playerName) {
        const notes = loadNotes();
        return notes[playerName] || '';
    }

    // Simple note editor
    function showNoteEditor(playerName) {
        const currentNote = getNote(playerName);
        const newNote = prompt(`Note for ${playerName}:`, currentNote);

        if (newNote !== null) {
            setNote(playerName, newNote);
            console.log(`FACEIT NOTES: ${newNote ? 'Updated' : 'Deleted'} note for ${playerName}`);
            // Refresh the page elements
            setTimeout(processElements, 100);
        }
    }

    // Add CSS
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .faceit-note-btn {
                background: #ff6c00 !important;
                color: white !important;
                border: none !important;
                font-size: 10px !important;
                padding: 2px 6px !important;
                margin-left: 4px !important;
                border-radius: 2px !important;
                cursor: pointer !important;
                font-weight: bold !important;
            }
            .faceit-note-btn:hover {
                background: #e85d00 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Create a note button
    function createNoteButton(playerName) {
        const existingNote = getNote(playerName);

        const button = document.createElement('button');
        button.className = 'faceit-note-btn';
        button.textContent = existingNote ? 'NOTE' : '+';
        button.title = existingNote ? `Note: ${existingNote}` : `Add note for ${playerName}`;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showNoteEditor(playerName);
        });

        return button;
    }

    // Process elements on the page
    function processElements() {
        console.log('FACEIT NOTES: Processing elements...');

        // Remove existing buttons AND wrappers to avoid duplicates
        document.querySelectorAll('.faceit-note-btn, .faceit-note-wrapper').forEach(el => el.remove());

        let buttonsAdded = 0;

        // Look for player cards
        const playerCards = document.querySelectorAll('[data-testid="playerCard"]');
        console.log(`FACEIT NOTES: Found ${playerCards.length} player cards`);

        playerCards.forEach((card, index) => {
            console.log(`FACEIT NOTES: Processing card ${index + 1}:`, card);

            // Look for player name using exact selector from your HTML
            const nameElement = card.querySelector('.styles__Nickname-sc-3441c003-2');

            if (nameElement) {
                const playerName = nameElement.textContent.trim();
                console.log(`FACEIT NOTES: Found player name "${playerName}"`);

                if (playerName && playerName.length > 1) {
                    const button = createNoteButton(playerName);

                    // Find the main player info container that contains both name and icons
                    const mainPlayerContainer = card.querySelector('.styles__Container-sc-5688573a-0');
                    if (mainPlayerContainer) {
                        // Create a wrapper div for the button positioned below everything
                        const buttonWrapper = document.createElement('div');
                        buttonWrapper.className = 'faceit-note-wrapper';
                        buttonWrapper.style.cssText = `
                            margin-top: 4px !important;
                            display: flex !important;
                            justify-content: center !important;
                            width: 100% !important;
                        `;
                        buttonWrapper.appendChild(button);

                        // Insert after the main player container (avatar + name/icons)
                        mainPlayerContainer.parentNode.insertBefore(buttonWrapper, mainPlayerContainer.nextSibling);
                        buttonsAdded++;
                        console.log(`FACEIT NOTES: Added button for ${playerName} below player info`);
                    } else {
                        console.log(`FACEIT NOTES: Could not find main player container for ${playerName}`);
                    }
                } else {
                    console.log(`FACEIT NOTES: Invalid player name: "${playerName}"`);
                }
            } else {
                console.log(`FACEIT NOTES: Could not find nickname element in card ${index + 1}`);
                console.log('FACEIT NOTES: Card HTML preview:', card.innerHTML.substring(0, 300));
            }
        });

        console.log(`FACEIT NOTES: Added ${buttonsAdded} buttons total`);
    }

    // Initialize
    function init() {
        console.log('FACEIT NOTES: Initializing...');
        addStyles();

        // Process immediately if page is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', processElements);
        } else {
            processElements();
        }

        // Throttle processing to prevent spam
        let processTimeout = null;
        let lastProcessTime = 0;
        let lastPlayerCount = 0;

        function throttledProcess() {
            const now = Date.now();

            // Only process if enough time has passed
            if (now - lastProcessTime < 2000) {
                return;
            }

            // Check if player count actually changed
            const currentPlayerCount = document.querySelectorAll('[data-testid="playerCard"]').length;
            if (currentPlayerCount === lastPlayerCount && lastPlayerCount > 0) {
                return;
            }

            console.log('FACEIT NOTES: Player count changed or enough time passed, processing...');
            lastProcessTime = now;
            lastPlayerCount = currentPlayerCount;
            processElements();
        }

        // Watch for changes with throttling
        const observer = new MutationObserver((mutations) => {
            // Only care about significant changes
            const hasSignificantChange = mutations.some(mutation =>
                mutation.type === 'childList' &&
                mutation.addedNodes.length > 0 &&
                Array.from(mutation.addedNodes).some(node =>
                    node.nodeType === Node.ELEMENT_NODE &&
                    (node.matches && node.matches('[data-testid="playerCard"]') ||
                     node.querySelector && node.querySelector('[data-testid="playerCard"]'))
                )
            );

            if (!hasSignificantChange) {
                return;
            }

            // Clear existing timeout
            if (processTimeout) {
                clearTimeout(processTimeout);
            }

            // Set new timeout
            processTimeout = setTimeout(throttledProcess, 1000);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Process when URL changes (for SPA navigation)
        let currentUrl = window.location.href;
        setInterval(() => {
            if (window.location.href !== currentUrl) {
                console.log('FACEIT NOTES: URL changed, processing...');
                currentUrl = window.location.href;
                setTimeout(processElements, 1500);
            }
        }, 2000);

        // Fallback processing (much less frequent)
        setInterval(() => {
            const currentCount = document.querySelectorAll('[data-testid="playerCard"]').length;
            if (currentCount > 0 && document.querySelectorAll('.faceit-note-btn').length === 0) {
                console.log('FACEIT NOTES: Fallback processing - found players but no buttons');
                processElements();
            }
        }, 10000);
    }

    // Start the script
    init();

    // Export functions for debugging
    window.faceitNotesDebug = {
        processElements,
        showNoteEditor,
        loadNotes,
        saveNotes
    };

})();
