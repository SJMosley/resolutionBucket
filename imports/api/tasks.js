import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if(Meteor.isServer){
  //runs only on server
  //publish only tasks user wants others to see
  Meteor.publish('tasks', function tasksPublication(){
    return Tasks.find({
      $or: [
        {private: {$ne: true}},
        {owner: this.userId},
      ],
    });
  });
}

Meteor.methods({
  //'tasks.insert'(type, text, current, max, recurrence){
  'tasks.insert'(text){
    check(text, String);

    //make sure user is logged in
    if(! this.userId){
      throw new Meteor.Error('not-authorized');
    }

    Tasks.insert({
      //type,
      text,
      createdAt: new Date(), //current time
      checked: false,
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      private: true,
      //current: 0;
      //max: 0;
      //recurrence: 'none';
    });
  },
  'tasks.remove'(taskId){
    check(taskId, String);

    const task = Tasks.findOne(taskId);
    if(task.private && task.owner !== this.userId){
      //only owner can delete task
      if(task.public && (Meteor.user().username === "sjmosley")){
          Tasks.remove(taskId);
      }
      else{
          throw new Meteor.Error('not-authorized');
      }
    }

    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked){
    check(taskId, String);
    check(setChecked, Boolean);

    const task = Tasks.findOne(taskId);
    if(task.owner !== this.userId){
      //ensure only owner can check off task
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, {$set: {checked: setChecked}});
  },
  'tasks.setPrivate'(taskId, setToPrivate){
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = Tasks.findOne(taskId);

    if(task.owner !== this.userId){
      if(Meteor.user().username === "sjmosley"){
          Tasks.update(taskId, {$set: {private: setToPrivate}});
      }
      else{
          throw new Meteor.Error('not-authorized');
      }
    }

    Tasks.update(taskId, {$set: {private: setToPrivate}});
  },
  'tasks.addMine'(taskId){
    check(taskId, String);

    const task = Tasks.findOne(taskId);

    Meteor.call('tasks.insert', task.text);
  }
});
