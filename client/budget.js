/**
 * Created by derrickgoh on 30/8/15.
 */
//New stuff here
Template.addItem.events({
  'change #category': function(event) {
    $("#items").empty();
    var category = $('#category').selectpicker().val();
    var items = Packages.find({
      categorys: category
    }).fetch();
    var distinctArray = _.uniq(items, false, function(d) {
      return d.name
    });
    var items = _.pluck(distinctArray, 'name');
    items.forEach(function(item) {
      $("#items").append('<option>' + item + '</option');
    });
    $('#items').selectpicker("refresh");
  },
  'change #items': function(event) {
    $("#products").empty();
    var item = $('#items').selectpicker().val();
    var itemslist = Packages.find({
      name: item
    }).fetch();
    var distinctArray = _.uniq(itemslist, false, function(d) {
      return d.productName
    });
    var itemslist = _.pluck(distinctArray, 'productName');
    itemslist.forEach(function(item) {
      $("#products").append('<option>' + item + '</option');
    });
    $('#products').selectpicker("refresh");

  },
  'change #products': function(event) {
    var product = $('#products').selectpicker().val();
    var productList = Packages.find({
      productName: product
    }).fetch();
    $('#cost').val(productList[0].price);
  }
})
Template.addpackage.helpers({
  wardList: function() {
    if (Session.get('type') === 'normal') {
      return Public.find({
        type: 'Normal'
      }).fetch();
    } else if (Session.get('type') === 'cesarean') {
      return Public.find({
        type: 'Cesarean'
      }).fetch();
    }
  },
  privateWardList: function() {
    if (Session.get('type') === 'normal') {
      return Private.find({
        type: 'Normal'
      }).fetch();
    } else if (Session.get('type') === 'cesarean') {
      return Private.find({
        type: 'Cesarean'
      }).fetch();
    }
  },
  single: function() {
    return Session.get('single');
  }
});
Template.addItemPackage.events({
  'click #isBasic': function(event) {
    if ($("div").hasClass("selectedHamper")) {
      if ($(event.currentTarget).hasClass('selectedHamper')) {
        $(event.currentTarget).removeClass('selectedHamper');
      } else {
        $("div").removeClass("selectedHamper");
        $(event.currentTarget).addClass('selectedHamper');
      }
    } else {
      $(event.currentTarget).addClass('selectedHamper');
    }
  },
  'click #isAdvanced': function(event) {
    if ($("div").hasClass("selectedHamper")) {
      if ($(event.currentTarget).hasClass('selectedHamper')) {
        $(event.currentTarget).removeClass('selectedHamper');
      } else {
        $("div").removeClass("selectedHamper");
        $(event.currentTarget).addClass('selectedHamper');
      }
    } else {
      $(event.currentTarget).addClass('selectedHamper');
    }
  },
  'click #isPremium': function(event) {
    if ($("div").hasClass("selectedHamper")) {
      if ($(event.currentTarget).hasClass('selectedHamper')) {
        $(event.currentTarget).removeClass('selectedHamper');
      } else {
        $("div").removeClass("selectedHamper");
        $(event.currentTarget).addClass('selectedHamper');
      }
    } else {
      $(event.currentTarget).addClass('selectedHamper');
    }
  },
  'click #addButton': function(event) {
    if ($('.outside .selectedHamper').html()) {
      Session.set('selectedHamper', $('.outside .selectedHamper').attr('id'));
    }
    var id = Session.get('selectedHamper');
    var obj = {};
    obj[id] = true;
    var hamper = Packages.find(obj).fetch();
    hamper.forEach(function(details) {
      details.quantity = 1;
    });

    // if (Meteor.user().profile.hasOwnProperty('packages')) {
    //     if (Meteor.user().profile.packages.hasOwnProperty('hamper')) {
    //         if (Meteor.user().profile.packages.hamper.hasOwnProperty('details')) {
    //             var details = Meteor.user().profile.packages.hamper.details;
    //             if (details) {
    //                 details.forEach(function(detail) {
    //                     if (detail.extra) {
    //                         hamper.push(detail);
    //                     }
    //                 });
    //             }
    //
    //         }
    //     }
    // }
    if (id) {
      toInsert = {
        type: id,
        details: hamper
      }
    }
    if (toInsert) {
      Meteor.users.update(Meteor.user()._id, {
        $set: {
          "profile.packages.hamper": toInsert
        }
      });
    }
    Router.go('/budget');
  },
  'click #cancelButton': function(event) {
    Router.go('/budget');
  }
});
Template.addpackage.events({
  'click #normalType': function(event) {
    Session.set('type', 'normal');
  },
  'click #cesareanType': function(event) {
    Session.set('type', 'cesarean');
  },
  'click .pricing-table-public tbody tr .selectable': function(event) {
    if ($("td").hasClass("selectedBg")) {
      if ($(event.currentTarget).hasClass('selectedBg')) {
        $(event.currentTarget).removeClass('selectedBg');
      } else {
        $("td").removeClass("selectedBg");
        $(event.currentTarget).addClass('selectedBg');
      }
    } else {
      $(event.currentTarget).addClass('selectedBg');
    }
  },
  'click .pricing-table-private tbody tr .selectable': function(event) {
    if ($("td").hasClass("selectedBg")) {
      if ($(event.currentTarget).hasClass('selectedBg')) {
        $(event.currentTarget).removeClass('selectedBg');
      } else {
        $("td").removeClass("selectedBg");
        $(event.currentTarget).addClass('selectedBg');
      }
    } else {
      $(event.currentTarget).addClass('selectedBg');
    }
  },
  'click #addButton': function(event) {
    // console.log($(".pricing-table tbody tr .selectable .selectedBg"));
    var price;
    var wardType;
    var hospital;
    var type;
    var index;
    var rowIndex;
    var deliveryType;
    if ($('.pricing-table-public .selectedBg').html()) {
      $('.pricing-table-public .selectedBg').each(function() {
        price = $(this).html();
        index = $(this).index() + 1;
        var $tr = $(this).closest('tr');
        rowIndex = $tr.index() + 1;
        type = 'public';
        deliveryType = Session.get('type');
        wardType = $('.pricing-table-public thead td:nth-child(' + index + ')').html();
        hospital = $('.pricing-table-public tbody tr:nth-child(' + rowIndex + ') td:nth-child(1)').html();
        Session.set('selectedArray', [price, wardType, hospital, type, deliveryType, index, rowIndex]);
      });
    } else if ($('.pricing-table-private .selectedBg').html()) {
      $('.pricing-table-private .selectedBg').each(function() {
        price = $(this).html();
        index = $(this).index() + 1;
        var $tr = $(this).closest('tr');
        rowIndex = $tr.index() + 1;
        type = 'private';
        deliveryType = Session.get('type');
        wardType = $('.pricing-table-private thead td:nth-child(' + index + ')').html();
        hospital = $('.pricing-table-private tbody tr:nth-child(' + rowIndex + ') td:nth-child(1)').html();
        Session.set('selectedArray', [price, wardType, hospital, type, deliveryType, index, rowIndex]);
      });
    }
    if (price) {
      toInsert = {
        price: price,
        wardType: wardType,
        hospital: hospital,
        deliveryType: deliveryType,
        type: type,
        colIndex: index,
        rowIndex: rowIndex,
        quantity: 1
      }
    }
    if (toInsert) {
      Meteor.users.update(Meteor.user()._id, {
        $set: {
          "profile.packages.package": toInsert
        }
      });
    }
    Router.go('/budget');
  },
  'click #cancelButton': function(event) {
    Router.go('/budget');
  }
})
Template.addItemPackage.helpers({
  categories: function() {
    return categories();
  },
  products: function(category) {
    return Packages.find({
      categorys: category
    }).fetch();
  },
  hamperPrice: function(hamper) {
    var obj = {};
    obj[hamper] = true;
    var hamper = Packages.find(obj).fetch();
    var totalPrice = 0;
    hamper.forEach(function(item) {
      totalPrice += item.price;
    });
    return parseInt(totalPrice).toLocaleString();
  },
  single: function() {
    return Session.get('single');
  },
  any: function(value) {
    if (value.isBasic || value.isAdvanced || value.isPremium) {
      return true;
    }
  }
});
Template.addItemPackage.onRendered(function() {
  Tracker.afterFlush(getHighlight);
  Tracker.afterFlush(function() {
    if (document.URL.indexOf('add-itempackage') !== -1) {
      Session.set('single', true);
    }
  });
});
Template.packagesconfirm.events({
  'click #addButton': function(event) {
    var price;
    var wardType;
    var hospital;
    var type;
    var index;
    var rowIndex;
    var budget = document.getElementsByName("userbudget")[0].value;
    if ($('.pricing-table-public .selectedBg').html()) {
      $('.pricing-table-public .selectedBg').each(function() {
        price = $(this).html();
        index = $(this).index() + 1;
        var $tr = $(this).closest('tr');
        rowIndex = $tr.index() + 1;
        type = 'public';
        deliveryType = Session.get('type');
        wardType = $('.pricing-table-public thead td:nth-child(' + index + ')').html();
        hospital = $('.pricing-table-public tbody tr:nth-child(' + rowIndex + ') td:nth-child(1)').html();
        Session.set('selectedArray', [price, wardType, hospital, type, deliveryType, index, rowIndex]);
      });
    } else if ($('.pricing-table-private .selectedBg').html()) {
      $('.pricing-table-private .selectedBg').each(function() {
        price = $(this).html();
        index = $(this).index() + 1;
        var $tr = $(this).closest('tr');
        rowIndex = $tr.index() + 1;
        type = 'private';
        deliveryType = Session.get('type');
        wardType = $('.pricing-table-private thead td:nth-child(' + index + ')').html();
        hospital = $('.pricing-table-private tbody tr:nth-child(' + rowIndex + ') td:nth-child(1)').html();
        Session.set('selectedArray', [price, wardType, hospital, type, deliveryType, index, rowIndex]);
      });
    }
    if ($('.outside .selectedHamper').html()) {
      Session.set('selectedHamper', $('.outside .selectedHamper').attr('id'));
    }
    var id = Session.get('selectedHamper');
    var obj = {};
    obj[id] = true;
    var hamper = Packages.find(obj).fetch();
    hamper.forEach(function(details) {
      details.quantity = 1;
    });
    var toInsert;
    if (price && id) {
      toInsert = {
        package: {
          price: price,
          wardType: wardType,
          hospital: hospital,
          deliveryType: deliveryType,
          type: type,
          colIndex: index,
          rowIndex: rowIndex,
          quantity: 1
        },
        hamper: {
          type: id,
          details: hamper
        },
        budget: budget
      }
    } else if (id) {
      toInsert = {
        hamper: {
          type: id,
          details: hamper
        },
        budget: budget
      }
    } else if (price) {
      toInsert = {
        package: {
          price: price,
          wardType: wardType,
          hospital: hospital,
          deliveryType: deliveryType,
          type: type,
          colIndex: index,
          rowIndex: rowIndex,
          quantity: 1
        },
        budget: budget
      }
    }
    if (toInsert) {
      Meteor.users.update(Meteor.user()._id, {
        $set: {
          "profile.packages": toInsert
        }
      });
    }
    Router.go('/budget');
  },
  'click #cancelButton': function(event) {
    event.preventDefault();
    Router.go('/budget');
  }
});
Template.budgettable.events({
  'click #submit-dropdown': function(event) {
    event.preventDefault();
    var hospital = document.getElementById("hospital").value;
    var type = document.getElementById("type").value;
  },
  'click .addpackagediv': function(event) {
    bootbox.dialog({
      title: "Add Package",
      message: "<div id='dialogNode'></div>",
      onEscape: function() {},
      backdrop: true,
    });
    Blaze.render(Template.packagePopup, $("#dialogNode")[0]);
  },
  'click .editbudgetdiv': function(event) {
    bootbox.dialog({
      title: "Edit Budget",
      message: "<div id='dialogNode'></div>",
      onEscape: function() {},
      backdrop: true,
      buttons: {
        main: {
          label: "Edit",
          className: "btn-primary",
          callback: function() {
            var budget = $('#budget').val();
            if (budget) {
              Meteor.users.update(Meteor.user()._id, {
                $set: {
                  "profile.packages.budget": budget
                }
              });
              var floored = Math.floor(parseInt(budget) / 1000);
              //Meteor.call('postItemEvent','setBudget',Meteor.userId(), floored)
            }
          }
        }
      }
    });
    Blaze.render(Template.editbudget, $("#dialogNode")[0]);
  },
  'click .additemdiv': function(event) {
    $('.selectpickercat').selectpicker('val', 'Baby Care');
    $('.selectpicker').selectpicker('val', 'Baby Bathing Lotion');
    bootbox.dialog({
      title: "Add Item",
      message: "<div id='dialogNode'></div>",
      onEscape: function() {},
      backdrop: true,
      buttons: {
        main: {
          label: "Add",
          className: "btn-primary",
          callback: function() {
            if ($('#products').selectpicker().val()) {
              var productname = $('#products').selectpicker().val();
              var item = Packages.find({
                productName: productname
              }).fetch();
              toInsert = item[0];
            }
            if ($('#cost').val()) {
              var cost = $('#cost').val();
            }
            if ($('#quantity').val()) {
              var quantity = $('#quantity').val();
            }
            // if ($('#items').selectpicker().val()) {
            //   var item = Packages.find({
            //     name: name
            //   }).fetch();
            //   var id = item[0]._id;
            //   // var productUrl = item[0].productUrl
            // }
            // var toInsert = {
            //   _id: id,
            //   name: name,
            //   productName:productname,
            //   price: cost,
            //   categorys: category,
            //   quantity: quantity,
            //   productUrl
            //   extra: true
            // }
            var contained;
            if (Meteor.user().profile.hasOwnProperty('packages')) {
              if (Meteor.user().profile.packages.hasOwnProperty('hamper')) {
                if (Meteor.user().profile.packages.hamper.hasOwnProperty('details')) {
                  var details = Meteor.user().profile.packages.hamper.details;
                  details.forEach(function(item) {
                    if (item.productName === productname && item.price === cost) {
                      item.quantity = parseInt(item.quantity) + parseInt(quantity);
                      contained = true;
                    }
                    if (item.productName === productname && item.price !== cost) {
                      item.quantity = parseInt(item.quantity) + parseInt(quantity);
                      contained = true;
                      item.price = cost;
                    }
                  });
                  if (!contained) {
                    details.push(toInsert);
                  }
                  if (product && cost && quantity) {
                    toInsert.price = cost;
                    toInsert.quantity = quantity;
                    Meteor.users.update(Meteor.user()._id, {
                      $set: {
                        "profile.packages.hamper.details": details
                      }
                    });
                  } else {
                    alert("error");
                  }
                } else {
                  if (product && cost) {
                    toInsert.price = cost;
                    toInsert.quantity = quantity;
                    Meteor.users.update(Meteor.user()._id, {
                      $push: {
                        "profile.packages.hamper.details": toInsert
                      }
                    });
                  }
                }
              }
            }
          }
        }
      }
    });
    Blaze.render(Template.addItem, $("#dialogNode")[0]);
  },
  'click .delete': function(event) {
    var toDelete = 'profile.packages.package';
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      Meteor.call('deleteThing', toDelete, function(error, result) {
        if (error) {} else {}
      });
    }
  },
  'click .deleteThing': function(event, template) {
    var toDelete = 'profile.packages.hamper.details';
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      if (Meteor.user().profile.packages.hasOwnProperty('hamper')) {
        Meteor.call('deleteItem', toDelete, this._id, function(error, result) {
          if (error) {} else {}
        });
      }
    }
  },
  'click .deleteAll': function(event, template) {
      if (Meteor.user().profile.hasOwnProperty('packages')) {
        if (Meteor.user().profile.packages.hasOwnProperty('hamper')) {
          Meteor.call('deleteHamper', function(error, result) {
            if (error) {} else {}
          });
        }
        if (Meteor.user().profile.packages.hasOwnProperty('package')) {
          Meteor.call('deleteHospital', function(error, result) {
            if (error) {} else {}
          });
        }
      }
    }
    // 'click .export':function(e){
    //   var html = Blaze.toHTML(Template.budgetpdf);
    //   Meteor.pdf.save(html, 'My Budget');
    // }
});

Template.charts.onRendered(function() {
  Tracker.autorun(function() {
          var chart;
    var budget = userbudget();
    if (budget == 0) {
      Session.set('zerobudget', true);
    } else {
      Session.set('zerobudget', false);
      var price = totalPrice();
      var balance = budget - price;
      var percent = Template.charts.__helpers.get('percentage')() + "%";
      if (balance >= 0) {
        Session.set("overbudget",false);
        var budgetChart = [{
          key: "Total Spent",
          y: price
        }, {
          key: "Balance",
          y: balance
        }];
        nv.addGraph(function() {
          chart = nv.models.pieChart()
            .x(function(d) {
              return d.key
            })
            .y(function(d) {
              return d.y
            })
            .showLegend(false)
            .showLabels(true)

          d3.select("#test2")
            .datum(budgetChart)
            .transition().duration(1200)
            .call(chart);
          d3.select(".nv-pieChart")
            .attr("transform", "translate(20,0)")

          return chart;
        });
      }
      else{
        Session.set("overbudget",true);
        var budgetChart = [{
          key: "Total Spent",
          y: price
        }, {
          key: "Balance",
          y: balance
        }];
        nv.addGraph(function() {
          chart = nv.models.pieChart()
            .x(function(d) {
              return d.key
            })
            .y(function(d) {
              return d.y
            })
            .showLegend(false)
            .showLabels(true)
            .color(["#86aad2","#d25865"])

          d3.select("#test2")
            .datum(budgetChart)
            .transition().duration(1200)
            .call(chart);
          d3.select(".nv-pieChart")
            .attr("transform", "translate(20,0)")

          return chart;
        });
      }

    }
    categoriesArray = [];

    if (Meteor.user().profile.hasOwnProperty('packages')) {
      var allCategories = categoriesUser();
      var hamper = Meteor.user().profile.packages.hamper.details;
      allCategories.forEach(function(category) {
        var price = 0;
        if (hamper) {
          hamper.forEach(function(index) {
            if (index.categorys === category) {
              var getPrice = index.price.toString();
              if (getPrice.indexOf('$') != -1) {
                getPrice = getPrice.substring(1, price.length);
              }
              getPrice = parseInt(getPrice);
              price += getPrice
            }
          });
        }
        categoriesArray.push({
          key: category,
          y: price
        });
      });
    }

    var colors1 = ["#aa3840","#d25865","#ecc196","#d7e3f1","#86aad2","#efdaa2","#e29786","#ecd909","#f1c8e3","#d884a5","#e4d5c6"];
    var chart;
    nv.addGraph(function() {
      chart = nv.models.pieChart()
        .x(function(d) {
          return d.key
        })
        .y(function(d) {
          return d.y
        })
        .showLegend(true)
        .showLabels(true)
        .donut(true)
        .donutLabelsOutside(true)
        .color(colors1)
      d3.select("#test1")
        .datum(categoriesArray)
        .transition().duration(1200)
        .call(chart);
      d3.select(".nv-legendWrap")
        .attr("transform", "translate(0,330)")
      d3.select(".nv-pieChart")
        .attr("transform", "translate(20,0)")

      return chart;
    });

  });
});

Template.charts.helpers({
  percentage: function() {
    var budget = userbudget();
    var price = totalPrice();
    var percent = Math.round(price / budget * 10000) / 100;
    return percent;
  },
  zerobudget: function() {
    return Session.get('zerobudget', true);
  },
  overbudget:function(){
    return Session.get('overbudget');
  }
});

Template.packagePopup.events({
  'click #popup-addpackage': function(event) {
    bootbox.hideAll();
    Router.go('/budget/add-hospitalpackage');
  },
  'click #popup-additem': function(event) {
    bootbox.hideAll();
    Router.go('/budget/add-itempackage');
  }
});
Template.addpackage.onRendered(function() {
  if (document.getElementById('normalType').checked) {
    Session.set('type', 'normal');
  } else if (document.getElementById('cesareanType').checked) {
    Session.set('type', 'cesarean')
  }
  // hack to force the autorun to reevaluate
  // insert onRendered code here
  Tracker.afterFlush(getHighlight);
  Tracker.afterFlush(function() {
    if (document.URL.indexOf('add-hospitalpackage') !== -1) {
      Session.set('single', true);
    } else {
      Session.set('single', false);

    }
  });
});
Template.packages.onRendered(function() {
  if (document.getElementById('normalType').checked) {
    Session.set('type', 'normal');
  } else if (document.getElementById('cesareanType').checked) {
    Session.set('type', 'cesarean')
  }
  // hack to force the autorun to reevaluate
  // insert onRendered code here
  Tracker.afterFlush(getHighlight);

});

Template.budgettable.onRendered(function() {
  if (_.isFunction(window.callPhantom)) {
    Meteor.setTimeout(function() {
      window.callPhantom('takeShot');
    }, 500);
  }
});


Template.budgetinput.helpers({
  userbudget: function() {
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      if (Meteor.user().profile.packages.hasOwnProperty('budget')) {
        return Meteor.user().profile.packages.budget;
      }
    }
  }
});


Template.addItem.onRendered(function() {
  $('.selectpicker').selectpicker();
  var category = $('#category').selectpicker().val();
  var items = Packages.find({
    categorys: category
  }).fetch();

  var distinctArray = _.uniq(items, false, function(d) {
    return d.name
  });
  var disctinctValues = _.pluck(distinctArray, 'name');
  disctinctValues.forEach(function(item) {
    $("#items").append('<option>' + item + '</option');
  });
  $('#items').selectpicker("refresh");
  var item = $('#items').selectpicker().val();
  var itemname = Packages.find({
    name: item
  }).fetch();

  itemname.forEach(function(item) {
    $("#products").append('<option>' + item.productName + '</option');
  });
  $('#products').selectpicker("refresh");
  product = $('#products').selectpicker().val();
  var cost = Packages.find({
    productName: product
  }).fetch();
  $('#cost').val(cost[0].price);
});

Template.addItem.helpers({
  categories: function() {
    return categories();
  }
});

Template.editbudget.helpers({
  userbudget: function() {
    return userbudget();
  }
});
Template.budgetpdf.helpers({
  selectedHospital: function() {
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      var selectedPackage = Meteor.user().profile.packages.package;
      if (selectedPackage) {
        return selectedPackage.hospital;
      }
    }
  },
  selectedWard: function() {
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      var selectedPackage = Meteor.user().profile.packages.package;
      if (selectedPackage) {
        return selectedPackage.wardType;
      }
    }
  },
  selectedPrice: function() {
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      var selectedPackage = Meteor.user().profile.packages.package;
      if (selectedPackage) {
        return selectedPackage.price;
      }
    }
  },
  selectedType: function() {
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      var selectedPackage = Meteor.user().profile.packages.package;
      if (selectedPackage) {
        if (selectedPackage.deliveryType === 'normal') {
          return 'Normal';
        } else {
          return selectedPackage.type;
        }
      }
    }
  },
  selectedPackage: function() {
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      var selectedPackage = Meteor.user().profile.packages.package;
      if (selectedPackage) {
        return selectedPackage;
      }
    }
  },
  selectedQuantity: function() {
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      var selectedPackage = Meteor.user().profile.packages.package;
      if (selectedPackage) {
        return selectedPackage.quantity;
      }
    }
  },
  hamperDetails: function(category) {
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      var hamper = Meteor.user().profile.packages.hamper.details;
      var toReturn = [];
      if (hamper) {
        hamper.forEach(function(index) {
          if (index.categorys === category) {
            toReturn.push(index);
          }
        });
        return toReturn;
      }
    }
  },
  categories: function() {
    return categoriesUser();
  },
  totalQ: function() {
    var total = 0;
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      if (Meteor.user().profile.packages.hasOwnProperty('hamper')) {
        if (Meteor.user().profile.packages.hamper.hasOwnProperty('details')) {
          var hamper = Meteor.user().profile.packages.hamper.details;
          hamper.forEach(function(detail) {
            total += parseInt(detail.quantity);
          });
        }
      }
      if (Meteor.user().profile.packages.hasOwnProperty('package')) {
        total += parseInt(Meteor.user().profile.packages.package.quantity);
      }
      return total;
    }
  },
  totalPrice: function() {
    return totalPrice();
  },
  userbudget: function() {
    return userbudget();
  },
  price: function(quantity, price) {
    return Math.round(quantity * price * 100) / 100;
  },
  balance: function() {
    var price = userbudget() - totalPrice();
    if (price > 0) {
      Session.set('color', 'greenText');
    } else {
      Session.set('color', 'redText');
    }
    return Math.round(price * 100) / 100;
  },
  parent: function() {
    return Template.parentData();
  },
  color: function() {
    return Session.get('color');
  }
});

Template.budgettable.helpers({
  selectedHospital: function() {
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      var selectedPackage = Meteor.user().profile.packages.package;
      if (selectedPackage) {
        return selectedPackage.hospital;
      }
    }
  },
  selectedWard: function() {
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      var selectedPackage = Meteor.user().profile.packages.package;
      if (selectedPackage) {
        return selectedPackage.wardType;
      }
    }
  },
  selectedPrice: function() {
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      var selectedPackage = Meteor.user().profile.packages.package;
      if (selectedPackage) {
        return selectedPackage.price;
      }
    }
  },
  selectedType: function() {
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      var selectedPackage = Meteor.user().profile.packages.package;
      if (selectedPackage) {
        if (selectedPackage.deliveryType === 'normal') {
          return 'Normal';
        } else {
          return selectedPackage.type;
        }
      }
    }
  },
  selectedPackage: function() {
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      var selectedPackage = Meteor.user().profile.packages.package;
      if (selectedPackage) {
        return selectedPackage;
      }
    }
  },
  selectedQuantity: function() {
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      var selectedPackage = Meteor.user().profile.packages.package;
      if (selectedPackage) {
        return selectedPackage.quantity;
      }
    }
  },
  hamperDetails: function(category) {
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      var hamper = Meteor.user().profile.packages.hamper.details;
      var toReturn = [];
      if (hamper) {
        hamper.forEach(function(index) {
          if (index.categorys === category) {
            toReturn.push(index);
          }
        });
        return toReturn;
      }
    }
  },
  categories: function() {
    return categoriesUser();
  },
  totalQ: function() {
    var total = 0;
    if (Meteor.user().profile.hasOwnProperty('packages')) {
      if (Meteor.user().profile.packages.hasOwnProperty('hamper')) {
        if (Meteor.user().profile.packages.hamper.hasOwnProperty('details')) {
          var hamper = Meteor.user().profile.packages.hamper.details;
          hamper.forEach(function(detail) {
            total += parseInt(detail.quantity);
          });
        }
      }
      if (Meteor.user().profile.packages.hasOwnProperty('package')) {
        total += parseInt(Meteor.user().profile.packages.package.quantity);
      }
      return total;
    }
  },
  totalPrice: function() {
    return totalPrice();
  },
  userbudget: function() {
    return userbudget();
  },
  price: function(quantity, price) {
    return Math.round(quantity * price * 100) / 100;
  },
  balance: function() {
    var price = userbudget() - totalPrice();
    if (price > 0) {
      Session.set('color', 'greenText');
    } else {
      Session.set('color', 'redText');
    }
    return Math.round(price * 100) / 100;
  },
  parent: function() {
    return Template.parentData();
  },
  color: function() {
    return Session.get('color');
  }
});
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
          console.log(type);
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
