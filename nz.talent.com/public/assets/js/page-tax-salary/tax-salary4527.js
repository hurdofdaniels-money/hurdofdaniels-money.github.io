function setBase(pivot, timebase, btn) {
    // set the current timebase to the pivot elem
    document.getElementById(pivot).setAttribute('timebase', timebase);

    // remove the selected class from all the buttons
    var btnList = document.querySelectorAll('#' + pivot + ' > .c-card__btn');
    var btnListLen = btnList.length;
    for (var x = 0; x < btnListLen; x++) {

        btnList[x].classList.remove('c-card__btn--selected');
    }
    // set the selected class for the clicked button
    btn.classList.add('c-card__btn--selected');

    // display the number with the selected timebase
    var tbElemsList = document.querySelectorAll('.timeBased');
    var tbElemsListLen = tbElemsList.length;
    for (var x = 0; x < tbElemsListLen; x++) {
        tbElemsList[x].innerHTML = tbElemsList[x].getAttribute(timebase);
    }
}

// do the ajax call for the elements with the data-loaded attribute
function loadDataSrc() {
    $("[data-loaded='no']").each(function () {
        var e = $(this);
        var uri = e.attr("data-src");
        var status = e.attr("data-loaded");

        $.get(uri, function (data) {
            e.html(data);
            e.attr("data-loaded", "yes");
        });
    });
}
function scrollTimeBase(){
    //The Following function is used to control the display property of the arrows from the timeBased selection slider
    $('#timeBasedGroup').scroll(function() {

        // At first, we take the left offset value of the first element of the slider
        // 28px is the sum of all the paddings to the left of the element, it is static no matter the size of the screen
        var elementX = $('.c-card__btn:first-child').offset();
        if(elementX.left < 28) {
            $('.c-card__btn-fade--left').css('display','flex');
        } else {
            $('.c-card__btn-fade--left').css('display','none');
        }

        /*  We need the last element left offset value, which varies depending on the size of the screens,
        As the screen grows to the right, tihs offset may vary. */

        // Take the left offset value from the element, and round it up with parseInt() to get the X coordinate
        var lastChildOffset = parseInt($('.c-card__btn:last-child').offset().left);

        /* To get the limit and check if the element has reached the end of the container, we need the width of the
        container. We obtain that value using .width() in the card container class.

        The container has its width, which is the total scroll distance. We obtain that value with .outerWidth().
        The difference between those two values (the subtraction of the container width and element outerWidth),
        give us the the "X" coordinate of the left side of the last element.

        We want to check when the right side reaches the end of the container. To do that, we sum the length of the
        element to the offset position and now we got the right side or the X Coordinate of the right side of the
        element. Always compare the right side to the total width of the container and both lenght should match. */

        // If the element reaches this point, it should dissapear. Otherwise display: flex.
        var offSetLimit = ($('#taxes .l-card__btn-container').width() - $('.c-card__btn:last-child').outerWidth()) + $('.c-card__btn:last-child').width();

        if( lastChildOffset <= offSetLimit) {
            $('.c-card__btn-fade--right').css('display','none');
        } else {
            $('.c-card__btn-fade--right').css('display','flex');
        }
    });
}


// By default the right arrow is shown, we should hide the right arrow when a scroll is not possible.
// Currently the limit is 375px which is the sum of the length of the elements, above that value the scrolling
// action is won't happen so, at this time, is going to be hardcoded.

if ($('#taxes .l-card__btn-container').width() > 375){
    $('.c-card__btn-fade--right').css('display','none');
}


function initialFunctions(){
    if(!getUrlVars()["uit"]){
        loadDataSrc();
    }
    scrollTimeBase();
    // Activating redirection popup according to the conditions in the PHP section
    if(app.popupRedirection === 'yes'){
        showCampaignPopup("taxCal");
    }
}


