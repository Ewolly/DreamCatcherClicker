gameData = {
    daysSlept: 0,
    goodDreams: 0,
    badDreams: 0
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
 
    },
    computed: {
        timeSlept: function () {
            years = Math.floor(this.daysSlept / 360);
            months = Math.floor((this.daysSlept % 360) / 30);
            days = this.daysSlept % 30;

            outputString = '';
            if (years > 0) {
                outputString += years;

                outputString += (years > 1 ? ' years' : ' year');
                outputString += ((months > 0 || days > 0) ? ', ' : '');
            }

            if (months > 0) {
                outputString += months;

                outputString += (months > 1 ? ' months' : ' month');
                outputString += (days > 0 ? ', ' : '');
            }

            if (days > 0) {
                outputString += days;

                outputString += (days > 1 ? ' days' : ' day');
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
            } else if (this.daysSlept >= 30) {
                return `<p>
                            Could I do something with my dreams?'<br />
                            It seems silly, absurd almost...<br />
                            But why else would dream catchers even exist?<br />
                            This has to be the use!
                        </p>`
            } else {
                return ''
            }
        }
    },

    methods: {
        sleep: function () {
            this.daysSlept++;

            if (this.daysSlept >= 30) {
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
                badDreams: 0
            });

            this.save();
        },
        save: function () {
            const parsed = JSON.stringify(gameData);
            localStorage.setItem('dcData', parsed);
        }
    }
})
