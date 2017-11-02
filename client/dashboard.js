Template.editCarousel.helpers({
  getPhoto: function() {
    return addIndex(Meteor.user().profile.image);
  }
});

oldValue = "";
oldIndex = 0;
Template.editCarousel.events({
  'click .capture': function() {
    curIndex = this.index -1;
    MeteorCamera.getPicture({}, function(error, data) {

      if (data != null) {
        if (Meteor.user().profile.hasOwnProperty('image')) {
          Meteor.call('addSelfieCarousel', curIndex, data)
        }
      }
    });
  },
  'click label.custom-file-upload': function() {
    oldValue = this.value;
    oldIndex = this.index;
  },
  'change #uploadPhoto': function(event, t) {
    var slideNumber = $('#carousel').slick('slickCurrentSlide');
    FS.Utility.eachFile(event, function(file) {
      Images.insert(file, function(err, fileObj) {
        if (err) {
        } else {
          var newValue = $(event.target).val();
          // var oldValue = $(t.target).val();
          newValue = newValue.replace("C:\\fakepath\\", "/img/");
          // var arrayIndex = Meteor.user().profile.image.indexOf(oldValue);
          var arrayIndex = oldIndex - 1;
          // setTimeout(function() {
          //   Meteor.call('upsertPhoto', fileObj, arrayIndex);
          // }, 2000);
          Meteor.call('upsertPhoto', fileObj, arrayIndex);
        }
      });
    });
    setTimeout(function() {
      window.location.reload();
    }, 0);
  },
  'click #removeCarousel': function() {
    if (Meteor.user().profile.hasOwnProperty('image')) {
      Meteor.call('deleteSpecificCarousel', this.index - 1, function(error, result) {
        if (error) {} else {}
      });
    }
  }
});

Template.carousel.helpers({
  photos: function() {
    var arrayOfPhoto = userPhotos();
    var longChunkOfString = "";
    if (arrayOfPhoto === undefined) {
      arrayOfPhoto = [];
      for (var i = 0; i < currentWeek() - 1; i++) {
        arrayOfPhoto.push("/img/stockpregnant.jpg");
      }
    }
    for (i = 0; i < arrayOfPhoto.length; i++) {
      if (arrayOfPhoto[i] === undefined) {
        arrayOfPhoto[i] = "/img/stockpregnant.jpg";
      } else
        longChunkOfString += "<div>" + "<img height=\"300\" src=\"" + arrayOfPhoto[i] + "\">" + "</div>" + "\n";
    }
    return longChunkOfString;
  }
});

Template.carousel.events({
  'click .slick-arrow': function() {
    weekToUpload.set($('#carousel').slick('slickCurrentSlide') + 1);
  },
});

Template.carousel.onRendered(function() {
  var arrayOfPhoto = userPhotos();
  //var longChunkOfString = "";
  //if (arrayOfPhoto === undefined){
  //  arrayOfPhoto = [];
  //  for(var i = 0; i < currentWeek() - 1; i++){
  //    arrayOfPhoto.push("/img/stockpregnant.jpg");
  //  }
  //  Meteor.call('massRelay',arrayOfPhoto);
  //}
  //for (i = 0; i < arrayOfPhoto.length; i++) {
  //  longChunkOfString += "<div>" + "<img height=\"300\" src=\"" + arrayOfPhoto[i] + "\">" + "</div>" + "\n";
  //}
  var number = userPhotos().length - 1;
  this.$('#carousel').slick({
    //options
    infinite: false,
    arrows: true,
    accessibility: false
  });
  this.$('#carousel').slick('slickGoTo', number);
  weekToUpload.set($('#carousel').slick('slickCurrentSlide') + 1)
});

// Baby Dashboard
// -----------------------------
ExerciseClock = new ReactiveClock("ExerciseClock");
var elapsedSeconds = 0;
var localTime;
var startTime;
counter = 0;
frequency = "";


Template.babydash.events({
  'click .btn.btn-circleContraction': function() {
    // ExerciseClock = new ReactiveClock("ExerciseClock");
    ExerciseClock.setElapsedSeconds(0);
    ExerciseClock.start();
    elapsedSeconds = ExerciseClock.elapsedTime({
      format: '00:00:00'
    });

    localTime = new Date();
    var h = localTime.getHours();
    var m = localTime.getMinutes();
    var s = localTime.getSeconds();
    if (h < 10) {
      h = "0" + h;
    }
    if (m < 10) {
      m = "0" + m;
    }
    if (s < 10) {
      s = "0" + s;
    }
    startTime = h + " : " + m + " : " + s;
    $(".btn.btn-circleContraction").hide();
    $(".btn.btn-circleContractionStop").show();
    $("input.kick").show();
    $("p.showTimerKicks").show();
  },
  'click .btn.btn-circleKick': function() {
    // ExerciseClock = new ReactiveClock("ExerciseClock");
    ExerciseClock.setElapsedSeconds(0);
    ExerciseClock.start();
    elapsedSeconds = ExerciseClock.elapsedTime({
      format: '00:00:00'
    });

    localTime = new Date();
    var h = localTime.getHours();
    var m = localTime.getMinutes();
    var s = localTime.getSeconds();
    if (h < 10) {
      h = "0" + h;
    }
    if (m < 10) {
      m = "0" + m;
    }
    if (s < 10) {
      s = "0" + s;
    }
    startTime = h + " : " + m + " : " + s;
    $(".btn.btn-circleKick").hide();
    $(".btn.btn-circleKickStop").show();
    $("input.kick2").show();
    $("p.showTimerKicks2").show();
  },
  'click .btn.btn-circleContractionStop': function() {
    ExerciseClock.stop();
    elapsedSeconds = ExerciseClock.elapsedTime();
    elapsedSeconds = ExerciseClock.elapsedTime({
      format: '00:00:00'
    });

    localTime = new Date();
    var h = localTime.getHours();
    var m = localTime.getMinutes();
    var s = localTime.getSeconds();
    if (h < 10) {
      h = "0" + h;
    }
    if (m < 10) {
      m = "0" + m;
    }
    if (s < 10) {
      s = "0" + s;
    }
    endTime = h + " : " + m + " : " + s;
    try {
      frequency = contractionLatestFrequency(startTime);
    } catch (e) {
      frequency = "---";
    }
    startDate = new Date();
    Meteor.call('setContractionTracker', startDate, startTime, endTime, elapsedSeconds, frequency, function(error, result) {
      if (error) {
        Meteor.call('contractionError', startDate, startTime, endTime, elapsedSeconds, frequency, function(error, result) {
          if (error) {
          }
        });
      }
    });
    counter = 0;
    Session.set('counter', 0);
    $(".btn.btn-circleContractionStop").hide();
    $(".btn.btn-circleContraction").show();
    $("input.kick").hide();
    $("p.showTimerKicks").hide();
  },
  'click .btn.btn-circleKickStop': function() {
    ExerciseClock.stop();
    elapsedSeconds = ExerciseClock.elapsedTime();
    elapsedSeconds = ExerciseClock.elapsedTime({
      format: '00:00:00'
    });
    var kickCounter = counter;
    startDate = new Date();
    Meteor.call('setKickTracker', startDate, startTime, elapsedSeconds, counter, function(error, result) {
      if (error) {
        Meteor.call('kickError', startDate, startTime, elapsedSeconds, kickCounter, function(error, result) {
          if (error) {
          }
        });
      }
    });

    counter = 0;
    Session.set('counter', 0);
    $(".btn.btn-circleKick").show();
    $(".btn.btn-circleKickStop").hide();
    $("input.kick2").hide();
    $("p.showTimerKicks2").hide();
  },
  'click input.kick': function() {
    Session.set('counter', counter + 1);
    counter = counter + 1;
  },
  'click input.kick2': function() {
    Session.set('counter', counter + 1);
    counter = counter + 1;
  },
  'click .btn.btn-primary': function() {
    Meteor.call('setGender', 'male', function(error, result) {
      if (error) {
      }
    });
    if (Meteor.user()) {
      var babyGender = Meteor.user().profile.babyGender[0];
    }
    if (Session.get('gender') == null) {
      Session.set('gender', 'male');
    }
    $(".btn.btn-primary").hide();
    $(".btn.btn-danger").hide();
  },
  'click .btn.btn-danger': function() {
    Meteor.call('setGender', 'female', function(error, result) {
      if (error) {
      }
    });

    if (Meteor.user()) {
      var babyGender = Meteor.user().profile.babyGender[0];
    }
    $(".btn.btn-primary").hide();
    $(".btn.btn-danger").hide();
  },
  'click input.contractionTrash': function() {
    if (Meteor.user().profile.hasOwnProperty('contractions')) {
      Meteor.call('deleteSpecificContraction', this.startDate, function(error, result) {
        if (error) {} else {}
      });
    }
  },
  'click input.kickTrash': function() {
    if (Meteor.user().profile.hasOwnProperty('kicks')) {
      Meteor.call('deleteSpecificKick', this.startDate, function(error, result) {
        if (error) {} else {}
      });
    }
  },
  'click button.btn#changeGender': function() {
    Meteor.call('setGender', null, function(error, result) {
      if (error) {
        console.log(error);
      }
    });
  }
});

var status = null;
var isBoy = null;
var isGirl = null;
Template.babydash.helpers({
  weight: function() {
    var week = currentWeek();
    var weeklytip = weightTable.find({
      week: week
    }).fetch();
    if (weeklytip) {
      return weeklytip[0].weight;
    }
  },
  headSize: function() {
    var week = currentWeek();
    var weeklytip = Weekly.find({
      week: week
    }).fetch();
    if (weeklytip) {
      return weeklytip[0].headSize;
    }
  },
  example: function() {
    return Posts.findOne();
  },
  currentUser: function() {
    return Meteor.user();
  },
  testEfficientKick: function() {
    if (Meteor.user().profile.hasOwnProperty('kicks')) {
      var timeArray = Meteor.user().profile.kicks.reverse();
    } else {
      timeArray = [];
    }
    var toAdd = {
      startDate: new Date(),
      startTime: '00 : 00 : 00',
      totalDuration: '0:00:00',
      noOfKicks: '0'
    };
    for (i = timeArray.length; i < 4; i++) {
      timeArray.push(toAdd);
    }
    return timeArray;
  },
  testEfficientContraction: function() {
    if (Meteor.user().profile.hasOwnProperty('contractions')) {
      var timeArray = Meteor.user().profile.contractions.reverse();
    } else {
      timeArray = [];
    }
    var toAdd = {
      startDate: new Date(),
      startTime: '00 : 00 : 00',
      endTime: '00 : 00 : 00',
      totalDuration: '00:00:00',
      frequency: '---'
    }
    for (i = timeArray.length; i < 4; i++) {
      timeArray.push(toAdd);
    }
    return timeArray;
  },
  formatDate: function(date) {
    return moment(date).format('DD-MM-YYYY');
  },
  getGender: function() {
    if (Session.get('gender') != null) {
      status = true;
      return status;
    } else {
      status = false;
      return status;
    }
  },
  isBoy: function() {
    if (Meteor.user().profile.hasOwnProperty('babyGender')) {
      if (Meteor.user()) {
        var babyGender = Meteor.user().profile.babyGender[0];
      }
      if (babyGender === 'male') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  isGirl: function() {
    if (Meteor.user().profile.hasOwnProperty('babyGender')) {
      if (Meteor.user()) {
        var babyGender = Meteor.user().profile.babyGender[0];
      }

      if (babyGender == 'female') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  posts: function() {
    return Posts.find();
  },
  currentWeek: function() {
    return currentWeek();
  },
  babyGender: function() {
    if (Meteor.user()) {
      return Meteor.user().profile.babyGender[0];
    }
  },
  isGenderNull: function() {
    try {
      if (Meteor.user()) {
        var babyGender = Meteor.user().profile.babyGender[0];
      }
      if (babyGender == null) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return true;
    }
  },
  whathapbaby: function() {
    var week = currentWeek();
    var weeklytip = Weekly.find({
      week: week
    }).fetch();
    if (weeklytip) {
      return weeklytip[0].whathapbaby;
    }
  },
  photodesc: function() {
    var week = currentWeek();
    var weeklytip = Weekly.find({
      week: week
    }).fetch();
    if (weeklytip) {
      return weeklytip[0].photodesc;
    }
  },
  satisfyWeekCondition: function() {
    var week = currentWeek();
    return week >= 16;
  },
  clock: function() {
    if (ExerciseClock === undefined)
      return '00:00:00';
    else
      return ExerciseClock.elapsedTime({
        format: '00:00:00'
      });;
  },
  kicks: function() {
    return Session.get('counter');
  },
  photourl: function() {
    var week = currentWeek();
    var weeklytip = Weekly.find({
      week: week
    }).fetch();
    if (weeklytip) {
      return weeklytip[0].babyphoto;
    }
  }
});


Template.mummydash.helpers({
  idealweight: function() {
    //Put bmi calculator here
    var min_bmi = 0;
    var max_bmi = 0;
    var weight = parseInt(Meteor.user().profile.weight);
    var height = Meteor.user().profile.height;
    var week = currentWeek() + 1;
    // console.log(week);
    var lowerRange = 0;
    var upperRange = 0;
    var lowerB14Range = 0;
    var upperB14Range = 0;
    var weightGain = 0;
    var beforeWeek14 = 0;
    console.log(weight);
    console.log(height);
    if (height.indexOf(".") > -1) {
      bmi = Math.round(weight / (height * height) * 100) / 100;
    } else {
      bmi = Math.round(weight / (height / 100 * height / 100) * 100) / 100;
      height = height / 100;
    }
    if (week == 1 || week == 2) {
      weightGain = 0;
    } else {
      if (bmi < 18.5) {
        if (week <14) {
          lowerRange = 0.1 * (week-2);
          upperRange = 0.3 * (week-2);
          weightGain = (upperRange + lowerRange) /2
        } else {
          lowerB14Range = 1;
          upperB14Range = 3;
          beforeWeek14 = (upperB14Range + lowerB14Range) / 2;
          lowerRange = (week-13) * 0.4;
          upperRange = (week-13) * 0.6;
          weightGain = (upperRange + lowerRange) / 2 + beforeWeek14;
        }
        // min_bmi = 28;
        // max_bmi = 40;
      } else if (bmi >= 18.5 && bmi < 24.9) {
        if (week <14) {
          lowerRange = 0.1 * (week-2);
          upperRange = 0.3 * (week-2);
          weightGain = (upperRange + lowerRange) /2
          beforeWeek14 = weightGain;
        } else {
          lowerB14Range = 1;
          upperB14Range = 3;
          beforeWeek14 = (upperB14Range + lowerB14Range) / 2;
          lowerRange = (week-13) * 0.4;
          upperRange = (week-13) * 0.5;
          weightGain = (upperRange + lowerRange) / 2 + beforeWeek14;
        }
        // min_bmi = 25;
        // max_bmi = 35;
      } else if (bmi >= 24.9 && bmi < 30) {
        // min_bmi = 15;
        // max_bmi = 25;
        if (week <14) {
          lowerRange = 1;
          upperRange = 3;
          weightGain = (upperRange + lowerRange) /2
          beforeWeek14 = weightGain;
        } else {
          lowerB14Range = 1;
          upperB14Range = 3;
          beforeWeek14 = (upperB14Range + lowerB14Range) / 2;
          lowerRange = (week-13) * 0.2;
          upperRange = (week-13) * 0.3;
          weightGain = (upperRange + lowerRange) / 2 + beforeWeek14;
        }
      } else if (bmi >= 30) {
        if (week <14) {
          lowerRange = 0.1 * (week-3)/2;
          upperRange = 0.2 * (week-3);
          weightGain = (upperRange + lowerRange) /2
          beforeWeek14 = weightGain;
        } else {
          lowerB14Range = 0.5;
          upperB14Range = 2;
          beforeWeek14 = (upperB14Range + lowerB14Range) / 2;
          lowerRange = (week-13) * 0.2;
          upperRange = (week-13) * 0.3;
          weightGain = (upperRange + lowerRange) / 2 + beforeWeek14;
        }
        // min_bmi = 11;
        // max_bmi = 20;
      }
    }
    console.log(weight + " " + weightGain);
    var finalbmi = (min_bmi + max_bmi) / 2;
    var finalWeight = weight+weightGain;
    // console.log("fweight " + finalWeight);
    return Math.round(finalWeight);
    //Get weight
  },
  daytip: function() {
    var tagArray = Guides.find({
      summary: "DAILY TIPS"
    }).fetch();
    var random = Math.floor(Math.random() * 10);
    if (tagArray === undefined || tagArray[0] === undefined || tagArray[0].tags === undefined || tagArray[0].tags[random] === undefined)
      return "Nothing";
    else
      return tagArray[0].tags[random];
  },
  age: function() {
    if (Meteor.user() && Meteor.user().profile)
      return Meteor.user().profile.age;
    else
      return null;
  },
  height: function() {
    if (Meteor.user() && Meteor.user().profile)
      return Meteor.user().profile.height;
    else
      return null;
  },
  weight: function() {
    if (Meteor.user() && Meteor.user().profile)
      return Meteor.user().profile.weight;
    else
      return null;
  },
  bmi: function() {
    if (Meteor.user() && Meteor.user().profile) {
      var height = Meteor.user().profile.height;
      var weight = Meteor.user().profile.weight;
      if (height.indexOf(".") > -1) {
        return Math.round(weight / (height * height) * 100) / 100;
      } else {
        return Math.round(weight / (height / 100 * height / 100) * 100) / 100;
      }
    } else
      return null;
  },
  weeklytip: function() {
    var week = currentWeek();
    var weeklytip = Weekly.find({
      week: week
    }).fetch();
    return weeklytip[0].whathap;
  },
  weeklysym: function() {
    var week = currentWeek();
    var weeklysym = Weekly.find({
      week: week
    }).fetch();
    return weeklysym[0].symptoms;
  },
  symptomsArray: function() {
    var week = currentWeek();
    var array = Weekly.find({
      week: week
    }).fetch();
    if (array) {
      return array[0].symptoms;
    }
  },
  daysleft: function() {
    return daysleft();
  },
  photoWeek: function() {
    return Session.get('week');
    // return weekToUpload.get();
  },
  currentWeek: function() {
    return currentWeek();
  },
  trimester1: function() {
    var percentage = Math.round(currentWeek() * 7 / 280 * 100 * 100) / 100;
    if (percentage < 33.33) {
      return true;
    } else {
      return false;
    }
  },
  trimester2: function() {
    var percentage = Math.round(currentWeek() * 7 / 280 * 100 * 100) / 100;
    if (percentage > 33.33 && percentage <= 66.66) {
      return true;
    } else {
      return false;
    }
  }
});

Template.mummydash.events({
  'change #uploadPhoto': function(event, t) {
    var slideNumber = $('#carousel').slick('slickCurrentSlide');
    FS.Utility.eachFile(event, function(file) {
      Images.insert(file, function(err, fileObj) {
        if (err) {
          console.log(err);
        } else {
          // handle success depending what you need to do
          var arrayIndex = slideNumber;
          setTimeout(function() {
            Meteor.call('upsertPhoto', fileObj, arrayIndex);
          }, 2000);
        }
      });
    });
    setTimeout(function() {
      window.location.reload();
    }, 3000);
  },
  'click #addEditCarousel': function() {
    event.preventDefault();
    Router.go('/editCarousel');
  }
});

Template.mummydash.onRendered(function() {
  $('[data-toggle="tooltip"]').tooltip();
  if (Meteor.user().profile.hasOwnProperty('image')) {
    if (Meteor.user()) {
      imageArray = Meteor.user().profile.image;
      Session.set('week', imageArray.length);
    }
  } else {
    imageArray = [];
    Session.set('week', imageArray.length);
  }
  var percentage = Math.round(currentWeek() * 7 / 280 * 100 * 100) / 100;
  $(".ProgressBar").progressBar({
    split: 3,
    percent: percentage,
    foreSplitLineColor: '#000000'
  });
  var nowWeek = currentWeek();
  var nowTrimester = Math.floor(percentage/33);
  if(Session.get('dashboard')) {
    introJs().start().oncomplete(function(){
      Meteor.call('setTutorialDone','dashboard');
    }).onexit(function(){
      Meteor.call('setTutorialDone','dashboard');
    });
  }
  //Meteor.call('setUserProperty',"currentWeek", Meteor.userId(), nowWeek);
  //Meteor.call('setUserProperty',"currentTrimester", Meteor.userId(), nowTrimester);
  //Meteor.call('setUserProperty',Meteor.userId(),properties);
});

Template.carousel.helpers({
  photos: function() {
    var arrayOfPhoto = userPhotos();
    var longChunkOfString = "";
    if (arrayOfPhoto === undefined) {
      arrayOfPhoto = [];
      for (var i = 0; i < currentWeek() - 1; i++) {
        arrayOfPhoto.push("/img/stockpregnant.jpg");
      }
    }
    for (i = 0; i < arrayOfPhoto.length; i++) {
      if (arrayOfPhoto[i] === undefined) {
        arrayOfPhoto[i] = "/img/stockpregnant.jpg";
      } else
        longChunkOfString += "<div>" + "<img height=\"280\" align=\"middle\" src=\"" + arrayOfPhoto[i] + "\"style=\"max-width:100%\">" + "</div>" + "\n";
    }
    return longChunkOfString;
  }
});

Template.carousel.events({
  'click .slick-prev': function() {
    weekToUpload.set($('#carousel').slick('slickCurrentSlide') + 1);
    if (Session.get('week') == 1) {

    } else {
      Session.set('week', Session.get('week') - 1);
    }
  },
  'click .slick-next': function() {
    weekToUpload.set($('#carousel').slick('slickCurrentSlide') + 1);
    if (Session.get('week') == imageArray.length) {

    } else {
      Session.set('week', Session.get('week') + 1);
    }
  }
});

Template.carousel.onRendered(function() {
  var arrayOfPhoto = userPhotos();
  //var longChunkOfString = "";
  //if (arrayOfPhoto === undefined){
  //  arrayOfPhoto = [];
  //  for(var i = 0; i < currentWeek() - 1; i++){
  //    arrayOfPhoto.push("/img/stockpregnant.jpg");
  //  }
  //  Meteor.call('massRelay',arrayOfPhoto);
  //}
  //for (i = 0; i < arrayOfPhoto.length; i++) {
  //  longChunkOfString += "<div>" + "<img height=\"300\" src=\"" + arrayOfPhoto[i] + "\">" + "</div>" + "\n";
  //}
  var number = userPhotos().length - 1;
  this.$('#carousel').slick({
    //options
    infinite: false,
    arrows: true,
    accessibility: false,
    centerMode: true
  });
  this.$('#carousel').slick('slickGoTo', number);
  weekToUpload.set($('#carousel').slick('slickCurrentSlide') + 1)
  this.$('#carousel').on('afterChange', function(event, slick, currentSlide) {
    console.log(currentSlide);
    Session.set('week', currentSlide + 1);
  });
});

addIndex = function(all) {
  return _.map(all, function(val, index) {
    return {
      index: index + 1,
      value: val
    };
  });
};
