import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';

import './task.html'

Template.task.helpers({
  isOwner(){
    return this.owner === Meteor.userId();
  },
  //for privatizing innappropriate public goals, and deleting repeat
  //publications of innappropriate goals. (Not actually expecting a huge problem)
  //I cannot view or change private goals.
  isDeveloper(){
    return Meteor.user().username === "sjmosley";
  },
});

Template.task.events({
  'click .toggle-checked'(){
    Meteor.call('tasks.setChecked', this._id, !this.checked);
  },
  'click .delete'(){
    Meteor.call('tasks.remove', this._id);
  },
  'click .toggle-private'(){
    Meteor.call('tasks.setPrivate', this._id, !this.private);
  },
  'click .add-mine'(){
    Meteor.call('tasks.addMine', this._id);
  },
});
