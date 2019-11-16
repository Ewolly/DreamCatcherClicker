// TODO(j): move this to its own file(?)
upgrades = {
	money: {
		dc: {
			name: 'Dream Catcher',
			description: 'A useless toy from the gypsy fair. Unless...',
			cost: 20, 
			available: false,
			isActive: true,
			acquired: null,
			onPickup: function() {},
			runOnLoad: false
		},
		bed: {
			name: 'New Bed',
			description: 'The Deluxe Queen Supreme. A good night\'s sleep guaranteed, or your money back!',
			cost: 400,
			available: false,
			acquired: null,
			onPickup: function() { gameData.muls.bed = 1 },
			runOnLoad: false
		}
	},
	goodDreams: {
		elec: {
			name: 'Generate Electricity?',
			description: 'Surely there\'s <i>someway</i> to use this power...',
			cost: 20, 
			available: false,
			acquired: null,
			onPickup: function () {
				gameData
			},
			runOnLoad: false
		},
		sleepSchedule: {
			name: 'Sleeping Schedule',
			description: '<q>Laziness casts into a deep sleep, And an idle man will suffer hunger.</q><br />Proverbs 19:15',
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
story = [
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
	story: story,
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
		sleep: function () {
			this.daysSlept++;				
			for (msg of this.story) {
				if (msg.trigger() == this.daysSlept) {
					msg.onDisp();
					this.messages.unshift(msg.lines);
				}
			}

			if (this.upgrades.money.dc.acquired) {
				roll = Math.random();
				if (roll < 0.05) {
					this.badDreams++;
				} else if (roll < 0.4) {
					this.goodDreams++;
				}
			}

			if(this.upgrades.goodDreams.elec.acquired){
				this.electricity();
			}
		},
		gameLoop: function () {
			window.setInterval(() => {
				this.tickCount+=this.tickRate;
				if (this.tickCount > this.sleepRate){
					for (let ii = 0; ii < Math.floor(this.tickCount / this.sleepRate); ii++) {
                        this.sleep();
                    }
					this.tickCount = this.tickCount % this.sleepRate;
				}
			},this.tickRate);
		},
		electricity: function() {
			if (this.goodDreams >= this.freq.elec) {
				this.money += this.muls.elec * this.freq.elec;
				this.goodDreams -= this.freq.elec;
			}
		}
	}
})
