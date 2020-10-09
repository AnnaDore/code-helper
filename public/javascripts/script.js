window.onscroll = function() {myFunction()};

var header = document.getElementById("myHeader");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

const { $where } = require("../../models/User");

document.addEventListener('DOMContentLoaded', () => {

 // console.log('IronGenerator JS imported successfully!');

}, false);


 $(document).ready(function() {
    $('.submit').clock(function (event) {
        let email = $('.email').val()
        let subject = $('.subject').val()
        let message = $('.message').val()
        let statusElm = $('.status')
        statusElm.empty()
        if(email.length > 5 && email.includes("@") && email.includes('.')) {
            statusElm.append('<div>Email is valid</div>')
        } else {
            statusElm.append('<div>Email is not valid</div>')
        }
       if(message.length < 3) {
           statusElm.append('<div>Message has to be more than 3 chars</div>')
       }
    })
})





