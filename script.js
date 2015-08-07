/**
 * Define all global variables here
 */
var gradeAverage;
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];
/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var nameInput = '';
var courseInput = '';
var gradeInput = '';
/**
 * addClicked - Event Handler when user clicks the add button
 */
$(document).ready(function () {
    $("#addButton").click(function () {
        console.log('add button was clicked');
        addStudent();
    });
});
/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
$(document).ready(function () {
    $("#cancelButton").click(function () {
        clearAddStudentForm();
    })
})
/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent() {
    console.log('add student function was called');
    var newStudent = {};
    nameInput = $("#studentName").val();
    courseInput = $("#course").val();
    gradeInput = $("#studentGrade").val();
    //check if any of the inputs are blank, if they are then it will call the cancel function.
    if ((nameInput === '') || (courseInput === '') || (gradeInput === '')) {
        alert('Invalid Input Values');
        clearAddStudentForm();
    } else {
        newStudent.name = nameInput;
        newStudent.course = courseInput;
        newStudent.grade = gradeInput;
        student_array.push(newStudent)
    }
}
/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm() {
    $('#studentName').val("");
    $('#course').val("");
    $('#studentGrade').val("");
}
/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage() {
    var gradeSum = 0;
    for (var i = 0; i < student_array.length; i++) {
        console.log(student_array[i].grade);
        gradeSum += parseFloat(student_array[i].grade);
    }
    gradeAverage = gradeSum / student_array.length
}
/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData() {
    calculateAverage();
    updateStudentList();
}
/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList() {
    for (var k = 0; k < student_array.length; k++) {
        var htmlName = $('<td>',{
            text: student_array[k].name
        })
        var htmlCourse = $('<td>',{
            text: student_array[k].course
        })
        var htmlGrade = $('<td>',{
            text: student_array[k].grade
        })
        var newRow = $('<tr>',{
            'data-index': k
        })
        $('tr').append(htmlName,htmlCourse,htmlGrade);
        $('tbody').append(newRow);

    }
}
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom() {
    var stuName = $('<td>', {
        text: newStudent.name
    });
    var stuCourse = $('<td>', {
        text: newStudent.course
    });
    var stuGrade = $('<td>', {
        text: newStudent.grade
    });
    $(".student_list tbody").append(stuName, stuCourse, stuGrade);
}
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    student_array = [];
}

/**
 * Listen for the document to load and reset the data to the initial state
 */
//$(document).ready(reset());