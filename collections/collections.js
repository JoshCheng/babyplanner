Weekly = new Mongo.Collection("weekly");
Guides = new Mongo.Collection("guides");
timerList = new Mongo.Collection('timer');
kickList = new Mongo.Collection('kick');
packageList = new Mongo.Collection('packageList');
userPackageList = new Mongo.Collection('userPackageList');
BudgetList = new Mongo.Collection('budget');
Public = new Mongo.Collection('services');
Entries = new Mongo.Collection('entries');
Journal = new Mongo.Collection('journal');
Private = new Mongo.Collection('private');
Packages = new Mongo.Collection('package');
Posts = new Mongo.Collection('posts');
headSizeTable = new Mongo.Collection('head');
weightTable = new Mongo.Collection('weight');
Tooltips = new Mongo.Collection('tooltips');

var Schemas = {};

Schemas.Tooltips = new SimpleSchema({
  title: {
    type: String,
    label: "Title of Tooltip"
  },
  description:{
    type: String,
    label: "Description of Tooltip"
  }
});

Schemas.Packages = new SimpleSchema({
  categorys: {
    type: String,
    allowedValues: ['Baby Care', 'Bottle Feeding', 'BreastFeeding', 'Baby Potty', 'Clothes','Furniture','Safety','Sleep','Toys','Travel'],
    label: "Category of the product"
  },
  name: {
    type: String,
    label: "Sub-category of product",
    allowedValues: ['Baby Bath Oil', 'Baby Bathing Lotion', 'Baby Body Wash', 'Baby Laundry Detergent', 'Baby Shampoo',
      'Baby Thermometer', 'Nasal Aspirator', 'Safety Nail Clippers', 'Soft Sponge', 'Tub', 'Bibs', 'Bottle Teats',
      'Bottles', 'Baby Milk Powder', 'Bottle Brush', 'Bottle Warmer', 'Steriliser Kit', 'Nursing Bra', 'Breast Pads',
      'Breast Milk Storage Bags', 'Breast Pump', 'Feeding Pillow', 'Nipple Cream', 'Privacy Shawl', 'Baby Wipes',
      'Changing Mat', 'Diapers', 'Fleece Outfit', 'Jacket', 'Mittens', 'Sweater', 'Caps', 'Swaddle Blankets',
      'Cardigans', 'Pyjamas', 'Pairs of Socks', 'Bouncer Seat', 'Changing Table', 'Baby Cot', 'High Chair', 'Infant Swing',
      'Baby Monitor', 'Carbon Monoxide Detector', 'Fever Reducer', 'First Aid Kit', 'Medicine Spoon', 'Smoke Alarm', 'Activity Mat',
      'Baby Soft Books', 'Bath Toys', 'Cuddly Toys', 'Pacifier', 'Rattle', 'Front Carrier', 'Infant Car Seat', 'Stroller With Full Recline',
      'Travel Bag', 'Travel Baby Cot'],
  },
  productName:{
    type:String,
    label: "Name of Product"
  },
  thumbnail: {
    type: String,
    label: "Photo of Product",
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images',
        label: 'Choose File',
      }
    },
    optional: true
  },
  price: {
    type: Number,
    label: "Price of the product",
    decimal: true
  },
  productUrl:{
    type: String,
    label: "Url of the product"
  },
  tags: {
    type: [String],
    label: "Tags",
    optional: true
  },
  isBasic: {
    type: Boolean,
    label: "Is it basic"
  },
  isAdvanced: {
    type: Boolean,
    label: "Is it advanced"
  },
  isPremium: {
    type: Boolean,
    label: "Is it premium"
  },
});

Schemas.Private = new SimpleSchema({
  type: {
    type: String,
    label: "The type of service",
    allowedValues: ["Normal", "Cesarean"],
  },
  //Once again need to fix the names of hospitals so can dropdownlist
  hospital: {
    type: String,
    label: "Name of hospital",
    allowedValues: ["Gleneagles Hospital", "Mount Alvernia Hospital", "Mount Elizabeth Hospital",
      "Mount Elizabeth Novena Hospital", "Parkway East Hospital", "Raffles Hospital",
      "Thomson Medical Centre"],
  },
  priceOneBed : {
    type: Number,
    label: "Price of the service One Bed"
  },
  priceTwoBed : {
    type: Number,
    label: "Price of the service Two Bed"
  },
  priceFourBed : {
    type: Number,
    label: "Price of the service Four Bed"
  },
});
Schemas.Journal = new SimpleSchema({
  symptom: {
    type: [String],
    label: "All the symptoms for Journal",
  },
  moods: {
    type: [String],
    label: "All the moods for Journal"
  }
});

Schemas.Entries = new SimpleSchema({
  post:{
    type:[Object],
    label: "Each post object added by the user to his/her journal"
  },
  "post.$.createdAt": {
    type: Date,
    label: 'Date',
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  "post.$.symptom": {
    type: [Object],
    optional: true
  },
  "post.$.mood":{
    type: [Object],
    optional: true
  },
  "post.$.craving":{
    type: [Object],
    optional: true
  },
  "post.$.weight":{
    type: Number,
    optional: true
  }
});

Schemas.Budget = new SimpleSchema({
  custom : {
    type: [Object],
    label: "Custom objects added by the user"
  },
  "custom.$.name": {
    type: String
  },
  "custom.$.cost": {
    type: Number
  },
  "custom.$.category" : {
    type: String
    //allowedValues: []
  },
  allservices : {
    type: [Schemas.Services],
    label: "All the services that the consumer have put in"
  },
  "allservices.dateAdded" : {
    type: Date,
    label: "Date the service was added",
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  "allservices.isPackage" : {
    type: Boolean,
    label: "Is the service a package"
  }
});

Schemas.Public = new SimpleSchema({
  //Need to ask Jiacheng/Chan to give us the fixed types there are for this
  //So that I can do a dropdown list in CMS
  //As of now type is like CSection, Normal Delivery etc yknow.
  type: {
    type: String,
    label: "The type of service",
    allowedValues: ["Normal", "Cesarean"],
  },
  //Once again need to fix the names of hospitals so can dropdownlist
  hospital: {
    type: String,
    label: "Name of hospital",
    allowedValues: ["KK Women's and Children's Hospital", "National University Hospital", "Singapore General Hospital"],
  },
  priceWardA : {
    type: Number,
    label: "Price of the service Ward A"
  },
  priceWardB1 : {
    type: Number,
    label: "Price of the service Ward B1"
  },
  priceWardB2plus : {
    type: Number,
    label: "Price of the service Ward B2+"
  },
  priceWardB2 : {
    type: Number,
    label: "Price of the service Ward B2"
  },
  priceWardC : {
    type: Number,
    label: "Price of the service Ward C"
  }
  //price90: {
  //  type: Number,
  //  label: "Price of the service at 90th percentile"
  //},
  //avglength: {
  //  type: Number,
  //  label: "Average length of stay (only for wards)",
  //}
});


Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images", {
    filter: {
      allow: {
        extensions: ['png','jpg'] //allow only images in this FS.Collection
      },
      onInvalid: function (message) {
        if (Meteor.isClient) {
          alert(message);
        } else {
          console.log(message);
        }
      }
  }})]
});
Schemas.Week = new SimpleSchema({
  week: {
    type: Number,
    label: "Number of the Week",
    min: 1
  },
  whathap: {
    type: String,
    autoform: {
      rows: 5
    }
  },
  symptoms: {
    type: [String],
    label: "Symptoms"
  },
  //Looking to put file/photo here. Placeholder sort of in the meantime
  //until I get CollectionFS to work.
  babyphoto: {
    type: String,
    label: "Baby Photo",
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images',
        label: 'Choose File',
      }
    }
  },
  photodesc: {
    type: String,
    label: "Photo Description",
    autoform: {
      rows: 5
    }
  },
  whathapbaby: {
    type: String,
    autoform: {
      rows: 5
    }
  },
  createdAt: {
    type: Date,
    label: 'Date',
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  createdBy: {
    type: String,
    label: 'created by',
    autoValue: function() {
      return Meteor.userId();
    }
  },
});
Schemas.Guide = new SimpleSchema({
  category:{
    type: String,
    label: "Category of Guide",
    allowedValues: ["Exercise","Diet","Health","Labour"]
  },
  title: {
    type: String,
    label: "Title",
    max: 200
  },
  url: {
    type: String,
    label: "URL",
    autoform: {
      rows: 1
    }
  },
  createdAt: {
    type: Date,
    label: 'Date',
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  createdBy: {
    type: String,
    label: 'created by',
    autoValue: function() {
      return Meteor.userId();
    }
  },
});

Tooltips.attachSchema(Schemas.Tooltips);
Packages.attachSchema(Schemas.Packages);
Private.attachSchema(Schemas.Private);
Journal.attachSchema(Schemas.Journal);
//Operations.attachSchema(Schemas.Operations);
Public.attachSchema(Schemas.Public);
BudgetList.attachSchema(Schemas.Budget);
Weekly.attachSchema(Schemas.Week);
Guides.attachSchema(Schemas.Guide);
//Products.attachSchema(Schemas.Product);
