import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated(){
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks(){
    const instance = Template.instance();

    if(instance.state.get('hideCompleted')&& instance.state.get('onlyUser')){
      return Tasks.find({checked: {$ne: true}, owner: {$eq: Meteor.userId()}}, {sort: {createdAt: -1}});
    }

    if(instance.state.get('hideCompleted')){
      return Tasks.find({checked: {$ne: true}}, {sort: {owner: 1, createdAt: -1}});
    }
    if(instance.state.get('onlyUser')){
      return Tasks.find({owner: {$eq: Meteor.userId()}}, {sort: {createdAt: -1}});
    }

    return Tasks.find({}, {sort: {owner: 1, createdAt: -1}});

    //WORKS: //Tasks.find({owner: {$eq: Meteor.userId()}}, {sort: {createdAt: -1}});

  },
  incompleteCount(){
    const instance = Template.instance();
    if(instance.state.get('onlyUser')){
      return Tasks.find({owner: {$eq: Meteor.userId()},checked: {$ne: true}}).count();
    }

    return Tasks.find({checked: {$ne: true}}).count();
  },
});

Template.body.events({
  'submit .new-task'(event){
    //prevent default form submit
    event.preventDefault();

    //get information from form
    const target = event.target;
    const text = target.text.value;

    Meteor.call('tasks.insert', text);

    //clear form
    target.text.value = '';
  },
  'change .hide-completed input'(event, instance){
    instance.state.set('hideCompleted', event.target.checked);
  },
  'change .only-user input'(event, instance){
    instance.state.set('onlyUser', event.target.checked);
  },
});
