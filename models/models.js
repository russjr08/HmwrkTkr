/**
 * Created by russjr08 on 2/23/15.
 */

module.exports = function() {
    function Class() {
        this.name = null;
        this.teacher = null;
        this.owner = null;

        this.assignments = [];

        this.color = null;

        this.save = function(db) {
            db.insert({name: this.name, teacher: this.teacher, owner: this.owner, color: this.color, assignments: []});
        }
    }

    function Assignment() {
        this.name = null;
        this.details = null;
        this.completed = false;
    }

    return { Class: Class, Assignment: Assignment };

};