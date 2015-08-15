var gradeAverage;
var newStudent = {};
var uniqueID;
var nameInput = '';
var courseInput = '';
var gradeInput = '';
var student_array = [];
var jsonData;
var sortObj = {};

//on document load
$(document).ready(function () {
    //function call to check if the table is empty
    checklist();
    getData();
    $("#addButton").click(function () {
        console.log('add button was clicked');
        addStudent();
    });
    $('#addButton').keyup(function (e) {
        //alert(e.keyCode);
        if (e.keyCode == 13) {
            alert('Enter key was pressed.');
        }
    });
    $("#cancelButton").click(function () {
        clearAddStudentForm();
    });
    $("#name_header").click(function () {
        $("#course_arrow").html("");
        $("#grade_arrow").html("");
        sortObj.focus = "name";
        var arrow = $("#name_arrow").html();
        if (arrow == "" || sortObj.direction == "up") {
            $("#name_arrow").html("&#9660");
            sortObj.direction = "down";
        }
        else {
            $("#name_arrow").html("&#9650");
            sortObj.direction = "up";
        }
        sortTable();
    });
    $("#course_header").click(function () {
        $("#name_arrow").html("");
        $("#grade_arrow").html("");
        sortObj.focus = "course";
        var arrow = $("#course_arrow").html();
        if (arrow == "" || sortObj.direction == "up") {
            $("#course_arrow").html("&#9660");
            sortObj.direction = "down";
        }
        else {
            $("#course_arrow").html("&#9650");
            sortObj.direction = "up";
        }
        sortTable();

    });
    $("#grade_header").click(function () {
        $("#name_arrow").html("");
        $("#course_arrow").html("");
        sortObj.focus = "grade";
        var arrow = $("#grade_arrow").html();
        if (arrow == "" || sortObj.direction == "up") {
            $("#grade_arrow").html("&#9660");
            sortObj.direction = "down";
        }
        else {
            $("#grade_arrow").html("&#9650");
            sortObj.direction = "up";
        }
        sortTable();
    });

});

/******************************************************************
 Function Name: getData
 Parameters: none
 DataType:
 Return: downloads student data from learning fuze server and refreshes
 the table
 *******************************************************************/
function getData() {
    $.ajax({
        url: "http://s-apis.learningfuze.com/sgt/get",
        dataType: "json",
        error: function () {
            console.log('Error occured!');
        },
        success: function (result) {
            for (var i in result.data) {
                //console.log(result.data[i].hasOwnProperty('id','name','grade','course'))
                if (result.data[i].hasOwnProperty('id', 'name', 'grade', 'course')) {
                    student_array.push(result.data[i]);
                    jsonData = result;
                    console.log("Data Validated");
                }
                else {
                    console.log("Bogus Data")
                }
            }
            console.log("Server download Successful")
            sortTable();
        },
        complete: function () {
            //Schedule the next request when the current one's complete
            setTimeout(getData, 10000);
        }
    });
}


/******************************************************************
 Function Name: sendData
 Parameters: studentData, student object out of the student array
 DataType: object
 Return: uploads new student data to the learning fuze server
 *******************************************************************/
function sendData(studentData) {
    $.ajax({
        url: "http://s-apis.learningfuze.com/sgt/create",
        type: "POST",
        dataType: "json",
        data: studentData,
        success: function (data, textStatus, jqXHR) {
            //console.log("Data:",data);
            //console.log("TextStatus:",textStatus);
            //console.log("jqXHR:",jqXHR);
            if (data.success) {
                console.log("Sent Data was accepted")
                student_array.push(studentData);
                student_array[student_array.length - 1].id = data.new_id;
                createStudentDOM(student_array.length - 1);
                checklist();
            }
            else {
                alert("ajax Post no worky");
            }

        },
        error: function (jaXHF, textStatus, error) {
            alert("failure");
        }
    })
}

/******************************************************************
 Function Name: checklist
 Parameters: none
 DataType:
 Return: checks if the table is blank, if it is shows a message
 *******************************************************************/
function checklist() {
    if (student_array.length > 0) {
        $('#blankTable').hide()
    } else {
        $('#blankTable').show()
    }
};

/******************************************************************
 Function Name: addStudent
 Parameters: none
 DataType:
 Return: main add button function, directs functionallity
 *******************************************************************/
function addStudent() {
    addStudentToDom();
    clearAddStudentForm();
}

/******************************************************************
 Function Name: clearAddStudentForm
 Parameters: none
 DataType:
 Return: clears out in the info in the student form
 *******************************************************************/
function clearAddStudentForm() {
    console.log('Input fields have been cleared');
    $('#studentName').val("");
    $('#course').val("");
    $('#studentGrade').val("");
}

/******************************************************************
 Function Name: calculateAverage
 Parameters: none
 DataType:
 Return: loops through the student array and grabs all of the grades
 and averages them
 *******************************************************************/
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

/******************************************************************
 Function Name: updateData
 Parameters: none
 DataType:
 Return: refreshes all shown data
 *******************************************************************/
function updateData() {
    updateStudentList();
    calculateAverage();
    checklist();
}

/******************************************************************
 Function Name: updateStudentList
 Parameters: none
 DataType:
 Return: builds the table based on the student array
 *******************************************************************/
function updateStudentList() {
    $('tbody').empty();
    for (var k = 0; k < student_array.length; k++) {
        createStudentDOM(k);
    }
    checklist();
}

/******************************************************************
 Function Name: addStudentToDom
 Parameters: none
 DataType:
 Return: adds a single student to table and updates the student array
 *******************************************************************/
function addStudentToDom() {
    takeInputs();
    calculateAverage();
    checklist();
}

/******************************************************************
 Function Name: deleteStudent
 Parameters: object
 DataType:
 Return: deletes student DOM and deletes the student object from the
 student_array
 *******************************************************************/
function deleteStudent(objectID) {
    for (var j = 0; j < student_array.length; j++) {
        if (student_array[j].id == objectID) {
            console.log('It\'s uniqueID is: ' + student_array[j].id)
            student_array.splice(j, 1);
        }
    }
    //console.log(student_array);
    $('tr[data-index="' + objectID + '"]').remove();
    calculateAverage();
    checklist();
}

/******************************************************************
 Function Name: takeInputs
 Parameters: none
 DataType: number
 Return:
 *******************************************************************/
function takeInputs() {
    newStudent = {};
    nameInput = $("#studentName").val();
    courseInput = $("#course").val();
    gradeInput = $("#studentGrade").val();
    if ((nameInput === '') || (courseInput === '') || (gradeInput === '') || (gradeInput < 0) || (gradeInput > 150)) {
        alert('Invalid Input Values');

    } else {
        uploadStudent();

    }
}

/******************************************************************
 Function Name: creatStudentDOM
 Parameters: i, used to index the student array to grab info to
 be placed in the DOM
 DataType: number
 Return: DOM appended to the tbody
 *******************************************************************/
function createStudentDOM(i) {
    var htmlName = $('<td>', {
        text: student_array[i].name
    })
    var htmlCourse = $('<td>', {
        text: student_array[i].course
    })
    var htmlGrade = $('<td>', {
        text: student_array[i].grade
    })
    var newRow = $('<tr>', {
        'data-index': student_array[i].id
    })
    var delTD = $('<td>', {
        class: 'delTD',
    })
    var delButton = $('<button>', {
        type: 'button',
        class: 'btn btn-danger delButton btn-xs',
        'data-index': student_array[i].id,
        text: 'Remove',
        onclick: 'deleteStudent(' + student_array[i].id + ')'
    })
    $('tbody').prepend(newRow);
    $(newRow).append(htmlName, htmlCourse, htmlGrade, delTD);
    $(delTD).append(delButton);
}

/******************************************************************
 Function Name: uploadStudent
 Parameters: none
 DataType:
 Return: creates a student object and uploads it to the server
 *******************************************************************/
function uploadStudent() {
    var d = new Date();
    var uniqueID = d.getDate();
    newStudent.name = nameInput;
    newStudent.course = courseInput;
    newStudent.grade = gradeInput;
    newStudent.id = uniqueID;
    //timeout
    //request
    //server
    newStudent["force-failure"] = "request";
    sendData(newStudent);
}

function sortTable() {
    console.log("table sorted with:", sortObj);
    var sortBy = sortObj.focus;
    var sortDirection = sortObj.direction;
    if (sortDirection == "up") {
        var firstReturn = 1;
        var secondRetun = -1;
    }
    if (sortDirection == "down") {
        var firstReturn = -1;
        var secondRetun = 1;
    }
    student_array.sort(function (a, b) {
        if (a[sortBy] > b[sortBy]) {
            return firstReturn;
        }
        if (a[sortBy] < b[sortBy]) {
            return secondRetun;
        }
        return 0;
    });

    updateData();
}