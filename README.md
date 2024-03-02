# Balatrolator

Score calculator for [Balatro](https://www.playbalatro.com/).

Very much work in progress. There's a just about functional user interface (that's probably laden with bugs) that you can summon by running `npm start` (see CONTRIBUTING.md for details).

[Example score](https://balatrolator.com/?state=N4IgFghgdgJgziAXABgDQhgSzgYwgJ3iTRAFsB7KAUwE9j0AjAG01iRACFMBzAAg5Zt0MKjgDW7AEpUYvACKiJ6SLAAyVAG5UmCRKABiTAK5wwvfZi1JQTTdqQBGB%2BgAOTCDV3IAvukMmzAAlyEyprEFstJkdXd09iXxALLV5yADNeCF4AaVYYcMj7RGcQNw8vRIBlABd8CB4wavNjUwK7aOLY8oS-EPxUjKzctj0I9pjSuIq-IyYmXmDQtqiJsviURP9W0cKOkrXpkBq6hurlov2pnpAAFTB8KioBzJy8872u9Z90G4B3cl4AAV6vh3qsrht0MDMKCduNOpNupCQIEGrwAMIEfJwlYIg4JRIAK3IYio%2BF0AG1QFAIKQwogQHIAHIAQRA6BkmGqmEo7AYEDgYViJnRYEwLi8wrgAFlZty3JgyfQQNy6TK5eKWEqEXUoBIGSycEKQHAjFz2IEqARqgh0NhDdyrIhakYqL5qbT6ZxjFQXPhWGcOVhubyGfzBezJiKxRLlW4TLKmPKtbCSKqqOqk5rFbCSrr9SBDcbTeaGZbrbaQPacI76S63agPXT2HcngBJGDkaJBrk8qB8gXG%2BNwUXiyVRzPJnPK9OT7PavPQAtFyMls4MuSYWmUIh2uAOyx1-Cu90gGnNstd8jcOqkSOckP9sODyPD0exlBSxNT7VpzBq7951zAAmAA6YCAFZ0HzdgV3QNcLStfAbUjatayQetT3PL1W3MWlMCYOge0fAcIyld9x2HQCFV-dBZ2olMJhgg0jVXM11xRJCUL3A8nUwxsz09dgAHF3DgOBeAAKRJJViL7UihxaCi4xaBjp0-FV-wzNTtQg0CoJAZjC1Y%2BD2MQitUP3GtDww483QAXXQYlSXwSomHIFDEAMtYZExQhKVAIy4JNMyNy3ChYErB95OfMiQCoKAVCNOkoA4qBKGLK0OkMmQQFPIKTJC0tGXCncouDGKQHDY0EqSqgUo47gxMrQUIGyh58nypdYMKhCwu3SL7wq0MqpfDlEugZKEsa5rVyy9gOrygSCuLUKSoG3d4uGp9Rri2rJvq6b2CagUWvmhlFq6vUetW4rNw28rexG6r7wmqAptS47Zvg86cs6xzwG0GA-KIRAqUM7qWNujj7oizbouesb4rej6ONIOU5ra9h0uoJbAsh4zofYWGyqGp6dpe8a6oa9g4GqR5uxNX7LuWgngr69a4cekjYpqlHDs%2Bhk6YZzH2tyq7l16taScGuTEb2-maYZHHMqxi7xfs7wgA) showcasing a hand played by [haelian](https://twitch.tv/haelian) on 2024-02-26 18:13 (UTC).

## Plans

### GUI

I'm going to work on a graphical user interface allowing you to input all data needed to calculate the score of a played hand.

## To do & Questions

- How to model cards with probablities? Always return two scores if probabilities are at play?
- Implement blind effects (e.g. Which suit is debuffed? Are base chips and multipliers halved?)
- UI: Drag'n'drop jokers & cards.

### Jokers

- **Misprint**: Implement (needs probability model).
- **Bloodstone**: Implement (needs probability model).
- **Matador**: Rarity?
- **Cartomancer**: Rarity?
- **Pareidolia**: How do stone cards interact with Pareidolia? (probably they're treated as stone cards and not face cards)
