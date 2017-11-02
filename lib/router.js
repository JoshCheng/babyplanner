Router.map(function() {
  this.route('myPregnancy', {
    path: '/dashboard',
    layoutTemplate: 'loggedInTemplate',
    yieldTemplate: 'myPregnancy',
    onBeforeAction: function(pause) {
      if(Meteor.user().profile.hasOwnProperty('dashboard')){
        Session.set('dashboard',false);
      } else {
        Session.set('dashboard', true);
      }
      if (!Meteor.userId()) {
        Router.go('/');
      } else if (!Meteor.user().hasOwnProperty('profile')) {
        Router.go('/detailspage');
      } else if (Meteor.user().hasOwnProperty('profile')) {
        if (!Meteor.user().profile.hasOwnProperty('duedate')) {
          Router.go('/detailspage');
        } else {
          this.next();
        }
      } else {
        this.next();
      }
    }
  });


  this.route('detailspage', {
    path: '/detailspage',
    layoutTemplate: 'atFormLayout',
    yieldTemplate: 'detailspage',
    onBeforeAction: function(pause) {
      if (!Meteor.userId()) {
        Router.go('/');
      } else if (Meteor.user().hasOwnProperty('profile')) {
        if (Meteor.user().profile.hasOwnProperty('duedate')) {
          Router.go('/dashboard');
        } else {
          this.next();
        }
      } else {
        this.next();
      }
    }
  });


  this.route('userprofile', {
    path: '/user-profile',
    layoutTemplate: 'atFormLayout',
    yieldTemplate: 'userprofile',
    onBeforeAction: function(pause) {
      if (!Meteor.userId()) {
        Router.go('/');
      } else if (!Meteor.user().hasOwnProperty('profile')) {
        Router.go('/detailspage');
      } else if (Meteor.user().hasOwnProperty('profile')) {
        if (!Meteor.user().profile.hasOwnProperty('duedate')) {
          Router.go('/detailspage');
        } else {
          this.next();
        }
      } else {
        this.next();
      }
    }
  });

  // I have one for adding posts
  this.route('addPost', {
    path: '/journal/new-entry',
    layoutTemplate: 'viewJournal',
    yieldTemplates: {
      'addPost': {
        to: 'body'
      }
    },
    onBeforeAction: function(pause) {
      if (!Meteor.userId()) {
        Router.go('/');
      } else if (!Meteor.user().hasOwnProperty('profile')) {
        Router.go('/detailspage');
      } else if (Meteor.user().hasOwnProperty('profile')) {
        if (!Meteor.user().profile.hasOwnProperty('duedate')) {
          Router.go('/detailspage');
        } else {
          this.next();
        }
      } else {
        this.next();
      }
      Session.set("addPostError", null);
    }
  });
  this.route('journal', {
    path: '/journal',
    layoutTemplate: 'viewJournal',
    yieldTemplates: {
      'archiveJournal': {
        to: 'archive'
      },
      'eachPost': {
        to: 'body'
      }
    },
    onBeforeAction: function(pause) {
      if(Meteor.user().profile.hasOwnProperty('journal')){
        Session.set('journal',false);
      } else {
        Session.set('journal', true);
      }
      if (!Meteor.userId()) {
        Router.go('/');
      } else if (!Meteor.user().hasOwnProperty('profile')) {
        Router.go('/detailspage');
      } else if (Meteor.user().hasOwnProperty('profile')) {
        if (!Meteor.user().profile.hasOwnProperty('duedate')) {
          Router.go('/detailspage');
        } else {
          this.next();
        }
      } else {
        this.next();
      }
    },
    data: function(){
      var toIterateOne = Entries.findOne({
        user: Meteor.userId()
      });
      if (typeof toIterateOne !== 'undefined'){
        for (var i = 0; i < toIterateOne.posts.length; i++) {
          (toIterateOne.posts[i].dayposts).sort(function(a,b){
            return b["timestamp"] - a["timestamp"];
          });
          var nextIterateTwo = toIterateOne.posts[i].dayposts;
          for (var l = 0; l < nextIterateTwo.length; l++) {
            nextIterateTwo[l].eachentry.sort(function(a,b){
              return b["date"] - a["date"];
            });
          }
        }
        if (typeof nextIterateTwo !== 'undefined'){
          return [toIterateOne.posts[0].dayposts[0]];
        } else {
          return undefined;
        }
      } else {

        return undefined;
      }
    }
  });
  // Need to make one more generic one for viewing; should I paste data context?
  // what would i use? i can't use id because it only corresponds to userid
  // should i use month then date?
  // so like /journal/view/mm/dd?
  // View specific date
  this.route('viewPost', {
    path: '/journal/:year/:month/:date',
    layoutTemplate: 'viewJournal',
    yieldTemplates: {
      'archiveJournal': {
        to: 'archive'
      },
      'eachPost': {
        to: 'body'
      }
    },
    onBeforeAction: function(pause) {
      if(Meteor.user().profile.hasOwnProperty('journal')){
        Session.set('journal',false);
      } else {
        Session.set('journal', true);
      }
      if (!Meteor.userId()) {
        Router.go('/');
      } else if (!Meteor.user().hasOwnProperty('profile')) {
        Router.go('/detailspage');
      } else if (Meteor.user().hasOwnProperty('profile')) {
        if (!Meteor.user().profile.hasOwnProperty('duedate')) {
          Router.go('/detailspage');
        } else {
          this.next();
        }
      } else {
        this.next();
      }
    },
    data: function() {
      //Need to use the year, month and date to find
      var year = this.params.year.toString();
      var month = (this.params.month).toString();
      var date = this.params.date.toString();
      var toIterate = Entries.findOne({
        user: Meteor.userId()
      });
      if(!(typeof toIterate === 'undefined')) {
        if (date === "all") {
          for (var i = 0; i < toIterate.posts.length; i++) {
            if (toIterate.posts[i].month.toString() === month && toIterate.posts[i].year.toString() === year) {
              return (toIterate.posts[i].dayposts).sort(function (a, b) {
                return b["timestamp"] - a["timestamp"];
              });
            }
          }
        } else {
          for (var i = 0; i < toIterate.posts.length; i++) {
            if (toIterate.posts[i].month.toString() === month && toIterate.posts[i].year.toString() === year) {
              var nextIterate = toIterate.posts[i].dayposts;
              for (var l = 0; l < nextIterate.length; l++) {
                if (nextIterate[l].d.toString() === date) {
                  nextIterate[l].eachentry.sort(function (a, b) {
                    return b["date"] - a["date"];
                  });
                  return [nextIterate[l]];
                }
              }
            }
          }
        }
      } else {
        return undefined;
      }
    }

  });

  this.route('budget', {
    path: '/budget',
    layoutTemplate: 'loggedInTemplate',
    yieldTemplate: 'budget',
    onBeforeAction: function(pause) {
      if (!Meteor.userId()) {
        Router.go('/');
      } else if (!Meteor.user().profile.hasOwnProperty('packages')) {
        Router.go('/budget/add-package');
      } else if (!Meteor.user().hasOwnProperty('profile')) {
        Router.go('/detailspage');
      } else if (Meteor.user().hasOwnProperty('profile')) {
        if (!Meteor.user().profile.hasOwnProperty('duedate')) {
          Router.go('/detailspage');
        } else {
          this.next();
        }
      } else {
        this.next();
      }
    }
  });


  this.route('addItem', {
    path: '/budget/add-item',
    layoutTemplate: 'loggedInTemplate',
    yieldTemplate: 'addItem',
    onBeforeAction: function(pause) {
      if (!Meteor.userId()) {
        Router.go('/');
      } else if (!Meteor.user().hasOwnProperty('profile')) {
        Router.go('/detailspage');
      } else if (Meteor.user().hasOwnProperty('profile')) {
        if (!Meteor.user().profile.hasOwnProperty('duedate')) {
          Router.go('/detailspage');
        } else {
          this.next();
        }
      } else {
        this.next();
      }
    }
  });

  this.route('packages', {
    path: '/budget/add-package',
    layoutTemplate: 'loggedInTemplate',
    yieldTemplate: 'packages',
    onBeforeAction: function(pause) {
      if (!Meteor.userId()) {
        Router.go('/');
      } else if (!Meteor.user().hasOwnProperty('profile')) {
        Router.go('/detailspage');
      } else if (Meteor.user().hasOwnProperty('profile')) {
        if (!Meteor.user().profile.hasOwnProperty('duedate')) {
          Router.go('/detailspage');
        } else {
          this.next();
        }
      } else {
        this.next();
      }
    }
  });

  this.route('addpackage', {
    path: '/budget/add-hospitalpackage',
    layoutTemplate: 'editPackageTemplate',
    yieldTemplate: 'addpackage',
    onBeforeAction: function(pause) {
      if (!Meteor.userId()) {
        Router.go('/');
      } else if (!Meteor.user().hasOwnProperty('profile')) {
        Router.go('/detailspage');
      } else if (Meteor.user().hasOwnProperty('profile')) {
        if (!Meteor.user().profile.hasOwnProperty('duedate')) {
          Router.go('/detailspage');
        } else {
          this.next();
        }
      } else {
        this.next();
      }
    }
  });

  this.route('addItemPackage', {
    path: '/budget/add-itempackage',
    layoutTemplate: 'editPackageTemplate',
    yieldTemplate: 'addItemPackage',
    onBeforeAction: function(pause) {
      if (!Meteor.userId()) {
        Router.go('/');
      } else if (!Meteor.user().hasOwnProperty('profile')) {
        Router.go('/detailspage');
      } else if (Meteor.user().hasOwnProperty('profile')) {
        if (!Meteor.user().profile.hasOwnProperty('duedate')) {
          Router.go('/detailspage');
        } else {
          this.next();
        }
      } else {
        this.next();
      }
    }
  });

  this.route('/', function() {
    this.render('landing');
  });

  this.route('editCarousel', {
    path: '/editCarousel',
    layoutTemplate: 'loggedInTemplate',
    yieldTemplate: 'editCarousel',
    onBeforeAction: function(pause) {
      if (!Meteor.userId()) {
        Router.go('/');
      } else if (!Meteor.user().hasOwnProperty('profile')) {
        Router.go('/detailspage');
      } else if (Meteor.user().hasOwnProperty('profile')) {
        if (!Meteor.user().profile.hasOwnProperty('duedate')) {
          Router.go('/detailspage');
        } else {
          this.next();
        }
      } else {
        this.next();
      }
    }
  });

  this.route('shop', {
    path: '/shop',
    layoutTemplate: 'loggedInTemplate',
    yieldTemplate: 'shop',
    onBeforeAction: function(pause) {
      if(Meteor.user().profile.hasOwnProperty('shop')){
        Session.set('shop',false);
      } else {
        Session.set('shop', true);
      }
      if (!Meteor.userId()) {
        Router.go('/');
      } else if (!Meteor.user().hasOwnProperty('profile')) {
        Router.go('/detailspage');
      } else if (Meteor.user().hasOwnProperty('profile')) {
        if (!Meteor.user().profile.hasOwnProperty('duedate')) {
          Router.go('/detailspage');
        } else {
          this.next();
        }
      } else {
        this.next();
      }
    }
  });

  this.route('guides', {
    path: '/guides',
    layoutTemplate: 'loggedInTemplate',
    yieldTemplate: 'guides',
    onBeforeAction: function(pause) {
      if(Meteor.user().profile.hasOwnProperty('guides')){
        Session.set('guides',false);
      } else {
        Session.set('guides', true);
      }
      if (!Meteor.userId()) {
        Router.go('/');
      } else if (!Meteor.user().hasOwnProperty('profile')) {
        Router.go('/detailspage');
      } else if (Meteor.user().hasOwnProperty('profile')) {
        if (!Meteor.user().profile.hasOwnProperty('duedate')) {
          Router.go('/detailspage');
        } else {
          this.next();
        }
      } else {
        this.next();
      }
    }
  });

  // this.route('generatePDF', {
  //       path: '/api/generatePDF',
  //       where: 'server',
  //       action: function() {
  //           var webshot = Meteor.npmRequire('webshot');
  //           var fs = Npm.require('fs');
  //           var Future = Npm.require('fibers/future');
  //           var fut = new Future();
  //           var fileName = "generated_"+Random.id()+".pdf";
  //           var url = Meteor.absoluteUrl("budget");
  //           var options = {
  //             takeShotOnCallback: true,
  //               "paperSize": {
  //                   "format": "Letter",
  //                   "orientation": "portrait",
  //                   "margin": "1cm"
  //               }
  //           };
  //
  //           webshot(url, fileName, options, function(err) {
  //             fs.readFile(fileName, function (err,data) {
  //               if (err) {
  //                 return console.log(err);
  //               }
  //
  //               fs.unlinkSync(fileName);
  //               fut.return(data);
  //             });
  //           });
  //
  //           this.response.writeHead(200, {'Content-Type': 'application/pdf',"Content-Disposition": "attachment; filename=generated.pdf"});
  //           this.response.end(fut.wait());
  //       }
  //   });
  // this.route('generatePDF', {
  //   where: 'server',
  //   path: '/api/generatePDF',
  //   action: function() {
  //     var fs = Npm.require('fs');
  //     var wkhtmltopdf = Npm.require('wkhtmltopdf');
  //     // var headers = {
  //     //      'Content-type': 'application/pdf',
  //     //      'Content-Disposition': "attachment; filename=test.pdf"
  //     //    };
  //     //    this.response.writeHead(200, headers);
  //     // wkhtmltopdf("1321312", function(code, signal) {
  //     //   console.log(fs.readFileSync('out.pdf').toString());
  //     // }).pipe(fs.createWriteStream('out.pdf'));
  //
  //     wkhtmltopdf('<h1>Test</h1><p>Hello world</p>')
  //       .pipe(fs.createWriteStream('out.pdf'));
  //     // This action function allows you to edit the response buffer.
  //
  //     // create some http buffers for your pdf file
  //     // var headers = {
  //     //   'Content-type': 'application/pdf',
  //     //   'Content-Disposition': "attachment; filename=test.pdf"
  //     // };
  //     //
  //     // // Add the headers to the response buffer
  //     // this.response.writeHead(200, headers);
  //     //
  //     // // Load the wkhtmltopdf module.
  //     // // Notice we are using Meteor.npmRequire here, available trough the meteorhacks:npm module.
  //     // var wk = Meteor.npmRequire('wkhtmltopdf');
  //     //
  //     // // Render the html response of 'http://www.google.com' to the response buffer.
  //     // var r = wk("http://www.google.com").pipe(this.response);
  //   }
  // });

});
