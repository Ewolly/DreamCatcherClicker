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
	}
}

// TODO(j): move this to its own file(?)
events = [
	{
		lines: [
			'As you lay down for your first nights sleep, you begin to think...',
			'What if you could use your time asleep productively?',
			'<q>Maybe tomorrow,</q> you think, as sleep over takes you.'
		],
		trigger: function () { return 10 },
		onDisp: function () {}
	},
	{
		lines: [
			'Could I do something with my dreams?',
			'It seems silly, absurd almost...',
			'But why else would dream catchers even exist?',
			'This has to be the use!'
		],
		trigger: function () { return 20 },
		onDisp: function () { upgrades.money.dc.available = true }
	},
	{
		lines: [
			'The dream catcher is allowing me to generate power',
			'By putting the power back into the grid, the power companys actually sending me money!!',
			'<strong>I NEED MORE!</strong>'
		],
		trigger: function () { return (upgrades.money.dc.acquired === null ? null : upgrades.money.dc.acquired + 10) },
		onDisp: function () { upgrades.goodDreams.elec.available = true }
	},
	{
		lines: false,
		trigger: function () { return (upgrades.money.dc.acquired === null ? null : upgrades.money.dc.acquired + 5) },
		onDisp: function () { upgrades.money.bed.available = true }
	}
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
				roll = Math.random()*this.muls.bed;
				if (roll < 0.1) {
					this.badDreams++;
					roll = Math.random()*this.muls.bed;
				} 

				if (roll < 0.8) {
					this.goodDreams++;
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
			
			upgrade.cost = Math.floor(upgrade.cost * 1.3);
			upgrade.level++;
		}
	}
})
