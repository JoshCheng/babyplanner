Session.set('counter', 0);
categoryChoice = "";

Template.shop.events({
  'click #sCategories': function(event, target) {
    currentCategory = event.target.getAttribute('data-test');
    // var plant = document.getElementById('categories');
    // var fruitCount = plant.getAttribute('data-cat'); // fruitCount = '12'
    // console.log(fruitCount);
    Session.set('products', Packages.find({
      name: currentCategory
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
  'click #addToBudget': function() {
    Meteor.call('postItemEvent','addToBudget',Meteor.userId(),this._id);
    // console.log(this);
    // currentName = this.productName;
    currentName = this.productName;
    if (Session.get(currentName) == undefined) {
      returnQ = 0;
      alert("Error: Unable to add product with quantity 0 to budget.")
    } else {
      returnQ = Session.get(currentName);
      var toInsert = {
        _id: this._id,
        categorys: this.categorys,
        name: this.name,
        productName: this.productName,
        thumbnail: this.thumbnail,
        price: this.price,
        productUrl: this.productUrl,
        isBasic: this.isBasic,
        isAdvanced: this.isAdvanced,
        isPremium: this.isPremium,
        quantity: returnQ
      };
      var contained;
      if (Meteor.user().profile.hasOwnProperty('packages')) {
        if (Meteor.user().profile.packages.hasOwnProperty('hamper')) {
          if (Meteor.user().profile.packages.hamper.hasOwnProperty('details')) {
            var details = Meteor.user().profile.packages.hamper.details;
            details.forEach(function(item) {
              if (item.productName === currentName) {
                item.quantity = parseInt(item.quantity) + returnQ;
                contained = true;
              }
            });
            if (!contained) {
              details.push(toInsert);
            }
            Meteor.users.update(Meteor.user()._id, {
              $set: {
                "profile.packages.hamper.details": details
              }
            });
          } else {
            console.log('pushing');
            Meteor.users.update(Meteor.user()._id, {
              $push: {
                "profile.packages.hamper.details": toInsert
              }
            });
          }
        }
      }
      var id = this._id
      Session.set(id, true);
      Meteor.setTimeout(function() {
        Session.set(id,false);
      }, 3000);
      Session.set(currentName, 0);
    }
  },
  'click .fa#minus': function() {
    minusQ = event.target.getAttribute('data-minus');
    if (Session.get(minusQ) == undefined) {
      Session.set(minusQ, 0);
    } else {
      if (Session.get(minusQ) <= 0) {

      } else {
        Session.set(minusQ, Session.get(minusQ) - 1);
      }
    }
    var counter = Session.get('counter');
    counter--;
    Session.set('counter', counter);
  },
  'click .fa#plus': function(event, target) {
    addQ = event.target.getAttribute('data-add');
    if (Session.get(addQ) == undefined) {
      Session.set(addQ, 1);
    } else {
      Session.set(addQ, Session.get(addQ) + 1);
    }
    var counter = Session.get('counter');
    counter++;
    Session.set('counter', counter);
  },
  'click .maincat': function(Event) {
    var stuff = "#maincat"+ this.index + " i";
    $(stuff).toggleClass('fa-caret-right fa-caret-down');
    // $(this).find('i').toggleClass('fa-caret-right fa-caret-down');
  }
});
Template.shop.onCreated(function(){
  var self = this;
  var placeHolder = [{
    productName: "Waiting for response from server..."
  }];
  self.recValue = new ReactiveVar(placeHolder);
  var allObjects = [];
  var toReturn = [];
  //Sends in a recommendation query request
  Meteor.call('recommendationGet', Meteor.userId(), function(error, res){
    if(error){
      console.log("error");
      var allItems = Packages.find({}).fetch();
      var range = allItems.length;
      for(var i = 1 ; i <= 3; i++){
        toReturn.push((allItems[Math.floor(Math.random() * range)]));
      }
      self.recValue.set(toReturn);
    }
    if(!res){
      console.log("no results");
    } else {
      var arr = res.data.itemScores;
      if (arr.length > 0){
        console.log(arr);
        for(var i = 0; i < arr.length; i++){
          allObjects.push(arr[i].item);
        };
        allObjects.forEach(function(objId){
          var eachObj = Packages.findOne({
            _id: objId
          });
          toReturn.push(eachObj);
        });
        self.recValue.set(toReturn);
      } else {
        var allItems = Packages.find({}).fetch();
        var range = allItems.length;
        for(var i = 1 ; i <= 3; i++){
          toReturn.push((allItems[Math.floor(Math.random() * range)]));
        }
        self.recValue.set(toReturn);
      }
    }
  });
});
Template.shop.helpers({
  recommendGet: function(){
    return Template.instance().recValue.get();
  },
  quantity: function() {
    currentName = this.productName;
    if (Session.get(currentName) == undefined) {
      returnQ = 0;
    } else {
      returnQ = Session.get(currentName);
    }
    return returnQ;
  },
  products: function() {
    return Session.get('products');
  },
  noOfProducts: function() {
    return Session.get('products').length;
  },
  categories: function() {
    return shopCategories();
  },
  sCategories: function(cat) {
    return subCategories(cat);
  },
  subsetOfBigCat: function() {
    subset = sCategories();
  },
  added: function() {
    return Session.get(this._id);
  },
  currentCat: function() {
    return Session.get('currentCat');
  }

});



shopCategories = function() {
  var hamper = Packages.find({}).fetch();
  var categories = [];
  if (hamper) {
    hamper.forEach(function(thing) {
      if (categories.indexOf(thing.categorys) === -1) {
        categories.push(thing.categorys);
      }
    });
  }
  return categories;
};

subCategories = function(cat) {
  var hamper = Packages.find({
    categorys: cat
  }).fetch();
  var categories = [];
  if (hamper) {
    hamper.forEach(function(thing) {
      if (categories.indexOf(thing.name) === -1) {
        categories.push(thing.name);
      }
    });
  }
  return categories;
};

Template.shop.onRendered(function() {
  $('[data-toggle="tooltip"]').tooltip();
  if(Session.get('shop')) {
    introJs().start().oncomplete(function(){
      Meteor.call('setTutorialDone','shop');
    }).onexit(function(){
      Meteor.call('setTutorialDone','shop');
    });
  }
});
