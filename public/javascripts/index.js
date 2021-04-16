
function Motorcycle(make, model, vin, inWarehouse) {
    this.make= make;
    this.model = model;
    this.vin = vin;
    this.inWarehouse = inWarehouse;
  }
  var ClientNotes = [];  // our local copy of the cloud data


document.addEventListener("DOMContentLoaded", function (event) {

    document.getElementById("submit").addEventListener("click", function () {
        var tTitle = document.getElementById("title").value;
        var tDetail = document.getElementById("detail").value;
        var tPriority = document.getElementById("priority").value;
        var oneToDo = new ToDo(tTitle, tDetail, tPriority);

        $.ajax({
            url: '/NewToDo' ,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(oneToDo),
            success: function (result) {
                console.log("added new note")
            }

        });
    });

    document.getElementById("get").addEventListener("click", function () {
        updateList()
    });
  


    document.getElementById("delete").addEventListener("click", function () {
        
        var whichToDo = document.getElementById('deleteMotorcycle').value;
        var idToDelete = "";
        for(i=0; i< ClientNotes.length; i++){
            if(ClientNotes[i].title === whichToDo) {
                idToDelete = ClientNotes[i]._id;
           }
        }
        
        if(idToDelete != "")
        {
                     $.ajax({  
                    url: 'DeleteMotorcycle/'+ idToDelete,
                    type: 'DELETE',  
                    contentType: 'application/json',  
                    success: function (response) {  
                        console.log(response);  
                    },  
                    error: function () {  
                        console.log('Error in Operation');  
                    }  
                });  
        }
        else {
            console.log("no matching Subject");
        } 
    });



    document.getElementById("editSubmit").addEventListener("click", function () {
        var make = document.getElementById("editMake").value;
        var model = document.getElementById("editModel").value;
        var vin = document.getElementById("editVIN").value;
        var inWarehouse = document.getElementById("editInWarehouse").value;
        var motorcycle = new Motorcycle(make, model, vin, inWarehouse);
        
            $.ajax({
                url: 'UpdateMotorcycle/'+idToFind,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(motorcycle),
                    success: function (response) {  
                        console.log(response);  
                    },  
                    error: function () {  
                        console.log('Error in Operation');  
                    }  
                });  
            
       
    });


    
    var idToFind = ""; // using the same value from the find operation for the modify
    // find one to modify
    document.getElementById("find").addEventListener("click", function () {
        var vin = document.getElementById("editMotorcycle").value;
         idToFind = "";
        for(i=0; i< ClientNotes.length; i++){
            if(ClientNotes[i].vin === vin) {
                idToFind = ClientNotes[i]._id;
           }
        }
        console.log(idToFind);
 
        $.get("/FindMotorcycle/"+ idToFind, function(data, status){ 
            console.log(data[0]);
            document.getElementById("editMake").value = data[0].make;
            document.getElementById("editModel").value= data[0].model;
            document.getElementById("editVIN").value = data[0].vin;
            document.getElementById("editInWarehouse").value = data[0].inWarehouse;
           

        });
    });

    // get the server data into the local array
    updateList();

});


function updateList() {
var ul = document.getElementById('listUl');
ul.innerHTML = "";  // clears existing list so we don't duplicate old ones

//var ul = document.createElement('ul')

$.get("/Motorcycles", function(data, status){  // AJAX get
    ClientNotes = data;  // put the returned server json data into our local array

    // sort array by one property
    ClientNotes.sort(compare);  // see compare method below
    console.log(data);
    //listDiv.appendChild(ul);
    ClientNotes.forEach(ProcessOneToDo); // build one li for each item in array
    function ProcessOneToDo(item, index) {
        var li = document.createElement('li');
        ul.appendChild(li);

        li.innerHTML=li.innerHTML + index + ": " + " Priority: " + item.priority + "  " + item.title + ":  " + item.detail + " Done? "+ item.completed;
    }
});
}

function compare(a,b) {
    if (a.completed == false && b.completed== true) {
        return -1;
    }
    if (a.completed == false && b.completed== true) {
        return 1;
    }
    return 0;
}
