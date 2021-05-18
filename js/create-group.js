import { createGroup } from "./firebase-queries.js";
const db = firebase.firestore();

const groupName = document.getElementById("groupName");
const groupDesc = document.getElementById("groupDescription");

const createBtn = document.getElementById("create");
const modalBtn = document.getElementById("modalBtn");
const modalName = document.getElementById("modal-groupName");

let myModal = new bootstrap.Modal(document.getElementById('exampleModal'));

// https://stackoverflow.com/questions/43047300/e-preventdefault-is-not-working-while-openning-a-modal-after-changing-modal-text

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            
            event.stopPropagation()
            console.log("no")
          } else {
            event.preventDefault()
            showModal();
            console.log('yes');
            
          }
        
          
          form.classList.add('was-validated')
        }, false)
      })
  })()
  myModal.show();

function showModal() {
    modalName.innerText = groupName.value + " has been created!"
    // myModal.show();
    console.log('yesmodal');
}

// createBtn.addEventListener("click", function(e) {
//     // console.log("clicked create");
//     let groupId = createGroup(groupName, groupDesc)

//     console.log("New group id", groupId);
//     modalName.innerText = groupName.value + " has been created!";
// })

modalBtn.addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "./group-main.html";
})


