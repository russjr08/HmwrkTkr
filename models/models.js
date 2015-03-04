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

        this.save = function() {
            //console.log("YOU SAVED!");
        }
    }

    function Assignment() {
        this.name = null;
        this.details = null;
        this.completed = false;
    }

    return { Class: Class };

};