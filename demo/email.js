/* global cordova */
(function loadEmailModule () {
  function tr (x) { return x; }

  window.emailModule = {

    hasEmailPlugin: function (done) {
      return done(true);
      /*
      var that = this
      if (window.plugin && window.plugin.email) {
        // window.plugin.email.isAvailable(done);
        cordova.plugins.email.hasPermission(function (granted) {
          if (granted) {
            done(true)
          } else {
            that.alertErrorEmailPermission()
          }
        })
      } else {
        done(false)
      }
      */
    },

    alertErrorEmail: function () {
      if (window.navigator.notification) {
        navigator.notification.alert(
          tr('alert.email.message'), // message
          function () {}, // callback to invoke with index of button pressed
          tr('alert.email.title'), // title
          tr('close') // buttonName
        );
      }
    },

    alertErrorEmailPermission: function () {
      if (window.navigator.notification) {
        navigator.notification.alert(
          tr('alert.email.message.long'), // message
          function () {
          }, // callback to invoke with index of button pressed
          tr('permission-denied'), // title
          tr('close') // buttonName
        );
      }
    },

    openEmail: function (recipient, subject, body, attachments) {
      cordova.plugins.email.open({
        to: recipient,
        subject: subject,
        body: body,
        attachments: attachments
      });
    }

  };
})();
