/**
 * Define all global variables here
 */
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];
/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds = ['studentName', 'course', 'studentGrade'];

//On Document load look for click function
$(document).ready(function () {
    $("#addButton").click(function () {
        console.log('add button was clicked');
        addStudent();
    });
    $("#cancelButton").click(function(){
        console.log("cancel button was clicked");
        clearAddStudentForm();
    })
});

/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent() {

    //create new empty object
    var newStudentObj = {};

    //retrieve values from each input field
    for (var i = 0; i < inputIds.length; i++) {
        var id = inputIds[i];
        var input = $("#" + id);
        var val = input.val();
        if(val == ""){
            alert("Um... you missing something?");
            return;
        }
        newStudentObj[id] = val;
        //console.log(newStudentObj)
    }

    //add newly created object to the global student array
    var d = new Date();
    var n = d.getTime();
    newStudentObj.studentID = n;
    student_array.push(newStudentObj);
    //console.log("student_array after add",student_array);

    //clear values from form inputs
    clearAddStudentForm();

    //call function to update the visual data
    updateData();
}

/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm() {
    //loop through inputIds and empty the values
    for (var i = 0; i < inputIds.length; i++) {
        var id = inputIds[i];
        var input = $("#" + id);
        input.val("");
    }
}

/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage() {
    //define local variables for calculation
    var avg = 0;
    var total = 0;

    //loop through student array to get the student grades
    for (var i = 0; i < student_array.length; i++) {
        total += parseFloat(student_array[i]["studentGrade"]);
    }

    //divide the total student grades by the length of the student array
    avg = Math.round(total / student_array.length);

    return avg;
}

/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData() {

    //get calculated value and update the DOM with this value
    var average = calculateAverage();
    $('.avgGrade').html(average);

    //update student list
    updateStudentList();
}

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList() {

    //empty out the current student list
    $('.student-list tbody').html('');

    //when the student array is empty, update the student table with a message of "User Info Unavailable"
    if (student_array.length == 0) {
        var userUnavailableRow = $('<td>').attr("colspan", 5).append($('<h3>').html("User Info Unavailable"));
        $('.student-list tbody').html(userUnavailableRow);
    }

    //loop through student list and call addStudentToDom with each student object in the array
    for (var i = 0; i < student_array.length; i++) {
        var studentObj = student_array[i];
        if(student_array[i] != undefined){
        addStudentToDom(studentObj);
        }
    }
}

/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom(studentObj) {
    console.log("studentObj",studentObj)
    //create new row and all columns within the row with the studentObj values
    var ID = studentObj.studentID;
    var newTableRow = $('<tr id='+ID+'>');
    //doesn't have to be a loop but I like loops :)
    for(var index in studentObj){
        var val = studentObj[index];
        var newCol = $('<td>').html(val);
        newTableRow.append(newCol);
    }
    //create the operations column and action buttons inside
    var deleteBtn = $('<button>').html("Delete").addClass("btn btn-danger btn-sm").attr("onclick","deleteStudent("+studentObj+")");
    var operationsColumn = $('<td>').html(deleteBtn);

    //append operations column to the row
    newTableRow.append(operationsColumn);

    //append the new row to the .student-list body
    $('.student-list tbody').append(newTableRow);
}

function deleteStudent(studentObj){
    console.log("delete button clicked",studentObj);
    //delete object from array
    //delete from DOM
}

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {

    //empty student array
    student_array = [];

    //update the data now that student array is empty
    updateData();

    //clear addStudent Form
    clearAddStudentForm();
}


/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function () {
    reset();
});