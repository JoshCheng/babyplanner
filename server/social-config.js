  ServiceConfiguration.configurations.remove({
    service: 'facebook'
});

ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '416548341860596',
    secret: '5381c8a66c3fb2e7f9020a6a5c6440dd'
});

Meteor.users.allow({
 remove:function(){
  return true;
  }
})
