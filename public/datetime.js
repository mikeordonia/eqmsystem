function startTime() {
    var dateTime = new Date();
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();

    var amPM = "AM";
    if(hours > 12){
      if(hours>= 12){
        amPM = "PM";
      }
      hours=hours-12;
    } else if (hours == 12) {
      if(hours>= 12){
        amPM = "PM";
      }
    }else if (hours == 0){
      hours=hours+12;
    }

    if(minutes < 10){
      minutes = "0" + minutes;
    }
    
    var time = hours + ":" + minutes + " " + amPM

    //Cashier Queue datetime//
    var theTIME = document.getElementById("timeTodatabase");
    theTIME.value = time;

    var theDATE = document.getElementById("dateTodatabase");
    theDATE.value = dateTime.toLocaleDateString();

    document.getElementById("displayTIME").innerHTML = time;
    document.getElementById("displayDATE").innerHTML = dateTime.toDateString();

    //Guidance Queue datetime//
    var theTIME = document.getElementById("timeTodatabase3");
    theTIME.value = time;

    var theDATE = document.getElementById("dateTodatabase3");
    theDATE.value = dateTime.toLocaleDateString();

    document.getElementById("displayTIME3").innerHTML = time;
    document.getElementById("displayDATE3").innerHTML = dateTime.toDateString();

    //Registrar Queue datetime//
    var theTIME = document.getElementById("timeTodatabase4");
    theTIME.value = time;

    var theDATE = document.getElementById("dateTodatabase4");
    theDATE.value = dateTime.toLocaleDateString();

    document.getElementById("displayTIME4").innerHTML = time;
    document.getElementById("displayDATE4").innerHTML = dateTime.toDateString();

    setTimeout(function clock(){
      startTime(),1000
    })
  }