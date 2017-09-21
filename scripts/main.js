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


 function addNewStaff(fname, sname, lname, cohort) {
     var postData = {
         fname: fname,
         sname: sname,
         lname: lname,
         cohort: cohort
        };
        

        // Get key for new staff member
        var newStaffKey = firebase.database().ref().child('staff').push().key;

        var updates = {};
        updates['/staff/' + newStaffKey] = postData;

        return firebase.database().ref().update(updates);
 }

 function getStaff() {
     return firebase.database().ref('staff');
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
            $('#addStaffModal').modal('hide');        
        }
    };
})   

 var count = 0;
 getStaff().on('child_added', function(snapshot) {
     count++;
     var table = $('#listStaff').DataTable();
    if(snapshot.exists()) {
        var content = '';
        var val = snapshot.val();
        if(val.fname) {
            var dataset = [count, val.fname, val.sname,val.lname, val.cohort,'<p data-placement="top" data-toggle="tooltip" title="Edit"><button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit" ><i class="fa fa-pencil" aria-hidden="true"></i></button></p>' , '<p data-placement="top" data-toggle="tooltip" title="Edit"><button class="btn btn-danger btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit"><i class="fa fa-trash-o" aria-hidden="true"></i></button></p>' ];
        } else {
            var dataset = [count, "", " ", " ", " ", " ", " "];
        }
        
        table.rows.add([dataset]).draw();
        
    }
});
 

