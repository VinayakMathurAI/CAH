"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whiteCards = exports.blackCards = void 0;
exports.shuffleCards = shuffleCards;
exports.drawCards = drawCards;
var uuid_1 = require("uuid");
// Sample set of black cards
exports.blackCards = [
    {
        id: (0, uuid_1.v4)(),
        text: "Why can't I sleep at night?",
        pick: 1
    },
    {
        id: (0, uuid_1.v4)(),
        text: "I got 99 problems but ____ ain't one.",
        pick: 1
    },
    {
        id: (0, uuid_1.v4)(),
        text: "What's a girl's best friend?",
        pick: 1
    },
    {
        id: (0, uuid_1.v4)(),
        text: "What's that smell?",
        pick: 1
    },
    {
        id: (0, uuid_1.v4)(),
        text: "This is the way the world ends. Not with a bang but with ____.",
        pick: 1
    },
    {
        id: (0, uuid_1.v4)(),
        text: "What will I bring back in time to convince people that I am a powerful wizard?",
        pick: 1
    },
    {
        id: (0, uuid_1.v4)(),
        text: "____ + ____ = ____",
        pick: 3
    },
    {
        id: (0, uuid_1.v4)(),
        text: "Make a haiku.",
        pick: 3
    },
    {
        id: (0, uuid_1.v4)(),
        text: "In M. Night Shyamalan's new movie, Bruce Willis discovers that ____ had really been ____ all along.",
        pick: 2
    },
    {
        id: (0, uuid_1.v4)(),
        text: "Life for American Indians was forever changed when the White Man introduced them to ____.",
        pick: 1
    }
];
// Sample set of white cards
exports.whiteCards = [
    { id: (0, uuid_1.v4)(), text: "Flying sex snakes." },
    { id: (0, uuid_1.v4)(), text: "Michelle Obama's arms." },
    { id: (0, uuid_1.v4)(), text: "German dungeon porn." },
    { id: (0, uuid_1.v4)(), text: "White privilege." },
    { id: (0, uuid_1.v4)(), text: "Getting so angry that you pop a boner." },
    { id: (0, uuid_1.v4)(), text: "Tasteful sideboob." },
    { id: (0, uuid_1.v4)(), text: "Praying the gay away." },
    { id: (0, uuid_1.v4)(), text: "Two midgets shitting into a bucket." },
    { id: (0, uuid_1.v4)(), text: "MechaHitler." },
    { id: (0, uuid_1.v4)(), text: "Being a motherfucking sorcerer." },
    { id: (0, uuid_1.v4)(), text: "A disappointing birthday party." },
    { id: (0, uuid_1.v4)(), text: "Puppies!" },
    { id: (0, uuid_1.v4)(), text: "A windmill full of corpses." },
    { id: (0, uuid_1.v4)(), text: "Guys who don't call." },
    { id: (0, uuid_1.v4)(), text: "Racially-biased SAT questions." },
    { id: (0, uuid_1.v4)(), text: "Dying." },
    { id: (0, uuid_1.v4)(), text: "Steven Hawking talking dirty." },
    { id: (0, uuid_1.v4)(), text: "Being on fire." },
    { id: (0, uuid_1.v4)(), text: "A lifetime of sadness." },
    { id: (0, uuid_1.v4)(), text: "An erection that lasts longer than four hours." },
    { id: (0, uuid_1.v4)(), text: "AIDS." },
    { id: (0, uuid_1.v4)(), text: "Same-sex ice dancing." },
    { id: (0, uuid_1.v4)(), text: "Glenn Beck catching his scrotum on a curtain hook." },
    { id: (0, uuid_1.v4)(), text: "The Rapture." },
    { id: (0, uuid_1.v4)(), text: "Pterodactyl eggs." },
    { id: (0, uuid_1.v4)(), text: "Crippling debt." },
    { id: (0, uuid_1.v4)(), text: "Eugenics." },
    { id: (0, uuid_1.v4)(), text: "Exchanging pleasantries." },
    { id: (0, uuid_1.v4)(), text: "My relationship status." },
    { id: (0, uuid_1.v4)(), text: "Auschwitz." }
];
// Get a shuffled copy of cards
function shuffleCards(cards) {
    var _a;
    var shuffled = __spreadArray([], cards, true);
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [shuffled[j], shuffled[i]], shuffled[i] = _a[0], shuffled[j] = _a[1];
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
