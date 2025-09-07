export type BlindName = 'Small Blind' | 'Big Blind' | 'The Hook' | 'The Ox' | 'The House' | 'The Wall' | 'The Wheel' | 'The Arm' | 'The Club' | 'The Fish' | 'The Psychic' | 'The Goad' | 'The Water' | 'The Window' | 'The Manacle' | 'The Eye' | 'The Mouth' | 'The Plant' | 'The Serpent' | 'The Pillar' | 'The Needle' | 'The Head' | 'The Tooth' | 'The Flint' | 'The Mark' | 'Amber Acorn' | 'Verdant Leaf' | 'Violet Vessel' | 'Crimson Heart' | 'Cerulean Bell'

export type DeckName = 'Red Deck' | 'Blue Deck' | 'Yellow Deck' | 'Green Deck' | 'Black Deck' | 'Magic Deck' | 'Nebula Deck' | 'Ghost Deck' | 'Abandoned Deck' | 'Checkered Deck' | 'Zodiac Deck' | 'Painted Deck' | 'Anaglyph Deck' | 'Plasma Deck' | 'Erratic Deck' | 'Challenge Deck'

export type HandName = 'Flush Five' | 'Flush House' | 'Five of a Kind' | 'Straight Flush' | 'Four of a Kind' | 'Full House' | 'Flush' | 'Straight' | 'Three of a Kind' | 'Two Pair' | 'Pair' | 'High Card'

export type JokerName = 'Joker' | 'Greedy Joker' | 'Lusty Joker' | 'Wrathful Joker' | 'Gluttonous Joker' | 'Jolly Joker' | 'Zany Joker' | 'Mad Joker' | 'Crazy Joker' | 'Droll Joker' | 'Sly Joker' | 'Wily Joker' | 'Clever Joker' | 'Devious Joker' | 'Crafty Joker' | 'Half Joker' | 'Joker Stencil' | 'Four Fingers' | 'Mime' | 'Credit Card' | 'Ceremonial Dagger' | 'Banner' | 'Mystic Summit' | 'Marble Joker' | 'Loyalty Card' | '8 Ball' | 'Misprint' | 'Dusk' | 'Raised Fist' | 'Chaos the Clown' | 'Fibonacci' | 'Steel Joker' | 'Scary Face' | 'Abstract Joker' | 'Delayed Gratification' | 'Hack' | 'Pareidolia' | 'Gros Michel' | 'Even Steven' | 'Odd Todd' | 'Scholar' | 'Business Card' | 'Supernova' | 'Ride the Bus' | 'Space Joker' | 'Egg' | 'Burglar' | 'Blackboard' | 'Runner' | 'Ice Cream' | 'DNA' | 'Splash' | 'Blue Joker' | 'Sixth Sense' | 'Constellation' | 'Hiker' | 'Faceless Joker' | 'Green Joker' | 'Superposition' | 'To Do List' | 'Cavendish' | 'Card Sharp' | 'Red Card' | 'Madness' | 'Square Joker' | 'Séance' | 'Riff-Raff' | 'Vampire' | 'Shortcut' | 'Hologram' | 'Vagabond' | 'Baron' | 'Cloud 9' | 'Rocket' | 'Obelisk' | 'Midas Mask' | 'Luchador' | 'Photograph' | 'Gift Card' | 'Turtle Bean' | 'Erosion' | 'Reserved Parking' | 'Mail-in Rebate' | 'To the Moon' | 'Hallucination' | 'Fortune Teller' | 'Juggler' | 'Drunkard' | 'Stone Joker' | 'Golden Joker' | 'Lucky Cat' | 'Baseball Card' | 'Bull' | 'Diet Cola' | 'Trading Card' | 'Flash Card' | 'Popcorn' | 'Spare Trousers' | 'Ancient Joker' | 'Ramen' | 'Walkie Talkie' | 'Seltzer' | 'Castle' | 'Smiley Face' | 'Campfire' | 'Golden Ticket' | 'Mr. Bones' | 'Acrobat' | 'Sock and Buskin' | 'Swashbuckler' | 'Troubador' | 'Certificate' | 'Smeared Joker' | 'Throwback' | 'Hanging Chad' | 'Rough Gem' | 'Bloodstone' | 'Arrowhead' | 'Onyx Agate' | 'Glass Joker' | 'Showman' | 'Flower Pot' | 'Blueprint' | 'Wee Joker' | 'Merry Andy' | 'Oops! All 6s' | 'The Idol' | 'Seeing Double' | 'Matador' | 'Hit the Road' | 'The Duo' | 'The Trio' | 'The Family' | 'The Order' | 'The Tribe' | 'Stuntman' | 'Invisible Joker' | 'Brainstorm' | 'Satellite' | 'Shoot the Moon' | 'Driver\'s license' | 'Cartomancer' | 'Astronomer' | 'Burnt Joker' | 'Bootstraps' | 'Canio' | 'Triboulet' | 'Yorick' | 'Chicot' | 'Perkeo'

export type Rank = 'Ace' | 'King' | 'Queen' | 'Jack' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2'

export type Suit = 'Clubs' | 'Spades' | 'Hearts' | 'Diamonds'

export type Edition = 'Base' | 'Foil' | 'Holographic' | 'Polychrome'

export type JokerEdition = Edition | 'Negative'

export type Seal = 'None' | 'Gold' | 'Red' | 'Blue' | 'Purple'

export type Enhancement = 'None' | 'Bonus' | 'Mult' | 'Wild' | 'Glass' | 'Steel' | 'Stone' | 'Gold' | 'Lucky'

export interface BaseScore {
	chips: number
	multiplier: number
}

export interface ScoreValue {
	chips?: ['+' | '*', number]
	multiplier?: ['+' | '*', number]
	phase: 'base' | 'played-cards' | 'held-cards' | 'jokers' | 'consumables' | 'balancing'
	card?: Card
	joker?: Joker
	type?: 'rank' | 'enhancement' | 'edition'
	trigger?: string
}

export interface InitialCard {
	index?: number
	rank: Rank
	suit: Suit
	edition?: Edition
	seal?: Seal
	enhancement?: Enhancement
	debuffed?: boolean
	played?: boolean
	count?: number
}

export interface Card extends Required<InitialCard> {
	toString(): string
	index: number
}

export interface EffectOptions {
	state: State
	scoringCards: Card[]
	playedHand: HandName
	score: ScoreValue[]
	luck: Luck
	trigger: string
}

export interface CardEffectOptions extends EffectOptions {
	card: Card
}

export interface IndirectEffectOptions extends EffectOptions {
	joker: Joker
}

export type JokerEffect = (this: Joker, options: EffectOptions) => void
export type JokerCardEffect = (this: Joker, options: CardEffectOptions) => void
export type JokerIndirectEffect = (this: Joker, options: IndirectEffectOptions) => void

export interface Probability {
	numerator: number
	denominator: number
}

export interface InitialJoker {
	index?: number
	name: JokerName
	edition?: JokerEdition
	plusChips?: number
	plusMultiplier?: number
	timesMultiplier?: number
	rank?: Rank
	suit?: Suit
	active?: boolean
	count?: number
}

export interface JokerDefinition {
	rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
	effect?: JokerEffect
	indirectEffect?: JokerIndirectEffect
	playedCardEffect?: JokerCardEffect
	heldCardEffect?: JokerCardEffect
	hasPlusChipsInput?: boolean
	hasPlusMultiplierInput?: boolean
	hasTimesMultiplierInput?: boolean
	hasIsActiveInput?: boolean
	hasRankInput?: boolean
	hasSuitInput?: boolean
}

export interface Joker {
	name: JokerName
	edition: JokerEdition
	plusChips: number
	plusMultiplier: number
	timesMultiplier: number
	rank?: Rank
	suit?: Suit
	active: boolean
	count: number
	rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
	effect?: JokerEffect
	indirectEffect?: JokerIndirectEffect
	playedCardEffect?: JokerCardEffect
	heldCardEffect?: JokerCardEffect
	index: number
	toString: () => string
}

export interface HandLevel { level: number, plays: number }
export type InitialObservatory = Partial<Observatory>
export type Observatory = Record<HandName, number>
export type InitialHandLevels = Partial<HandLevels>
export type HandLevels = Record<HandName, HandLevel>
export type HandScore = Record<HandName, BaseScore>

export interface Blind {
	name: BlindName
	active: boolean
}

export interface InitialState {
	hands?: number
	discards?: number
	money?: number
	blind?: Partial<Blind>
	deck?: DeckName
	handLevels?: InitialHandLevels
	observatory?: InitialObservatory
	jokers?: InitialJoker[]
	jokerSlots?: number
	cards?: InitialCard[]
}

export interface State {
	hands: number
	discards: number
	money: number
	blind: Blind
	deck: DeckName
	handLevels: HandLevels
	handBaseScores: HandScore
	observatory: Observatory
	jokers: Joker[]
	jokerSet: Set<JokerName>
	jokerSlots: number
	cards: Card[]
}

export type Luck = 'none' | 'average' | 'all'

export interface Result {
	score: string
	formattedScore: string
	luck: Luck
	log: string[]
}
