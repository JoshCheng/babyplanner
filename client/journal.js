/**
 * Created by derrickgoh on 30/8/15.
 */
// Journal
// -----------------------------
Template.addPost.events({
  'click #cancelPost': function(err, t) {
    Router.go('/journal');
  },
  'submit #entry': function(err, t) {
    event.preventDefault();
    //Get the weight, symptom, mood and userinput from the form and store into variables.
    var weight = event.target.weight.value;
    var symptom = $("#allSymptoms").val();
    //var craving = event.target.craving.value;
    var mood = $("#allMoods").val();
    var thoughts = event.target.userthoughts.value;
    if (weight.length === 0 && symptom.length === 0 && mood.length === 0 && thoughts.length === 0) {
      Session.set("addPostError", "Please key in a field");
      return false;
    } else {
      Session.set("addPostError", null);
    }
    //Get the one that corresponds to the UserID then check if the month exists?
    var currentDate = new Date(event.target.date.value);
    var currentMonth = currentDate.getMonth();
    var currentYear = currentDate.getFullYear();
    var currentUser = Meteor.userId();
    var checkExist = Entries.findOne({
      user: currentUser
    });
    //Make the object that I will throw in here
    var dayposts = {};
    //Test what comes out of checkExist
    //Case 1: UserID doesn't even exist (means no journal yet)
    if (typeof checkExist === "undefined") {
      dayposts = {
        user: currentUser,
        createdAt: currentDate,
        posts: [{
          month: currentMonth,
          year: currentYear,
          dayposts: [{
            d: currentDate.getDate(),
            timestamp: currentDate,
            eachentry: [{
              date: currentDate,
              symptom: symptom,
              mood: mood,
              thoughts: thoughts,
              weight: weight
            }]
          }]
        }]
      };
      Entries.insert(
        dayposts
      );
      //Case 2: Month + Year doesn't exist; create Month + year + new post
    } else {
      var yearMonthExist = Entries.findOne({
        user: currentUser,
        "posts.month": currentMonth,
        "posts.year": currentYear
      });
      if (typeof yearMonthExist === "undefined") {
        dayposts = {
          month: currentMonth,
          year: currentYear,
          dayposts: [{
            d: currentDate.getDate(),
            timestamp: currentDate,
            eachentry: [{
              date: currentDate,
              symptom: symptom,
              mood: mood,
              thoughts: thoughts,
              weight: weight
            }]
          }]
        };
        Entries.update({
          _id: checkExist._id
        }, {
          $push: {
            posts: dayposts
          }
        });
        //Case 3: Date doesn't exist; need to create new one.
      } else {
        dayposts = yearMonthExist;
        //dayposts is the entire document
        var newPost = true;
        dayposts.posts.forEach(function(p) {
          if (p.year === currentYear && p.month === currentMonth) {
            p.dayposts.forEach(function(t) {
              if (t.d === currentDate.getDate()) {
                t.eachentry.push({
                  date: currentDate,
                  symptom: symptom,
                  mood: mood,
                  thoughts: thoughts,
                  weight: weight
                });
                newPost = false;
              }
            });
          }
        });
        if (newPost) {
          dayposts.posts.forEach(function(p) {
            if (p.year === currentYear && p.month === currentMonth) {
              p.dayposts.push({
                d: currentDate.getDate(),
                timestamp: currentDate,
                eachentry: [{
                  date: currentDate,
                  symptom: symptom,
                  mood: mood,
                  thoughts: thoughts,
                  weight: weight
                }]
              });
            }
          });
        }
        Entries.update({
          _id: dayposts._id
        }, {
          $set: {
            posts: dayposts.posts
          }
        });

      }
    }
    //if (typeof symptom !== 'undefined' && symptom.length != 0){
    //  Meteor.call('setUserProperty', Meteor.userId(),{symptom:symptom});
    //}
    Router.go("/journal");
  },
  'change .input-medium':function(event){
    console.log("ds");
  }
});

Template.addPost.onRendered(function() {
  $(".js-example-basic-multiple").select2({
  placeholder: "Symptoms"
});
  $(".js-example-basic-single").select2();
  this.$('.datetimepicker').datetimepicker({
    defaultDate: new Date(),
    showClose: true,
    keepOpen: false
  });

});



Template.addPost.helpers({
  symptoms: function() {
    var symptomsArray = Journal.find().fetch()[0].symptom;
    return symptomsArray;
  },
  moods: function() {
    var moodsArray = Journal.find().fetch()[0].moods;
    return moodsArray;
  },
  getAddPostError: function() {
    return Session.get("addPostError");
  }
});
Template.registerHelper("symptomComma", function(symptom) {
  var toReturn = "";
  for (var i = 0; i < symptom.length; i++) {
    if (i === (symptom.length - 1)) {
      toReturn += symptom[i];
    } else {
      toReturn += symptom[i] + ", "
    }
  }
  return toReturn;
});
Template.archiveJournal.helpers({
  userPosts: function() {
    var userArray = Entries.findOne({
      user: Meteor.userId()
    });
    if (typeof userArray != "undefined") {
      var monthSort = (userArray.posts).sort(function(a,b){
        return b["year"] - a["year"] || b["month"] - a ["month"];
      });
      for (var i = 0; i < monthSort.length; i++){
        var nextIterate = monthSort[i].dayposts;
        nextIterate.sort(function(a,b){
          return b["timestamp"] - a["timestamp"];
        });
      }
      return userArray.posts;
    } else {
      return false;
    }
  }
});
Template.archiveJournal.events({
  'click .drop':function(e){
    var stuff = "#drop"+ this.index + " i";
    $(stuff).toggleClass('fa-caret-right fa-caret-down');
  }
  //Put the table pulling over here next time
});





Template.eachPost.events({
  'click #deletePost': function(e, t) {
    e.preventDefault();
    var clickedButton = e.currentTarget;
    var date = clickedButton.value;
    var d = new Date(date);
    var plsWork = d.getDate();
    var year = d.getFullYear();
    var month = d.getMonth();
    var monthYearEmpty = false;
    var dateEmpty = false;
    var dayposts = Entries.findOne({
      user: Meteor.userId()
    });
    for (var l = 0; l < dayposts.posts.length; l++) {
      p = dayposts.posts[l];
      if (p.year == year && p.month == month) {
        for (var j = 0; j < p.dayposts.length; j++) {
          each = p.dayposts[j];
          if (each.d === plsWork) {
            for (var i = 0; i < each.eachentry.length; i++) {
              var eachPost = each.eachentry[i];
              if (eachPost.date.toString() === d.toString()) {
                each.eachentry.splice(i, 1);
              }
            }
          }
          if (each.eachentry.length === 0) {
            p.dayposts.splice(j, 1);
          }
        }
        if (p.dayposts.length === 0) {
          monthYearEmpty = true;
        }
      }
    }
    Entries.update({
      _id: dayposts._id
    }, {
      $set: {
        posts: dayposts.posts
      }
    });
    if (monthYearEmpty) {
      Entries.update({
        _id: dayposts._id
      }, {
        $pull: {
          posts: {
            month: month,
            year: year
          }
        }
      })
    }
    // Meteor.call('generatePDF', Blaze.toHTML(Template.eachPost),function(error, result) {
		// 	if (error) {
    //     console.log(error);
		// 	} else {
    //     console.log(result)
		// 	}
		// });
  }
});
Template.viewJournal.events({
  'click #newEntry': function(e, t) {
    e.preventDefault();
    Router.go("/journal/new-entry");
  }
});

Template.viewJournal.onRendered(function() {
  if(Session.get('journal')) {
    introJs().start().oncomplete(function(){
      Meteor.call('setTutorialDone','journal');
    }).onexit(function(){
      Meteor.call('setTutorialDone','journal');
    });
  }
 $('[data-toggle="tooltip"]').tooltip();
   if (_.isFunction(window.callPhantom))
     Meteor.setTimeout(function() {
       window.callPhantom('takeShot');
     }, 500);
});

