var app = new Vue({ 
    el: '#app',
    data: {
        Title: 'Welcome to the DreamCatcher!', 
        Description: 'In DreamCatcher, your goal is to generate power through your dreams and revolutionise the world!',
        Story1: 'Click the Button!',
        Story2: '',
        Story3: '',
        Story4: ''
    }
});

var app5 = new Vue({
  el: '#app-5',
  data: {
    count: 0
  },
  methods: {
    addDream: function () {
        this.count = this.count + 1
        if (this.count == 1){
            app.Story1 = 'As you lay down for your first nights sleep, you begin to think...'
            app.Story2 = 'What if you could use your time asleep productively'
            app.Story3 = 'Maybe tomorrow you think, as sleep over takes you'
        }
        if (this.count == 2){
            app.Story1 = 'A dream catcher perhaps?'
            app.Story2 = 'It seems silly, absurd almost...'
            app.Story3 = 'But why else would dream catchers even exist?'
            app.Stroy4 = 'This has to be the use!'
        }
    }
  }
})
