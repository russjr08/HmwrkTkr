/**
 * Created by russjr08 on 2/23/15.
 */

module.exports = function() {
    function Class() {
        this.name = null;
        this.teacher = null;
        this.color = null;

        this.save = function() {
            //console.log("YOU SAVED!");
        }
    }

    return { Class: Class };

};