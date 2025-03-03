"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whiteCards = exports.blackCards = void 0;
exports.shuffleCards = shuffleCards;
exports.drawCards = drawCards;
const cardData_1 = require("./cardData");
Object.defineProperty(exports, "blackCards", { enumerable: true, get: function () { return cardData_1.blackCards; } });
Object.defineProperty(exports, "whiteCards", { enumerable: true, get: function () { return cardData_1.whiteCards; } });
// Get a shuffled copy of cards
function shuffleCards(cards) {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
// Draw a specified number of cards from a deck
function drawCards(cards, count) {
    if (count > cards.length) {
        throw new Error("Not enough cards in the deck");
    }
    return cards.splice(0, count);
}
//# sourceMappingURL=cards.js.map