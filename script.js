var gradeAverage;
var newStudent = {};
var uniqueID;
var nameInput = '';
var courseInput = '';
var gradeInput = '';
var student_array = [];
var jsonData;
var sortObj = {};
var serverDataLength = 0;
var spinWheel = '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate">';

//on document load
$(document).ready(function () {
    //function call to check if the table is empty
    checklist();
    getData();
    $('#studentName').focus();
    $("#addButton").click(function () {
        console.log('add button was clicked');
        addStudent();
    });
    $('body').keyup(function (e) {
        //alert(e.keyCode);
        $(".form-control").removeClass("input_error");
        if (e.keyCode == 13) {
            $('#addButton').trigger("click");
            $('#studentName').focus();

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

var courseGuessArray = [];
$(document).ready(function () {
    typeAheadData();
    $('#course').keyup(function (e) {
        typeAheadData(e);
        console.log(e.keyCode);
    })
});


function typeAheadData() {
    $.ajax({
        url: "http://s-apis.learningfuze.com/sgt/courses",
        dataType: "json",
        success: function (result) {
                if (result.success) {
                    if(result.data.length > courseGuessArray.length) {
                        for (var i in result.data) {
                            courseGuessArray.push(result.data[i].course);
                        }
                        $('input.typeahead').empty();
                        $('input.typeahead').typeahead({
                            local: courseGuessArray
                        });
                        $(".twitter-typeahead").css("display", "block");
                        console.log("typeAhead array", courseGuessArray)
                    }
                }
            }
        })
    }
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
            if (serverDataLength < result.data.length) {
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
            }
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
    $("#addButton").html('').prop('disabled',true).append(spinWheel).append(" Loading...");
    $.ajax({
        url: "http://s-apis.learningfuze.com/sgt/create",
        type: "POST",
        dataType: "json",
        data: studentData,
        success: function (data, textStatus, jqXHR) {
            console.log("Data:",data);
            console.log("TextStatus:",textStatus);
            console.log("jqXHR:",jqXHR);
            if (data.success) {
                console.log("Sent Data was accepted")
                student_array.push(studentData);
                student_array[student_array.length - 1].id = data.new_id;
                createStudentDOM(student_array.length - 1);
                checklist();
                $("#addButton").html('').text('Add').prop('disabled',false);
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
 Function Name: deleteStudent
 Parameters: object
 DataType:
 Return: deletes student DOM and deletes the student object from the
 student_array
 *******************************************************************/
function deleteStudent(objectID) {
    //console.log(student_array);
    var delObj = {};
    delObj.student_id = objectID;
    removeData(delObj, objectID);
    checklist();
}

/******************************************************************
 Function Name: removeData
 Parameters: studentData, student object out of the student array
 DataType: object
 Return: uploads new student data to the learning fuze server
 *******************************************************************/
function removeData(studentData, objectID) {
    $('button[data-index="' + objectID + '"]').after(spinWheel).prop("disabled",true);
    $.ajax({
        url: "http://s-apis.learningfuze.com/sgt/delete",
        type: "POST",
        dataType: "json",
        data: studentData,
        success: function (data, textStatus, jqXHR) {
            console.log("Data Removed", studentData, data);
            if (data.success) {
                $('tr[data-index="' + objectID + '"]').remove();
                calculateAverage();
                for (var j = 0; j < student_array.length; j++) {
                    if (student_array[j].id == objectID) {
                        student_array.splice(j, 1);
                    }
                }
            }
        },
        error: function (jaXHF, textStatus, error) {
            console.log("delete server error",error,jaXHF,textStatus);
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
        $(".form-control").addClass("input_error");
        clearAddStudentForm();
    } else {
        uploadStudent();
        clearAddStudentForm();

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
    newStudent["force-failure"] = "timeout";
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


//fun
var even = [];
var odd = [];
var words = [];
function fun() {
    var phish = "START:" + " Phishing is a continual threat that keeps " +
        "growing to this day. The risk grows even larger in social" +
        " media such as Facebook, Twitter, and Google+. Hackers " +
        "commonly take advantage these sites to attack people using " +
        "them at their workplace, homes, or in public in order to take " +
        "personal and security information that can affect the user or " +
        "company (if in a workplace environment). Phishing takes advantage " +
        "of the trust that the user may have since the user may not be able " +
        "to tell that the site being visited, or program being used, is not " +
        "real; therefore, when this occurs, the hacker has the chance to gain " +
        "the personal information of the targeted user, such as passwords," +
        " usernames, security codes, and credit card numbers, among other " +
        "things." + ":END"
    words = phish.split(" ");

    for (var i = 0; i < words.length; i += 2) {
        even.push(words[i]);
    }
    for (var i = 1; i < words.length; i += 2) {
        odd.push(words[i]);
    }
    for (var i = 0; i <= odd.length; i++) {
        nameInput = even[i];
        courseInput = odd[i];
        gradeInput = i;
        console.log(nameInput, courseInput, gradeInput);
        uploadStudent();
    }

}
