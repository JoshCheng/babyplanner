//http://localhost:7070/events.json?accessKey=yourAccessKeyString
var accessKey = "k2vlq88kb4qXrlJTQF905F5qdqzrNMUZ14Xh16ao9H2309FjQwg90f5w0XnWez3Q";
var deployKey = "EBfRKm9tHYdE0T0GQl2mbDPOZdv78rkoMSgsXrAG00xltBLKtuGuXzF1YH0P6xH6";
//var toGo = "http://localhost:7070/events.json?accessKey=" + accessKey;
var toQuery = "http://baby-planner.cloudapp.net:8000/queries.json"
var toGo = "http://baby-planner.cloudapp.net:7070/events.json?accessKey=" + deployKey;
Meteor.methods({
  setTutorialDone: function(tutorial){
    var t = tutorial;
    var field_name = "profile." + t;
    var update = { "$set" : { } };
    update["$set"][field_name] = true;
    Meteor.users.update({ "_id" : Meteor.userId() }, update)
  },
  recommendationGet: function(userId){
    var event = {
      user: userId
    };
    var someRec = HTTP.post(toQuery, {
      headers: "Content-Type: application/json",
      data: event
    });
    return someRec;
  },
  postItemEvent: function(eventName, userId, objectId){
    var date = new Date();
    var event = {
      event: eventName,
      entityType: "user",
      entityId: userId,
      targetEntityType: "item",
      targetEntityId: objectId,
      eventTime: date
    };
    HTTP.post(toGo, {
      headers: "Content-Type: application/json",
      data: event
    });
  },
  setItemProperty: function(itemId, itemProperties){
    var date = new Date();
    var event = {
      event: "$set",
      entityType: "item",
      entityId: itemId,
      properties: itemProperties,
      eventTime: date
    };
    HTTP.post(toGo, {
      headers: "Content-Type: application/json",
      data: event
    });
  },
  setUserProperty: function(eventName ,userId, objectId){
    var date = new Date();
    var event = {
      event: eventName,
      entityType: "user",
      entityId: userId,
      targetEntityType: "item",
      targetEntityId: objectId,
      eventTime: date
    };
    HTTP.post(toGo, {
      headers: "Content-Type: application/json",
      data: event
    });
  },
  getRecommend: function(userId, numberRet){
    this.unblock();
    HTTP.post(toQuery,{
      headers: "Content-Type: application/json",
      data: {
        "user": userId,
        "num": numberRet
      }
    });
  },
  upsertPhoto: function(fileObj, arrayIndex) {
    var userId = Meteor.userId();
    var photoArray = Meteor.user().profile.image;
    photoArray[arrayIndex] = "/cfs/files/images/" + fileObj._id;
    var imagesURL = {
      "profile.image": photoArray
    };
    Meteor.users.update({
      _id: userId
    }, {
      $set: imagesURL
    });
  },
  changeEmail: function(newEmail) {
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "emails": [{
          address: newEmail
        }]
      }
    });
  },
  deleteThing: function(toDelete) {
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $unset: {
        "profile.packages.package": ""
      }
    });
  },
  deleteItem: function(toDelete, id) {
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $pull: {
        'profile.packages.hamper.details': {
          _id: id
        }
      }
    });
  },
  deleteHamper: function() {
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      if (Meteor.user().profile.packages.hasOwnProperty('hamper')) {
        Meteor.users.update({
          _id: Meteor.user()._id
        }, {
          $unset: {
            'profile.packages.hamper.details': [],
            'profile.packages.hamper.type' : ""
          }
        });
      }
    }
  },
  deleteHospital: function() {
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      if (Meteor.user().profile.packages.hasOwnProperty('package')) {
        Meteor.users.update({
          _id: Meteor.user()._id
        }, {
          $unset: {
            'profile.packages.package': ""
          }
        });
      }
    }
  },
  massRelay: function(fileObj) {
    Meteor.users.update({
      id: Meteor.userId()
    }, {
      $set: {
        "profile.image": fileObj
      }
    });
  },
  setGender: function(newGender) {
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "profile.babyGender": [newGender]
      }
    });
  },
  setContractionTracker: function(date, time,time2,duration,f) {
    var array = Meteor.user().profile.contractions;
    var toAdd = {
      startDate: date,
      startTime: time,
      endTime: time2,
      totalDuration: duration,
      frequency: f
    };
    array.push(toAdd)
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "profile.contractions": array
      }
    });
  },
  setKickTracker: function(date, time,duration,kicks) {
    var array = Meteor.user().profile.kicks;
    var toAdd = {
      startDate: date,
      startTime: time,
      totalDuration: duration,
      noOfKicks: kicks
    };
    array.push(toAdd)
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "profile.kicks": array
      }
    });
  },
  contractionError: function(date, time,time2,duration,f) {
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "profile.contractions": [{
          startDate: date,
          startTime: time,
          endTime: time2,
          totalDuration: duration,
          frequency: f
        }]
      }
    });
  },
  kickError: function(date,time,duration,kicks) {
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "profile.kicks": [{
          startDate: date,
          startTime: time,
          totalDuration: duration,
          noOfKicks: kicks
        }]
      }
    });
  },
  deleteContraction: function(array) {
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "profile.contractions": array
      }
    });
  },
  deleteKick: function(array) {
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "profile.kicks": array
      }
    });
  },
  deleteEntry: function(date){
    Entries.update({ user : Meteor.userId()},
      {$pull : {'posts.$.dayposts' : {'date' : date}}});
  },
  deleteSpecificKick: function(startDate) {
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $pull: {
        "profile.kicks": {
          startDate: startDate
        }
      }
    });
  },
  deleteSpecificContraction: function(startDate) {
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $pull: {
        "profile.contractions": {
          startDate: startDate
        }
      }
    });
  },
  deleteSpecificCarousel: function(index) {
    var array = Meteor.user().profile.image;
    var toAdd = "/img/stockpregnant.jpg";
    array[index] = toAdd;
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "profile.image": array
      }
    });
  },
  addSelfieCarousel: function(index, data) {
    var array = Meteor.user().profile.image;
    // console.log(index + " + " + data);
    var toAdd = data;
    array[index] = toAdd;
    // console.log(array);
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "profile.image": array
      }
    });
  },
  setContractionTracker: function(date, time,time2,duration,f) {
    var array = Meteor.user().profile.contractions;
    var toAdd = {
      startDate: date,
      startTime: time,
      endTime: time2,
      totalDuration: duration,
      frequency: f
    };
    array.push(toAdd)
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "profile.contractions": array
      }
    });
  },
  setKickTracker: function(date, time,duration,kicks) {
    var array = Meteor.user().profile.kicks;
    var toAdd = {
      startDate: date,
      startTime: time,
      totalDuration: duration,
      noOfKicks: kicks
    };
    array.push(toAdd)
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "profile.kicks": array
      }
    });
  },
  contractionError: function(date, time,time2,duration,f) {
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "profile.contractions": [{
          startDate: date,
          startTime: time,
          endTime: time2,
          totalDuration: duration,
          frequency: f
        }]
      }
    });
  },
  kickError: function(date,time,duration,kicks) {
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "profile.kicks": [{
          startDate: date,
          startTime: time,
          totalDuration: duration,
          noOfKicks: kicks
        }]
      }
    });
  },
  deleteContraction: function(array) {
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "profile.contractions": array
      }
    });
  },
  deleteKick: function(array) {
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {
        "profile.kicks": array
      }
    });
  }
});
