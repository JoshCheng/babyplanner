Session.set('counter', 0);
categoryChoice = "";
previousCategory = "Exercise";
prevStuff = "";
prevStuffCollapse = "";
div_termsTop = 0;
prevWantToScrollTo = "";

Template.guides.events({
  // 'click #categories': function(event, target) {
  //   currentCategory = event.target.getAttribute('data-test');
  //   Session.set('guides', Guides.find({
  //     category: previousCategory
  //   }).fetch());
  //   // $("#defaultGuides").fadeOut(1000);
  //   $("#selectedGuides").fadeOut(1000);
  // },
  'click #categories': function(event, target) {
    currentCategory = event.target.getAttribute('data-test');
    console.log(currentCategory);
    Session.set('guides', Guides.find({
      category: currentCategory
    }).fetch());
    $("#defaultGuides").fadeOut(1000);
    // $("#selectedGuides").fadeOut(1000);
    $('#selectedGuides').hide();
    setTimeout(function() {
      $('#selectedGuides').fadeIn('slow');
    }, 800);
    previousCategory = currentCategory;
    // $("#selectedGuides").delay(3000).show();
  },
  'click #sCategories': function(event, target) {
    currentCategory = event.target.getAttribute('data-test');
    wantToScrollTo = '#' +event.target.getAttribute('data-target');
    // var plant = document.getElementById('categories');
    // var fruitCount = plant.getAttribute('data-cat'); // fruitCount = '12'
    // console.log(fruitCount);
    Session.set('products', Packages.find({
      title: currentCategory
    }).fetch());
    Session.set("currentCat", currentCategory);
    $("#displayProducts").show();
    if ($("div").hasClass("selectedCat")) {
      if ($(event.currentTarget).hasClass('selectedCat')) {
        $(event.currentTarget).removeClass('selectedCat');
      } else {
        $("div").removeClass("selectedCat");
        $(event.currentTarget).addClass('selectedCat');
      }
    } else {
      $(event.currentTarget).addClass('selectedCat');
    }
    prevDiv_terms = div_termsTop;
    prevScroll = prevWantToScrollTo;
    prevWantToScrollTo = wantToScrollTo;
    div_terms = $(wantToScrollTo).position();
    div_termsTop = div_terms.top;
    // console.log(div_termsTop);
    // console.log(prevDiv_terms);
    // console.log(prevScroll);
    // console.log(wantToScrollTo);
    if (prevScroll != wantToScrollTo) {
      // console.log(div_terms);
      // console.log(div_terms.top);
      // $(document).scrollTop( $(currentTarget).offset().top );
      // $('#selectedGuides').animate({scrollTop: div_terms.top}, "fast");
      $("#selectedGuides").scrollTo(wantToScrollTo,{offset:-500});
    }
  },
  'click #guideTitles': function(event, target) {
    currentCategory = event.target.getAttribute('data-test');
    // var plant = document.getElementById('categories');
    // var fruitCount = plant.getAttribute('data-cat'); // fruitCount = '12'
    // console.log(fruitCount);
    Session.set('guides', Guides.find({
      title: currentCategory
    }).fetch());
    Session.set("currentCat", currentCategory);
    $("#displayProducts").show();
    if ($("div").hasClass("selectedCat")) {
      if ($(event.currentTarget).hasClass('selectedCat')) {
        $(event.currentTarget).removeClass('selectedCat');
      } else {
        $("div").removeClass("selectedCat");
        $(event.currentTarget).addClass('selectedCat');
      }
    } else {
      $(event.currentTarget).addClass('selectedCat');
    }
  },
  'click .maincat': function(Event) {
    // console.log(prevStuff);
    // if (prevStuff != "") {
    //   $(prevStuff).toggleClass('fa-caret-right fa-caret-down');
    //   // $(prevStuff).removeclass("collapse");
    //   $(prevStuffCollapse).hide();
    //   $(prevStuffCollapse).toggleClass('collapse in');
    //   // console.log(prevStuffCollapse);
    //   $(stuffIndex).toggleClass('collapse in');
    // }
    var stuff = "#maincat"+ this.index + " i";
    // console.log(stuff);
    var stuffIndex = "#" + this.index;
    $(stuff).toggleClass('fa-caret-right fa-caret-down');
    // $(stuffIndex).toggleClass('collapse in');
    // $(stuffIndex).show();
    currentCategory = event.target.getAttribute('data-test');
    Session.set('guides', Guides.find({
      category: currentCategory
    }).fetch());
    $("#defaultGuides").fadeOut(1000);
    // $("#selectedGuides").fadeOut(1000);
    $('#selectedGuides').hide();
    setTimeout(function() {
      $('#selectedGuides').fadeIn('slow');
    }, 800);
    previousCategory = currentCategory;
    prevStuff = stuff;
    prevStuffCollapse = "#"+this.index;
    // $("#selectedGuides").delay(3000).show();
    // $(this).find('i').toggleClass('fa-caret-right fa-caret-down');
  }
})

Template.guides.helpers({
  categories: function() {
    return guideCategories();
  },
  titles: function(cat) {
    return addIndex(guideTitles(cat));
  },
  guides: function() {
    return Session.get('guides');
  },
  defaultGuides: function() {
    return Guides.find({
      category: "Exercise"
    }).fetch();
  },
  currentCategory: function() {
    curCategory = Session.get('guides');
    if (curCategory === undefined) {
      return "Exercise";
    } else {
      return curCategory[0].category;
    }
  }
});

Template.guides.onRendered(function() {
    // $("#defaultGuides").fadeIn(1000);
    $('[data-toggle="tooltip"]').tooltip();
    setTimeout(function() {
      $('#defaultGuides').fadeIn('fast');
    }, 1000);
  if(Session.get('guides')) {
    introJs().start().oncomplete(function(){
      Meteor.call('setTutorialDone','guides');
    }).onexit(function(){
      Meteor.call('setTutorialDone','guides');
    });
  }
});

guideCategories = function() {
  var hamper = Guides.find({}).fetch();
  var categories = [];
  if (hamper) {
    hamper.forEach(function(thing) {
      if (categories.indexOf(thing.category) === -1) {
        categories.push(thing.category);
      }
    });
  }
  return categories;
};

guideTitles = function(cat) {
  var hamper = Guides.find({
    category: cat
  }).fetch();
  var categories = [];
  if (hamper) {
    hamper.forEach(function(thing) {
      if (categories.indexOf(thing.title) === -1) {
        categories.push(thing.title);
      }
    });
  }
  return categories;
};
