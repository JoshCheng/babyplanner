if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);



  function onScreen() {
    // Check if the top of the page collides with each section
    $('.section').each(function() {
      var windowScroll = $(document).scrollTop();
      var navHeight = $('.navbar ul').height();

      // Complex line checks if windowScroll (top of page) + nav bar hits Section Top / Bottom
      if (windowScroll + navHeight >= $(this).offset().top && windowScroll + navHeight <= $(this).offset().top + $(this).height()) {
        // This section is active! Add Highlight
        $('.navbar ul a#nav-' + $(this).attr('id')).addClass('highlight');
      } else {
        // No - Remove highlight class
        $('.navbar ul a#nav-' + $(this).attr('id')).removeClass('highlight');
      }
    });
  }

  $(window).on('scroll resize', function() {
    onScreen();
  });
}

Meteor.startup(function() {
  AdminDashboard.addSidebarItem('Dashboard', AdminDashboard.path('../dashboard'), {
    icon: 'plus'
  })
});

Session.set('tutorialEnabled', true);
tutorialSteps = [
  {
    template: Template.dTutorial_step1,
    onLoad: function() { console.log("The tutorial has started!"); }
  },
  {
    template: Template.dTutorial_step2,
    spot: "#tProgress"
  },
  {
    template: Template.dTutorial_step3,
    spot: "#tCarousel"
  },
  {
    template: Template.dTutorial_step4,
    spot: "#tBodyHap"
  },
  {
    template: Template.dTutorial_step5,
    onLoad: function(){
      Router.go('/dashboard#tBabySize');
      $('html, body').animate({
        scrollTop: $("#tBabySize").offset().top
      }, 500);
    },
    spot: "#tBabySize"
  },
  {
    template: Template.dTutorial_step6,
    spot: "#tBabyName"
  },
  {
    template: Template.dTutorial_step7,
    spot: "#tBabyHap"
  },
  {
    template: Template.dTutorial_step8,
    spot: "#tContraction"
  },
  {
    template: Template.dTutorial_step9,
    spot: "#tKick"
  }
];

Template.loggedInTemplate.helpers({
  tutorialEnabled: function() {
    return Session.get('tutorialEnabled')
  },
  options: {
    id: "myCoolTutorial",
    steps: tutorialSteps,
    emitter: new EventEmitter(),
    onFinish: function() {
      Session.set('tutorialEnabled',false);
    }
  },
});

//Details Page Events + Helpers
Template.detailspage.events({
  'submit .info': function(e, t) {
    event.preventDefault();
    var name = event.target.name.value;
    var birthdate = event.target.birthdate.value;
    var height = event.target.height.value;
    var weight = event.target.weight.value;
    var duedate;
    if (event.target.duedate) {
      duedate = event.target.duedate.value;
    } else {
      duedate = new Date(event.target.lastperiod.value);
      var numberOfDaysToAdd = 280;
      duedate.setDate(duedate.getDate() + numberOfDaysToAdd);
      var dd = duedate.getDate();
      var mm = duedate.getMonth() + 1;
      var y = duedate.getFullYear();
      if (mm < 10) {
        mm = '0' + mm;
      }
      if (dd < 10) {
        dd = '0' + dd;
      }
      duedate = y + '-' + mm + '-' + dd;
    }
    var today = new Date();
    var date1 = new Date(duedate);
    var timeDiff = Math.abs(date1.getTime() - today.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    var conceived_week = Math.floor((280 - diffDays) / 7);
    var imagesArray = [];
    for (var i = 1; i <= conceived_week; i++) {
      imagesArray.push("/img/stockpregnant.jpg");
    }
    var newProfile = {
      name: name,
      birthdate: birthdate,
      weight: weight,
      height: height,
      duedate: duedate,
      babyName: "input baby name",
      image: imagesArray
    };
    Meteor.users.update(Meteor.user()._id, {
      $set: {
        profile: newProfile
      }
    });
    Router.go('/dashboard');
  },
  'click .noduedate': function(e, t) {
    event.preventDefault();
    if (Session.get('duedate-checkbox')) {
      Session.set('duedate-checkbox', false);
    } else {
      Session.set('duedate-checkbox', true);
    }
  }
});
Template.detailspage.helpers({
  maxDate: function() {
    var someDate = new Date();
    var numberOfDaysToAdd = 280;
    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    month = '' + (someDate.getMonth() + 1),
      day = '' + someDate.getDate(),
      year = someDate.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  },
  today: function() {
    var someDate = new Date();
    month = '' + (someDate.getMonth() + 1),
      day = '' + someDate.getDate(),
      year = someDate.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  },
  facebook: function() {
    if (Meteor.user().services.facebook) {
      return Meteor.user().profile.name;
    } else {
      return null;
    }
  },
  checkbox: function() {
    return Session.get('duedate-checkbox');
  }
});

//Nav Bar Events
Template.navbar.events({
  'click #register': function(e, t) {
    event.preventDefault();
    Router.go('/login');
  }
});

//User Profile Events + Helpers
Template.userprofile.events({
  'submit .updateInfo': function(event) {
    event.preventDefault();
    var name = event.target.name.value;
    var email = event.target.email.value;
    var duedate = event.target.duedate.value;
    var weight = event.target.weight.value;
    var height = event.target.height.value;
    var today = new Date();
    var date1 = new Date(duedate);
    var timeDiff = Math.abs(date1.getTime() - today.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    var conceived_week = Math.floor((280 - diffDays) / 7);
    var imagesArray = Meteor.user().profile.image;
		console.log(conceived_week + " " + currentWeek());
    if (currentWeek() <= conceived_week) {
      for (var i = currentWeek(); i < conceived_week; i++) {
        imagesArray.push("/img/stockpregnant.jpg");
      }
    } else {
      for (var i = currentWeek(); i > conceived_week; i--) {
        imagesArray.pop();
      }
    }
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "profile.name": name,
        "profile.duedate": duedate,
        "profile.height": height,
        "profile.weight": weight,
        "profile.image": imagesArray
      }
    });
    Meteor.call('changeEmail', email, function(error, result) {
      if (error) {

      } else {
        Session.set('change-success', true);
        setTimeout(function() {
          Router.go('/dashboard');
          Session.set('change-success', false);
        }, 3000);
      }
    });
  }
});
Template.userprofile.helpers({
  name: function() {
    if (Meteor.user()) {
      return Meteor.user().profile.name;
    }
  },
  email: function() {
    if (Meteor.user().emails) {
      return Meteor.user().emails[0].address;
    } else if (Meteor.user().services.facebook) {
      return Meteor.user().services.facebook.email;
    }
  },
  duedate: function() {
    if (Meteor.user()) {
      return Meteor.user().profile.duedate;
    }
  },
  changesuccess: function() {
    return Session.get('change-success');
  },
  weight: function() {
    if (Meteor.user()) {
      return Meteor.user().profile.weight;
    }
  },
  height: function() {
    if (Meteor.user()) {
      return Meteor.user().profile.height;
    }
  }

});

//Logged In Nav Bar Event + Helpers
Template.loggedInNavBar.events({
  'click #logout': function(event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('/');
  },
  'click #profilepage': function(event) {
    event.preventDefault();
    Router.go('/user-profile');
  },
  'click #changepassword': function(event) {
    event.preventDefault();
    Router.go('/change');
  }
});
Template.loggedInNavBar.helpers({
  userName: function() {
    if (Meteor.user()) {
      return Meteor.user().profile.name;
    } else {
      return null;
    }
  },
  isFacebook: function() {
    if (Meteor.user().services.hasOwnProperty('facebook')) {
      return true;
    } else {
      return false;
    }
  }
});

//Registered Helpers
UI.registerHelper('addIndex', function(all) {
  return _.map(all, function(val, index) {
    return {
      index: index,
      value: val
    };
  });
});
Template.registerHelper("monthYearDisplay", function(month) {
  return monthDisplay(month);
});
Template.registerHelper("eachPostDateDisplay", function(date) {
  return date.getDate() + " " + monthDisplay(date.getMonth()) + " " + date.getFullYear();
});
Template.registerHelper("dateDisplay", function(date) {
  return moment(date).format("DD MMM");
});
Template.registerHelper("dayPostLink", function(date) {
  return "" + date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
});
Template.registerHelper("timeDisplay", function(date) {
  var timeD = moment(date).format("LT");
  return timeD;
});
Template.registerHelper("findTool", function(title){
  var tip = Tooltips.findOne({ title: title });
  if (tip){
    return tip.description;
  } else {
    return "Tooltip not found!";
  }
});

//Reactive Variables
weekToUpload = new ReactiveVar(0);

//Global Methods
duedate = function() {
  if (Meteor.user() && Meteor.user().profile)
    return Meteor.user().profile.duedate;
  else
    return null;
};
daysleft = function() {
  if (Meteor.user() && Meteor.user().profile) {
    var duedate = new Date(Meteor.user().profile.duedate);
    var today = new Date();
    var timeDiff = Math.abs(duedate.getTime() - today.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  } else
    return null;

};
currentWeek = function() {
  var conceived_date = Math.floor((280 - daysleft()) / 7);
  return conceived_date;
};
userPhotos = function() {
  return Meteor.user().profile.image;
};
monthDisplay = function(month) {
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  //What if the user journal collection exists but there are no posts?
  //What will happen?
  return monthNames[month];
};
//Derrick notes: 2 cTime and 2 cLatestTime need to remove one
//Cheng take note
cTime = function() {
  var timeArray = Meteor.user().profile.contractions.reverse();
  if (timeArray.length <= 1) {
    return '00 : 00 : 00';
  } else {
    return timeArray[1][0].startTime;
  }
};
cLatestTime = function() {
  // try {
  var timeArray = Meteor.user().profile.contractions.reverse();
  if (timeArray.length < 1) {
    return '00 : 00 : 00';
  } else {
    return timeArray[0][0].startTime;
  }
  // } catch (e) {
  // 	return '00: 00';
  // }
};
contractionLatestFrequency = function(startTime) {
  // var latestFrequency = contractionLatestTime() - cTime();
  //2nd latest time
  var timeH = startTime.substring(0, 2);
  var timeM = startTime.substring(4, 7);
  var timeS = startTime.substring(9, 12);
  var intH = parseInt(timeH);
  var intM = parseInt(timeM);
  var intS = parseInt(timeS);

  //latestTime
  var latestTimeH = cLatestTime().substring(0, 2);
  var latestTimeM = cLatestTime().substring(4, 7);
  var latestTimeS = cLatestTime().substring(9, 12);
  var intLatestH = parseInt(latestTimeH);
  var intLatestM = parseInt(latestTimeM);
  var intLatestS = parseInt(latestTimeS);

  //contraction frequency = latest - previous timing
  var timeDiffH = intH - intLatestH;
  var timeDiffM = intM - intLatestM;
  var timeDiffS = intS - intLatestS;
  if (cLatestTime() == '00 : 00 : 00') {
    return "---";
  }
  if (timeDiffS < 0) {
    timeDiffM = timeDiffM - 1;
    timeDiffS = timeDiffS + 60;
  }
  if (timeDiffM < 0) {
    timeDiffH = timeDiffH - 1;
    timeDiffM = timeDiffM + 60;
  }
  if (timeDiffS === undefined) {
    return "---";
  }
  var timeDiff = timeDiffH + "hr " + timeDiffM + "m " + timeDiffS + "s ";
  // frequency = timeDiff;
  return timeDiff;
};
cTime = function() {
  var timeArray = Meteor.user().profile.contractions.reverse();
  if (timeArray.length <= 1) {
    return '00 : 00 : 00';
  } else {
    return timeArray[1].startTime;
  }
};
cLatestTime = function() {
  // try {
  var timeArray = Meteor.user().profile.contractions.reverse();
  if (timeArray.length < 1) {
    return '00 : 00 : 00';
  } else {
    return timeArray[0].startTime;
  }
  // } catch (e) {
  // 	return '00: 00';
  // }
};
categories = function() {
  var distinctEntries = _.uniq(Packages.find({}, {
    sort: {
      categorys: 1
    },
    fields: {
      categorys: true
    }
  }).fetch().map(function(x) {
    return x.categorys;
  }), true);
  return distinctEntries;
};
categoriesUser = function() {
  if (Meteor.user().profile.packages.hasOwnProperty('hamper')) {
    var hamper = Meteor.user().profile.packages.hamper.details;
    var categories = [];
    if (hamper) {
      hamper.forEach(function(thing) {
        if (categories.indexOf(thing.categorys) === -1) {
          categories.push(thing.categorys);
        }
      });
    }
  }
  return categories;
};
getHighlight = function() {
  if (Meteor.user().profile.hasOwnProperty('packages')) {
    if (Meteor.user().profile.packages.hasOwnProperty('package')) {
      var hospitalPackage = Meteor.user().profile.packages.package;
      var hospital = hospitalPackage.hospital;
      var wardType = hospitalPackage.wardType;
      var type = hospitalPackage.type;
      var colIndex = hospitalPackage.colIndex - 1;
      var rowIndex = hospitalPackage.rowIndex;
      if (rowIndex && colIndex) {
        if (type) {
          $('.pricing-table-' + type + ' tr').eq(rowIndex).find('td').eq(colIndex).addClass('selectedBg');
        }
      }
    }
    if (Meteor.user().profile.packages.hasOwnProperty('hamper')) {
      var type = Meteor.user().profile.packages.hamper.type;
      if (type) {
        $('.outside #' + type).addClass('selectedHamper');
      }
    }
  }
};
totalPrice = function() {
	var totalPrice = 0;
	if (Meteor.user().profile.hasOwnProperty('packages')) {
		if (Meteor.user().profile.packages.hasOwnProperty('hamper')) {
			var hamper = Meteor.user().profile.packages.hamper.details;
			if (hamper) {
				hamper.forEach(function(index) {
					totalPrice += index.price * index.quantity;
				});
			}
		}
		if (Meteor.user().profile.packages.hasOwnProperty('package')) {
			var price = Meteor.user().profile.packages.package.price;
			var price = price.substring(1, price.length);
			totalPrice += parseInt(price);
		}
	}
	return Math.round(totalPrice * 100) / 100;
};
userbudget = function() {
	if (Meteor.user().profile.hasOwnProperty('packages')) {
		if (Meteor.user().profile.packages.hasOwnProperty('budget')) {
			return Meteor.user().profile.packages.budget;
		}
	}
};
// getPercent = function() {
// 	if (Meteor.user().profile.hasOwnProperty('packages')) {
// 		if (Meteor.user().profile.packages.hasOwnProperty('budget')) {
// 			return Meteor.user().profile.packages.budget;
// 		}
// 	}
// };

getPercent = function(){
  var percent = 0;
  if (userbudget() && totalPrice()){
    percent = Math.round(totalPrice() / userbudget() * 10000) / 100;
  }
  // Session.set("percent",percent);
  return percent;
};

function res() {
  (function($) {
    //REMOVED VALIDATIONS
    var date = mon + '/' + day + '/' + year;

    var tmp = date.split('/');

    var m = tmp[0];
    var d = tmp[1];
    var y = tmp[2];

    var range = new Array();
    var gain = new Array();

    //Put bmi calculator here
    var bmi = calc_BMI();
    var min_bmi = 0;
    var max_bmi = 0;

    if (bmi < 18.5) {
      min_bmi = 28;
      max_bmi = 40;
    } else if (bmi > 18.5 && bmi < 24.5) {
      min_bmi = 25;
      max_bmi = 35;
    } else if (bmi > 24.5 && bmi < 30) {
      min_bmi = 15;
      max_bmi = 25;
    } else if (bmi > 30) {
      min_bmi = 11;
      max_bmi = 20;
    }
    var finalbmi = (min_bmi + max_bmi) / 2
    var height = Meteor.user().profile.height;
    //Get weight
    var w = Meteor.user().profile.weight;
    return finalbmi * height * height;
    //Converts pounds to kg
    //var a=document.getElementById('sid').value;
    //if(a==1)w=w/(0.4535924);
    //var min_range = (parseFloat(min_gain) + parseFloat(w)).toFixed(2);
    //
    //var max_range = (parseFloat(max_gain) + parseFloat(w)).toFixed(2);
    //var min_ = parseFloat(min_bmi / 2).toFixed(2);
    //var max_ = parseFloat(max_bmi / 2).toFixed(2);
    //Return recommended weight range
    //var total_min=0;
    //var total_max=0;
    //$('#res').append('<tr class="top_tr"><td colspan=5><strong>Your Result</strong></td></tr>');
    //
    //$('#res').append('<tr class="top_tr"><th>BMI</th><th colspan=2>Category</th><th colspan=2>Total Weight Gain Range</th></tr>');
    //
    //if(bmi<18.5)$('#res').append('<tr><td class="cell_td">'+bmi+'</td><td colspan=2 class="cell_td">Underweight</td><td colspan=2 class="cell_td">28-40 lbs</td></tr>');
    //
    //else if(bmi>18.5 && bmi<24.5)$('#res').append('<tr><td class="cell_td">'+bmi+'</td><td colspan=2 class="cell_td">Normal Weight</td><td colspan=2 class="cell_td">25-35 lbs</td></tr>');
    //
    //else if(bmi>24.5 && bmi<30)$('#res').append('<tr><td class="cell_td">'+bmi+'</td><td colspan=2 class="cell_td">Overweight</td><td colspan=2 class="cell_td">15-25 lbs</td></tr>');
    //
    //else if(bmi>30)$('#res').append('<tr><td class="cell_td">'+bmi+'</td><td colspan=2 class="cell_td">Obese</td><td colspan=2 class="cell_td">11-20 lbs</td></tr>');

    $('#res').show();
  })(jQuery);
}
