export type BlindName = 'Small Blind' | 'Big Blind' | 'The Hook' | 'The Ox' | 'The House' | 'The Wall' | 'The Wheel' | 'The Arm' | 'The Club' | 'The Fish' | 'The Psychic' | 'The Goad' | 'The Water' | 'The Window' | 'The Manacle' | 'The Eye' | 'The Mouth' | 'The Plant' | 'The Serpent' | 'The Pillar' | 'The Needle' | 'The Head' | 'The Tooth' | 'The Flint' | 'The Mark' | 'Amber Acorn' | 'Unknown One' | 'Violet Vessel' | 'Unknown Two' | 'Cerulean Bell'

export type HandName = 'Flush Five' | 'Flush House' | 'Five of a Kind' | 'Straight Flush' | 'Four of a Kind' | 'Full House' | 'Flush' | 'Straight' | 'Three of a Kind' | 'Two Pair' | 'Pair' | 'High Card'

export type JokerName = 'Joker' | 'Greedy Joker' | 'Lusty Joker' | 'Wrathful Joker' | 'Gluttonous Joker' | 'Jolly Joker' | 'Zany Joker' | 'Mad Joker' | 'Crazy Joker' | 'Droll Joker' | 'Sly Joker' | 'Wily Joker' | 'Clever Joker' | 'Devious Joker' | 'Crafty Joker' | 'Half Joker' | 'Joker Stencil' | 'Four Fingers' | 'Mime' | 'Credit Card' | 'Ceremonial Dagger' | 'Banner' | 'Mystic Summit' | 'Marble Joker' | 'Loyalty Card' | '8 Ball' | 'Misprint' | 'Dusk' | 'Raised Fist' | 'Chaos the Clown' | 'Fibonacci' | 'Steel Joker' | 'Scary Face' | 'Abstract Joker' | 'Delayed Gratification' | 'Hack' | 'Pareidolia' | 'Gros Michel' | 'Even Steven' | 'Odd Todd' | 'Scholar' | 'Business Card' | 'Supernova' | 'Ride the Bus' | 'Space Joker' | 'Egg' | 'Burglar' | 'Blackboard' | 'Runner' | 'Ice Cream' | 'DNA' | 'Splash' | 'Blue Joker' | 'Sixth Sense' | 'Constellation' | 'Hiker' | 'Faceless Joker' | 'Green Joker' | 'Superposition' | 'To Do List' | 'Cavendish' | 'Card Sharp' | 'Red Card' | 'Madness' | 'Square Joker' | 'Séance' | 'Riff-Raff' | 'Vampire' | 'Shortcut' | 'Hologram' | 'Vagabond' | 'Baron' | 'Cloud 9' | 'Rocket' | 'Obelisk' | 'Midas Mask' | 'Luchador' | 'Photograph' | 'Gift Card' | 'Turtle Bean' | 'Erosion' | 'Reserved Parking' | 'Mail-in Rebate' | 'To the Moon' | 'Hallucination' | 'Fortune Teller' | 'Juggler' | 'Drunkard' | 'Stone Joker' | 'Golden Joker' | 'Lucky Cat' | 'Baseball Card' | 'Bull' | 'Diet Cola' | 'Trading Card' | 'Flash Card' | 'Popcorn' | 'Spare Trousers' | 'Ancient Joker' | 'Ramen' | 'Walkie Talkie' | 'Seltzer' | 'Castle' | 'Smiley Face' | 'Campfire' | 'Golden Ticket' | 'Mr. Bones' | 'Acrobat' | 'Sock and Buskin' | 'Swashbuckler' | 'Troubador' | 'Certificate' | 'Smeared Joker' | 'Throwback' | 'Hanging Chad' | 'Rough Gem' | 'Bloodstone' | 'Arrowhead' | 'Onyx Agate' | 'Glass Joker' | 'Showman' | 'Flowerpot' | 'Blueprint' | 'Wee Joker' | 'Merry Andy' | 'Oops! All 6s' | 'The Idol' | 'Seeing Double' | 'Matador' | 'Hit the Road' | 'The Duo' | 'The Trio' | 'The Family' | 'The Order' | 'The Tribe' | 'Stuntman' | 'Invisible Joker' | 'Brainstorm' | 'Satellite' | 'Shoot the Moon' | 'Driver\'s license' | 'Cartomancer' | 'Astronomer' | 'Burnt Joker' | 'Bootstraps' | 'Canio' | 'Triboulet' | 'Yorick' | 'Chicot' | 'Perkeo'

export type Rank = 'Ace' | 'King' | 'Queen' | 'Jack' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2'

export type Suit = 'Clubs' | 'Spades' | 'Hearts' | 'Diamonds'

export type Edition = 'base' | 'foil' | 'holographic' | 'polychrome'

export type JokerEdition = Edition | 'negative'

export type Seal = 'none' | 'gold' | 'red' | 'blue' | 'purple'

export type Enhancement = 'none' | 'bonus' | 'mult' | 'wild' | 'glass' | 'steel' | 'stone' | 'gold' | 'lucky'

export interface ScoreSet {
	chips: number
	multiplier: number
}

export interface ModifierDefaults {
	edition: Record<JokerEdition, Modifiers>
	enhancement: Record<Enhancement, Modifiers>
	seal: Record<Seal, Modifiers>
}

export interface Modifiers {
	plusChips?: number
	plusMult?: number
	timesMult?: number
}

export interface Blind {
	reward: number
	multFactor: number
}

export interface InitialCard {
	rank: Rank
	suit: Suit
	edition?: Edition
	seal?: Seal
	enhancement?: Enhancement
	isDebuffed?: boolean
}

export interface Card extends Required<InitialCard> {
	toString(): string
	index: number
}

export interface InitialJoker {
	name: JokerName
	edition?: JokerEdition
	plusChips?: number
	plusMult?: number
	timesMult?: number
	rank?: Rank
	suit?: Suit
	isActive?: boolean
}

export interface JokerEffectOptions {
	state: State
	value: number
}

export interface CardJokerEffectOptions extends JokerEffectOptions {
	card: Card
}

export type JokerEffect = (this: Joker, options: JokerEffectOptions) => number
export type CardJokerEffect = (this: Joker, options: CardJokerEffectOptions) => number

export interface JokerEffects {
	toString(): string
	rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
	probability?: Probability
	applyChips?: JokerEffect
	applyMultiplier?: JokerEffect
	applyCardChips?: CardJokerEffect
	applyCardMultiplier?: CardJokerEffect
	applyHeldCardChips?: CardJokerEffect
	applyHeldCardMultiplier?: CardJokerEffect
}

export interface Probability {
	numerator: number
	denominator: number
}

export interface Joker extends Required<JokerEffects> {
	index: number
	name: JokerName
	edition: JokerEdition
	plusChips: number
	plusMult: number
	timesMult: number
	rank?: Rank
	suit?: Suit
	isActive: boolean
}

export type HandLevel = { level: number, plays: number }
export type InitialHandLevels = Partial<HandLevels>
export type HandLevels = Record<HandName, HandLevel>
export type HandScoreSets = Record<HandName, ScoreSet>

export type InitialState = {
	hands?: number
	discards?: number
	money?: number
	handLevels?: InitialHandLevels
	blind?: BlindName
	jokers?: InitialJoker[]
	jokerSlots?: number
	playedCards?: InitialCard[]
	heldCards?: InitialCard[]
}

export interface State {
	hands: number
	discards: number
	money: number
	handLevels: HandLevels
	handScoreSets: HandScoreSets
	blind: BlindName
	jokers: Joker[]
	jokerSet: Set<JokerName>
	jokerSlots: number
	blueprintTarget: JokerName | undefined
	brainstormTarget: JokerName | undefined
	playedCards: Card[]
	heldCards: Card[]
	playedHand: HandName
	scoringCards: Card[]
}

export interface Score {
	hand: HandName
	scoringCards: Card[]
	score: number
	formattedScore: string
}
