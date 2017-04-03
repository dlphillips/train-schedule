$(document).ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAKmUD_1Boabv75FwEWkb3RDBQOHluSDnU",
        authDomain: "train-schedule-39c5a.firebaseapp.com",
        databaseURL: "https://train-schedule-39c5a.firebaseio.com",
        projectId: "train-schedule-39c5a",
        storageBucket: "train-schedule-39c5a.appspot.com",
        messagingSenderId: "1052159302902"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    var nextTrain = 0;
    var tMinutesTillTrain = 0;

    function clearForm() {
        $("#tName").val("");
        $("#tDest").val("");
        $("#tTime").val("");
        $("#tFreq").val("");
    }

    $("#tButton").on("click", function(event) {
        event.preventDefault();

        var tName = $("#tName").val().trim();
        var tDestination = $("#tDest").val().trim();
        var tStartTime = $("#tTime").val().trim();
        var tFrequency = $("#tFreq").val().trim();

        database.ref().push({
            name: tName,
            destination: tDestination,
            starttime: tStartTime,
            frequency: tFrequency
        });

        clearForm();

    });


    function calcNextTrain(p1,p2) {

        var tFrequency = p1;
        var firstTime = p2;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        // Minutes Until Train
        tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        nextTrain = moment().add(tMinutesTillTrain, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        return [nextTrain, tMinutesTillTrain];

    };

    database.ref().on("child_added", function(snapshot) {

        // var convertedDate = moment(new Date(snapshot.val().startDate));

        $("#trainInfo").append(`
        	<tr>
	        	<td>${snapshot.val().name}</td>
	        	<td>${snapshot.val().destination}</td>
	        	<td>${snapshot.val().frequency}</td>
	        	<td>${calcNextTrain(snapshot.val().frequency,snapshot.val().starttime)[0]}</td>
	        	<td>${calcNextTrain(snapshot.val().frequency,snapshot.val().starttime)[1]}</td>
        	</tr>
        	`);
    });



});
