'use strict';

// Create a new countDown function that changes the text of a counter while the
// user types in a text area element

/**
 * CountDown is a function to count the characters insisde the text message
 * box inside a form. It displays how many characters are left in the textarea
 * @param string obj TextArea Element
 */
function countDown(obj) {
    var textCount = document.getElementById('textCount');

    textCount.innerHTML = 200 - obj.value.length;

    if (200 - obj.value.length < 4) {
        textCount.style.color = 'red';

    } else {
        textCount.style.color = '#676767';
    }
}

// Functions to be loaded as soon as the page loads
$(document).ready(function(){
    // Change the value from the checkbox for giving consent
    $('[name="consent"]').click(function(){
        if ($(this).val() == "true") {
            $(this).prop("value", "false");
        } else {
            $(this).prop("value", "true");
        }
    });
});