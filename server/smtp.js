if(Meteor.isServer){
  Meteor.startup(function () {
    smtp = {
      username: 'postmaster@babyplanner.meteor.com',   // eg: server@gentlenode.com
      password: '445d588fd95ccb9ea0d1f7fa8ddb51d5',   // eg: 3eeP1gtizk5eziohfervU
      server:   'smtp.mailgun.org',  // eg: mail.gandi.net
      port: 25
    }

    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
  });
}
