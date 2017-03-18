var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// Setup Firebase
var config = {
  apiKey: "AIzaSyBRgfRKOxusYprHlxPlBdibjPvAt4wLByo",
  authDomain: "vic86app-c0960.firebaseapp.com",
  databaseURL: "https://vic86app-c0960.firebaseio.com",
  storageBucket: "vic86app-c0960.appspot.com",
  messagingSenderId: "53172507252"
};
firebase.initializeApp(config)

var usersRef = firebase.database().ref('users');
var awardsRef = firebase.database().ref('choujiang');
var gapRef = firebase.database().ref('ChoujiangGap');
var cjSettingRef = firebase.database().ref('cjSetting');
var bannersRef = firebase.database().ref('banner');
var normalRef = firebase.database().ref('websites/normal');
var vipRef = firebase.database().ref('websites/vip');
var newsRef = firebase.database().ref('notice/news');
var eventRef = firebase.database().ref('notice/events');
var kefuRef = firebase.database().ref('kefu');


// create Vue app
var app = new Vue({
  // element to mount to
  el: '#app',
  // initial data
  data: {
    currentPage: "Login",
    user: null,
    newUser: {
      name: '',
      email: '',
      password: ''
    },
    item: null,
    detail: null,
    userSearch: '',
    awardSearch: ''
  },
  // firebase binding
  // https://github.com/vuejs/vuefire
  firebase: {
    rootR: firebase.database().ref(),
    users: usersRef,
    awards: awardsRef,
    cjGap: gapRef,
    cjSetting: cjSettingRef,
    banners: bannersRef,
    normal: normalRef,
    vip: vipRef,
    news: newsRef,
    events: eventRef,
    kefu: kefuRef
  },
  // computed property for form validation state
  computed: {
    validation: function() {
      return {
        name: !!this.newUser.name.trim(),
        email: emailRE.test(this.newUser.email)
      }
    },
    isValid: function() {
      var validation = this.validation
      return Object.keys(validation).every(function(key) {
        return validation[key]
      })
    },
    visibleAwards: function() {
      if (this.awardSearch === '') {
        return this.awards;
      }
      let list = [];
      for (let i = 0; i < this.awards.length; i++) {
        let item = this.awards[i];
        if (item.username.indexOf(this.awardSearch) !== -1) {
          list.push(item);
        }
      }
      return list;
    },
    isLogin: function() {
      return this.user !== null;
    },
    getUsers: function() {
      if (this.userSearch === '') {
        return this.users;
      }
      let list = [];
      for (let i = 0; i < this.users.length; i++) {
        let item = this.users[i];
        if (item.username.indexOf(this.userSearch) !== -1) {
          list.push(item);
        }
      }
      return list;
    },
  },
  mounted: function() {
    firebase.auth().onAuthStateChanged(this.onUserLogin);
  },
  // methods
  methods: {
    onUserLogin: function(user) {
      this.user = user;
      this.currentPage = "Home";
    },
    login: function() {
      firebase.auth().signInWithEmailAndPassword(this.newUser.email, this.newUser.password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('-------Login--------');
        console.log(errorCode);
        console.log(errorMessage);
        // ...
      });
    },
    getUserAwards: function(cj) {
      let keys = Object.keys(cj);
      let list = [];
      for (let i = 0; i < keys.length; i++) {
        let item = cj[keys[i]];
        if (item.prize !== '未中奖') {
          list.push(item);
        }
      }
      return list;
    },
    getDate: function(date) {
      return new Date(date);
    },
    goToUserDetail: function(user) {
      this.detail = user;
      this.currentPage = "UserDetail";
    },
    goToUserAwards: function(user) {
      this.detail = user;
      this.currentPage = "UserAwards";
    },
    goToUserList: function() {
      this.currentPage = "Home";
    },
    goToProcessAward: function() {
      this.currentPage = "ProcessAward";
    },
    deleteAward: function(key) {
      awardsRef.child(key).child('hidden').set(true);
    },
    processAward: function(key) {
      awardsRef.child(key).child('processed').set(true);
    },
    goToPage: function(name) {
      this.currentPage = name;
    },
    resetCjGap: function() {
      
    },
    updateCjChance: function(index) {
      let ele = document.getElementsByName('cjChance'+index)[0];
      if (ele) {
        let newValue = ele.value
        console.log(newValue);
        if (newValue) {
          cjSettingRef.child(index).child('chance').set(newValue);
        }
      }
    },
    updateCjAward: function(index) {
      let ele = document.getElementsByName('cjAward'+index)[0];
      if (ele) {
        let newValue = ele.value
        console.log(newValue);
        if (newValue) {
          cjSettingRef.child(index).child('award').set(newValue);
        }
      }
    },
    updateGap: function() {
      let ele = document.getElementsByName('cjGap')[0];
      console.log(ele);
      if (ele) {
      let newValue = ele.value
      console.log(newValue);
      if (newValue) {
        firebase.database().ref().child('ChoujiangGap').set(newValue);
      }
      }
    },
    updateBanner: function(index) {
      let ele = document.getElementsByName('banner'+index)[0];
      console.log(ele);
      if (ele) {
        let newValue = ele.value
        console.log(newValue);
        if (newValue) {
          bannersRef.child(index).child('url').set(newValue);
        }
      }
    },
    updateNormal: function(index) {
      let ele = document.getElementsByName('normal'+index)[0];
      console.log(ele);
      if (ele) {
      let newValue = ele.value
      console.log(newValue);
      if (newValue) {
        normalRef.child(index).set(newValue);
      }
      }
    },
    updateVip: function(index) {
      let ele = document.getElementsByName('vip'+index)[0];
      console.log(ele);
      if (ele) {
      let newValue = ele.value
      console.log(newValue);
      if (newValue) {
        vipRef.child(index).set(newValue);
      }
      }
    },
    newNormal: function() {
      let ele = document.getElementsByName('normalNew')[0];
      console.log(ele);
      if (ele) {
        let newValue = ele.value
        console.log(newValue);
        if (newValue) {
          normalRef.child(this.normal.length).set(newValue);
        }
      }
    },
    newVip: function() {
      let ele = document.getElementsByName('vipNew')[0];
      console.log(ele);
      if (ele) {
        let newValue = ele.value
        console.log(newValue);
        if (newValue) {
          normalRef.child(this.normal.length).set(newValue);
        }
      }
    },
    deleteNormal: function(index) {
      normalRef.child(index).remove();
    },
    deleteVip: function(index) {
      vipRef.child(index).remove();
    },
    newNews: function() {
      let ele = document.getElementsByName('newsNew')[0];
      console.log(ele);
      if (ele) {
        let newValue = ele.value
        console.log(newValue);
        if (newValue) {
          newsRef.child(this.news.length).child('content').set(newValue);
        }
      }
    },
    updateNews: function(index) {
      let ele = document.getElementsByName('news'+index)[0];
      console.log(ele);
      if (ele) {
      let newValue = ele.value
      console.log(newValue);
      if (newValue) {
        newsRef.child(index).child('content').set(newValue);
      }
      }
    },
    deleteNews: function(index) {
      newsRef.child(index).remove();
    },
    newEvent: function() {
      let ele1 = document.getElementsByName('eventURL')[0];
      let ele2 = document.getElementsByName('eventTitle')[0];
      let ele3 = document.getElementsByName('eventContent')[0];
      if (ele1 && ele2 && ele3) {
        eventRef.child(this.news.length).child('url').set(ele1.value);
        eventRef.child(this.news.length).child('title').set(ele2.value);
        eventRef.child(this.news.length).child('content').set(ele3.value);
      }
    },
    updateEvent: function(index) {
      let ele1 = document.getElementsByName('eventURL')[0];
      let ele2 = document.getElementsByName('eventTitle')[0];
      let ele3 = document.getElementsByName('eventContent')[0];
      if (ele1 && ele2 && ele3) {
        eventRef.child(index).child('url').set(ele1.value);
        eventRef.child(index).child('title').set(ele2.value);
        eventRef.child(index).child('content').set(ele3.value);
      }
    },
    deleteEvent: function(index) {
      eventRef.child(index).remove();
    },
    updateKefu: function() {
      let ele = document.getElementsByName('kefu')[0];
      if (ele) {
        let newValue = ele.value;
        if (newValue) {
          firebase.database().ref().child('kefu').set(newValue);
        }
      }
    },
  }
})
