/**
 * Define all global variables here
 */
var gradeAverage;
var newStudent = {};
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];
function checklist() {
    if (student_array.length > 0) {
        $('#blankTable').hide()
    } else {
        $('#blankTable').show()
    }
};
/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var nameInput = '';
var courseInput = '';
var gradeInput = '';
var uniqueID = 0;

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
    newStudent = {};
    nameInput = $("#studentName").val();
    courseInput = $("#course").val();
    gradeInput = $("#studentGrade").val();
    //check if any of the inputs are blank, if they are then it will call the cancel function.
    //And alert the user.
    if ((nameInput === '') || (courseInput === '') || (gradeInput === '') || (gradeInput < 0) || (gradeInput > 100)) {
        alert('Invalid Input Values');
        clearAddStudentForm();
    } else {
        newStudent.name = nameInput;
        newStudent.course = courseInput;
        newStudent.grade = gradeInput;
        newStudent.ID = uniqueID++;
        student_array.push(newStudent);
        $('tbody').empty();
        updateData();
        calculateAverage();
    }
    //After a new student has been added we call the clear inputs function to clear the input fields
    clearAddStudentForm();
}
/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm() {
    console.log('Input fields have been cleared');
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
        gradeSum += parseFloat(student_array[i].grade);
    }
    gradeAverage = gradeSum / student_array.length;
    //Here I check if the average is a number or not. If it is Not A Number(NaN returns true)
    //I set a default value of 0 to the average.
    if (isNaN(gradeAverage) == true) {
        gradeAverage = 0;
    }
    $('.avgGrade').empty();
    $('.avgGrade').text(gradeAverage.toFixed(1));

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
        var htmlName = $('<td>', {
            text: student_array[k].name
        })
        var htmlCourse = $('<td>', {
            text: student_array[k].course
        })
        var htmlGrade = $('<td>', {
            text: student_array[k].grade
        })
        var newRow = $('<tr>', {
            'data-index': student_array[k].ID
        })
        var delTD = $('<td>', {
            class: 'delTD',
        })
        var delButton = $('<button>', {
            type: 'button',
            class: 'btn btn-danger delButton btn-xs',
            'data-index': student_array[k].ID,
            text: 'Remove',
            onclick: 'deleteStudent(' + student_array[k].ID + ')'
        })
        $('tbody').append(newRow);
        $(newRow).append(htmlName, htmlCourse, htmlGrade, delTD);
        $(delTD).append(delButton);

        checklist();
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
    $('tr').append(stuName, stuCourse, stuGrade);
    $('tbody').append(stuName, stuCourse, stuGrade);
}
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    console.log('document has been reset');
    gradeAverage;
    newStudent = {};
    clearAddStudentForm()
    student_array = [];
    checklist();

}

/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(reset());


/**
 * Remove Student Button
 **/
function deleteStudent(objectID) {
    for (var j = 0; j < student_array.length; j++) {
        if (student_array[j].ID == objectID) {
            console.log('It\'s uniqueID is: ' + student_array[j].ID)
            student_array.splice(j, 1);
        }
    }
    console.log(student_array);
    $('tr[data-index="' + objectID + '"]').remove();
    calculateAverage();
    checklist();
}