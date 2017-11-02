//Routes
AccountsTemplates.configureRoute('changePwd', {
  name: 'changePwd',
  path: '/change',
  template: 'atFormTemplate',
  layoutTemplate: 'atFormLayout',
  yieldTemplate: 'atFormTemplate',
  redirect: '/dashboard'

});
AccountsTemplates.configureRoute('enrollAccount');

AccountsTemplates.configureRoute('forgotPwd', {
  name: 'forgot-password',
  path: '/forgotpassword',
  template: 'atFormTemplate',
  layoutTemplate: 'atFormLayout',
  yieldTemplate: 'atFormTemplate'
});

AccountsTemplates.configureRoute('resetPwd', {
  name: 'reset-password',
  path: '/resetpassword',
  template: 'atFormTemplate',
  layoutTemplate: 'atFormLayout',
  yieldTemplate: 'atFormTemplate'
});

AccountsTemplates.configureRoute('signIn', {
  name: 'login',
  path: '/login',
  template: 'atFormTemplate',
  layoutTemplate: 'atFormLayout',
  yieldTemplate: 'atFormTemplate',
  redirect: function() {
    var user = Meteor.user();
    if (user) {
      user.lastLoggedIn = new Date();
      if (user.roles) {
        Router.go('/admin');
      } else {
        if (user.hasOwnProperty('profile')) {

          if (user.profile.hasOwnProperty('duedate')) {
          Router.go('/dashboard');
        }
        else{
          Router.go('detailspage');
        }
        } else {
          Router.go('/detailspage');
        }
      }
    }
  }
});

AccountsTemplates.configureRoute('signUp', {
  name: 'register',
  path: '/sign-up',
  template: 'atFormTemplate',
  layoutTemplate: 'atFormLayout',
  yieldTemplate: 'atFormTemplate',
  redirect: function() {
    var user = Meteor.user();
    if (user) {
      if (user.roles) {
        Router.go('/admin');
      } else {
        if (user.hasOwnProperty('profile')) {
          if (user.profile.hasOwnProperty('duedate')) {
            Router.go('/dashboard');
          }
          else{
            Router.go('detailspage');
          }
        } else {
          Router.go('/detailspage');
        }
      }
    }
  }
});
AccountsTemplates.configureRoute('verifyEmail');

// Options
AccountsTemplates.configure({
  //defaultLayout: 'emptyLayout',
  showForgotPasswordLink: true,
  overrideLoginErrors: true,
  enablePasswordChange: true,
  sendVerificationEmail: false,

  //enforceEmailVerification: true,
  //confirmPassword: true,
  //continuousValidation: false,
  //displayFormLabels: true,
  //forbidClientAccountCreation: false,
  //formValidationFeedback: true,
  //homeRoutePath: '/',
  //showAddRemoveServices: false,
  //showPlaceholders: true,

  negativeValidation: true,
  positiveValidation: true,
  negativeFeedback: false,
  positiveFeedback: true,

  // Privacy Policy and Terms of Use
  //privacyUrl: 'privacy',
  //termsUrl: 'terms-of-use',
  texts: {
    errors: {
      loginForbidden: "error.accounts.Invalid Username/Password",
    },

    info: {
      emailSent: "Email has been sent!",
      pwdReset: "Password has been reset",
      pwdSet: "Password has been changed!",
    }

  }
});
