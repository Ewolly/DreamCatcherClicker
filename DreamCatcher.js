// TODO(j): move this to its own file(?)
upgrades = {
	money: {
		dc: {
			name: 'Dream Catcher',
			description: 'A useless toy from the gypsy fair. Unless...',
			level: 0,
			maxLevel: 9999,
			cost: 20, 
			available: false,
			acquired: null,
			onPickup: function() { this.description = 'Two is better than one, right?'; },
		},
		bed: {
			name: 'New Bed',
			description: 'The Deluxe Queen Supreme. A good night\'s sleep guaranteed, or your money back!',
			level: 0,
			maxLevel: 4,
			cost: 400,
			available: false,
			acquired: null,
			onPickup: function() { 
				gameData.muls.bed *= 1.2;
			},
		},
		generator: {
			name: 'Power Generator',
			description: '<strong>MAXIMUM POWER!</strong>',
			level: 1,
			maxLevel: 9999,
			cost: 40,
			available: false,
			acquired: null,
			onPickup: function() { }

		}
	},
	goodDreams: {
		elec: {
			name: 'Generate Electricity?',
			description: 'Surely there\'s <i>someway</i> to use this power...',
			level: 0,
			maxLevel: 1,
			cost: 20, 
			available: false,
			acquired: null,
			onPickup: function () { 
				upgrades.money.generator.available = true;
				upgrades.goodDreams.improveElec.available = true;
			},
		},
		improveElec: {
			name: 'Improve Generator',
			description: 'A resistor here, a capacitor there...',
			level: 1,
			maxLevel: 9999,
			cost: 100,
			available: false,
			acquired: null,
			onPickup: function () { gameData.muls.elec *= 1.2; }
		},
		sleepSchedule: {
			name: 'Sleeping Schedule',
			description: '<q>Laziness casts into a deep sleep, And an idle man will suffer hunger.</q><br />Proverbs 19:15',
			level: 0,
			maxLevel: 9999,
			cost: 5,
			available: true,
			acquired: null,
			onPickup: function() {
				if(!this.acquired){
					app.gameLoop()
				} else {
					gameData.sleepRate *=.95;
				}
			}
		}
	},
	badDreams: {
		goodCap: {
			name: 'Increase Good Dream Capacity',
			description: 'Hmm, maybe if this middle string were slightly to the left...',
			level: 1,
			maxLevel: 9999,
			cost: 2,
			available: false,
			acquired: null,
			onPickup: function() { },
		},
		badCap: {
			name: 'Increase Bad Dream Capacity',
			description: 'No no, this is all <strong>wrong</strong>! It should be here!',
			level: 1,
			maxLevel: 9999,
			cost: 4,
			available: false,
			acquired: null,
			onPickup: function() { },
		},
	}
}

// TODO(j): move this to its own file(?)
events = [
	{
		lines: [
			'As you lay down for yet another nights\' sleep, you\'re struck with a thought.',
			'<q>I spend so much of my life asleep. There must be a better use for it.</q>',
			'<q>Maybe tomorrow,</q> you think, as sleep overtakes you.'
		],
		trigger: function () { return 10 },
		onDisp: function () {}
	},
	{
		lines: [
			'You awaken with a start in the middle of the night, sweating profusely.',
			'<q>That was terrible... It felt so real!</q> You think to yourself, a spark forming in your mind as you settle back down to rest.',
		],
		trigger: function () { return 12 },
		onDisp: function () {}
	},
	{
		lines: [
			'<q>Could I do something with my dreams?</q>',
			'It seems silly, absurd almost - but dreams can be so powerful, there must be more to them!',
			'Maybe a dream catcher could shed some light on the issue?',
			'<q>This has to be the use!</q> You exclaim, deciding to get one to experiment with.'
		],
		trigger: function () { return 15 },
		onDisp: function () { upgrades.money.dc.available = true }
	},
	{
		lines: [
			'After waking up from a particularly pleasant dream, you notice a slight glow from the lamp beside your dream catcher.',
			'It vanishes almost as soon as you wake up, but you <strong>know</strong> you saw it.',
			'You decide to investigate as soon as you get the chance.'
		],
		trigger: function () { return (upgrades.money.dc.acquired === null ? null : upgrades.money.dc.acquired + 5) },
		onDisp: function () { upgrades.goodDreams.elec.available = true }
	},
	{
		lines: [
			'<q>My tinkering has paid off!</q> You proclaim proudly, checking your bank account.',
			'<pre>Power r us: <span style="color: green">+$10</span></pre>',
			'You are able to use the good dreams captured to generate electricity.',
			'By putting the power back into the grid, the power company is actually sending you money!',
		],
		trigger: function () { return (upgrades.goodDreams.elec.acquired ? upgrades.goodDreams.elec.acquired+1 : null) },
		onDisp: function () { 
			app.money += 10;
		}
	},
	{
		lines: false,
		trigger: function () { return (upgrades.money.dc.acquired === null ? null : upgrades.money.dc.acquired + 5) },
		onDisp: function () { upgrades.money.bed.available = true }
	},
	{
		lines: [
			'You\'re starting to get a feel for the dream catcher at this point, and you notice each one can only hold a certain amount of dreams.',
			'You try tweaking a string, when a strong feeling of <span style="font-size: 125%"><strong>IMPENDING DOOM</strong></span> rolls over you.',
			'You curse in shock <q>!$@!@, is this a <span style="color: red">bad dream?</span></q> ...before reaching back in again to do the same thing.',
			'<q>I can use this...</q> You say to yourself, sinisterly',
		],
		trigger: function () {
			if (!this.triggered && upgrades.money.dc.level && (gameData.goodDreams >= (app.goodDreamCap - 5*upgrades.money.dc.level))) {
				this.triggered = gameData.daysSlept;
			}
			return this.triggered;
		},
		triggered: null,
		onDisp: function () { 
			badDreams = 1
			upgrades.badDreams.goodCap.available = true;
		}
	},
	{
		lines: false,
		trigger: function () {
			if (!this.triggered && upgrades.money.dc.level && (gameData.badDreams >= (app.badDreamCap - upgrades.money.dc.level))) {
				this.triggered = gameData.daysSlept;
			}
			return this.triggered;
		},
		triggered: null,
		onDisp: function () { 
			upgrades.badDreams.badCap.available = true;
		}
	},
]

gameData = {
	tickCount: 0,
	sleepRate: 1000,
	tickRate: 4,
	daysSlept: 0,
	money: 40,
	goodDreams: 0,
	badDreams: 0,
	elec: 0,
	upgrades: upgrades,
	events: events,
	messages: [],
	muls: {
		bed: 0.5,
		elec: 1
	},
	freq: {
		elec: 1
	}
};

var app = new Vue({ 
	el: '#app',
	data: gameData,
	mounted() {
	},
	computed: {
		timeSlept: function () {
			years = Math.floor(this.daysSlept / 360);
			months = Math.floor((this.daysSlept % 360) / 30);
			days = this.daysSlept % 30;

			outputString = '';
			if (years > 0) {
				outputString += years +
					(years > 1 ? ' years' : ' year') +
					((months > 0 || days > 0) ? ', ' : '');
			}

			if (months > 0) {
				outputString += months + 
					(months > 1 ? ' months' : ' month') +
					(days > 0 ? ', ' : '');
			}

			if (days > 0) {
				outputString += days + (days > 1 ? ' days' : ' day');
			}

			return outputString;
		},
		goodDreamCap: function() {
			return (this.upgrades.money.dc.level * this.upgrades.badDreams.goodCap.level * 25);
		},
		badDreamCap: function() {
			return (this.upgrades.money.dc.level * this.upgrades.badDreams.badCap.level * 5);
		}
	},
	methods: {
		sleep: function (sleepCount) {
			if (sleepCount === 0) {
				return false;
			}

			this.daysSlept += sleepCount;

			for (msg of this.events) {
				if ((msg.trigger() <= this.daysSlept) && (msg.trigger() > this.daysSlept - sleepCount)) {
					msg.onDisp();
					if (msg.lines) {
						this.messages.unshift(msg.lines);
					}
				}
			}

			for (let ii = 0; ii < (sleepCount * this.upgrades.money.dc.level); ii++) {
				roll = Math.random()/this.muls.bed;
				if (this.upgrades.badDreams.goodCap.available && roll < 0.05) {
					this.badDreams++;
				} 
				else if (this.upgrades.goodDreams.elec.available && roll < 0.8) {
					this.goodDreams++
				}
			}

			for (let ii = 0; ii < sleepCount; ii++) {
				if(this.upgrades.goodDreams.elec.acquired){
					this.electricity();
				}
			}

			return true;
		},
		gameLoop: function () {
			window.setInterval(() => {
				this.tickCount += this.tickRate;
                if (this.sleep(Math.floor(this.tickCount / this.sleepRate))) {
					this.tickCount = this.tickCount % this.sleepRate;
                }
			}, this.tickRate);
		},
		electricity: function() {
			if (this.goodDreams >= this.upgrades.money.generator.level) {
				this.money += this.muls.elec * this.upgrades.money.generator.level;
				this.goodDreams -= this.upgrades.money.generator.level;
			}
		},
		buyUpgrade: function(upgrade, currency) {
			if (this[currency] < upgrade.cost) {
				return;
			}
			upgrade.onPickup(); 
			if (!upgrade.acquired) {
				upgrade.acquired = this.daysSlept;
			}
			
			this[currency] -= upgrade.cost;
			
			upgrade.cost = Math.ceil(upgrade.cost * 1.3);
			upgrade.level++;
		}
	}
})
