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
 var tableStaff = $('#listStaff').DataTable();
 var tablle = document.getElementById('table-body');
 var currentUID;


 function addNewStaff(fname, sname, lname, cohort) {
    

        // Get key for new staff member
        var newStaffKey = firebase.database().ref().child('staff').push().key;

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

 // Binding
$('document').ready(()=> {
     // Saves staff on form submit

     $('#addNewStaffButton').click(()=> {
        $('#addStaffModal').modal('show');
     })
     $('.close-button').click(()=> {
        $('#addStaffModal').modal('hide');        
     })
    
     messageForm.onsubmit = function(e) {
        e.preventDefault();
        var fn = firstName.value;
        var ln = lastName.value;
        var sn = surName.value;
        var ch = cohort.value;

        if(fn && ln && sn && ch) {
            addNewStaff(fn, sn, ln, ch);
            var fn = '';
            var ln = '';
            var sn = '';
            var ch = '';
            messageForm.reset();
            $('#addStaffModal').modal('hide');        
        }
    };
    var count = 0;
    
    getStaff().on('child_added', function(snapshot) {
        count++;
       
       if(snapshot.exists()) {
           var content = '';
           var val = snapshot.val();
           if(val.fname) {
               var dataset = [count, val.fname, val.sname,val.lname, val.cohort];
           } else {
               var dataset = [count, "", " ", " ", " ", " ", " "];
           }
           
           tableStaff.rows.add([dataset]).draw();
           currentUID = snapshot.key;
   
       }
   });
       
})





