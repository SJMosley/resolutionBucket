import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';

export const Tasks = new Mongo.Collection('tasks');

Meteor.methods({
  sendEmail: function(to, subject, text){
    this.unblock();

    if (!Meteor.user())
      throw new Meteor.Error(403, “not logged in”);

    Email.send({
      to: to,
      from: Meteor.user().emails[0].address,
      subject: subject,
      text: text
    });
  },

  sendEmails: function(){
    var url = "";//deploy url
    for(var user in Meteor.users){
      var html = "<p>Hey " + user.username+ ",</br>"+
      "How have your tasks been going?"+ "</br>"+
      "If you have been doing well, go show others and <a href="">update your tasks!</a>"
      "</p><ul>Your Tasks:";

      //add list items to html
      for(var task in Tasks.find(user.userId)){
        html = html + "<li>" + task.text + "</li>";
      }
      //close off the list
      html = html + "</ul>";

      Email.send({
        to: user.emails[0].address,
        from: user.emails[0].address,
        subject: "How are you doing on your goals?",
        html: html
      });
    }

  },
});
