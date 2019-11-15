// TODO(j): move this to its own file(?)
upgrades = {
	money: {
		dc: {
			name: 'Dream Catcher',
			description: 'A useless toy from the gypsy fair. Unless...',
			cost: 20, 
			available: false,
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
				// TODO(j): move this to the game loop
				this.$nextTick(function () {
					window.setInterval(() => {
						if (gameData.goodDreams) {
							gameData.elec += gameData.muls.elec;
							gameData.goodDreams--;
						}
					}, gameData.periods.elec);
				})
			},
			runOnLoad: false
		},
		sleepSchedule: {
			name: 'Sleeping Schedule',
			description: '<q>Laziness casts into a deep sleep, And an idle man will suffer hunger.</q><br />Proverbs 19:15',
			cost: 50,
			available: false,
			acquired: null,
			onPickup: function() {
				// TODO(j): move this to the game loop
				this.$nextTick(function () {
					window.setInterval(() => {
						this.sleep();
					}, gameData.periods.sleep);
				})
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
	daysSlept: 0,
	goodDreams: 0,
	badDreams: 0,
	clickTime: 5000,
	dcPurchased: 0,
	upgrades: upgrades,
	story: story,
	messages: [],
	muls: {
		bed: 0.5,
		elec: 1
	},
	periods: {
		elec: 2000,
		sleep: 1000,
	}
};

var app = new Vue({ 
	el: '#app',
	data: gameData,
	mounted() {
		// if (localStorage.getItem('dcData')) {
		// 	try {
		// 		parsed = JSON.parse(localStorage.getItem('dcData'));
		// 		Object.assign(gameData, parsed);
		// 	} catch (e) {
		// 		localStorage.removeItem('dcData');
		// 	}
		// }

		// this.$nextTick(function () {
		// 	window.setInterval(() => {
		// 		this.save();
		// 	},1000);
		// })

		// if (this.upgrades.sleepSchedule) {
		// 	this.upgrades.sleepSchedule = false;
		// 	this.startAutoClicker();
		// }
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
				console.log(msg);
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
		},
		devReset: function () {
			Object.assign(gameData, {
				daysSlept: 0,
				goodDreams: 0,
				badDreams: 0,
				clickTime: 5000,
				dcPurchased: 0,
				upgrades: {
					electricity: false,
					sleepSchedule: false
				}
			});

			this.save();
		},
		save: function () {
			const parsed = JSON.stringify(gameData);
			localStorage.setItem('dcData', parsed);
		},
		startElectricity: function () {
			this.upgrades.electricity = true;
		},
		startAutoClicker: function () {
			if (!this.upgrades.sleepSchedule){
				this.$nextTick(function () {
					window.setInterval(() => {
						this.sleep();
					},this.clickTime);
				})
			}
			this.upgrades.sleepSchedule = true;
		}
	}
})
