gameData = {
	daysSlept: 0,
	goodDreams: 0,
	badDreams: 0,
	clickTime: 5000,
	dcPurchased: 0,
	upgrades: {
		electricity: false,
		sleepSchedule: false
	}
};

var app = new Vue({ 
	el: '#app',
	data: gameData,
	mounted() {
		if (localStorage.getItem('dcData')) {
			try {
				parsed = JSON.parse(localStorage.getItem('dcData'));
				Object.assign(gameData, parsed);
			} catch (e) {
				localStorage.removeItem('dcData');
			}
		}

		this.$nextTick(function () {
			window.setInterval(() => {
				this.save();
			},1000);
		})

		if (this.upgrades.sleepSchedule) {
			this.upgrades.sleepSchedule = false;
			this.startAutoClicker();
		}

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
		storyText: function () {
			if (this.daysSlept >= 10 && this.daysSlept <= 20) {
				return `<p>
							As you lay down for your first nights sleep, you begin to think...<br />
							What if you could use your time asleep productively?<br />
							Maybe tomorrow you think, as sleep over takes you<br />
						</p>`
			} else if (this.daysSlept >= 30 && this.dcPurchased == 0) {
				return `<p>
							Could I do something with my dreams?<br />
							It seems silly, absurd almost...<br />
							But why else would dream catchers even exist?<br />
							This has to be the use!
						</p>`
			} else if (this.dcPurchased && this.daysSlept >= (this.dcPurchased + 10) && !this.upgrades.electricity) {
				return `<p>
							The dream catcher is allowing me to generate power<br />
							Buy putting the power back into the grid, the power companys actually sending me money!!<br />
							I NEED MORE<br />
						</p>`
			} else {
				return ''
			}
		}
	},

	methods: {
		sleep: function () {
			this.daysSlept++;

			if (dcPurchased) {
				if (this.daysSlept >= 30) {
					roll = Math.random();
					if (roll < 0.05) {
						this.badDreams++;
					} else if (roll < 0.4) {
						this.goodDreams++;
					}
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
