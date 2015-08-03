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
var nameInput = $("#studentName").val();
var courseInput = $("#course").val();
var gradeInput = $("#studentGrade").val();
/**
 * addClicked - Event Handler when user clicks the add button
 */
function addClicked(){
    addStudent();
}
/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked(){
    $("#studentName").val("");
    $("#course").val("");
    $("#studentGrade").val("");
}
/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent(){
    var newStudent = {};
    if((nameInput === '')||(courseInput === '')||(gradeInput === '')) {
        alert('Invalid Input');
        cancelClicked();
    }
    newStudent.studentName = nameInput;
    newStudent.studentCourse = courseInput;
    newStudent.studentGrade = gradeInput;
    $(student_array).push(newStudent);
}
/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm(){}
/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage(){}
/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData(){}
/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList(){
    for(var i = 0; i < student_array.length; i++){

    }
}
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom(){
    var stuName = $('<div>',{
        text: newStudent.studentName
    });
    var stuCourse = $('<div>',{
        text: newStudent.studentCourse
    });
    var stuGrade = $('<div>',{
        text: newStudent.studentGrade
    });
    $(".student_list tbody").append(stuName, stuCourse, stuGrade);
}
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset(){}

/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(reset());