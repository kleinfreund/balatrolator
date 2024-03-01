# Balatrolator

Score calculator for [Balatro](https://www.playbalatro.com/).

Very much work in progress. There's a just about functional user interface (that's probably laden with bugs) that you can summon by running `npm start` (see CONTRIBUTING.md for details).

## Plans

### GUI

I'm going to work on a graphical user interface allowing you to input all data needed to calculate the score of a played hand.

## To do & Questions

- How to model cards with probablities? Always return two scores if probabilities are at play?
- Implement blind effects (e.g. Which suit is debuffed? Are base chips and multipliers halved?)

### Jokers

- **Misprint**: Implement (needs probability model).
- **Seltzer**: Does it trigger on held cards? (probably yes)
- **Sock and Busking**: Does it trigger on held cards? (probably yes)
- **Dusk**: Implement. (I need to implement a better model that allows me to re-trigger card effects easily (specifically from the point of applying a general joker effect).)
- **Splash**: What wins? Splash effect or debuffed? (probably debuffed)
- **Bloodstone**: Implement (needs probability model).
- **Matador**: Rarity?
- **Cartomancer**: Rarity?
- **Pareidolia**: How do stone cards interact with Pareidolia? (probably they're treated as stone cards and not face cards)
- **Hiker**: Implement (FML)
