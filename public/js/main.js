import { initChat } from './chat.js';
import { initUI } from './ui.js';
import { initStorage } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    initStorage();
    initUI();
    initChat();
});