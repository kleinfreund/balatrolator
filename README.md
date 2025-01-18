# Balatrolator

[![Tests passing](https://github.com/kleinfreund/balatrolator/workflows/Tests/badge.svg)](https://github.com/kleinfreund/balatrolator/actions)

[Balatrolator](https://balatrolator.com/) is a score calculator for [Balatro](https://www.playbalatro.com/). It's a fan project and not affiliated with the makers of Balatro.

> [!NOTE]
> Please, [report any bugs you encounter](https://github.com/kleinfreund/balatrolator/issues/new/choose).

> [!TIP]
> [Example score](https://balatrolator.com/?state=---1-1--5-___________-11*_*_*_*_*_*_*_*_*_*_*_*-50********_122********_126*****0*3**_69****12.25****_132********_119****5.5****-0*3***2**1*_0*3**4*2**1*4_0*3**2****_0*3**5*2***_0*3**5*2***_0*3***2***) showcasing a hand played by [haelian](https://twitch.tv/haelian) on 2024-02-26 18:13 (UTC).

## Features

- Game features: Supports all score-influencing game features (and has tests for a lot of them)
- Luck: Calculates worst case, average, and best case scores when odds are in play (read more below: [Tell me the odds: how probabilistic effects are handled](#tell-me-the-odds-how-probabilistic-effects-are-handled))
- Saves: Save hands in the browser and load them later to compare different hand variations. You can also export saves as JSON files and import them again.
- Share URLs: Share your score! The current hand is persisted in the URL and the saves.
- Quality of life: Duplicate jokers/playing cards or set their play count to input high-scoring endless game hands.

## Non-features

- No hand optimizations: the goal of this calculator is to predict/verify scores (i.e doing the math). I leave being clever to you. 🤡 (Also: I might change my mind on this. 🃏)

## Documentation

### Tell me the odds: how probabilistic effects are handled

Balatrolator always returns deterministic scores and doesn't roll any “dice” when probabilistic effects (e.g. lucky card) are at play. Instead, it gives you scores for three “luck modes”:

- **no luck**: the lower bound
- **all luck**: the upper bound
- **average luck**: the score you can expect with perfectly average luck

“No luck” means probabilistic effects never contribute anything to the score. Lucky cards never apply their +Mult value; Bloodstone never applies its xMult value.

“All luck” means probablistic effects always contribute to the score. Lucky cards always add their +Mult value; Bloodstone always applies its xMult value.

“Average luck” means probabilistic effects are counted with the scores that you can expect on average. That is, the resulting score is the one you would get as if you would play the same hand an infinite amount of times and averaged the resulting scores. In other words, a lucky card's +Mult value of 20 with standard odds of 1 in 5 would add 4 (20 * 1/5). “Oops! All 6s” jokers do factor into this math: having two instances of that joker would raise the odds of a lucky card's +Mult effect to 4 in 5 and so the value scored would be 16 (20 * 4/5).

Of special note is the case when there are enough instances of the “Oops! All 6s” joker to guarantee an effect in the game. In that case, the three luck modes become irrelevant and the score is calculated the same way it would in “all luck” mode.

## Contributing

[Contribution guidelines for this project](CONTRIBUTING.md)

## Development

### Calculate score via CLI

After cloning this repository, run the following to calculate a score with a Balatrolator save export in JSON format.

```sh
node --experimental-strip-types balatrolator.ts 'Current hand.json'
```
