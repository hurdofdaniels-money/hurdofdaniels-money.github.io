'use strict';
/**
 *
 * @param html elem          element been click
 * @param string parameters  URL parameters
 * @param string key         filter's key EX: date, company, etc.
 * @returns {boolean}
 */
function clickFilter(elem, parameters, key) {
  // If the key is clean then we clear all the filter inputs and reload
  // the site
  if (key === 'clear') {
    $('.hiddenFilter').each(function() {
      $(this).val('');
    });
    $('#main-search-form').submit();
    return true;
  }
  // We clean the previous elements for the active clases
  $('.click_filter').removeClass('click_filter');
  $('#filter-' + key).addClass('click_filter');

  // In order to show the filter in a clean matter
  // we need a couple of data points

  var thisList = $('#items-' + key);        // current active filter list
  var listWidth = $(thisList).width();      // current list width
  var viewportWidth = $(window).width();    // viewport width
  var elemOffset = $(elem).offset();        // coordinates
  var elemTopCord = (elemOffset.top) + 20;  // Top position of the element
  var elemLeftCord = elemOffset.left;       // Left position of the element

  // We update the top position of the list with the position of the element
  $(thisList).css('cssText', 'top: ' + elemTopCord + 'px !important;');

  // if the viewport Width minus the left position of the element
  // is less that the necessary space of the list that we want to show
  // we want the list to be in the very right of the site
  if ((viewportWidth - elemLeftCord) < listWidth) {
    $(thisList).css('right', '0px');
    $(thisList).css('left', 'initial');
  } else {
    // if the list have the necessary space we just move the list
    // to be on the left coordinate of the element
    $(thisList).css('left', elemLeftCord);
    $(thisList).css('right', 'initial');
  }

  // We append the list to the body of the element
  $('body').append($(thisList).detach());

  // We show the list
  $(thisList).toggle();

  // For mobile we want to show prevent the user to scroll
  // while also showing then a fade background
  if (domain.device === 'mobile') {
    $('#filter-wraper').show();
    $('body, html').css('overflow', 'hidden');
  }

  // Hide the others list elements
  $('.jobFilters__listFilters ').not(thisList).hide();
  $('.jobFilters__label').not($(elem)).removeClass('isHover');

  if ($(elem).hasClass('anyVal')) {
    $(elem).addClass('isHover');
  }
  if (thisList.css('display') === 'none') {
    $(elem).removeClass('isHover');
  }

  // For the text inputs on the filters
  // we want to set then up for, if the user hits enter
  // if will make a search with the input setup
  var inputText = $(thisList).find('input[type=search]');

  if ($(inputText).length) {
    $(inputText).focus();
    $(inputText).keypress(function(e) {
      var k = e.which;
      if (k === 13)  // the enter key code
      {
        //prevent main form to be submit
        e.preventDefault();
        // we populate the hidden input with the user's input
        $('input[name=\'' + key + '\']').val($(this).val());
        // we submit the main form now that the hidden input have the
        // information
        $('#main-search-form').submit();
      }
    });
  }

}

/**
 * Show the clean filters element and mobile UI changes went
 * there is a filter with a value
 */

function showClearFilters() {

  //show clear filters at page load
  $('.hiddenFilter').each(function() {
    if ($(this).val() !== '') {
      if (domain.device !== 'mobile') {
        $('#filter-clear').css('display', 'inline-block');
      } else {
        $('#filter-clear').show();
      }
    }
  });
  // if it is mobile we want to move the filters with values
  // at the beginning of the carousel
  if (domain.device === 'mobile') {
    $('.jobFilters__label').each(function() {
      if ($(this).hasClass('anyVal')) {
        $(this).parent().appendTo('#jobFilters_wrap');
      }
    });
  }

}

/**
 * None text type filter click, we change the value of their correspondent input
 * and submit the form
 * @param html    elem          element been click
 * @param string  parameters    URL parameters
 * @param string  key           key of the filter Ex: company, date, source
 */

function submitFilter(elem, parameters, key) {
  $('input[name=\'' + key + '\']').val($(elem).attr('data'));
  $('#main-search-form').submit();

}

/**
 * This will check the search made by the user, clean the filter fields that are empty and register that search
 */
function checkSearch() {

  // Remove empty filter parameters and "&p=1" when it's on the first results page
  $('.jobFilters > input, #text-company').each(function (){
    if(!this.value){
      this.remove()
    }

    if ($(this).attr("name") === "p" && this.value === "1"){
      this.remove()
    }
  });

  if(domain.jobSeekerLogin === "1"){
    var data = {};
        data.keyword = $('#nv-k').val();
        data.location = $('#nv-l').val();
    userEventTracket('job_search',data);
    return true;
  }
}



/**
 *
 */

function checkEmailApplyBox(elem) {
  var email = elem.val().trim();

  if (verifyEmail(email)) {
    $('.jobApply__confirmEmailMessage').show();
    $('.jobApply__errorEmailMessage').hide();
    $('.jobApply__email').text(email);
  } else {
    $('.jobApply__confirmEmailMessage').hide();
    $('.jobApply__errorEmailMessage').show();
  }

}
/**
 * Will close the general se message on the SERP
 */

function closeMessage(){
  $(".card--message").fadeOut(500);
  replaceStateURL('e', '');
  replaceStateURL('s', '');
}

/**
 * This shows the 'x' on the text inputs on the search bar if necessary
 */

function showClearInput() {
  // Keyword input check
  var keyword = $('#nv-k').val();
  if (keyword !== '') {
    $('#nv-clear').show();
  } else {
    $('#nv-clear').hide();
  }
  // Location input check
  var location = $('#nv-l').val();
  if (location !== '') {
    $('#nv-clear-l').show();
  } else {
    $('#nv-clear-l').hide();
  }
}

/**
 * This shows the real input box for mobile and prevents the user for scrolling
 * the body
 */
function showSearchInputsMobile() {
  $("body, html").addClass("isSearchActive");
  window.scrollTo(0, 0);
  $('.jobsearch_hiddenWraper').show();
}

/**
 * This updates the H1 fake input on mobile with the from the real input
 */
function updateFakeInputPlaceholder() {
  allowBodyScroll();
  $('#fake-k').text($('#nv-k').val());
  $("body, html").removeClass("isSearchActive");
  if ($('#nv-k').val() === '') {
    $('#fake-k').text($('#fake-k').attr('data-placeholder'));
  }
  $('.jobsearch_hiddenWraper').hide();
}

/**
 * We store the job preview HTML with the JobId and the response from
 * hobjobs
 * @param string jobId
 */
function addToJobIdsSessionStorage(jobId, response) {

  var clickedJobIds = {};
  var array_to_json = {};
  array_to_json.HTML = response;
  try {
    // We try to get the jobClickIds sessionStorage
    clickedJobIds = $.parseJSON(sessionStorage['jobClickIds']);
  } catch (err) {
    // if it fails we create a new sessionStorage with the first click
    clickedJobIds[jobId] = {HTML: array_to_json.HTML};

    sessionStorage['jobClickIds'] = JSON.stringify(clickedJobIds);
    return true;
  }
  // if we already had the object we just update the current one
  clickedJobIds[jobId] = {HTML: array_to_json.HTML};
  sessionStorage['jobClickIds'] = JSON.stringify(clickedJobIds);
}

/**
 * This will check if we have the job preview in storage and return the HTML
 * or a false string depending on the case
 * @param string jobId
 * @returns {string|any}
 */

function checkJobIdsInSessionStorage(jobId) {
  var jobIdsArray = {};
  try {
    jobIdsArray = $.parseJSON(sessionStorage['jobClickIds']);
  } catch (err) {
    return 'false';
  }

  if (jobIdsArray[jobId]) {
    return jobIdsArray[jobId].HTML;
  } else {
    return 'false';
  }
}

/**
 * Remove a bucket from sessionStorage
 * @param bucket
 */
function removeSessionStorageElement(bucket) {
  sessionStorage.removeItem(bucket);
}

/**
 * On load we want to show the review of the job if one, there is the jobid on the
 * URL and also if the job is on the list
 * @param string jobId
 * @returns {boolean}
 */
function checkIfJobIsOnList(jobId) {
  var elem = $('[data-id=' + jobId + ']');

  //if we found the element with the id we show that preview job
  if (elem.length) {
    return true;
  }
  return false;
}


/**
 * This will get the jobId from the given element for jobPreview popup, update
 * the url with that id, and flag the element as preview active
 * @param html elem
 * @returns {null|undefined}
 */
function getPreviewJobId(elem) {
  // We look for the job id
  var jobId = elem.closest('.card__job').attr('data-id');
  // update the URL to contain the jobid=jobId
  replaceStateURL('id', jobId);
  // Cleaning any trace from a previous Job preview been show
  $('.card__job--preview').removeClass('card__job--preview');
  $('.card__job-other-link--preview').
      removeClass('card__job-other-link--preview');
  $('.card__job-other-locations--preview').
      removeClass('card__job-other-locations--preview');

  // We flag that job card to have the preview open
  elem.closest('.card__job').addClass('card__job--preview');

  // If the element been click is not a job card but a
  // Job from the 'other jobs' structure
  // we need to change from where we take the id
  if (elem.hasClass('card__job-other-job')) {
    // We flag that other job as preview active
    elem.addClass('card__job-other-link--preview');
    jobId = elem.attr('data-id');
  }
  // Same as other jobs but for other location
  if (elem.hasClass('card__job-other-locations-link')) {
    // We flag the other location job as preview active
    elem.addClass('card__job-other-locations--preview');
    jobId = elem.attr('data-id');
  }

  return jobId;
}


/**
 * This function will take a jobId provided and do an
 * Ajax call for the job preview store and show the results
 * @param string jobId  the job id that we want to show
 * @param string from   Where the preview is been requested, by click or on first load
 * @returns {boolean}
 */
function openJobPreview(jobId, from) {
  // Set the preview card as the active element for Accessability purposes
  $("#jobPreview").addClass("acsb-active");
  $("#jobPreview").attr("data-acsb-overlay", "popup");
  $("#jobPreview").attr("aria-modal", "true");
  $("#jobPreview").attr("aria-hidden", "false");
  $("#jobPreview").attr("data-acsb-hidden", "false");
  $("#jobPreview").attr("aria-label", "POPUP");
  $("#jobPreview").attr("role", "dialog");
  $("#jobPreview > h1.jobPreview__header--title").attr("data-acsb-focused", "true");
  $("#jobPreview > h1.jobPreview__header--title").attr("data-acsb-title", "true");
  $("#jobPreview > h1.jobPreview__header--title").trigger('focus');


  // we can't do anything without the jobId
  if (!jobId || jobId === "") {
    return true;
  }
  // Link building
  var link = 'redirect?id=' + jobId + '&lang=' + domain.language + '&k=' +
      getUrlSingleVar('k') + '&l=' + getUrlSingleVar('l') + '&nb=true';

  if (from === 'load') {
    //if there is no jobcard with the job we want to preview, then
    if (!checkIfJobIsOnList(jobId)) {

      var paramsJobCard = {};
      paramsJobCard.id = jobId;
      paramsJobCard.country = domain.country;
      paramsJobCard.language = domain.language;
      paramsJobCard.languageFolder = domain.settings.language_folder;
      paramsJobCard.device = domain.device;

      // Ajax file location
      var whereJobCard = '/ajax/page_jobs/generate-jobcard.php';
      $.get(whereJobCard,paramsJobCard,function(response) {
        var objResponse = $.parseJSON(response);
        response = objResponse.payload;
        $(".joblist").prepend(response.html);
        $('[data-id=' + jobId + ']').addClass('card__job--preview');
      })
    }else{
      // We flag that other job as preview active
      if ($('[data-id=' + jobId + ']').hasClass('card__job-other-job')) {
        $('[data-id=' + jobId + ']').addClass('card__job-other-link--preview');
        $('[data-id=' + jobId + ']').closest(".card__job").addClass('card__job--preview');
      }else{
        $('[data-id=' + jobId + ']').addClass('card__job--preview');
      }
    }
  }
  // if the viewport width or height is too small we open the job into an other
  // window instead of doing the preview

  if($(window).width() < 900 || $(window).height() < 600){
    window.open(link, '_blank');
    closeJobPreview();
    return true;
  }

  if (checkJobIdsInSessionStorage(jobId) !== 'false') {
    // console.log("cache");
    var response = checkJobIdsInSessionStorage(jobId);
    $('.card--preview').html(response);
    // We  need toe scroll at the moment to adapt the viewport of the
    // job preview card and show it after the process
    var scroll = $(document).scrollTop();
    jobPreviewAutoHeight(scroll);
    $('.card--preview').show();
    $('.content__rightSide').css('opacity', '0');
    return true;
  }
  // jobId = "asdf";
  // Object preparing for Ajax request
  var paramsPreview = {};
  paramsPreview.id = jobId;
  paramsPreview.country = domain.country;
  paramsPreview.language = domain.language;
  paramsPreview.preview = 1;
  // Ajax file location
  var where = '/ajax/page_jobs/page-whitepage-preview.php';
  $.ajax({
    type: 'GET',
    url: where,
    dataType: 'text',
    async: true,
    data: paramsPreview,
    success: function(response) {
      // We try to parse the response
      try {
        var payload = {};
        var objResponse = $.parseJSON(response);
        payload = objResponse.payload;
        // if the action is to redirect we do so
        if (payload.redirect === 'true') {

          window.open(link, '_blank');
          closeJobPreview();
          return true;
        } else if(payload.redirect === 'error'){
          // if there is an error of any time we reload and display it
          var baseURL = window.location.origin;
          var pathURL = window.location.pathname;
          link = baseURL + pathURL + '?e=' + payload.error;
          window.open(link, '_self');
          return true;
        }else {
          // we insert the response HTML to the card--preview Holder
          $('.card--preview').html(payload.html);
          addToJobIdsSessionStorage(jobId, payload.html);
          // We  need toe scroll at the moment to adapt the viewport of the
          // job preview card and show it after the process
          var scroll = $(document).scrollTop();
          jobPreviewAutoHeight(scroll);
          $('.card--preview').show();
          $('.content__rightSide').css('opacity', '0');
        }

      } catch (e) {
        // if for some reason is not returning a Json then we redirect.
        window.open(link, '_blank');
        closeJobPreview();
        return true;
      }

    },
    timeout: 3000,
    error: function(data, textStatus, errorThrown) {

      // if by any change the Ajax fails
      // we will still try to send the user to the whitepage
      // We remove any trace of job preview
      $('.card__job--preview').removeClass('card__job--preview');
      $('.card__job-other-link--preview').
          removeClass('card__job-other-link--preview');
      $('.card__job-other-locations--preview').
          removeClass('card__job-other-locations--preview');
      $('.content__rightSide').css('opacity', '1');

      window.open(link, '_blank');

    }
  });
}

/**
 * Function that have all the desktop only event listeners
 */

function desktopEventsListener() {

  //On scroll events on the website
  $(document).scroll(function() {
    var scroll = $(document).scrollTop();

    //We want to resize the viewport of the job preview if necessary
    jobPreviewAutoHeight(scroll);
  });

  //On window is been resized
  $(window).resize(function() {
    var scroll = $(document).scrollTop();

    //We want to resize the viewport of the job preview if necessary
    jobPreviewAutoHeight(scroll);
  });

  // We want to prevent page scrolling on the site went the mouse is over
  // this elements
  $('.card--preview').hover(
      function(){
        if(! $('.popup__background').hasClass("is--active")){
          preventBodyScroll();
        }
      }
      ,
      function(){
        if(! $('.popup__background').hasClass("is--active")){
          allowBodyScroll();
        }
      }
  );

}

/**
 * This function takes care that the job preview description height and the
 * top position of the job preview card
 * @param int scrollValue
 */

function jobPreviewAutoHeight(scrollValue) {

  // First we need to know the height of the website
  // and after that we will adapt this viewport taking in consideration
  // the header height or of the scroll position is at bottom
  var viewport = $(window).height();

  // Default value of the top position of the preview window
  var top = $('.content__rightLeftSide').offset().top;
  // We want the original position of the top part of the preview window
  var anchorPosition = top;
  // we want to move the card more to the top for every scroll unit
  top = top - scrollValue;

  //  We need to know the height of the header because
  // some job titles might take more the one line
  // the +350 is for accounting the top free space
  var headerHeight = $('.jobPreview__header--wrapper').height() + 350;

  // We always want the header to be at least 519 on the calculations
  if (headerHeight < 519) {
    headerHeight = 519;
  }

  // So my first viewport description calculation is
  // the windows height minus the header plus the scroll height at the moment
  viewport = viewport - headerHeight + scrollValue - anchorPosition + 250;

  // We don't want the viewport to be more than the window height minus some space
  // for the white space
  if (viewport > $(window).height() - 301) {

    // We recalculate the viewport if it wants to be more than we want
    viewport = $(window).height() - (headerHeight - 210);
  }

  // We don't want to top value to be less than 10
  if (top < 11) {
    top = 10;
  } else {
    viewport = viewport - 25;
  }

  // If we are just at the end of the side we have to recalculate the viewport
  // We know this by two flags, first the document height minus the
  // window height is  less than the scroll value and the footer is on view site
  if (
      (($(document).height() - $(window).height() - 100) < scrollValue) &&
      isElementInPartialView(document.getElementById('container__footer'))
  ) {
    // We recalculate the viewport if it wants to be more than we want
    viewport = viewport - (scrollValue - ($(document).height() - $(window).height() - 250));
  }

  // We update the values after been process
  $('.card--preview').css('top', top + 'px');
  $('.jobPreview__body--wrapper').height(viewport);

}

/**
 * This function close the jobPreview card
 */
function closeJobPreview() {
  // We clean the HTML inside the preview card we hide the card
  // and also we remove any class preview modifications to the job card
  // other jobs and other locations
  $('.card--preview').html('');
  $('.card--preview').hide();
  $('.card__job--preview').removeClass('card__job--preview');
  $('.card__job-other-link--preview').
      removeClass('card__job-other-link--preview');
  $('.card__job-other-locations--preview').
      removeClass('card__job-other-locations--preview');

  $('.content__rightSide').css('opacity', '1');
  replaceStateURL('id', '');
  // we allow the user to scroll again
  allowBodyScroll();
}

/**
 * first Step on the apply Preview card email confirmation
 * @returns {boolean}
 */
function confirmEmail() {
  // First we remove any previous error message
  $('.has--error').removeClass('has--error');

  // We validate the email
  var email = $('.input--jobApply').val().trim();
  var validator = verifyEmail(email);

  // if is not a valid email we show the error messages
  if (!validator) {
    $('.jobApply__error').addClass('has--error');
    $('.input--jobApply').addClass('has--error');
    return true;
  }
  // if all goes well we show the next step of the apply process
  $('.jobApply__frame--stepEmail').hide();
  $('.jobApply__frame--stepConfirm').show();
  $('.jobApply__emailConfirm').text(email);

}

/**
 * Skip on the apply popup, if they hit no thank you
 * they will go to the source
 * @param string jobId
 */
function skipEmail(jobId) {
  var elem = $('[data-id=' + jobId + ']');
  var link = elem.attr('data-link') + '&nb=true';

  if (elem.hasClass('card__job')) {
    link = elem.find('.link-job-wrap').attr('data-link') + '&nb=true&action=f-link';
  }

  if (domain.device === 'mobile') {
    window.location.href = link
  } else {
    window.open(link, '_blank');
  }
}

/**
 * If the user clicks on No on the email confirmation
 * we send then back to the first step
 */
function noConfirmEmail() {
  $('.jobApply__frame--stepEmail').show();
  $('.jobApply__frame--stepConfirm').hide();
}

/**
 * All event listener should go here if possible
 */
function eventsListener() {
  // Auto complete for keyword
  $('#nv-k').autocomplete({
    serviceUrl: '/ajax/auto-suggest.php?type=keyword&language=' +
        domain.language + '&country=' + domain.country,
    triggerSelectOnValidInput: false,
    onSelect: function(value, data) {
    },
  });

  // Auto complete for location
  $('#nv-l').autocomplete({
    serviceUrl: '/ajax/auto-suggest.php?type=location&country=' +
        domain.country + '&language=' + domain.language,
    triggerSelectOnValidInput: false,
    onSelect: function(value, data) {
    },
  });

  // Hide filters went they click on anything else but the filters
  $('body').click(function(e) {

    // If the click target is not any filter elements AND
    // there is something to hide we hide it
    if (!$(e.target).hasClass('jobFilters__nvFilters') &&
        !$(e.target).hasClass('jobFilters__listFilters ') &&
        !$('.jobFilters__nvFilters').find(e.target).length &&
        !$('.jobFilters__listFilters ').find(e.target).length) {

      // $(thisList).hide();
      $('.jobFilters__listFilters').hide();
      $('.jobFilters__label').removeClass('isHover');
      $('.click_filter').removeClass('click_filter');

      if (domain.device === 'mobile') {
        $('#filter-wraper').delay(5).hide(0);
        $('body, html').css('overflow', 'initial');
      }

    }
  });
}

/**
 * Side emailBox for Desktop and bottom emailBox for mobile.
 */
function getEmailBoxHTML() {

  if (getUrlSingleVar('k') === '' && getUrlSingleVar('l') === '') {
    return true;
  }

  var paramsEmailBox = new Object();
  paramsEmailBox.keyword = getUrlSingleVar('k');
  paramsEmailBox.location = getUrlSingleVar('l');
  paramsEmailBox.country = domain.country;
  paramsEmailBox.language = domain.language;
  paramsEmailBox.languageFolder = domain.settings.language_folder;

  // Ajax file location
  var where = '/ajax/page_jobs/email-box.php';

  $.get(where, paramsEmailBox, function(response) {
    var objResponse = $.parseJSON(response);
    var  payload = objResponse.payload;

    if(domain.device === "mobile"){
      $(".content__rightSide").addClass("isActive");
    }
    $('#emailBox-card').html(payload.html);
    $('#emailBox-card').show();
  });

}


function getSalaryModuleHTML() {
  // Variables required for the widget
  var paramsSalaryWidgetBox            = new Object();
  paramsSalaryWidgetBox.country        = domain.country;
  paramsSalaryWidgetBox.language       = app.region;
  paramsSalaryWidgetBox.language       = domain.language;
  paramsSalaryWidgetBox.keyword        = getUrlSingleVar('k');
  paramsSalaryWidgetBox.version        = "002";


  // Ajax file location
  var where = "https://cdn-dynamic.talent.com/ajax/salary-module/salary-module.php";

  if(app.detectRepo == 1){
    where = '/ajax/salary-module/salary-module.php';
    // where = 'https://cdn-dynamic.talent.com/ajax/salary-module/salary-module.php';
  }

  $.get(where, paramsSalaryWidgetBox, function(response) {
    $(".content__rightSide").addClass("isActive");
    $('#salary-card').html(response);
    $('#salary-card').show();
  });

}

/**
 * first Step on the emailBox card email confirmation
 * @returns {boolean}
 */

function confirmEmailBox() {
  // First we remove any previous error message
  $('.has--error').removeClass('has--error');

  // We validate the email
  var email = $('.input--emailRegist').val().trim();
  var validator = verifyEmail(email);

  // if is not a valid email we show the error messages
  if (!validator) {
    $('.emailRegistration__notification--error').addClass('has--error');
    $('.input--emailRegist').addClass('has--error');
    return true;
  }
  // if all goes well we show the next step of the apply process
  $('.emailRegistration__inputHolder--stepEmail').hide();
  $('.emailRegistration__inputHolder--stepConfirm').show();
  $('.emailRegistration__emailConfirm').text(email);
}

/**
 * If the user clicks on No on the email confirmation
 * we send then back to the first step
 */
function noConfirmEmailBox() {
  $('.emailRegistration__inputHolder--stepEmail').show();
  $('.emailRegistration__inputHolder--stepConfirm').hide();
}

/**
 * This will get the latest search of a user and make a search base it on that
 * entry
 * @returns {boolean}
 */
function autoSearchWithLastUSerHistory(){
  // First we try to get the user's job_search history
   getUserHistory("job_search",function(response){
     //If we have an history we move on
     var lastSerch = response.list[0];
     //We only autofill if the country of the latest search is the same as their
     // current domain
     if(lastSerch.country == domain.country){
       //Auto fill information and submit the form
       $("#nv-k").val(lastSerch.keyword);
       $("#nv-l").val(lastSerch.location);
     }
     $("#main-search-form").submit();

   },function(){
     location.reload();
  });

}

/**
 * Add a new entry to the user's search history when triggered
 */
function addUserSearchToEventHistory() {
  var data = {};
  data.keyword = getUrlVars()['k'];
  data.location = getUrlVars()['l'];
  userEventTracket('job_search', data);
}


function SEOLinks(){

  if (getUrlSingleVar('k') == "" && getUrlSingleVar('l') == "") {
    return true;
  }

  var request = {}
  request.language = domain.language;
  request.langaugeFolder = domain.settings.language_folder;
  request.country = domain.country;
  request.location = getUrlSingleVar('l');
  request.keyword =  getUrlSingleVar('k');

  var where = "/ajax/page_jobs/SEOPopularSearchs.php";

  $.get(where,request,function(response){
    var objResponse = $.parseJSON(response);
    $(".js-relatedLinks").html(objResponse.payload.html);
  })

}

function easySearchSignUp() {
  var emailRaw = getUrlVars()['email'];
  var emailClean = "";

  if(getUrlVars()['project'] == "easysearch"){
    showJobSeekerPopup('createJobSeekerStep');
    $("input[name='emailCreate']").val();
  }
}

/**
 * Display next popup or send user to job source if the exp was finished
 * @param obj Answer from the ajax call
 */
function successTargetExperince(obj){
  if(obj.link == "end"){
    // So that we don't reshow
    sessionStorage.setItem("strategy", "warehouse_serp_v2");
    appStorage.noClosePopup = "true";
    showJobSeekerPopup('checkEmailStepImageSerp');
  }else{
    showJobSeekerPopup(obj.link);
  }
}

/**
 * This is a function that triggers on load only for mobile
 * checks if the parameters (source - utm_campaign) are met and triggers the
 * Tailored experience
 */
function targetExperienceOnLoad(){

  // Getting the url params
  var getSource = getUrlSingleVar('source');
  var getUtmCampaign = getUrlSingleVar('utm_campaign');
  var strategy = sessionStorage.getItem("strategy")
  var utmCampaignsAdwords = ['12654542804', '12649205494', '12654682759'];
  var utmCampaignsFacebookAds = ['23847256230930607'];
  var showPopup = false;

  if(getSource == "adwords"){
    if(utmCampaignsAdwords.includes(getUtmCampaign)){
        showPopup = true;
    }
  }
  if(getSource == "facebook_ads"){
    if(utmCampaignsFacebookAds.includes(getUtmCampaign)){
      showPopup = true;
    }
  }
  if(domain.country != "us" || strategy == "warehouse_serp_v2" || domain.jobSeekerLogin == "1"){
    showPopup = false;
  }

  // If showpopup is true
  if(showPopup){
    // Show the target experience
    appStorage.conversionTest = "warehouse_serp_v2";
    appStorage.jobSeekerContext = "warehouse_serp_v2";
    showJobSeekerPopup('targetExperienceSerp-1');
  }
}

/**
 * This function is the one in charge of the Tailored Experience routing
 * @param elem The form we're sending
 * @param step The current step of the popup we are at
 * @param action Action the user is taking (next or back)
 */
function targetExperience(elem, step, action = 'next'){

  // Prevent default submit
  event.preventDefault();
  // Selectors
  var inputs = $(".TE--form input:checked");
  var data = "";
  var isValid = true;
  // Validation
  if(inputs.length == "0" && action != "back"){
    isValid = false;
    $('#tailoredError').addClass('has--error');
  }
  // Going through all the selected inputs
  for(var i=0; i<inputs.length; i++){
    if(i==0){
      data = inputs[i].value;
    }else{
      data += ","+inputs[i].value;
    }
  }
  // Params
  var params = {};
  params.step = step;
  params.action = action;
  params.data = data;
  params.jobSeekerContext = appStorage.jobSeekerContext;
  params.from = "serp";
  // Ajax file
  var where = '/ajax/jobSeeker/routerTargetExpSerp.php';
  // If isValid still is true
  if(isValid){
    // Adding the data to the session storage
    // sessionStorage.setItem('step', step);
    sessionStorage.setItem(step, data);

    $.ajax({
      type: 'POST',
      url: where,
      data: params,
      success: function(response) {
        var objResponse = $.parseJSON(response);
        // objResponse = objResponse.payload;
        //Response routing
        if (objResponse.result == 'ok') {
          successTargetExperince(objResponse.payload);
        } else {
          failFunction(objResponse.payload);
        }
      },
    });
  }
}

/**
 * initial functions for the SERP (page-jobs.php)
 */

function initialFunctions() {

  // We dont show the app object on the HTML
  $('#app').remove();

  // Easysearch sign up
  easySearchSignUp();
  //Showing clean filters button
  showClearFilters();
  //Show the x to clean the keyword and location
  showClearInput();
  //Desktop and mobile events listener must go here
  eventsListener();

  //Show frienly related SEO links
  SEOLinks();

  //Side email box for Desktop and bottom email box for mobile
  // getEmailBoxHTML();

  /**
   * Desktop only js functions
   */
  if (domain.device === 'desktop') {
    //Side salary module for desktop only for the moment
    getSalaryModuleHTML();
    //Reset the SessionStorage for jobClickIds went the user reloads
    removeSessionStorageElement('jobClickIds');
    //Load a job preview from the jobid on the URL
    openJobPreview(getUrlSingleVar("id"), 'load');
    //Desktop only events listener
    desktopEventsListener();
  } else {
    /**
     * Mobile only js functions
     */
    // Validation for the target exp
    targetExperienceOnLoad();
  }
}