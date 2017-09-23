/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 'use strict';

 // Shortcuts to DOM Elements.
 var messageForm = document.getElementById('addForm');
 var firstName = document.getElementById('inputFName');
 var surName = document.getElementById('inputSName');
 var lastName = document.getElementById('inputLName');
 var cohort = document.getElementById('selectCohort');
 var editBtn = document.getElementById('editButton');
 var rootRef = firebase.database().ref().child("staff");
//  var tableStaff = $('#listStaff').DataTable({
//     select: true
//  });
 var tablle = document.getElementById('table-body');
 var currentUID;


 function addNewStaff(fname, sname, lname, cohort, newStaffKey) {
     if(!newStaffKey) {

        newStaffKey = firebase.database().ref().child('staff').push().key;
        
                var postData = {
                    id: newStaffKey,
                    fname: fname,
                    sname: sname,
                    lname: lname,
                    cohort: cohort
                   };
        
                var updates = {};
                updates['/staff/' + newStaffKey] = postData;
        
                return firebase.database().ref().update(updates);
     } else {
        firebase.database().ref('staff/' + newStaffKey).set({
            id: newStaffKey,
            fname: fname,
            sname: sname,
            lname: lname,
            cohort: cohort
          }).then(function() { // removed from Firebase DB
            console.log("Update succeeded.")
           })
           .catch(function(error) {
            console.log("Update failed: " + error.message)
           });

        console.log("Has key");
       
     }

    // Get key for new staff member
   
 }

 function getStaff() {
     return firebase.database().ref('staff');
 }

 function getStaffDetails(fname, sname, lname, cohort) {
     firstName.value = fname;
     surName.value = sname;
     lastName.value = lname;
     cohort.value = cohort;
 }

 function submitForm(newStaffKey) {
    messageForm.onsubmit = function(e) {
        e.preventDefault();
        var fn = firstName.value;
        var ln = lastName.value;
        var sn = surName.value;
        var ch = cohort.value;

        if(fn && ln && sn && ch) {
            addNewStaff(fn, sn, ln, ch, newStaffKey);
            var fn = '';
            var ln = '';
            var sn = '';
            var ch = '';
            messageForm.reset();
            $('#addStaffModal').modal('hide');
            window.location.reload();        
        }
    };
 }

 // Binding
$('document').ready(()=> {
     // Saves staff on form submit

     $('#addNewStaffButton').click(()=> {
        $('#addStaffModal').modal('show');
     })
     $('.close-button').click(()=> {
        $('#addStaffModal').modal('hide');        
     })
    
     submitForm();
    var count = 0;

    



    
    rootRef.orderByChild("fname").on('child_added', function(snapshot) {
        count++;
       
       if(snapshot.exists()) {
           var content = '';
           var val = snapshot.val();
           if(val.fname) {
            var assetKey = snapshot.child("id").val();
            var fname = snapshot.child("fname").val();
            var sname = snapshot.child("sname").val();
            var lname = snapshot.child("lname").val();
            var cohort = snapshot.child("cohort").val();
            $("#listStaff").append("<tr id='row"+assetKey+"' class='clickable-row' key='"+ assetKey +"'>"+
                                    "<td class='mdl-data-table__cell--non-numeric'>" + fname + "</td>" +
                                    "<td class='mdl-data-table__cell--non-numeric'>" + sname + "</td>" +
                                    "<td class='mdl-data-table__cell--non-numeric'>" + lname + "</td>" +
                                    "<td class='mdl-data-table__cell--non-numeric'>" + cohort + "</td>" +
      
                                    "<td class='mdl-data-table__cell--non-numeric'><div buttons>"+
                                    "<button key='"+ assetKey +"' class='edit_btn btn btn-primary my-2 my-sm-0 update-staff' ><i class='fa fa-pencil' aria-hidden='true'></i></button>"+" "+
                                            "<button key='"+ assetKey +"' class='delete-btn btn btn-danger my-2 my-sm-0'><i class='fa fa-trash' aria-hidden='true'></i></button>"+" "+
                                            "</div></td></tr>");
           } 
       }
   });

   rootRef.orderByChild("fname").on("child_changed", snapshot => {
    var val = snapshot.val();
    if(val.fname) {
        var assetKey = snapshot.child("id").val();
        var fname = snapshot.child("fname").val();
        var sname = snapshot.child("sname").val();
        var lname = snapshot.child("lname").val();
        var cohort = snapshot.child("cohort").val();
        console.log(fname);
  
        $("#listStaff").append("<tr id='row"+assetKey+"' class='clickable-row' key='"+ assetKey +"'>"+
                                "<td class='mdl-data-table__cell--non-numeric'>" + fname + "</td>" +
                                "<td class='mdl-data-table__cell--non-numeric'>" + sname + "</td>" +
                                "<td class='mdl-data-table__cell--non-numeric'>" + lname + "</td>" +
                                "<td class='mdl-data-table__cell--non-numeric'>" + cohort + "</td>" +
  
                                "<td class='mdl-data-table__cell--non-numeric'><div buttons>"+
                                "<button key='"+ assetKey +"' class='edit_btn btn btn-outline-success my-2 my-sm-0 update-staff' ><i class='fa fa-pencil' aria-hidden='true'></i></button>"+" "+
                                        "<button key='"+ assetKey +"' class='delete-btn btn btn-danger my-2 my-sm-0'><i class='fa fa-trash' aria-hidden='true'></i></button>"+" "+
                                        "</div></td></tr>");
       } 
       
    });

    rootRef.on('child_removed', function(snapshot) {
        var key = snapshot.key;
        $('#'+key).remove();
    
      });
  
});

$('#listStaff').on('click', ".delete-btn", function(){ 
var key = $(this).attr('key');
var itemToRemove = rootRef.child(key);
itemToRemove.remove()
.then(function() { // removed from Firebase DB
 console.log("Remove succeeded.")
})
.catch(function(error) {
 console.log("Remove failed: " + error.message)
});

// window.location.reload();

});

$('#listStaff').on('click', ".edit_btn", function(){ 
    var key = $(this).attr('key');
    var itemToUpdate = rootRef.child(key);
    firebase.database().ref("staff/" + key).once('value').then(function(snapshot) {
        firstName.value = snapshot.val().fname;
        surName.value = snapshot.val().sname;
        lastName.value = snapshot.val().lname;
        cohort.value = snapshot.val().cohort;
      });
      $('#addStaffModal').modal('show');
      submitForm(key);
    });

    $("#listStaff").on("click", "tr", function () {
        var col = $(this).index();
        $(this).addClass("highlight").siblings().removeClass("highlight");
        
          console.log("OK");
              
     });


