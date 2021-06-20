'use strict';

/**
 * This will prevent the scroll went the user on mobile clicks on the burger menu
 */
function toggleMobileMenu() {
  // Lest show/hide all the elements that we need
  $('.menu__wrapHidden').toggle();
  $('.menu-burger-icon').toggle();
  $('.menu-close-icon').toggle();

  // If the device need more space to scroll
  if ($('menu__multiItem').length) {
    $('.menu__wrapHidden').height($(window).height() - 132);
  } else {
    $('.menu__wrapHidden').height($(window).height());
  }

  // If the new menu is visible we want to prevent the html to be scrollable
  if ($('.menu__wrapHidden').is(':visible')) {
    $('body, html').addClass('active-menu');
  } else {
    $('.active-menu').removeClass('active-menu');
  }
}

/**
 * General use email validator
 * @param string email
 * @returns {boolean}
 */
function verifyEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var validate = re.test(email.trim());

  return validate;
}

/**
 * General use phone validator
 * @param string phone
 * @returns {boolean}
 */
function verifyPhone(phone) {
  var re = /^\d+$/;
  var validate = re.test(phone.trim());
  if(validate){
    if (phone.trim().length != domain.phoneLength){
      validate = false;
    }
  }
  return validate;
}


/**
 * General use password validator
 * @param string password
 * @returns {boolean}
 */

function verifyPassword(password) {

  var re = /.{6,100}/;
  var validate = re.test(password);

  return validate;
}

/**
 * Asynchronous method that receives the jobId and verifies
 * if the geocode associated with the job should be reprocessed
 * or not.
 */
function fixGeocodeProcess(jobId, country) {
  // Var initialization
  var params = {};
  //Request location
  var where = '/ajax/fixGeocodeProcess/fixGeocodeProcess.php';
  // Set params to send.
  params.jobid   = jobId;
  params.country = country;
  // Async call
  $.get({url: where, data: params, async: true});
}

/**
 * This will take the data-link attribute and re route the user to
 * the endpoint while also tracking the click
 * @param html elem      The  job been click on
 * @param event event     Event for firefox compatibility
 */


function openJobDescription(elem, jobId, event) {

  // We want to prevent the anchor to act out
  if (event.stopPropagation) {
    event.stopPropagation();
    event.preventDefault();
  }
  if (domain.jobSeekerLogin === '1') {
    var data = {};
    data.jobid = jobId;
    //deactivating this to give priority to actual open links like emails etc, this needs to be address later
    // userEventTracket('job_click', data);
  }

  // Call the async method to check if the geocode should be reprocessed.
  if (app.pageName === 'serp' && domain.device === 'desktop') {
    fixGeocodeProcess(jobId, domain.country);
  }

  // page jobs have an special job preview for desktop
  // all this functions are on the page-search.js file
  if (app.pageName === 'serp' && domain.device === 'desktop' &&
      (!event.metaKey && !event.ctrlKey)) {

    // // this will return the jobId form the element
    // // while also flag the element as 'preview active'
    let jobId = getPreviewJobId(elem);

    // we show the review card
    openJobPreview(jobId, 'click');
    return true;
  }

  // General use link
  var link = elem.attr('data-link') + '&nb=true';

  // if it is mobile we change the current tab
  // if it is desktop we open the job in a new one
  if (domain.device === 'mobile') {
    window.location.href = link;
  } else {
    window.open(link, '_blank');
  }

}

/**
 * This will verify if an file input have the appropiate file type to be upload
 * and size
 * @param elem
 * @returns {boolean}
 */

function uploadJobSeekerFile(elem, successFunction) {

  //If no value then there is nothing to do
  if ($(elem).val() === '') {
    return true;
  }

  //Clean the fileName to remove the fakepath
  var fileName = $(elem).val().replace(/C:\\fakepath\\/i, '');
  //From the fileName we extract the fileType
  var fileType = fileName.split('.').pop();
  //Array with the list of type of document we currently accept
  var acceptedTypes = ['doc', 'docx', 'pdf', 'txt', 'rtf', 'odt'];
  //Attribute name of the file input (Ex: name='cv')
  var inputName = $(elem).attr('name');
  //Javascirpt native call of the input
  var input = document.getElementById(inputName);
  //File value to be upload
  var file = input.files[0];
  //Size of the file that wants to be uploaded
  var fileSize = file.size;

  //Remove any previous message or indication of errors
  $('.button--uploadFile[for=' + inputName + '].has--file').
      removeClass('has--file');
  $('.button--uploadFile[for=' + inputName + '].has--error').
      removeClass('has--error');
  $('.error-message[data-for=' + inputName + ']').removeClass('has--error');
  $('.success--file[data-for=' + inputName + ']').removeClass('has--file');

  //If it all good then we update the visuals of the input to fit the new file
  if ((jQuery.inArray(fileType, acceptedTypes) > -1) && (fileSize < 2000000)) {

    $('.success--file[data-for=' + inputName + '] .success--file__text').
        text(fileName);
    $('.success--file[data-for=' + inputName + ']').addClass('has--file');
    $('.button--uploadFile[for=' + inputName + ']').addClass('has--file');
    $('input[name=file-' + inputName + ']').val(fileName);
    if (successFunction) {
      successFunction(file);
    }

  } else {

    //If the file is not the right type we show an error message, specifict
    //to the file type
    if (jQuery.inArray(fileType, acceptedTypes) <= -1) {
      $('.error-type[data-for=' + inputName + ']').addClass('has--error');
    }
    //If is not the right size we show an error message, specifict to the file
    // size (2MB)
    if (fileSize > 2000000) {
      $('.error-size[data-for=' + inputName + ']').addClass('has--error');
    }
    //Add the necesary class to the input to show the error red border
    $('.button--uploadFile[for=' + inputName + ']').addClass('has--error');
    //Clean the input value so we don't upload an none accepted file
    $(elem).val('');
    $('input[name=file-' + inputName + ']').val('');
  }
}

function clearFileInput(inputName) {
  $('.button--uploadFile[for=' + inputName + '].has--file').
      removeClass('has--file');
  $('.success--file[data-for=' + inputName + ']').removeClass('has--file');
  $('input[name=file-' + inputName + ']').val('');
  $('input[name=' + inputName + ']').val('');
}

/**
 * This will add or remove the job to the favorites table depending if
 * the job was already in the user's favorites list.
 * @param string id
 * @param event event
 */
function addToFavoritesJob(jobId, event, source) {
  if (event.stopPropagation) {
    event.stopPropagation();
    event.preventDefault();
  }

  //if they are not log in we show then the user popup
  if (domain.jobSeekerLogin === '0') {

    appStorage.jobSeekerContext = 'favorites';
    appStorage.actionSouce = source;
    appStorage.jobSeekerFavToAdd = jobId;
    showJobSeekerPopup('checkEmailStep');

  } else {
    //If the button press has the class active-fav
    // we want to remove that jobid from the favorites
    if ($(event.target).hasClass('active-fav')) {

      // We remove the active-fav class from the clicked button
      $(event.target).removeClass('active-fav');

      // some buttons need to updates the text from "remove to favorites"
      // to "add to favorites"
      $(event.target).text($(event.target).attr('data-fav'));

      // On white page we want to update all the fav call to action
      if (app.pageName == 'whitepage') {
        $('.button--favHeader, button--ctaFav').removeClass('active-fav');
        $('.button--ctaFav').text($('.button--ctaFav').attr('data-fav'));
      }

      // on serp page desktop we want to also update the favorites
      if (app.pageName == 'serp' && domain.device == 'desktop') {
        $('.card__job[data-id=' + jobId + ']').
            find('.button--fav').
            removeClass('active-fav');
        $('.button--fav[data-button-id=' + jobId + ']').
            removeClass('active-fav');
        if ($('#jobPreview').html() != '' &&
            $('.card__job[data-id=' + jobId + ']').
                hasClass('card__job--preview'))
          addToJobIdsSessionStorage(jobId, $('#jobPreview').html());
      }
      var location = '';
      if (app.pageName == 'serp') {
        location = $('#nv-l').val();
      }
      //We remove the jobid from the job_favorite history
      var data = {};
      data.jobid = jobId;
      data.searchLocation = location;
      userEventTracket('job_favorite', data, 'delete');

    } else {

      //We add the active-fav class to update visuals and flag the clicked elemt
      $(event.target).addClass('active-fav');

      // some buttons need to updates the text from "add to favorites"
      // to "remove to favorites"
      $(event.target).text($(event.target).attr('data-rem'));

      // On white page we want to update all the fav call to action
      if (app.pageName == 'whitepage') {
        $('.button--favHeader, button--ctaFav').addClass('active-fav');
        $('.button--ctaFav').text($('.button--ctaFav').attr('data-rem'));
      }

      if (app.pageName == 'serp' && domain.device == 'desktop') {
        $('.card__job[data-id=' + jobId + ']').
            find('.button--fav').
            addClass('active-fav');
        $('.button--fav[data-button-id=' + jobId + ']').addClass('active-fav');
        if ($('#jobPreview').html() != '' &&
            $('.card__job[data-id=' + jobId + ']').
                hasClass('card__job--preview'))
          addToJobIdsSessionStorage(jobId, $('#jobPreview').html());
      }

      //We add the jobid from the job_favorite history
      var data = {};
      data.jobid = jobId;
      userEventTracket('job_favorite', data);
    }

  }
}

/**
 * Get's user favorite history and flag job listing job cards
 * @returns {boolean}
 */
function checkFavoritesOnJobListing() {
  if (domain.jobSeekerLogin === '0' || $('.card__job').length == 0) {
    return true;
  }
  getUserHistory('job_favorite', function(objResponse) {
    objResponse.list.forEach(function(entry) {
      $('.card__job[data-id=' + entry.jobid + ']').
          find('.button--fav').
          addClass('active-fav');
    });
  }, function(response) {
    return true;
  });
}

/**
 * This will check if the element is partial view
 * @param html elem
 * @returns {boolean|boolean}
 */
function isElementInPartialView(elem) {
  var rect = elem.getBoundingClientRect();
  var elemTop = rect.top;
  var elemBottom = rect.bottom;

  // Partially visible elements return true:
  var isVisible = elemTop < window.innerHeight && elemBottom >= 0;
  return isVisible;
}

/**
 * This will check if the element is total view
 * @param html elem
 * @returns {boolean|boolean}
 */
function isElementInTotalView(elem) {
  var rect = elem.getBoundingClientRect();
  var elemTop = rect.top;
  var elemBottom = rect.bottom;

  // Only completely visible elements return true:
  var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
  return isVisible;
}

/**
 * General scroll prevention function
 */
function preventBodyScroll() {
  $('html').addClass('no-scroll');
}

/**
 * If preventBodyScroll was call before
 * this will allow the scroll back
 */
function allowBodyScroll() {
  $('html').removeClass('no-scroll');
}

/**
 * General use closePopup if the popup is been attach to the popup__background
 */
function closePopup() {
  allowBodyScroll();
  $('.popup__background').removeClass('is--active');
  $('.popup__background').html('');
}

/**
 * General use closePopup if the popup is been attach to the popup__background
 */
function showPopup() {
  $('.popup__background').addClass('is--active');
}

/**
 * General use closePopup went the user click on the
 * fade background of the popup.
 */

function closePopupBackground() {
  $('.popup__background').on('mousedown', function(e) {
    if (e.target !== this)
      return;
    closePopup();
  });
}

/**
 * Remove general use closePopup went the user click on the
 * fade background of the popup.
 */

function removeClosePopupBackgroundEvent() {
  $('.popup__background').unbind();
}

/**
 * Sets a Cookie with the key and value given
 * @param string cookieName    key of the cookie
 * @param string cookieValue   value of the cookie
 * @param int    expireDays    number of days that the cookie will be valid
 */
function setCookie(cookieName, cookieValue, expireDays) {

  var d = new Date();
  d.setTime(d.getTime() + (expireDays * 24 * 60 * 60 * 1000));
  var expires = 'expires=' + d.toUTCString() + ';';

  document.cookie = cookieName + '=' + cookieValue + ';' + expires +
      'SameSite=Lax;path=/;domain=.talent.com;';
}

/**
 * Gets a Cookie value
 * @param  string cookieName    String key of the cookie
 * @returns {string}
 */

function getCookie(cookieName) {
  var name = cookieName + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

/**
 * return an array with all the $_GET variables
 * @returns {{}}
 */

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
      function(m, key, value) {
        vars[key] = value.split('#').shift();
      });
  return vars;
}

/**
 * Will return an specific value on the $_GET parameters, if not found it will
 * return an empty string ""
 * @param value
 * @returns {string}
 */
function getUrlSingleVar(value) {
  var value = getUrlVars()[value];
  if (!value) {
    value = '';
  }
  return value;
}

/**
 * This will setup the cookie preferred_language for 30 days went the user
 * clicks on the language menu.
 */
function preferredLanguageCookieSetup() {
  //We want to target the languages links on the menu
  $('.menu .languageMenuLink').click(function(event) {
    //prevent the links to act out
    if (event.stopPropagation) {
      event.stopPropagation();
      event.preventDefault();
    }
    //We get the current element been click
    var element = event.currentTarget;
    //We get the language value from the element
    var value = $(element).attr('data-lang');
    //Setting up the cookie preferred_language value
    setCookie('preferred_language', value, 30);
    //After that we just send the user to their final destination
    var link = $(element).find('a').attr('href');
    window.location.href = link;
  });
}

/**
 * Delete a Cookie with the given key
 * @param string cookieName
 */
function deleteCookie(cookieName) {
  document.cookie = cookieName +
      '=; expires=Thu, 01 Jan 1970 00:00:00 UTC;SameSite=Lax;path=/;domain=.talent.com;';
}

/**
 * Change type of a password input to text, so we can show the user the
 *  password that they are input
 * @param inputName the HTML attribute name of the input (ex <input name=test >
 * @param elem      the button that is been click for this event to trigger
 */

function showPassword(inputName, elem) {

  // We look for the target input that we want to change their current type
  var input = $('input[name=' + inputName + ']');

  // if their type is password we change it to text and change the button icon
  // to demostrate that their password is been show or hidden
  if (input.attr('type') == 'password') {
    input.attr('type', 'text');
    elem.addClass('has--show');
  } else {
    // but if their type was already text, we want to restore the password type
    // and reverse the icon to the hidden state
    input.attr('type', 'password');
    elem.removeClass('has--show');
  }
}

/**
 * This will send the user to the jobsource of the active job, on white page is
 * the current job, on SERP is the active job preview
 * @returns {boolean}
 */
function sendToJobSource() {
  var link = '/redirect?id=' + appStorage.activeJobId + '&lang=' +
      domain.language +
      '&k=' +
      app.keyword + '&l=' + app.location +
      '&context=' + app.pageName + '&nb=true&action=f-link';

  if (app.pageName == 'serp') {

    if ($('.card__job[data-id=' + appStorage.activeJobId + ']').length) {
      link = $(
          '.card__job[data-id=' + appStorage.activeJobId + '] .link-job-wrap').
          attr('data-link');

      link = link + '&nb=true&action=f-link';

    } else if($('.card__job-other-job[data-id=' + appStorage.activeJobId + ']').length) {

      link = $('.card__job-other-job[data-id=' + appStorage.activeJobId + ']').
          attr('data-link');
      link = link + '&nb=true&action=f-link';
    }

  }

  if(app.pageName == "whitepageBulk"){
    link = '/redirect?id=' + appStorage.activeJobId + '&lang=' +
        domain.language +
        '&k=' +
        app.jobTitle + '&l=' + app.jobLocation +
        '&context=' + app.pageName + '&nb=true&action=f-link';
  }
  // Passing country so that animation redirect works
  link += '&country=' + domain.country
  //All divices change the current URL
  window.open(link, '_self');
  return true;
}

/**
 * Takes the email input from the check user step and
 * if they don't have a jobSeeker account, we promnt that view
 * if they do we ask then to log in.
 */
function applyPopupEmailStep() {
  // Get email value
  var email = $('input[name=emailCheck]').val().trim();

  // Store the email account for verification processes
  appStorage.email = email;

  // Check if the email is correct, if it not correct we show then an error message
  if (verifyEmail(email)) {
    // Check if the email given have an jobSeeker account attach to it
    checkAccount(email, function(response) {
      // Display the legacy popup for account login process (email and password)
      showJobSeekerPopup('signInJobSeekerStep');

    }, function(response) {
      // if they dont have an account we ask then to create an account
      if (getUrlSingleVar('context') == 'messenger') {
        showJobSeekerPopup('createJobSeekerStep', '', '',
            appStorage.easyLoginInfo, 'talent');
      } else {
        showJobSeekerPopup('createJobSeekerStep');
      }
    });
  } else {
    // Showing error message if the email was not a valid one
    $('input[name=emailCheck]').addClass('has--error');
    $('.error-message[data-for=emailCheck]').addClass('has--error');
  }

}

/**
 * Takes the popup email + password combination and sign in the jobSeeker
 * if their information is valid, if their account is not been confirm we resend
 * the confirmation email and show then the confirmation panel. If they do have
 * confirm their account we send then to the source
 */
function signInApplyPopup() {
  // Inputs from the popup
  var email = $('input[name=emailLogin]').val().trim();
  var password = $('input[name=passwordLogin]').val();
  var rememberMe = false;
  var country = domain.country;
  var language = domain.language;
  var platform = 'talent';
  var uit = '';
  // isValid default value if true, if one of the inputs is wrong, this value will
  // change to false.
  var isValid = true;

  // Clean previous error messages
  $('.has--error').removeClass('has--error');

  // If the email is not valid we show the error message for that field
  if (!verifyEmail(email)) {
    $('input[name=emailLogin]').addClass('has--error');
    $('.error-message[data-for=emailLogin]').addClass('has--error');
    isValid = false;
  }

  // If the password is not valid we show the error message for that field
  if (!verifyPassword(password)) {
    $('input[name=passwordLogin]').addClass('has--error');
    $('input[name=emailLogin]').addClass('has--error');
    $('.error-message[data-for=passwordLogin]').addClass('has--error');
    isValid = false;
  }
  // If they check remember me we change the value to be true
  if ($('input[name=rememberMe]').is(':checked')) {
    rememberMe = true;
  }

  // if isValid still is true, we try to sign in the user
  if (isValid) {
    loginJobSeeker(email,
        password,
        country,
        language,
        rememberMe,
        platform,
        uit,
        function(response) { // sucessful log in route

          // if the account haven't been confirm we resend the confirmation
          // code email, and send then to that panel.
          if (response.status == 'not_confirmed') {
            showJobSeekerPopup('confirmCodeStep');
          } else {
            // Tracking the search when account creation is a success
            try {
              if (app.pageName == 'serp') {
                addUserSearchToEventHistory();
              }
            } catch (e) {
            }

            //If the context is apply we need to check if it is a quick apply
            //job or not
            if (appStorage.jobSeekerContext == 'apply') {
              //IF it is a quick apply job we need to check if the user's
              // have a CV or not
              if (appStorage.applyType == 'quickApply') {
                getUserStatus(function(response) {
                  // Add the reload value this variable so when a user is logged
                  // and tries to apply a job, the application process popups will have
                  // a close and reload effect when the popup is closed
                  appStorage.closeAndReload = "reload";
                  //If they do we don't ask for a CV on the application process
                  if (response.hasCV == 'true') {
                    routingApplyPopupProcess('false');
                  } else {
                    routingApplyPopupProcess('true');
                  }
                });
              } else {
                //If it is not a quick apply job we just send then to the source
                sendToJobSource();
              }
            } else {
              routingEndPointAccountCreation();
            }

          }

        }, function(response) { // fail log in route
          //If they where using an SSO then we quickply send them to log in with it
          if (response.reason == 'sso') {
            showJobSeekerPopup('signInAPIStep', '', '', '', response.platform);
          } else {
            // If the Password is invalid, print the error only below the
            // password input
            if (response.reason == "password") {
              $('input[name=passwordLogin]').addClass('has--error');
              $('.error-message[name=passwordLogin]').
                  html(response.user_message);
              $('.error-message[data-for=passwordLogin]').addClass('has--error');
            }
            else {
              // Error for the password + email combination
              $('input[name=passwordLogin]').addClass('has--error');
              $('input[name=emailLogin]').addClass('has--error');
              $('.error-message[data-for=SignInForm]').
                  html(response.user_message);
              $('.error-message[data-for=SignInForm]').addClass('has--error');
            }
          }

        });
  }

}

/**
 * If the email is valid and the limit for password reset email haven't been
 * reach we send the user the email with the instructions of how to reset
 * their password
 */

function resetPasswordSendEmailPopup() {
  // Inputs from the popup
  var email = $('input[name=emailReset]').val().trim();
  var country = domain.country;
  var language = domain.language;
  // isValid default value if true, if one of the inputs is wrong, this value will
  // change to false.
  var isValid = true;

  // Clean previous error messages
  $('.has--error').removeClass('has--error');

  // If the email is not valid we show the error message for that field
  if (!verifyEmail(email)) {
    $('input[name=emailReset]').addClass('has--error');
    $('.error-message[data-for=emailReset]').addClass('has--error');
    isValid = false;
  }
  // if isValid still is true, we try to send the reset password email
  if (isValid) {
    resetPasswordSendEmail(email, country, language, function() {
      // if we where able to send then the email we show then the
      // Success reset password email send panel.
      showJobSeekerPopup('resetPasswordSuccessStep','','','','',true);
    }, function() {

    });
  }

}

/**
 * Show the country selector on the account creation process
 */

function accountShowCountrySelector(){
  $("select[name=countryCreate]").closest(".inputWrap").removeClass("is--hidden");
  $("#countryMiddleButton").addClass('is--hidden');
  $(".js-acLabelCountry").hide();
}

/**
 * This will update the autocomplete of the account creation process based on the
 * selected country select input #countryCreate
 */
function updateSelectedCountryAccountCreation() {

  //First we get the country value Ex: 'us', 'ca', 'de'
  var countrySelected = $('#countryCreate').val();
  //Then we take the the data-lang on that option selected, because the auto
  // enableAutoCompleteLocationOnAccountProcess required a langauge as well
  var languageSelected = $(
      '#countryCreate option[value=' + countrySelected + ']').attr('data-lang');

  //We need to store this information for product placement
  appStorage.jobSeekerCountry = countrySelected;

  //We update the autocomplete location with this information
  enableAutoCompleteLocationOnAccountProcess(countrySelected, languageSelected);

}

/**
 * Create jobSeeker account with the information given in the create account
 * step
 */

function createJobSeekerPopup() {
  //prevent the links to act out
  if (event.stopPropagation) {
    event.stopPropagation();
    event.preventDefault();
  }
  // Inputs from the popup
  var firstName = $('input[name=firstName]').val().trim();
  var lastName = $('input[name=lastName]').val().trim();
  var email = $('input[name=emailCreate]').val().trim();
  var location = $('input[name=applicantLocationCity]').val().trim();
  var countryCreate = $('select[name=countryCreate]').val();
  var platform = $('input[name=platform]').val().trim();
  var messengerUserID = $('input[name=messengerUserID]').val().trim();
  var messengerPageID = $('input[name=messengerPageID]').val().trim();
  var password = $('input[name=passwordCreate]').val().trim();
  var phoneNumber = '';
  var phonePlatform = '';
  var rememberMe = false;
  var emailAllow = false;
  var country = domain.country;
  var language = domain.language;
  var languageFolder = domain.settings.language_folder;

  // isValid default value if true, if one of the inputs is wrong, this value will
  // change to false.
  var isValid = true;
  // Clean previous error messages
  $('.has--error').removeClass('has--error');

  // First name and Last name need to have at least one input, if is not
  // valid we show the error message
  if (firstName == '') {
    $('input[name=firstName]').addClass('has--error');
    $('.error-message[data-for=firstName]').addClass('has--error');
    isValid = false;
  }
  if (lastName == '') {
    $('input[name=lastName]').addClass('has--error');
    $('.error-message[data-for=lastName]').addClass('has--error');
    isValid = false;
  }

  // Email verification, if is not valid we show the error message
  if (!verifyEmail(email)) {
    $('input[name=emailCreate]').addClass('has--error');
    $('.error-message[data-for=emailCreate]').addClass('has--error');
    isValid = false;
  }
  //Location varification, if empty we show the error message
  if (location == '') {
    $('input[name=applicantLocationCity]').addClass('has--error');
    $('.error-message[data-for=applicantLocationCity]').addClass('has--error');
    isValid = false;
  }
  // Password verirification, if is not valid we show the error message
  if (!verifyPassword(password)) {
    $('input[name=passwordCreate]').addClass('has--error');
    $('.error-message[data-for=passwordCreate]').addClass('has--error');
    isValid = false;
  }

  // ToS checkbox verification, it need to be check in order to move forward
  // we show the error message
  if ($('input[name=rememberMe]').length) {
    if ($('input[name=rememberMe]').is(':checked')) {
      rememberMe = true;
    }
  } else {
    rememberMe = true;
  }

  // ToS checkbox Email verification, it need to be check in order to move forward
  // we show the error message
  if ($('input[name=allowEmail]').length) {
    if ($('input[name=allowEmail]').is(':checked')) {
      emailAllow = true;
    }
  } else {
    emailAllow = true;
  }

  if (isValid) {
    createJobseeker(firstName,
        lastName,
        email,
        password,
        country,
        language,
        location,
        rememberMe,
        emailAllow,
        platform,
        phoneNumber,
        phonePlatform,
        messengerUserID,
        countryCreate,
        function(response) {

          // Check if the messengerUserID comes from messenger bot
          if (messengerUserID) {
            $.ajax({
              url: '/ajax/messenger/accountCreationConfirmation.php',
              method: 'post',
              async: false,
              dataType: 'json',
              data: {
                messengerUserID: messengerUserID,
                messengerPageID: messengerPageID,
              },
            });
          }

          // Tracking the search when account creation is a success
          try {
            if (app.pageName == 'serp') {
              addUserSearchToEventHistory();
            }
          } catch (e) {}
          //If they user their email to create the account and not a SSO
          //we show the user the confirmation step
          if (response.platform == 'talent') {

            // We show the confirmation step (createJobseeker, already send the
            // confirmation email via php and the jobSeeker class)
            showJobSeekerPopup('confirmCodeStep');
          } else {
            routingPhoneNumberProcess();
          }

        }, function(response) {
          // If the email given was already taken we show the error message from
          // the ajax call
          if (response.reason == 'User already exists') {
            $('input[name=emailCreate]').addClass('has--error');
            $('.error-message[data-for=CreateForm]').
                text(response.user_message);
            $('.error-message[data-for=CreateForm]').addClass('has--error');
          }
          if (response.reason == 'Invalid Phone Number') {
            $('input[name=phone]').addClass('has--error');
            $('.error-message[data-for=phone]').addClass('has--error');
          }
          if (response.reason == 'Password too weak') {
            $('input[name=passwordCreate]').addClass('has--error');
            $('.error-message[data-for=passwordCreate]').addClass('has--error');
          }

        });
  }

}

/**
 * Apply popup process routing
 */
function routingApplyPopupProcess(askForCV) {
  //If it is quick apply we ask for the CV as the next step on the process
  if (appStorage.applyType == 'quickApply') {
    //IF we need to ask for the CV we change the step of the user's
    var step = 'userApplySummary';
    if (askForCV === 'true') {
      step = 'userCVUpload';
    }
    //Show the popup the user's needs to go
    showJobSeekerPopup(step);
    //We register the application information with the step
    registerApplyConvertionForApplyPopup(step);
  } else {
    //If it is not quickApply we just send then to the endpoint of the registration
    // process
    routingEndPointAccountCreation();
  }

}

/**
 * Registering apply convertion on the application popup went the apply process
 * starts and all this information will be store on the event talent_apply_popup
 * @param step string | application step taken
 */
function registerApplyConvertionForApplyPopup(step) {

  //Request location
  var where = '/ajax/applyProcess/storeApplyConvertionForApplyPopup.php';

  var params = {};
  //Information to be register
  params.jobid = appStorage.activeJobId;
  params.step = step;
  params.country = domain.country;
  $.get(where, params, function(response) {
  });

}

/**
 *
 */
function sendPhoneNumberJobSeekerPopup() {
  var phoneNumber = $('input[name=phone]').cleanVal().trim();
  var phonePlatform = $('input[name=phonePlatform]').val();
  var isValid = true;

  // Clean previous error messages
  $('.has--error').removeClass('has--error');

  //If there is a phone platform setup then the phone number becomes
  //required
  if (phoneNumber == '') {
    $('input[name=phone]').addClass('has--error');
    $('.error-message[data-for=phone]').addClass('has--error');
    isValid = false;
  }

  var params = {};
  params.phone = phoneNumber;
  params.phonePlatform = phonePlatform;

  if (isValid) {
    sendJobseekerPhoneNumber(phoneNumber,phonePlatform, domain.country, domain.language,
        function() {
          showJobSeekerPopup('confirmPhoneNumberCodeStep');
        }, function() {
          $('input[name=phone]').addClass('has--error');
          $('.error-message[data-for=phone]').addClass('has--error');
        });
  }

}

/**
 * Confirm jobSeeker account if the code given in the popup is valid
 */
function confirmPhoneNumberCodePopup() {
  // Inputs from the popup
  var code = $('input[name=confirmCode]').val();

  // isValid default value if true, if one of the inputs is wrong, this value will
  // change to false.
  var isValid = true;
  // Clean previous error messages
  $('.has--error').removeClass('has--error');

  // Code ened to be 4 digits only
  // if (code.length != 4) {
  //   $('input[name=confirmCode]').addClass('has--error');
  //   $('.error-message[data-for=confirmCode]').addClass('has--error');
  //   isValid = false;
  // }

  // if its all good we send the inform
  if (isValid) {
    confirmJobSeekerPhoneNumber(code, function() {
      if(appStorage.jobSeekerContext == 'apply'){
        routingApplyPopupProcess();
      }else{
        showJobSeekerPopup('userSuccessfulConfirmation');
      }


    }, function() {
      // Show error message if something is wrong with the code
      $('input[name=confirmCode]').addClass('has--error');
      $('.error-message[data-for=errorConfirm]').addClass('has--error');
    });
  }

}

/**
 * Upload the user's CV from the jobSeeker popup
 */
function uploadCVtoJobSeekerProfile() {

  //Gather data
  var filename = $('input[name=file-cv]').val();
  var input = document.getElementById('cv');
  var file = input.files[0];

  //Remove any old error messages
  $('.has--error').removeClass('has--error');

  var isValid = true;

  //If the CV is empty we show the error to the user
  if ($('input[name=file-cv]').val() === '') {
    $('.button--uploadFile[for=cv]').addClass('has--error');
    $('.error-required[data-for=cv]').addClass('has--error');
    isValid = false;
  }

  //If all is good we send the information to the profile manager
  if (isValid) {
    //Forming the request
    var fd = new FormData();
    var xhr = new XMLHttpRequest();
    //If there is a file in th einput we need to also add this to the request
    if (file) {
      fd.append('cv', file);
    }

    fd.append('file-cv', filename);
    fd.append('section', 'basicInfo');

    var where_to_upload = '/ajax/jobSeeker/manageJobseekerProfile.php';

    xhr.open('POST', where_to_upload, true);
    xhr.onload = function(response) {
      var obj = JSON.parse(xhr.responseText);
      //If the all is good we show the summary popup
      if (obj.result === 'ok') {
        showJobSeekerPopup('userApplySummary');
      }
    };
    //Sending all the information
    xhr.send(fd);
  }

}

/**
 * Sends the user's information to the apply API on the summary popup step
 */
function sendApplicationInformation() {

  //Remove any old error messages
  document.querySelectorAll('.has--error').
      forEach(el => el.classList.remove('has--error'));

  //Preparing Data
  var fd = new FormData();
  var xhr = new XMLHttpRequest();

  // Extra Questions step
  var questions = getSessionApplication();
  var jsonQuestions = JSON.stringify(questions);

  fd.append('jobid', appStorage.activeJobId);
  fd.append('country', domain.country);
  fd.append('language', domain.language);
  fd.append('applyWith', 'cv');
  fd.append('email', getEmailInJson(questions));

  // If questions object is greater than 0 append extra question to post request
  if (Object.keys(questions).length > 0) {
    fd.append('extraQuestions', jsonQuestions);
  }

  // Apply middleman location, no need for user id because we use the cookie for that
  var where_to_upload = '/ajax/jobSeeker/jobSeekerApply.php';

  xhr.open('POST', where_to_upload, true);

  xhr.onload = function(response) {
    var obj = $.parseJSON(xhr.responseText);
    obj = obj.payload;
    //If there was no issues we send the email and show a popup showing the user's
    // that they apply
    if (obj.response === 'ok') {

      deleteLocalApplicationStorage();

      sendApplicationEmail(obj.applicationID);
      showJobSeekerPopup('userSuccessfulConfirmation');

      if(obj.applyDelivery === "api"){
        sendApplicationToClientServer(obj.applicationID);
      }

    } else {
      //If something went wrong we add or update the error message and add the necessary error clases to display
      // this information
      document.querySelector('.error-message[data-for=errorApply]').
          classList.
          add('has--error');
      document.querySelector(
          '.error-message[data-for=errorApply]').innerHTML = obj.user_message;
    }
  };
  xhr.send(fd);
}

/**
 * Patch for the new users when try to apply to a psot it job, this function
 * will ask for the baisc information and email of the user
 */

function sendApplicationInformationPatch(){

  //prevent the links to act out
  if (event.stopPropagation) {
    event.stopPropagation();
    event.preventDefault();
  }
  //Remove any old error messages
  document.querySelectorAll('.has--error').
      forEach(el => el.classList.remove('has--error'));

  //Data for the user
  var firstName = $('input[name=postFirstName]').val().trim();
  var lastName = $('input[name=postLastName]').val().trim();
  var email = $('input[name=postEmailCreate]').val().trim();
  var isValid = true;

  // Valid we show the error message
  if (firstName == '') {
    $('input[name=postFirstName]').addClass('has--error');
    $('.error-message[data-for=postFirstName]').addClass('has--error');
    isValid = false;
  }
  // Valid we show the error message
  if (lastName == '') {
    $('input[name=postLastName]').addClass('has--error');
    $('.error-message[data-for=postLastName]').addClass('has--error');
    isValid = false;
  }
  // Email verification, if is not valid we show the error message
  if (!verifyEmail(email)) {
    $('input[name=postEmailCreate]').addClass('has--error');
    $('.error-message[data-for=postEmailCreate]').addClass('has--error');
    isValid = false;
  }
  //If all is good
  if(isValid){
    //Check if that email is already in the database
    checkAccount(email,function(){
      //if the email is the same one as their account we move then forward
      // send the otp and send the to the popup to confirm
      if($('input[name=postEmailCreate]').hasClass('is--disable')){
        sendOTPCodeEmail(email,4,function(){
          appStorage.email = email;
          appStorage.quickApplyFirstName = firstName;
          appStorage.quickApplyLastName = lastName;
          showJobSeekerPopup('verifyEmailStepApply');
        });
      }else{
        //If the email in on en existing account we show an error message
        $('input[name=postEmailCreate]').addClass('has--error');
        $('.error-message[data-for=postEmailCreate]').addClass('has--error');
      }
    },function(){
      // If threre is not user on that email we send the code and show
      // the verification step
      sendOTPCodeEmail(email,4,function(){
        appStorage.email = email;
        appStorage.quickApplyFirstName = firstName;
        appStorage.quickApplyLastName = lastName;
        showJobSeekerPopup('verifyEmailStepApply');

      });
    })
  }

}

/**
 * Update basic user information, email, first name and last name
 * if they confirm their email
 */
function updateUserEmailApplyPath(){
  if (event.stopPropagation) {
    event.stopPropagation();
    event.preventDefault();
  }
  //Code information
  var code = $('input[name=confirmCode]').val();
  //confirm code with the email
  simpleOTPemailConfirm(code, appStorage.email, function() {
    //Update the basic information
    updateUserApplyInfo(appStorage.quickApplyFirstName,
        appStorage.quickApplyLastName, appStorage.email, function() {
          //Send the application information
          sendApplicationInformation();
        }, function() {

        });

  }, function() {
    //If the code is wrong we show the error message
    $('input[name=confirmCode]').addClass('has--error');
    $('.error-message[data-for=confirmCode]').addClass('has--error');
  });

}

/**
 * This will take the email and confirmed with the code generatorn, and return
 * if the code is okay or not
 * @param code
 * @param email
 * @param successFunction
 * @param failFunction
 */

function simpleOTPemailConfirm(code,email,successFunction,failFunction){
  //Variables
  var params = {};
  params.email = email;
  params.code = code;
  // Ajax file location
  var where = '/ajax/jobSeeker/popups/accountCreationFlow/ajax/simpleConfirmEmailOTP.php';
  //Ajax call
  $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;

      //Response routing
      if (objResponse.response == 'ok') {
        //Excecute the success function if we detect that the code is correct
        successFunction(objResponse);
      } else {
        //Excecute the fail function if we detect that the code is incorrect
        failFunction(objResponse);
      }
    },
  });
}

/**
 * This will update the user apply informaiton, first name, last name, email
 * @param firstName
 * @param lastName
 * @param email
 * @param successFunction
 * @param failFunction
 */
function updateUserApplyInfo(firstName,lastName,email,successFunction,failFunction){
  var params = {};
  params.email = email;
  params.firstName = firstName;
  params.lastName = lastName;
  // Ajax file location
  var where = '/ajax/jobSeeker/popups/accountCreationFlow/ajax/updateUserApplyInfo.php';
//Ajax call
  $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;

      //Response routing
      if (objResponse.response == 'ok') {
        //Excecute the success function the data was succesfuly updated
        successFunction(objResponse);
      } else {
        //Excecute the fail function if there was a problem updating the data
        failFunction(objResponse);
      }
    },
  });
}

/**
 * This will send the confirmation email for the applicant using the application ID provided by the apply process
 * @param applicationID
 */
function sendApplicationEmail(applicationID) {
  var fd = new FormData();
  var xhr = new XMLHttpRequest();

  fd.append('applicationID', applicationID);

  var where_to_upload = '/ajax/jobSeeker/jobSeekerSendApplicationEmail.php';

  xhr.open('POST', where_to_upload, true);
  xhr.send(fd);
}

/**
 * This will send the application information to the client's server using the application ID provided by the request process.
 * @param applicationID
 */
function sendApplicationToClientServer(applicationID) {
  let fd = new FormData();
  let xhr = new XMLHttpRequest();

  fd.append('applicationID', applicationID);

  const where_to_upload = '/ajax/jobSeeker/sendApplicationToClientServer.php';

  xhr.open('POST', where_to_upload, true);
  xhr.send(fd);
}

/**
 * Confirm jobSeeker account if the code given in the popup is valid
 */
function confirmCodePopup() {
  // Inputs from the popup
  var code = $('input[name=confirmCode]').val();

  // isValid default value if true, if one of the inputs is wrong, this value will
  // change to false.
  var isValid = true;
  // Clean previous error messages
  $('.has--error').removeClass('has--error');

  // Code ened to be 4 digits only
  // if (code.length != 4) {
  //   $('input[name=confirmCode]').addClass('has--error');
  //   $('.error-message[data-for=confirmCode]').addClass('has--error');
  //   isValid = false;
  // }

  // if its all good we send the inform
  if (isValid) {
    confirmJobSeekerEmail(code, function() {

      routingPhoneNumberProcess();

    }, function() {
      // Show error message if something is wrong with the code
      $('input[name=confirmCode]').addClass('has--error');
      $('.error-message[data-for=errorConfirm]').addClass('has--error');
    });
  }

}

/**
 * Phone number registration process path, if the domain.allowSMSandWA is 1
 * it means that the country have a SMS and WA strategy and phone number needs
 * need to be ask furing the account creation process
 */
function routingPhoneNumberProcess(){

  //If the country have a SMS and WA strategy we move to the phone popup
  if (domain.allowSMSandWA == 1 &&
      appStorage.jobSeekerCountry == domain.country) {
    // Use the following validation to allow the page to reload when
    // the user clicks in the close button of the Upload CV Process
    if (appStorage.jobSeekerContext === 'apply' &&
        appStorage.applyType == 'quickApply') {
      appStorage.closeAndReload = "reload";
      if( domain.testGroup == 'A' &&
          domain.testName == 'sms_account_creation'){
        //Show the phone number popup
        showJobSeekerPopup('userPhoneNumber');
      }else{
        // Show application route
        routingApplyPopupProcess('true');
      }
      return true;
    }else{
      //Show the phone number popup
      showJobSeekerPopup('userPhoneNumber');
    }

  } else {
    // There is no need for confirming the user on other registration
    // platforms, also if the context is apply, we sendthen to the application
    // process for the other ones we just show then a popup.
    if (appStorage.jobSeekerContext === 'apply') {
      appStorage.closeAndReload = "reload";
      routingApplyPopupProcess('true');
    } else {
      showJobSeekerPopup('userSuccessfulConfirmation');
    }
  }

}

/**
 * logs out the user by removing the user-token cookie and refreshing
 * the site
 */
/*
function logoutJobSeeker() {
  // jobSeeker log out logout location
  var where = '/ajax/jobSeeker/logoutJobSeeker.php';
  $.get(where, '', function(response) {
    location.reload();
  });
}
*/
/**
 * This determents what happen went a users does the following:
 * Finish the account creation process
 * Successful sign in/Login with ANY of the  options (SSO or Email)
 * @param reload string If you don't want the site to reload set it to 'false'
 */

function routingEndPointAccountCreation(reload) {
  //We send the user to the job source if they successfuly confirm their account
  // and we close the popup

  if (getUrlVars()['uit']) {
    replaceStateURL('uit', '');
    replaceStateURL('action', '');
    replaceStateURL('platform', '');
    replaceStateURL('jobSeekerContext', '');
  }
  //SSO invalid sign in context
  if (appStorage.jobSeekerContext == 'invalid_signin') {
    appStorage.jobSeekerContext = getUrlVars()['jobSeekerContext'];
  }
  //Apply process context
  if (appStorage.jobSeekerContext == 'apply') {
    var data = {};
    data.jobid = appStorage.activeJobId;
    if (app.pageName == 'serp') {
      data.searchLocation = $('#nv-l').val();
    }
    userEventTracket('job_ioa', data);
    sendToJobSource();

  } else if (appStorage.jobSeekerContext == 'user-page') {
    var url = getUrlVars();
    var params = Object.entries(url).
        map(item => item[0] + '=' + item[1]).
        join('&');

    window.location.href = domain.settings.language_folder +
        appStorage.jobSeekerUserPage + '?' + params;
  }
  //Home page context
  else if (appStorage.jobSeekerContext == 'home') {
    window.location.href = domain.settings.language_folder + '/jobs';
  }
  //Favorites process
  else if (appStorage.jobSeekerFavToAdd != '' && appStorage.jobSeekerContext == 'favorites') {
    //We add the jobid from the job_favorite history
    var data = {};
    data.jobid = appStorage.jobSeekerFavToAdd;
    userEventTracket('job_favorite', data);
    location.reload();
  }
  // For serp tailored experience
  else if(appStorage.jobSeekerContext == "warehouse_serp_v2"){

    var url = getUrlVars();
    url.l = appStorage.userLocation;
    var params = Object.entries(url).
        map(item => item[0] + '=' + item[1]).
        join('&');

    window.location.href = domain.settings.language_folder + '?' + params;

  } else if(appStorage.jobSeekerContext == "salaryWhitepageWidget"){

    // Add the language folder to this variable and check if its undefined
    var languageFolder = domain.settings.language_folder;

    // If its undefined, leave it blank
    if (languageFolder == undefined) {
      languageFolder = "";
    }

    window.location.href = languageFolder + "/salary?job="+app.jobTitle;

  }
  else {

    if (reload != 'false') {
      location.reload();
    }

  }
  closePopup();
}

/**
 * This logs out the user's and refresh the site
 */
function logoutJobSeeker() {
  // Delete all application questions when user logout
  deleteLocalApplicationStorage();
  // jobSeeker log out logout location
  var where = '/ajax/jobSeeker/logoutJobSeeker.php';
  $.get(where, '', function(response) {
    location.reload();
  });
}

/**
 * Delete local Storage application
 * When user logout delete from local storage
 * all the element that has the prefix application
 */
function deleteLocalApplicationStorage() {
  // Look into the local storage for the prefix application
  for (var i = 0; i < localStorage.length; i++){
    if (localStorage.key(i).substring(0,11) === "application") {
      localStorage.removeItem(localStorage.key(i));
    }
  }
}

/**
 * This will target the jobSeeker popup router, and show one of the steps depending
 * on the input route
 *
 * route can have the following values:
 *
 * checkEmailStep             for /ajax/jobSeeker/HTML/popupCheckEmailStep.php
 * confirmCodeStep            for /ajax/jobSeeker/HTML/popupConfirmCodeStep.php
 * resetPasswordStep          for /ajax/jobSeeker/HTML/popupResetPasswordJobSeekerStep.php
 * resetPasswordSuccessStep   for /ajax/jobSeeker/HTML/popupResetPasswordSuccessStep.php
 * createJobSeekerStep        for /ajax/jobSeeker/HTML/popupCreateJobSeekerStep.php
 * signInJobSeekerStep        for /ajax/jobSeeker/HTML/popupSignInJobSeekerStep.php
 * signInAPIStep              for /ajax/jobSeeker/HTML/popupReturningAPISignIn.php
 * userCVUpload               for /ajax/jobSeeker/HTML/popupUploadCV.php
 * userApplySummary           for /ajax/jobSeeker/HTML/popupApplySummary.php
 * userPhoneNumber            for /ajax/jobSeeker/HTML/popupPhoneNumberStep.php
 * confirmPhoneNumberCodeStep for /ajax/jobSeeker/HTML/popupConfirmCodeStep.php
 *
 * Router is in /ajax/jobSeeker/HTML/popupRouter.php
 *
 * @param route string that can take the values showing top
 * @param jobId string the jobid of the job that the user try to apply to
 * @param ioa   string with false or true, if true it will register an ioa
 */

function showJobSeekerPopup(route, jobId, ioa, easySignin, platform, legacy) {

  if (route == "") {
    return true;
  }

  // if we want to try to register an ioa we first need to check if
  // we are not going to double register that event.
  if (ioa === 'true') {

    // we want to keep a list of the jobs with ioa already register
    if (appStorage.ioaList !== undefined) {
      //if we already have some ids store we just check
      // if the one been click on is on the list
      if (appStorage.ioaList.indexOf(jobId) === -1) {
        //not on the list? then we store it
        appStorage.ioaList = appStorage.ioaList + ',' + jobId;
      } else {
        //if it is already in the list we don't want to send this ioa
        ioa = 'false';
      }
    } else {
      //if this is the first store we just need to put the id
      appStorage.ioaList = jobId;
    }
  }

  if (!easySignin && appStorage.backupUit) {
    easySignin = appStorage.backupUit;
  }

  appStorage.jobSeekerCountry = domain.country;

  if (!platform && appStorage.backupPlatform) {
    platform = appStorage.backupPlatform;
  }
  var source = '';
  if (getUrlVars()['source']) {
    source = getUrlVars()['source'];
  }

  var params = {};
  params.country = domain.country;
  params.language = domain.language;
  params.languageFolder = domain.settings.language_folder;
  params.route = route;
  params.jobid = appStorage.activeJobId;
  params.registerIOA = ioa;
  params.device = domain.device;
  params.jobSeekerContext = appStorage.jobSeekerContext;
  params.uit = easySignin;
  params.platform = platform;
  params.jobSource = source;
  params.forceRegistration = domain.forceRegistration;
  params.at = appStorage.applyType;
  params.newJobSeeker = appStorage.newJobSeeker;
  params.closeAndReload = appStorage.closeAndReload;
  params.accountType = appStorage.accountType;
  params.midStep = appStorage.midStep;
  params.phone = appStorage.phone;
  params.email = appStorage.email;
  params.otpCountry = domain.otpCountry;
  params.allowSMSandWA = domain.allowSMSandWA;
  params.bulkRoute = appStorage.bulkRoute ;
  params.suggested_mbg = appStorage.suggested_mbg ;
  params.k_mbg = appStorage.k_mbg ;
  params.l_mbg = appStorage.l_mbg ;
  // This is to make sure the account creation does not close if user comes from
  // adwords for tailored exp
  if(appStorage.noClosePopup == "true"){
    params.noClosePopup = appStorage.noClosePopup;
  }
  // JobSeeker router location
  var where = '/ajax/jobSeeker/popups/popupRouter.php';
  // Set the conditions to get the router
  if (domain.otpCountry == "1") {
    // New account creation router flow
    where = '/ajax/jobSeeker/popups/accountCreationFlow/_newFlowRouter.php';
  }
  if (legacy == true || appStorage.applyType == "quickApply") {
    where = '/ajax/jobSeeker/popups/popupRouter.php';
  }

  // Sending the information to the popups
  $.get(where, params, function(response) {
    var objResponse = $.parseJSON(response);
    // we apprend the response to our general use popup
    hangElementToPopup(objResponse.payload.HTML);
    // we clean the URL from any SSO login information
    if (getUrlVars()['uit']) {
      appStorage.easyLoginInfo = getUrlVars()['uit'];
      replaceStateURL('uit', '');
      replaceStateURL('action', '');
      replaceStateURL('platform', '');
    }
    if (getUrlVars()['jobSeekerContext']) {
      appStorage.easyLoginInfo = getUrlVars()['uit'];
      replaceStateURL('jobSeekerContext', '');
      replaceStateURL('at', '');
    }
  });
}

function hangElementToPopup(html) {
  if ($('#popupBackground').length > 0) {
    $('#popupBackground').html(html);
  } else {
    $('body').
        append(
            '<div class="popup__background" id="popupBackground">' + html +
            '</div>');
  }
  // we show the popup
  showPopup();
  // we prevent the site to scroll
  preventBodyScroll();
  // and we add the background popup event that, if they click on the background
  // it will close the popup

  if (domain.forceRegistration == '' && appStorage.jobSeekerContext !=
      'apply' && appStorage.noClosePopup == "") {
    closePopupBackground();
  } else if(appStorage.noClosePopup == "true" && domain.device == "mobile"){
    removeClosePopupBackgroundEvent();
  } else {
    removeClosePopupBackgroundEvent();
  }
}

/**
 * Auto focus the first input without value on the popup
 */

function focusFirstTextInputOnPopup() {
  //get the list of inputs on the popup
  var elementsToFocus = document.getElementById('popupBackground').
      querySelectorAll('.input--text');
  var elementToFocus = "";

  //Foreach element we check if they have a value
  elementsToFocus.forEach(function(el){
        //if they don't have a value we take that one
        if($(el).val() == "" && elementToFocus == ""){
          elementToFocus = el;
        }
      }

  );
  //If there is one we focus it
  if (elementToFocus) {
    elementToFocus.focus();
  }
}

function showJobSeekerLogIn(jobSeekerContext) {
  appStorage.jobSeekerContext = jobSeekerContext;
  appStorage.activeJobId      = getUrlSingleVar("id");

  if (jobSeekerContext == 'home') {
    showJobSeekerPopup('checkEmailStep');
  } else {
    showJobSeekerPopup('checkEmailStep');
  }
}

/**
 *  Apply CTA actions, if the jobSeeker is not log in we ask then for their email
 *  and check if they have an account with us, if they do we send then to log in
 *  if they don't we show then the creation account step. In the case they are log
 *  in we send then to the source if they are confirm, if they are not confirm
 *  in that case we ask then to confirm their account on the confirm account step
 * @param jobId  string The id of the job intend to be apply
 * @param source string  The CTA that trigger that application
 * @param isPPC  string If the job is a PPC or not
 * @param isQuickApply string If the job is a quick apply or not
 * @returns {boolean}
 */
function applyRouter(jobId, source, isPPC, isQuickApply) {

  // We update the activeJobId value so the sendToJobSource() knows where to go
  appStorage.activeJobId = jobId;
  appStorage.actionSouce = source;
  appStorage.jobSeekerContext = 'apply';
  if (isQuickApply === 1) {
    appStorage.applyType = 'quickApply';
  } else {
    appStorage.applyType = 'source';
  }

  if (app.pageName == 'whitepage') {
    var params = {};
    params.id = app.jobid;
    params.country = domain.country;
    $.get('/ajax/update-ioa-status.php', params, function() {
    });
  }
  if (
      app.applyUser != 'true'
  ) {
    sendToJobSource();
    return true;
  }

  // If it is a quickApply do not do any other validation
  if (appStorage.applyType == 'quickApply') {
    checkQuestions();
    return true;
  }

  //we try to get the cookie user-token
  var userToken = domain.jobSeekerLogin;

  //if it not empty we are going to check if they are confirm or notresendConfirmationCodeEmail
  if (userToken === '1') {

    var data = {};
    data.jobid = jobId;
    if (app.pageName == 'serp') {
      data.searchLocation = $('#nv-l').val();
    }
    userEventTracket('job_ioa', data);

    // Checking user's status value
    getUserStatus(function(response) {

      // if it is not_confirmed we need to resend the confirmation email
      // and show then the confirm code step on the popup
      if (response.status == 'not_confirmed') {
        showJobSeekerPopup('confirmCodeStep', jobId, 'true');
        return true;
      } else {
        //If it is not a quickApply we just send then to the source
        sendToJobSource();
        //if they are confirmmed we just send then to the job source
        return true;
      }
    }, function(response) {

      // if for some reason they have an invalid cookie we are going to delete it
      // and show then the first step of the jobSeeker creation process
      showJobSeekerPopup('checkEmailStep', jobId, 'true');
    });

  } else {
    //If it is a quickapply job we need to store this for routing the user
    // accordently
    if (isPPC === 1) {
      sendToJobSource();
    } else {
      // if they are not log in we show then the first step of the jobSeeker creation
      // process

      // If it's part of the test
      showJobSeekerPopup('checkEmailStep', jobId, 'true');
    }
  }
}

/**
 * Check if an email have an jobSeeker account attach to it
 * @param email         Email of the user we want to check
 * @param successFunction    Function if the user have an account
 * @param failFunction      Function if user does not have an account
 */
var checkAccountXHR = null;

function checkAccount(email, isUserFunction, isNotUSerFunction) {
  // kill the any XHR request done before the must recent one
  if (window.checkAccountXHR) {
    window.checkAccountXHR.abort();
  }

  var params = {};
  params.email = email;
  // Ajax file location, eveything JobSeeker related is on the /jobSeekerFolder
  var where = '/ajax/jobSeeker/checkJobSeekerAccount.php';
  // Storing the XHR request if there is a need for killing it because of a
  // new request. So we garantee to send the must recent information.
  window.checkAccountXHR = $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;

      //Response routing
      if (objResponse.response == 'account') {
        //Excecute the success function if we detect that the user haves
        // an account with that email
        appStorage.accountPasswordType = objResponse.passwordType;
        isUserFunction(objResponse);
      } else {
        //Excecute the fail function if we detect that the user does not have
        // an account with that email
        isNotUSerFunction(objResponse);
      }
    },
  });
}

/**
 * Check if an email have an jobSeeker account attach to it
 * @param extraInformation   Email of the user we want to check
 * @param successFunction    Function if the user have an account
 * @param failFunction      Function if user does not have an account
 */
var sendPhoneNumberXHR = null;

function sendJobseekerPhoneNumber(
    phoneNumber,phonePlatform, country, language, successFunction, failFunction) {
  // kill the any XHR request done before the must recent one
  if (window.sendPhoneNumberXHR) {
    window.sendPhoneNumberXHR.abort();
  }

  var params  = {};
  params.country = country;
  params.language = language;
  params.phone = phoneNumber;
  params.phonePlatform = phonePlatform;
  // Ajax file location, eveything JobSeeker related is on the /jobSeekerFolder
  var where = '/ajax/jobSeeker/sendPhoneJobseeker.php';
  // Storing the XHR request if there is a need for killing it because of a
  // new request. So we garantee to send the must recent information.
  window.sendPhoneNumberXHR = $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;

      //Response routing
      if (objResponse.response == 'ok') {
        //Excecute the success function if we detect that the user haves
        // an account with that email
        successFunction(objResponse);
      } else {
        //Excecute the fail function if we detect that the user does not have
        // an account with that email
        failFunction(objResponse);
      }
    },
  });
}

/**
 * Resend user's confirmation phone number with the code to activate the account
 * @param code
 * @param successFunction
 * @param failFunction
 */


function confirmJobSeekerPhoneNumber(code, successFunction, failFunction) {
  //If there is already a request made we are going to proverent it
  //if all is good we just dissable the submitter button and form
  if(event.target){
    if($(event.target).find(".button[type=submit]").hasClass('is--waiting')){
      return false;
    }else{
      $(event.target).find(".button[type=submit]").addClass("is--waiting");
    }
  }

  var params = {};
  params.code = code;
  // Ajax file location, eveything JobSeeker related is on the /jobSeekerFolder
  var where = '/ajax/jobSeeker/confirmJobSeekerPhoneNumber.php';
  window.confirmJobSeekerEmailXHR = $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;
      //Response routing
      if (objResponse.response == 'ok') {
        // Function sending the email was a success
        successFunction(objResponse);
      } else {
        // Function if something fail trying to send the email, Ex: user already
        // verify or non-existent
        failFunction(objResponse);
      }
      $('.is--waiting').removeClass("is--waiting");
    },
    fail: function(){
      //Allow button to be reactivate
      $('.is--waiting').removeClass("is--waiting");
    }
  });
}

/**
 * Check jobSeeker combination for password and email and returns, the response
 * object for sucess or fail log in
 * @param email             Email of the user
 * @param password          Password of the user
 * @param country           ISO (2 letters) for country EX: us,ca,gb
 * @param language          ISO (2 letters) for language EX: en,fr,ge
 * @param successFunction   Funcion if the combination password + email is correct
 * @param failFunction      Function if the combination password + email is not correct
 */

function loginJobSeeker(
    email,
    password,
    country,
    language,
    rememberMe,
    platform,
    uit,
    successFunction,
    failFunction,
) {
  //If there is already a request made we are going to proverent it
  //if all is good we just dissable the submitter button and form
  if(event.target){
    if($(event.target).find(".button[type=submit]").hasClass('is--waiting')){
      return false;
    }else{
      $(event.target).find(".button[type=submit]").addClass("is--waiting");
    }
  }

  var params = {};
  params.email = email;
  params.password = password;
  params.country = country;
  params.language = language;
  params.rememberMe = rememberMe;
  params.platform = platform;
  params.jobSeekerContext = appStorage.jobSeekerContext;
  params.applyType = appStorage.applyType;
  params.uit = uit;
  params.conversionTest = appStorage.conversionTest

  // Ajax file location, eveything JobSeeker related is on the /jobSeekerFolder
  var where = '/ajax/jobSeeker/loginJobSeeker.php';

  window.loginJobSeekerXHR = $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;
      //Response routing
      if (objResponse.response == 'ok') {
        //Excecute the success function if the password email combination is
        //correct
        successFunction(objResponse);
      } else {
        //Excecute the fail function if the password email combination is
        //not correct (might be because there is not an account with the input email)
        failFunction(objResponse);
      }
      $('.is--waiting').removeClass("is--waiting");
    },
    fail: function(){
      //Allow button to be reactivate
      $('.is--waiting').removeClass("is--waiting");
    }
  });

}

/**
 * Check jobSeeker account status value giving the cookie token
 * @param token           User's id encrypted (usually is on the user-token value)
 * @param successFunction Function if there was not issues returning the status value
 * @param failFunction    Function if there was issues returning the status value
 */

var getUserStatusXHR = null;

function getUserStatus(
    successFunction,
    failFunction,
) {
  // kill the any XHR request done before the must recent one
  if (window.getUserStatusXHR) {
    window.getUserStatusXHR.abort();
  }

  var params = {};
  // Ajax file location, everything JobSeeker related is on the /jobSeekerFolder
  var where = '/ajax/jobSeeker/getJobSeekerStatus.php';

  window.getUserStatusXHR = $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;
      //Response routing
      if (objResponse.response == 'ok') {
        // Execute the success function if the Ajax was able to return the status
        // of the jobSeeker
        successFunction(objResponse);
      } else {
        // Execute the fail function if the Ajax was not able to return the
        // status of the jobSeeker (must likely there is a problem with the token
        // given Ex: account not longer in the database, or a bad token given)
        failFunction(objResponse);
      }
    },
  });
}

/**
 * Creates an jobSeeker account with the given information and return the
 * response object for sucess or fail account
 * @param firstName         First name of the user
 * @param lastName          Last name of the user
 * @param email             Email of the user
 * @param password          Password of the user
 * @param country           ISO (2 letters) for country EX: us,ca,gb
 * @param language          ISO (2 letters) for language EX: en,fr,ge
 * @param location          Location input by the user
 * @param rememberMe        Set to true if you want to keep the user log in
 * @param emailAllow        Set to true if you want to sinal that the users wants emails
 * @param testGroup         Testing value for AB test
 * @param platform          Creation platform (Talent, Google, Facebook, etc.)
 * @param messengerUserId   It comes from messenger chatbot when we're creating an account
 * @param countryCreate     Input country of the user's selects on the process
 * @param successFunction   Function if there account creation was successful
 * @param failFunction      Function if there account creation was not successful
 */


function createJobseeker(
    firstName,
    lastName,
    email,
    password,
    country,
    language,
    location,
    rememberMe,
    emailAllow,
    platform,
    phoneNumber,
    phonePlatform,
    messengerUserId,
    countryCreate,
    successFunction,
    failFunction,
) {
  //If there is already a request made we are going to proverent it
  //if all is good we just dissable the submitter button and form
  if(event.target){
    if($(event.target).find(".button[type=submit]").hasClass('is--waiting')){
      return false;
    }else{
      $(event.target).find(".button[type=submit]").addClass("is--waiting");
    }
  }

  // For target experience for SERP (this testId is declared in page-search.js
  // targetExperienceOnLoad on success
  if(appStorage.conversionTest == "warehouse_serp_v2"){

    // Getting the target exp answer from session storage
    var shift = sessionStorage.getItem("shift"),
        startDate = sessionStorage.getItem("startDate"),
        certifications = sessionStorage.getItem("certifications"),
        commute = sessionStorage.getItem("commute");
    // Creating object to send the information
    var targetExperience = {};
    targetExperience.shift = shift;
    targetExperience.startDate = startDate;
    targetExperience.certifications = certifications;
    targetExperience.commute = commute;
    // Clear session storage
    sessionStorage.removeItem("shift");
    sessionStorage.removeItem("startDate");
    sessionStorage.removeItem("certifications");
    sessionStorage.removeItem("commute");
    // Keeping user location for the redirect later on
    appStorage.userLocation = location;
  }

  var params = {};
  params.firstName = firstName;
  params.lastName = lastName;
  params.email = email;
  params.password = password;
  params.country = country;
  params.language = language;
  params.location = location;
  params.countryCreate = countryCreate;
  params.rememberMe = rememberMe;
  params.emailAllow = emailAllow;
  params.context = appStorage.jobSeekerContext;
  params.activeJobId = appStorage.activeJobId;
  params.applyType = appStorage.applyType;
  params.platform = platform;
  params.phoneNumber = phoneNumber;
  params.phonePlatform = phonePlatform;
  params.messengerUserId = messengerUserId;
  params.questionaryTargetExperience = targetExperience;
  params.conversionTest = appStorage.conversionTest;

  // Ajax file location, eveything JobSeeker related is on the /jobSeekerFolder
  var where = '/ajax/jobSeeker/createJobSeekerAccount.php';

  window.createJobseekerXHR = $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;
      //Response routing
      if (objResponse.response == 'ok') {
        //For tracking we need to know that a jobSeeker was created during this
        // session
        appStorage.newJobSeeker = "true";
        //Function if the account creation was a success
        successFunction(objResponse);
      } else {
        // Function if the account creation fail, cases might range from
        // the email already had an account attach to it, or there was a problem
        // with the database.
        failFunction(objResponse);
      }
      //Allow button to be reactivate
      $('.is--waiting').removeClass("is--waiting");
    },
    fail: function(){
      //Allow button to be reactivate
      $('.is--waiting').removeClass("is--waiting");
    }
  });

}

/**
 * Reset password email send for jobSeeker account with the given email, country and language
 * @param email             Email of the user
 * @param country           ISO (2 letters) for country EX: us,ca,gb
 * @param language          ISO (2 letters) for language EX: en,fr,ge
 * @param successFunction   Function if sending the email was successful
 * @param failFunction      Function if sending the email was not successful
 */

var resetPasswordSendEmailXHR = null;

function resetPasswordSendEmail(
    email,
    country,
    language,
    successFunction,
    failFunction,
) {
  // kill the any XHR request done before the must recent one
  if (window.resetPasswordSendEmailXHR) {
    window.resetPasswordSendEmailXHR.abort();
  }

  var params = {};
  params.email = email;
  params.country = country;
  params.language = language;
  // Ajax file location, eveything JobSeeker related is on the /jobSeekerFolder
  var where = '/ajax/jobSeeker/sendEmailResetJobSeekerPassword.php';
  window.resetPasswordSendEmailXHR = $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;
      //Response routing
      if (objResponse.response == 'ok') {
        //Function if the email was send
        if (successFunction !== undefined)
          successFunction(objResponse);
      } else {
        // Function if the email was not success, might be because there is not
        // account attach to that email or it hits the limit of 3 emails per day
        // for account password reset request.
        if (failFunction !== undefined)
          failFunction(objResponse);
      }

    },
  });
}

/**
 * Reset user password giving 3 main elements, the user email, password and the
 * verification token.
 * @param email        Email of the user
 * @param token        Verification token for security reasons
 * @param password     New password of the user
 * @param country      ISO (2 letters) for country EX: us,ca,gb
 * @param language     ISO (2 letters) for language EX: en,fr,ge
 * @param successCode  Function if the password was updated
 * @param failFunction Function if the password was not updated
 */

var resetPasswordXHR = null;

function resetPassword
(
    userInfo,
    userToken,
    password,
    country,
    language,
    successCode,
    failFunction,
) {
  // kill the any XHR request done before the must recent one
  if (window.resetPasswordXHR) {
    window.resetPasswordXHR.abort();
  }

  var params = {};
  params.userInfo = userInfo;
  params.userToken = userToken;
  params.password = password;
  params.country = country;
  params.language = language;

  // Ajax file location, eveything JobSeeker related is on the /jobSeekerFolder
  var where = '/ajax/jobSeeker/resetJobSeekerPassword.php';
  window.resetPasswordXHR = $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;
      //Response routing
      if (objResponse.response == 'ok') {
        // Function if updating the user's password was a success
        successCode(objResponse);
      } else {
        // Function if something fail updating the user's password
        // (must likely the security token given was expired)
        failFunction(objResponse);
      }

    },
  });
}

/**
 * Resend user's confirmation email with the code to activate the account
 * @param code
 * @param successFunction
 * @param failFunction
 */


function confirmJobSeekerEmail(code, successFunction, failFunction) {
  //If there is already a request made we are going to proverent it
  //if all is good we just dissable the submitter button and form
  if(event.target){
    if($(event.target).find(".button[type=submit]").hasClass('is--waiting')){
      return false;
    }else{
      $(event.target).find(".button[type=submit]").addClass("is--waiting");
    }
  }

  var params = {};
  params.code = code;
  // Ajax file location, eveything JobSeeker related is on the /jobSeekerFolder
  var where = '/ajax/jobSeeker/confirmJobSeekerAccount.php';
  window.confirmJobSeekerEmailXHR = $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;
      //Response routing
      if (objResponse.response == 'ok') {
        // Function sending the email was a success
        successFunction(objResponse);
      } else {
        // Function if something fail trying to send the email, Ex: user already
        // verify or non-existent
        failFunction(objResponse);
      }
      $('.is--waiting').removeClass("is--waiting");
    },
    fail: function(){
      //Allow button to be reactivate
      $('.is--waiting').removeClass("is--waiting");
    }
  });
}

/**
 * Get an especifict history type of a user
 * @param type
 * @param successCode
 * @param failFunction
 */
var getUserHistoryXHR = null;

function getUserHistory(type, successCode, failFunction) {
  // kill the any XHR request done before the must recent one
  if (window.getUserHistoryXHR) {
    window.getUserHistoryXHR.abort();
  }

  var params = {};
  params.type = type;

  // Ajax file location, eveything JobSeeker related is on the /jobSeekerFolder
  var where = '/ajax/jobSeeker/getTypeHistory.php';
  window.getUserHistoryXHR = $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;
      //Response routing
      if (objResponse.response == 'ok') {
        // Function if that type of history is found
        successCode(objResponse);
      } else {
        // Function if the user does not have that type of history
        failFunction(objResponse);
      }

    },
  });
}

/**
 * Checks if the user profile is valid, and to be a valid profile, it needs
 * to have one Education entrie and one skill entrie
 * @param successFunction
 * @param failFunction
 */
var checkUserProfileXHR = null;

function checkUserProfile(successFunction, failFunction) {
  // kill the any XHR request done before the must recent one
  if (window.checkUserProfileXHR) {
    window.checkUserProfileXHR.abort();
  }

  // Ajax file location, eveything JobSeeker related is on the /jobSeekerFolder
  var where = '/ajax/jobSeeker/validateUserProfile.php';

  window.checkUserProfileXHR = $.ajax({
    type: 'POST',
    url: where,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload.check;
      //Response routing
      if (objResponse.result == 'ok') {
        // Function if their profile is valid
        successFunction(objResponse);
      } else {
        // Function if their profile is not valid
        failFunction(objResponse);
      }

    },
  });
}

/**
 * This will re send the confirmation email for a log in jobSeeker
 */

function resendConfirmationCodeEmail() {

  var params = {};
  params.country  = domain.country;
  params.language = domain.language;
  var where = '/ajax/jobSeeker/resendConfirmCodeJobSeeker.php';

  $.post(where, params, function(response) {
    var objResponse = $.parseJSON(response);
    objResponse = objResponse.payload;
    $('.error-message[data-for=ConfirmForm]').text(objResponse.user_message);
    $('.error-message[data-for=ConfirmForm]').show();
    $('.error-message[data-for=ConfirmForm]').addClass('has--error');
    $('.error-message[data-for=ConfirmForm]').delay(1000 * 20).fadeOut(1000);
  });
}


/**
 * This will re send the SMS confirmation Text for SMS alerts
 */

function resendConfirmationCodeSMS () {

  var params = {};
  params.country  = domain.country;
  params.language = domain.language;
  var where = '/ajax/jobSeeker/resendSMSConfirmCode.php';

  $.post(where, params, function(response) {
    var objResponse = $.parseJSON(response);
    objResponse = objResponse.payload;
    $('.error-message[data-for=ConfirmForm]').text(objResponse.user_message);
    $('.error-message[data-for=ConfirmForm]').show();
    $('.error-message[data-for=ConfirmForm]').addClass('has--error');
    $('.error-message[data-for=ConfirmForm]').delay(1000 * 20).fadeOut(1000);
  });
}

/**
 *  This will update the user's history in different buckets
 *
 *  @param data object that contains the information that tye bucket needs
 *  one note if provided with a jobId it will get the job_title and job_location
 *  from that job.
 *
 *  @param type  The bucket type that want to be updated
 *  Ex: (bucket_name   -> key_input = key_value)
 *  job_click    -> jobId = jobid | keyword = job_title  | location = job_location
 *  job_ioa      -> jobId = jobid | keyword = job_title  | location = job_location
 *  job_favorite -> jobId = jobid | keyword = job_title  | location = job_location
 *  job_alert    -> keyword = user Input | location = user Input
 *  job_search   -> keyword = user Input | location = user Input
 *
 *  @param action if set to delete, it will delete the element on the selected
 *  bucket with the same key_values (Ex: in order to delete something from
 *  favorites it need type = job_favorite, data.jobid = asdf234 and action = delete
 *
 */
function userEventTracket(type, data, action) {

  var params = {};
  params.type = type;
  params.data = data;
  params.country = domain.country;
  params.language = domain.language;
  params.action = action;

  var where = '/ajax/jobSeeker/manageUserEvent.php';

  $.post(where, params, function(response) {
  });
}

/**
 * General campaign popup it shows a image, header text, snippet and a CTA
 * @param campaign String: the name of the campaign EX: taxCal
 */

function showCampaignPopup(campaign) {
  // generalPopup location
  var where = '/ajax/generalUsePopups/generalPopup.php';
  var params = {};
  params.language = domain.language;
  params.country = domain.country;
  params.campaign = campaign;
  // Sending the information to the popups
  $.get(where, params, function(response) {
    var objResponse = $.parseJSON(response);
    // we apprend the response to our general use popup
    hangElementToPopup(objResponse.payload.HTML);
  });
}

/**
 * For the capaign popup this will show the information with the given index
 * @param index int
 */

function displayPopupInfo(index) {
  $('.card--popup .isActive').removeClass('isActive');

  $('.popup__indexDot[data-index=' + index + ']').addClass('isActive');
  $('.popup__infoHolder[data-index=' + index + ']').addClass('isActive');
}

function nextInfo() {
  var index = $('.popup__infoHolder.isActive').attr('data-index');
  var nextPanel = parseInt(index) + 1;
  $('.card--popup .isActive').removeClass('isActive');

  if ($('.popup__indexDot[data-index=' + nextPanel + ']').length > 0) {
    $('.popup__indexDot[data-index=' + nextPanel + ']').addClass('isActive');
    $('.popup__infoHolder[data-index=' + nextPanel + ']').addClass('isActive');
  } else {
    closePopup();
  }

}

var timeout = '';

function UIShowWarning(elem) {
  if (window.timeout) {
    clearInterval(window.timeout);
  }
  var warningElem = $(elem).find('.input__disableMessage');
  warningElem.addClass('is--active');
  window.timeout = setInterval(function() {
    warningElem.removeClass('is--active');
  }, 3000);
}

/**
 * General cookies ToS popup
 * @returns {boolean}
 */
function getCookiesTosBanner() {

  if (getCookie('cookiesAccepted') === 'true') {
    return true;
  }

  var request = {};
  request.language = domain.language;
  request.languageFolder = domain.settings.langauge_folder;
  request.country = domain.country;

  var where = '/ajax/cookies-policy-html.php';

  $.get(where, request, function(response) {
    var objResponse = $.parseJSON(response);
    $('body').append(objResponse.payload.HTML);
  });
}

/**
 * If they accepts their cookies
 * @param elem
 */
function acceptCookies(elem) {
  elem.parentNode.parentNode.remove();
  setCookie('cookiesAccepted', 'true', 360);
}

/**
 * Multiplatform easy sign in, it will take the the information from uit and the
 * action to either create or login the user from a specific platform
 * @returns {string}
 */
function easySignIn() {
  //If there is no uit on the URL then there is nothing that we can do
  if (!getUrlVars()['uit']) {
    return '';
  }
  //Variables from the url
  var action = getUrlVars()['action'];
  var platform = getUrlVars()['platform'];
  var uit = getUrlVars()['uit'];

  // if there is a context we take that on the popup
  if (getUrlVars()['jobSeekerContext']) {
    appStorage.jobSeekerContext = getUrlVars()['jobSeekerContext'];
    if (appStorage.jobSeekerContext == 'apply') {
      appStorage.activeJobId = getUrlVars()['id'];
      appStorage.applyType = getUrlVars()['at'];
    }
    if (appStorage.jobSeekerContext == 'favorites') {
      appStorage.jobSeekerFavToAdd = getUrlVars()['id'];
    }
  }

  if (platform == '') {
    platform = 'talent';
  }
  //if the action is create then we show the create step popup but with some
  // modification like, we dont ask for a password and also there is no need
  // to confirm the user

  if (action == 'create' && getUrlSingleVar("np") == "true") {
    createEmailAlertWithSSO(uit,platform);
    return true;
  }

  if (action == 'create') {
    showJobSeekerPopup('createJobSeekerStep', getUrlVars()['id'], '',
        uit, platform);
  }
  // if the action to take is login or invalid_signin we call the easyLogIn process
  if (action == 'login') {
    if (appStorage.jobSeekerContext == 'apply') {

      //IF it is a quick apply job we need to check if the user's
      // have a CV or not
      if (appStorage.applyType == 'quickApply') {
        getUserStatus(function(response) {
          //If they do we don't ask for a CV on the application process
          if (response.hasCV == 'true') {
            routingApplyPopupProcess('false');
          } else {
            routingApplyPopupProcess('true');
          }
        });
      } else {
        //If it is not a quick apply job we just send then to the source
        sendToJobSource();
      }

    } else {
      routingEndPointAccountCreation('false');
    }
  }

  if (action == 'checkEmail') {
    appStorage.backupUit = uit;
    appStorage.backupPlatform = platform;
    showJobSeekerPopup('checkEmailStep', '', '',
        uit, platform);
  }

}

function createEmailAlertWithSSO(uit,platform){
  var params = {};
  params.uit = uit;
  params.platform = platform;
  params.country = domain.country;
  params.language = domain.language;
  params.jobSeekerContext = appStorage.jobSeekerContext;

  var where  = "/ajax/jobSeeker/popups/accountCreationFlow/ajax/decodeSSOInfo.php";
  $.post(where,params,function(response){
    var objResponse = $.parseJSON(response);
    appStorage.phoneOrMail = objResponse.payload.email;
    appStorage.email = objResponse.payload.email;
    appStorage.accountType = "sso";
    appStorage.midStep = "yes";
    // If the country has phone services, display the save phone number popup
    if (domain.allowSMSandWA === "1" && !getUrlSingleVar("exist")) {
      showJobSeekerPopup("savePhoneStep");
    }else{
      showJobSeekerPopup("userSuccessfulConfirmation");
    }
  })
}

/**
 * Load Job Posting Popups
 * Popups needed to complete the process of create account,
 * sign in, sms verification and reset password
 * @param url -----> (it can be sign-in, create-account)
 * @param userToken ---> the user token needed in the process
 * of sign in, create account and sms verification
 * @param accountId ---> account id linked to the user needed in the process of sms verification
 * @param url
 * @param userToken
 * @param accountId
 * @param additionalParams
 */
function loadJobPostingPopup(
    url = '',
    userToken = '',
    accountId = '',
    additionalParams,
) {
  // Required params
  var params = {};
  params.country = domain.country;
  params.language = domain.language;
  params.device = domain.device;

  // Assign User token to params
  if (userToken !== '') {
    params.token = userToken;
  }

  // Assign account id to params
  if (accountId !== '') {
    params.aid = accountId;
  }

  // Assign additional params to
  // params for create account process
  if (additionalParams !== '') {
    params = Object.assign(params, additionalParams);
  }

  // job posting location files route
  var where = '/ajax/jobPosting/popup-' + url + '.php';
  // Sending the information to the popups
  $.get(where, params, function(response) {
    hangElementToPopup(response);
  });
}

/**
 * Talent post Logout
 */
function logoutTalentPost() {
  var where = '/employers/user/page-logout-post.php';
  $.get(where, '', function(response) {
    location.reload();
  });
}

/**
 * This will take the name and the value and add it to the url, while taking in
 * consideration of the URL have no, or some GET parameters on it
 * EX: /job?name=value or /job?page=1&name=value
 * @param string name
 * @param string value
 */
function replaceStateURL(name, value) {

  let link = window.location.href;
  let URLObject = new URL(link);
  let params = new URLSearchParams(URLObject.search.slice(1));

  params.set(name, value);
  link = '?' + params.toString();

  window.history.replaceState(null, null, link);
}

/**
 * This function checks if the user is coming from emails and if the interaction is
 * the personalize cta and redirects the user to the page, unless the user is logged in
 */
function userNotificationRedirect() {
  var get_params = getUrlVars();
  if (get_params.source == 'emails' && get_params.template) {
    appStorage.jobSeekerContext = 'user-page';

    appStorage.jobSeekerUserPage = get_params.endpoint;
    // Creating default
    if (!get_params.endpoint) {
      appStorage.jobSeekerUserPage = 'notifications';
    }
    showJobSeekerPopup('signInJobSeekerStep', '', '');
  }
}

function RadiusUncheck() {
  // iterate using Array method for compatibility
  Array.prototype.forEach.call(document.querySelectorAll('[type=radio]'),
      function(radio) {
        if (radio.dataset.event) {
          return true;
        } else {
          radio.setAttribute('data-event', 'true');
        }
        radio.addEventListener('click', function() {
          var self = this;
          // get all elements with same name but itself and mark them unchecked
          Array.prototype.filter.call(document.getElementsByName(this.name),
              function(filterEl) {
                return self !== filterEl;
              }).forEach(function(otherEl) {
            delete otherEl.dataset.check;
          });

          // set state based on previous one
          if (this.dataset.hasOwnProperty('check')) {
            this.checked = false;
            delete this.dataset.check;
          } else {
            this.dataset.check = '';
          }
        }, false);
      });
}

/**
 * This function checks if the user is coming from emails and if the interaction is
 * the personalize cta and redirects the user to the page, unless the user is logged in
 */
function userSuccessConfirmationPopup() {
  var get_params = getUrlVars();
  if (get_params.emailConfirmation == 'ok') {
    appStorage.jobSeekerContext = get_params.context;
    showJobSeekerPopup('userSuccessfulConfirmation', '', '');
  }
}

/**
 * This function is in charge to decide the action of the CTA in the user confirmation popup
 * according to the context for the user when registered
 */
function userConfirmationRedirect() {

  if (getUrlSingleVar('emailConfirmation') != '') {
    // Get parameters
    var get_params = getUrlVars();
    appStorage.activeJobId = get_params.id;
    appStorage.jobSeekerContext = get_params.context;
    appStorage.jobSeekerFavToAdd = get_params.id;
    // get_params.emailConfirmation = "";
    replaceStateURL('emailConfirmation', '');
    routingEndPointAccountCreation();
  } else {
    routingEndPointAccountCreation();
  }

}

function callMaskJS() {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = domain.objCDN + '/libs/js/jquery.mask.js';
  // Use any selector
  $('head').append(s);
}

/**
 * Controls the hide/show actions in the dropdown links on the mobile menu from Enterprise pages
 * Used in the ui_menu class
 * @param string DOM element attached
 */
function toggleDropdownLink(element) {
  let dropdownHolder = $(element).
      parent().
      find('.menu__dropdownHolder.menu__dropdownLink-content');

  $(element).toggleClass('menu__highlighted');

  if ($(dropdownHolder).hasClass('hide')) {
    $(dropdownHolder).slideDown();
    $(dropdownHolder).removeClass('hide');
  } else {
    $(dropdownHolder).slideUp();
    $(dropdownHolder).addClass('hide');
  }
}

/**
 * General label toolTip popup class manager to display it
 * @param name
 */
function toggleToolTIp(name) {
  //We use the name to find the element
  // to be toggle and add the class 'is--active'
  $('.tooltip--content[data-for=' + name + ']').toggleClass('is--active');
}

/**
 * Shows users that came from home page with the specific action
 * the user create step popup
 */
function showCreatePopupFromHomeRedirect() {
  //Only do this if we don't come from SSOS
  if (getUrlVars()['uit']) {
    return '';
  }
  if (domain.forceRegistration.toLocaleLowerCase() == 'usercreatefromhome' &&
      domain.jobSeekerLogin === '0') {
    appStorage.jobSeekerContext = 'homeRedirect';
    showJobSeekerPopup('checkEmailStep');
  }
}

/**
 *  This function shows the pop-up to enter the confirmation code
 *  and sends the email with the code.
 */
function clickUnconfirmedMenuOption() {
  showJobSeekerPopup('confirmCodeStep');
  resendConfirmationCodeEmail();
}

/**
 * Loads scripts async
 * @param url File url locations
 * @param callback function for success call
 */
function callJSFile (url, callback) {
  jQuery.ajax({
    url: url,
    dataType: 'script',
    success: callback,
    async: true
  });
}

/**
 * Activates the autocomplete functionality on the location for the account
 * creation process based on the country and laguagne given
 * @param country String 2 letter ISO format country
 * @param langauge 2 letter ISO format language
 */
function enableAutoCompleteLocationOnAccountProcess(country, langauge) {

  // Auto complete for location
  $('#locationCreate').autocomplete({
    serviceUrl: '/ajax/auto-suggest.php?type=location&country=' +
        country + '&language=' + langauge,
    triggerSelectOnValidInput: false,
    onSelect: function(value, data) {
    },
  });

}

/**
 * Closes the popup when the user tries to perform "Go back to previous page"
 * button interactions.
 */
function closePopupOnGoBackAction() {
  history.pushState(null, null, location.href);
  window.onpopstate = function () {
    closePopup();
  };
}

/**
 * generateWysiwygApply
 * Function to render all the Wysiwyg (textarea question in popup for extra question)
 * @param id Unique id to generate the wysiwyg
 * @param placeholder Placeholder of Wysiwyg
 * @param height height of the Wysiwyg
 * @param maxHeight Max height define for the Wysiwyg, if set the auto resize plugging will be add it
 */
function generateWysiwygApply(id, placeholder, height, maxHeight = '') {

  // Auto resize plugging needed to grow the wysiwyg until
  // the limit of max height is reach
  var autoResize = ",";
  if (maxHeight) {
    autoResize = ',autoresize,';
    var max_height = maxHeight;
  }

  tinymce.init({
    selector: '#' + id,
    plugins: 'lists,paste, wordcount' + autoResize,
    'toolbar': 'bullist bold italic underline',
    placeholder: placeholder,
    paste_enable_default_filters: false,
    paste_as_text: true,
    resize: false,
    elementpath: false,
    menubar: false,
    branding: false,
    height: height,
    min_height: height,
    max_height: max_height,
    statusbar: false,
    force_p_newlines : false,
    force_br_newlines : true,
    convert_newlines_to_brs : false,
    remove_linebreaks : true,
    entity_encoding : "raw",
    content_css: [
      '//fonts.googleapis.com/css?family=Poppins:300,400,500,600&amp;subset=latin,greek-ext,vietnamese,' +
      'cyrillic-ext,latin-ext,cyrillic',
      '/public/assets/css/tinyMCE/tinyMCE-editor.css?' +
      new Date().getTime()],
    setup: function(editor) {
      // Stop writing when reach limit
      var maxlength = parseInt($('#' + (id)).attr('maxlength'));
      editor.on('keydown', function(e) {
        // Selectors
        var wordCount = tinymce.get(id).plugins.wordcount;
        tinymce.triggerSave();
        // Defining the words to count without including enter and delete keys
        var words = wordCount.body.getCharacterCount();
        if ((words >= maxlength) && (e.keyCode != 8 && e.keyCode != 46)) {
          e.stopPropagation();
          return false;
        }
      });
      editor.on('change', function () {
        tinymce.triggerSave();
      });
    }
  });
}

/**
 * Toggle accordion extra questions
 * This function close and open the preview accordion
 * with all the questions answered
 */
function toggleExtraQuestions() {
  // Selectors
  var box = $('.card--profileInfo__question-box');
  var arrow = $('.card--profileInfo__info--arrow');
  // If the box container is close --> open
  if (box.is(':hidden')) {
    box.slideDown(300);
    arrow.addClass('card--profileInfo__info--arrow-flip');
  } else {
    // If the box container is open --> close
    box.slideUp(300);
    arrow.removeClass('card--profileInfo__info--arrow-flip');
  }
}

/**
 * Edit Question Popup
 * This function call the edit question popup
 * Where user can edit the question selected
 * @param questionID
 * @param questionIndex
 */
function editApplyQuestionPopup(questionID, questionIndex) {
  var storageKey = 'application' + getUrlVars()['id'];
  // Required params
  var params = {};
  params.country = domain.country;
  params.language = domain.language;
  params.questionid = questionID;
  params.application = storageKey;
  params.jobid = getUrlVars()['id'];
  params.index = questionIndex;
  // Popup location
  var where = '/ajax/jobSeeker/popups/popupApplyEditQuestion.php';
  // Sending the information to the popups
  $.get(where, params, function(response) {
    var objResponse = $.parseJSON(response);
    // append the response to our general use popup
    hangElementToPopup(objResponse.payload.HTML);
  });
}

/**
 * Get the json extra question from local storage
 * Recuperate the values using the job id set in url
 * The Local storage will be set using the job id as soon as the user stars
 * answering questions
 */
function getSessionApplication() {
  // Use the id of the job to get the application from storage
  var storageKey = 'application' + getUrlVars()['id'];
  if (localStorage.getItem(storageKey)) {
    return JSON.parse(localStorage.getItem(storageKey));
  } else {
    // Return false if there is not json in local storage
    return false;
  }
}

/**
 * Generate preview in popup apply summary with all extra questions
 * Recuperate information from local storage and send to ajax to create preview
 * If the user has not answer all the questions preview won't be shown
 */
function getSummaryQuestions() {
  // Validate if there are questions in local storage to send request
  if (getSessionApplication() === false) {
    return;
  }
  var params = {};
  params.id = getUrlVars()['id'];
  params.extraQuestionsResponses = getSessionApplication();
  params.country = domain.country;
  params.language = domain.language;
  params.languageFolder = domain.settings.language_folder;
  // Ajax file location
  var where = '/ajax/applyProcess/popupQuestionsAccordion.php';
  $.post(where, params, function(response) {
    var objResponse = $.parseJSON(response);
    response = objResponse.payload;
    // If all answered from service is yes, means user already answered all the questions
    // Add the class to form so we can handle the request to job seeker apply
    if (response.allAnswered === "yes") {
      $('.js-extraQuestionsSummary').html(response.HTML);
    } else {
      showJobSeekerPopup("popupApplyQuestions")
    }
  });
}

/**
 * Function that validates if the user previously answered all the the questions
 * to apply to the job, send the request to ajax
 */
function checkQuestions() {
  // Validate if there are questions in local storage to send request
  if (getSessionApplication() === false) {
    showJobSeekerPopup("popupApplyQuestions", "", "", "", "", true);
    return;
  }
  var params = {};
  params.id = getUrlVars()['id'];
  params.extraQuestionsResponses = getSessionApplication();
  params.country = domain.country;
  params.language = domain.language;
  params.languageFolder = domain.settings.language_folder;
  // Ajax file location
  var where = '/ajax/applyProcess/checkUserApplication.php';
  $.post(where, params, function(response) {
    var objResponse = $.parseJSON(response);
    response = objResponse.payload;
    if (response.allQuestionsViewed === 1 && response.onlyStandardQuestions === 0) {
      showJobSeekerPopup("userApplySummary", "", "", "", "", true);
    } else {
      showJobSeekerPopup("popupApplyQuestions", "", "", "", "", true);
    }
  });
}

/**
 * Function to find the email value store in json
 * @param json
 * @returns {string}
 */
function getEmailInJson(json) {
  var found = "";
  $.each(json, function(keyword, value) {
    if (value.name === "email") {
      found = value.response;
    }
  });
  return found;
}

/**
 * Check if an email have an jobSeeker account attach to it
 * @param email         Email of the user we want to check
 * @param successFunction    Function if the user have an account
 * @param failFunction      Function if user does not have an account
 */
var newCheckAccountXHR = null;

function newCheckAccount(emailOrPhone, successFunction, failFunction) {
  // Kill the any XHR request done before the must recent one
  if (window.checkAccountXHR) {
    window.checkAccountXHR.abort();
  }

  var params = {};
  params.emailOrPhone = emailOrPhone;
  params.country      = domain.country;
  // Ajax file location, eveything JobSeeker related is on the /jobSeekerFolder
  var where = '/ajax/jobSeeker/popups/accountCreationFlow/ajax/checkJobSeekerAccount.php';
  // Storing the XHR request if there is a need for killing it because of a
  // new request. So we garantee to send the must recent information.
  window.newCheckAccountXHR = $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;
      // Response routing
      if (objResponse.response == 'account') {
        // Excecute the success function if we detect that the user haves
        // an account with that email
        successFunction(objResponse);
      } else {
        // Excecute the fail function if we detect that the user does not have
        // an account with that email
        failFunction(objResponse);
      }
    },
  });
}

/**
 * Generate OTP Code for email accounts
 * @param email             Email of the user we want to send the code
 * @param successFunction   Function if the user have an account
 * @param failFunction      Function if user does not have an account
 */
var otpEmailXHR = null;

function sendOTPCodeEmail(email, length, successFunction, failFunction) {
  // Kill the any XHR request done before the must recent one
  if (window.otpEmailXHR) {
    window.otpEmailXHR.abort();
  }

  var params = {};
  params.email    = email;
  params.length    = length;
  params.country  = domain.country;
  params.language = domain.language;
  params.accountExist = appStorage.accountExist;

  // Ajax file location to generate and send the OTP code
  var where = '/ajax/jobSeeker/popups/accountCreationFlow/ajax/generateEmailOTPcode.php';

  // Storing the XHR request if there is a need for killing it because of a
  // new request. So we garantee to send the must recent information.
  window.otpEmailXHR = $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;
      // Response routing
      if (objResponse.response == 'sent') {
        // Excecute the success function if we have sent the email to the user
        successFunction(objResponse);
      } else {
        // Excecute the fail function if we detect that the email couldn't be
        // sent
        failFunction(objResponse);
      }
    },
  });
}


/**
 * Generate OTP Code for phone number accounts
 * @param phone             Phone of the user we want to send the code
 * @param successFunction   Function if the user have an account
 * @param failFunction      Function if user does not have an account
 */
var otpPhoneXHR = null;

function sendOTPCodePhone(phone, length, successFunction, failFunction) {

  // Kill the any XHR request done before the must recent one
  if (window.otpPhoneXHR) {
    window.otpPhoneXHR.abort();
  }

  var params = {};
  params.phone    = phone;
  params.length   = length;
  params.country  = domain.country;
  params.language = domain.language;
  params.accountExist = appStorage.accountExist;

  // Ajax file location to generate and send the OTP code
  var where = '/ajax/jobSeeker/popups/accountCreationFlow/ajax/generatePhoneOTPcode.php';

  // Storing the XHR request if there is a need for killing it because of a
  // new request. So we garantee to send the must recent information.
  window.otpPhoneXHR = $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;
      // Response routing
      if (objResponse.response == 'sent') {
        // Excecute the success function if we have sent the email to the user
        successFunction(objResponse);
      } else {
        // Excecute the fail function if we detect that the email couldn't be
        // sent
        failFunction(objResponse);
      }
    },
  });
}



/**
 * Send user's confirmation email with the OTP code to activate the account
 * @param code digit code (can be 4 or 6)
 * @param successFunction
 * @param failFunction
 */
function confirmJobSeekerPhoneByOTP(code, phone, length, successFunction, failFunction) {
  //If there is already a request made we are going to proverent it
  //if all is good we just dissable the submitter button and form
  if(event.target){
    if($(event.target).find(".button[type=submit]").hasClass('is--waiting')){
      return false;
    }else{
      $(event.target).find(".button[type=submit]").addClass("is--waiting");
    }
  }
  var params      = {};
  params.code     = code;
  params.phone    = phone;
  params.length   = length;
  params.country  = domain.country;
  params.language = domain.language;
  params.jobSeekerContext = appStorage.jobSeekerContext;
  params.jobSeekerPath    = appStorage.accountType;
  params.activeJobId = appStorage.activeJobId;
  params.applyType = appStorage.applyType;
  params.isBulk = appStorage.bulkRoute;

  // Ajax file location
  var where = '/ajax/jobSeeker/popups/accountCreationFlow/ajax/confirmPhoneByOTP.php';
  window.confirmJobSeekerPhoneXHR = $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;
      //Response routing
      if (objResponse.response == 'ok') {
        // Function sending the email was a success
        successFunction(objResponse);
      } else {
        // Function if something fail trying to send the email, Ex: user already
        // verify or non-existent
        failFunction(objResponse);
      }
      $('.is--waiting').removeClass("is--waiting");
    },
    fail: function(){
      //Allow button to be reactivate
      $('.is--waiting').removeClass("is--waiting");
    }
  });
}

/**
 * Send user's confirmation email with the OTP code to activate the account
 * @param code 4 digit code
 * @param successFunction
 * @param failFunction
 */
function confirmJobSeekerEmailByOTP(code,email,lenght, successFunction, failFunction) {
  //If there is already a request made we are going to proverent it
  //if all is good we just dissable the submitter button and form
  if(event.target){
    if($(event.target).find(".button[type=submit]").hasClass('is--waiting')){
      return false;
    }else{
      $(event.target).find(".button[type=submit]").addClass("is--waiting");
    }
  }

  var params      = {};
  params.code = code;
  params.email = email;
  params.lenght = lenght;
  params.country = domain.country;
  params.language = domain.language;
  params.jobSeekerContext = appStorage.jobSeekerContext;
  params.jobSeekerPath = appStorage.accountType;
  params.activeJobId = appStorage.activeJobId;
  params.applyType = appStorage.applyType;
  params.otpSkip = appStorage.otpSkip;
  params.isBulk = appStorage.bulkRoute;

  // Ajax file location
  var where = '/ajax/jobSeeker/popups/accountCreationFlow/ajax/confirmEmailByOTP.php';
  window.confirmJobSeekerEmailXHR = $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;
      //Response routing
      if (objResponse.response == 'ok') {
        // Function sending the email was a success
        successFunction(objResponse);
      } else {
        // Function if something fail trying to send the email, Ex: user already
        // verify or non-existent
        failFunction(objResponse);
      }
      $('.is--waiting').removeClass("is--waiting");
    },
    fail: function(){
      //Allow button to be reactivate
      $('.is--waiting').removeClass("is--waiting");
    }
  });
}

/**
 * This function decides the behaviour of the skip button
 */
function skipAlertRouter(){


  if(appStorage.jobSeekerContext == 'jobsOrganicStrategy'){
    var eventData = {}
    eventData.jobseeker_context = appStorage.jobSeekerContext;
    sendEventToUET("closePopup",eventData);
  }


  if(appStorage.jobSeekerContext == "apply" && appStorage.midStep != "yes"){
    sendToJobSource();
  }else if (appStorage.jobSeekerContext == "salaryWhitepageWidget"){
    window.location.href = domain.settings.language_folder + "/salary?job="+app.jobTitle;
  }else{
    if (appStorage.midStep == "yes") {
      showJobSeekerPopup("userSuccessfulConfirmation");
    } else {
      closePopup();
    }

  }
}

/**
 * Takes the email input from the check user step and
 * if they don't have a jobSeeker account, we promnt that view
 * if they do we ask then to log in.
 */
function applyByEmailOrPhoneStep() {
  var phoneOrMail = $('input[name=phoneOrMailCheck]').val().trim();
  var isValid = false;
  var OTPLenght  = 4;
  var route = "";
  //If there is already a request made we are going to proverent it
  //if all is good we just dissable the submitter button and form
  if(event.target){
    if($(event.target).find(".button[type=submit]").hasClass('is--waiting')){
      return false;
    }else{
      $(event.target).find(".button[type=submit]").addClass("is--waiting");
    }
  }

  // Save phone for next steps
  appStorage.phoneOrMail = phoneOrMail;

  var valueType = "";
  // Check the type of input to validate error messages
  // Don't validate if its a phone number if the country doesn't have
  // phone services
  if (domain.allowSMSandWA == 1) {
    if (phoneOrMail.search("@") > 1) {
      valueType = "email";
    } else {
      valueType = "phone";
    }
  } else {
    valueType = "email";
  }

  if( appStorage.bulkRoute  == "true"){
    valueType = "email";
  }

  // Check if the email is correct, if it not correct we show then an error message
  if (verifyEmail(phoneOrMail)) {
    // Save the account type
    appStorage.accountType = "email";
    appStorage.email = phoneOrMail;
    isValid = true;
  } else {
    if (valueType === "email" || appStorage.accountType === "sso") {
      $('input[name=phoneOrMailCheck]').addClass('has--error');
      $('.error-message[data-for=phoneOrMailCheck]').addClass('has--error');
      $('.is--waiting').removeClass("is--waiting");
      if( appStorage.bulkRoute  == "true") {
        return true;
      }
    }
  }

  // Check if the country has phone services first then
  // Check if the phone is correct, if it not correct we show then an error message
  if (domain.allowSMSandWA != "") {
    if (verifyPhone(phoneOrMail)) {
      // Save the account type
      appStorage.accountType = "phone";
      appStorage.phone = phoneOrMail;
      isValid = true;
    } else {
      if (valueType == "phone") {
        $('input[name=phoneOrMailCheck]').addClass('has--error');
        $('.error-message[data-for=phoneOrMailCheck]').addClass('has--error');
      }
    }
  }

  //if the input is valid either as an email or phone number we check if there is
  //an accoutn attach to that input
  if(isValid){
    // Check the user's account
    newCheckAccount(phoneOrMail,function(response) {
      // Case when is already an user
      //If the user does not have a password and they need an OTP then
      if (response.password_type == "otp") {
        route = 'signInJobSeekerStepOTP';
        OTPLenght = 6;
        // If the account is a phone based account
        if(appStorage.accountType == 'phone'){
          // Send the OTP code for phone based accounts
          sendOTPCodePhone(phoneOrMail,OTPLenght,function(){},function(){});
        }else{
          // Send the OTP code for email based accounts
          sendOTPCodeEmail(phoneOrMail,OTPLenght,function(){},function(){});
        }
      }
      // case the type of account has a legacy password (old accounts)
      else if(response.password_type == "legacy"){
        // Check the type of the account
        if (appStorage.accountType == 'phone') {
          route = "signInJobSeekerStepOTP";
          OTPLenght = 6;
          // Send the OTP code to the phone
          sendOTPCodePhone(phoneOrMail,OTPLenght,function(){},function(){});
        } else {
          // If is not a phone based account show the sign in popup
          // route = "legacySignInJobSeekerStep";
          showJobSeekerPopup("signInJobSeekerStep","","","","",true);
        }
      }
      else {
        // Default behaviour show the jobseekers sign in popup
        route = "legacySignInJobSeekerStep";
        showJobSeekerPopup("signInJobSeekerStep","","","","",true);
        return true;
      }
      showJobSeekerPopup(route);
      $('.is--waiting').removeClass("is--waiting");
    },function(){
      // Case when we create a new user
      OTPLenght = 4;
      route = 'verifyStep';
      // Case when the account type is a phone type
      if(appStorage.accountType == 'phone'){
        // Send OTP code to the phone based accounts
        sendOTPCodePhone(phoneOrMail,OTPLenght,function(){},function(){});
      }else{
        // Send OTP code to the email based accounts
        // Autoconfirm the account for Organic Bulk Strategy - Check if the country can skip this step
        if (domain.otpSkippedCountry == "1" && appStorage.otpSkip == "yes") {
          confirmPhoneOrEmailAccount(); return false;
        } else {
          sendOTPCodeEmail(phoneOrMail,OTPLenght,function(){},function(){});
        }
      }

      // Display the correct route
      showJobSeekerPopup(route);
      $('.is--waiting').removeClass("is--waiting");
    });
  } else {
    // Showing error message if the email was not a valid one
    $('input[name=emailCheck]').addClass('has--error');
    $('.error-message[data-for=emailCheck]').addClass('has--error');
    $('.is--waiting').removeClass("is--waiting");
  }
}


/**
 * confirmPhoneOrEmailAccount()
 * Check if the account is email base or phone base, and gets their code and
 * compared to the backend. This function is used in the popups to confirm the
 * email or the phone.
 */
function confirmPhoneOrEmailAccount() {

  // Inputs from the popup
  var phoneOrEmail = appStorage.phoneOrMail;
  var code  = $('input[name=confirmCode]').val();

  // isValid default value if true, if one of the inputs is wrong, this value will
  // change to false.
  var isValid = true;

  // Only for SSO accounts
  if (appStorage.accountType == 'sso') {
    phoneOrEmail = appStorage.phone;
  }

  // Clean previous error messages
  $('.has--error').removeClass('has--error');

  // If its all good we send the form
  if (isValid) {
    if (appStorage.accountType == 'email') {
      // We confirm the email account
      confirmJobSeekerEmailByOTP(code,phoneOrEmail,4,function() {
        // If the account is confirmed, add the midstep variable
        appStorage.midStep = "yes";
        // If the country has SMS or WhatsApp services Enabled, display the
        // savePhoneNumber popup
        if (domain.allowSMSandWA != '') {
          showJobSeekerPopup("savePhoneStep");
        }
        // If the country doesn't have phone services, display the sucess message
        else {
          showJobSeekerPopup("userSuccessfulConfirmation");
        }
      },function() {
        // Display errors if it cannot be confirmed
        $('input[name=confirmCode]').addClass('has--error');
        $('.error-message[data-for=errorConfirm]').addClass('has--error');
      })
    } else {
      // We confirm the phone number account
      confirmJobSeekerPhoneByOTP(code,phoneOrEmail,4,function(){
        // If the account is confirmed, add the midstep variable
        appStorage.midStep = "yes";
        // If the type of account is SSO show the successful confirmation
        if (appStorage.accountType == 'sso') {
          showJobSeekerPopup("userSuccessfulConfirmation");
        } else {
          // If the type of account is phone number based, show the save email step
          showJobSeekerPopup("saveEmailStep");
        }
      },function(){
        // Display errors if none of the paths could be choose.
        $('input[name=confirmCode]').addClass('has--error');
        $('.error-message[data-for=errorConfirm]').addClass('has--error');
      })
    }
  }
}

/**
 * storePhoneOrEmailExtraAlert()
 * This function belongs to the second step for the account creation or login
 * process. It is used in the popups to save the phone number or the email account
 * depending on the flow that the user chooses.
 */
function storePhoneOrEmailExtraAlert(){

  // Clear all previous error messages
  $('.error-message[data-for=errorConfirm]').removeClass('has--error');
  $('.error-message[data-for=extraPhone]').removeClass('has--error');
  $('.error-message[data-for=extraEmail]').removeClass('has--error');

  // Flag to check wether if an account exists or not for the second step
  appStorage.accountExist = 0;

  // Unless the country is allowed to have SMS or WhatsApp services, don't store
  // extra data
  if (domain.allowSMSandWA != "") {
    // Check the email account type or if it is a SSO account
    if(appStorage.accountType == "email" || appStorage.accountType == "sso"){
      // Get the phone value from the input
      var phone = $('input[name=extraPhone]').val().trim();
      // Verify the phone
      if(verifyPhone(phone)){
        // Check the user account if it exists
        newCheckAccount(phone,function(response){
          // If the response is account the account exits, send a 6 digits otp code
          if (response.response == "account") {
            appStorage.phone = phone;
            appStorage.secondStepLoginData = phone;
            appStorage.secondStepLoginType = "phone";
            appStorage.accountExist = 1;
            sendOTPCodePhone(phone,6,function(){},function(){})
            showJobSeekerPopup("signInJobSeekerStepOTPPhone");
          } else {
            // if we have another response, display error messages
            $('.error-message[data-for=errorConfirm]').removeClass('has--error');
            $('.error-message[data-for=extraPhone]').addClass('has--error');
          }
          $('.error-message[data-for=errorConfirm]').addClass('has--error');
        },function(response){
          // Case when the account doesn't exists, send a 4 digits otp code
          appStorage.phone = phone;
          sendOTPCodePhone(phone,4,function(){},function(){})
          showJobSeekerPopup("verifyPhoneStep");
        });
      }
      // If the phone verification fails, display error messages
      else{
        $('input[name=extraPhone]').addClass('has--error');
        $('.error-message[data-for=extraPhone]').addClass('has--error');
      }

    }
    // Case for phone based accounts
    else if(appStorage.accountType == "phone"){
      var email = $('input[name=extraEmail]').val().trim();
      // Verify the email account
      if(verifyEmail(email)){
        // Check if the users account exits first
        newCheckAccount(email,function(response){
          // If the account is found send the 6 digits OTP code to the email
          if (response.response == "account") {
            appStorage.email = email;
            appStorage.secondStepLoginData = email;
            appStorage.secondStepLoginType = "email";
            appStorage.accountExist = 1;
            sendOTPCodeEmail(email,6,function(){},function(){})
            showJobSeekerPopup("signInJobSeekerStepOTPEmail");
          } else {
            // If is not found, display error messages
            $('.error-message[data-for=errorConfirm]').addClass('has--error');
            $('.error-message[data-for=extraEmail]').removeClass('has--error');
          }
          $('input[name=extraEmail]').addClass('has--error');
        },function(response){
          // If the account is not found, send the 4 digits OTP code
          appStorage.email = email;
          // Test to autoconfirm the account for Organic Bulk Strategy Version 2
          if (domain.otpSkippedCountry == "1" && appStorage.otpSkip == "yes") {
            updatePhoneOrEmailAccount(); return false;
          } else {
            sendOTPCodeEmail(email,4,function(){},function(){})
            showJobSeekerPopup("verifyEmailStep");
          }
        });
      }
      // if the email is not valid, display error messages
      else{
        $('input[name=extraEmail]').addClass('has--error');
        $('.error-message[data-for=extraEmail]').addClass('has--error');
      }
    }
  } else {
    showJobSeekerPopup("userSuccessfulConfirmation");
  }

}

/**
 * updatePhoneOrEmailAccount()
 * Updates the phone or email account, this is the function to be used in the
 * popups to manage both actions.
 *
 */

function updatePhoneOrEmailAccount(){
  if (event.stopPropagation) {
    event.stopPropagation();
    event.preventDefault();
  }
  // Inputs from the popup
  var code  = $('input[name=confirmCode]').val();

  // isValid default value if true, if one of the inputs is wrong, this value will
  // change to false.
  var isValid = true;

  // Clean previous error messages
  $('.has--error').removeClass('has--error');

  // if its all good we send the inform
  if (isValid) {
    if (appStorage.accountType == 'email' || appStorage.accountType == "sso") {
      // Updates the phone of an exisitng email account or an SSO account
      updateJobSeekerPhoneByOTP(code,appStorage.phone,function(){
        // Displays successful confirmation popup to the user
        showJobSeekerPopup("userSuccessfulConfirmation");
      },function(){
        // Displays error messages if the update couldn't be performed
        $('input[name=confirmCode]').addClass('has--error');
        $('.error-message[data-for=errorConfirm]').addClass('has--error');
      })
    } else {
      // Updates the email of a phone account
      updateJobSeekerEmailByOTP(code,appStorage.email ,function() {
        // Displays successful confirmation popup to the user
        showJobSeekerPopup("userSuccessfulConfirmation");
      },function() {
        // Displays error messages if the update couldn't be performed
        $('input[name=confirmCode]').addClass('has--error');
        $('.error-message[data-for=errorConfirm]').addClass('has--error');
      })
    }
  }
}


/**
 * resendOTPCode
 * This resends the OTP code to the email or phone of the user
 * @param platform  Type of platform
 * @param length length of the code
 * @returns {boolean} Returns Boolean
 */

function resendOTPCode(platform,length){

  // If the platform is an email
  if (platform == "email") {
    sendOTPCodeEmail(appStorage.email,length,function(){
      $('.error-message[data-for=ConfirmForm]').addClass('has--error');
    },function(){})
  }
  // If the platform is a phone
  else{
    sendOTPCodePhone(appStorage.phone,length,function(){
      $('.error-message[data-for=ConfirmForm]').addClass('has--error');
    },function(){})
  }

}

/**
 * updateJobSeekerPhoneByOTP
 * This function stores the email into an exisitng phone account
 * @param code  OTP Code
 * @param email email account
 * @param successFunction Success Function
 * @param failFunction Fail Function
 * @returns {boolean} Returns Boolean
 */

function updateJobSeekerEmailByOTP(code,email,successFunction,failFunction){

  //If there is already a request made we are going to proverent it
  //if all is good we just dissable the submitter button and form
  if(event.target){
    if($(event.target).find(".button[type=submit]").hasClass('is--waiting')){
      return false;
    }else{
      $(event.target).find(".button[type=submit]").addClass("is--waiting");
    }
  }

  var params      = {};
  params.code     = code;
  params.email    = email;
  params.country  = domain.country;
  params.language = domain.language;
  params.jobSeekerContext = appStorage.jobSeekerContext;
  params.jobSeekerPath = appStorage.accountType;
  params.otpSkip = appStorage.otpSkip;
  params.isBulk = appStorage.bulkRoute;

  // Ajax file location
  var where = '/ajax/jobSeeker/popups/accountCreationFlow/ajax/updateJobseekerEmail.php';
  $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;
      //Response routing
      if (objResponse.response == 'ok') {
        // Function sending the email was a success
        successFunction(objResponse);
      } else {
        // Function if something fail trying to send the email, Ex: user already
        // verify or non-existent
        failFunction(objResponse);
      }
      $('.is--waiting').removeClass("is--waiting");
    },
    fail: function(){
      //Allow button to be reactivate
      $('.is--waiting').removeClass("is--waiting");
    }
  });
}

/**
 * updateJobSeekerPhoneByOTP
 * This function stores the phone into an exisitng email account
 * @param code  OTP Code
 * @param phone Phone Number
 * @param successFunction Success Function
 * @param failFunction Fail Function
 * @returns {boolean} Returns Boolean
 */

function updateJobSeekerPhoneByOTP(code,phone,successFunction,failFunction){

  //If there is already a request made we are going to proverent it
  //if all is good we just dissable the submitter button and form
  if(event.target){
    if($(event.target).find(".button[type=submit]").hasClass('is--waiting')){
      return false;
    }else{
      $(event.target).find(".button[type=submit]").addClass("is--waiting");
    }
  }

  var params      = {};
  params.code     = code;
  params.phone    = phone;
  params.country  = domain.country;
  params.language = domain.language;
  params.jobSeekerContext = appStorage.jobSeekerContext;
  params.jobSeekerPath = appStorage.accountType;
  params.isBulk = appStorage.bulkRoute;


  // Ajax file location
  var where = '/ajax/jobSeeker/popups/accountCreationFlow/ajax/updateJobseekerPhone.php';
  $.ajax({
    type: 'POST',
    url: where,
    data: params,
    success: function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;
      //Response routing
      if (objResponse.response == 'ok') {
        // Function sending the email was a success
        successFunction(objResponse);
      } else {
        // Function if something fail trying to send the email, Ex: user already
        // verify or non-existent
        failFunction(objResponse);
      }
      $('.is--waiting').removeClass("is--waiting");
    },
    fail: function(){
      //Allow button to be reactivate
      $('.is--waiting').removeClass("is--waiting");
    }
  });
}

/**
 * Login OTP
 * Function to log in the user in the secondary data steps, when a user is asked
 * to add the phone number or an email account, it is prompt to be logged using an OTP code
 * This is the function that logs the user by entering the OTP Code
 * @param platform
 */

function logInOTP(platform){

  // The platform defines the paths of the validations that follows

  if(platform == "email"){
    var data = appStorage.email;
  }else{
    var data = appStorage.phone;
  }

  // Get the user's code
  var code = $("input[name=otpCheck]").val();

  // isValid default value if true, if one of the inputs is wrong, this value will
  // change to false.
  var isValid = true;

  // Clean previous error messages
  $('.has--error').removeClass('has--error');

  // The code needs to be 6 digits long
  if (code.length < 6) {
    isValid = false;
    $('input[name=otpCheck]').addClass('has--error');
    $('.error-message[data-for=otpCheck]').addClass('has--error');
  }

  // If its all good we send the form
  if (isValid) {
    var where = "/ajax/jobSeeker/popups/accountCreationFlow/ajax/loginJobSeekerAccountOTP.php";
    var params = {};
    params.data = data;
    params.code = code;
    params.accountType = appStorage.accountType;
    params.secondStepLoginData = appStorage.secondStepLoginData;
    params.secondStepLoginType = appStorage.secondStepLoginType;
    params.jobSeekerContext = appStorage.jobSeekerContext;

    $.post(where, params, function(response) {
      var objResponse = $.parseJSON(response);
      objResponse = objResponse.payload;
      if(objResponse.response == "fail"){
        $('input[name=otpCheck]').addClass('has--error');
        $('.error-message[data-for=otpCheck]').addClass('has--error');
      }else{
        routingEndPointAccountCreation();
      }

    });
  }

}

/**
 * This will add or remove the job to the favorites table depending if
 * the job was already in the user's favorites list.
 * @param string id
 * @param event event
 */
function addRemoveToFavoritesJob(jobId, event, source) {
  if (event.stopPropagation) {
    event.stopPropagation();
    event.preventDefault();
  }

  //if they are not log in we show then the user popup
  if (domain.jobSeekerLogin === '0') {

    appStorage.jobSeekerContext = 'favorites';
    appStorage.actionSouce = source;
    appStorage.jobSeekerFavToAdd = jobId;
    showJobSeekerPopup('checkEmailStep');

  } else {
    //If the button press has the class active-fav
    // we want to remove that jobid from the favorites
    if ($(event.target).hasClass('active-fav')) {

      // We remove the active-fav class from the clicked button
      $(event.target).removeClass('active-fav');

      // some buttons need to updates the text from "remove to favorites"
      // to "add to favorites"
      $(event.target).text($(event.target).attr('data-fav'));

      // On white page we want to update all the fav call to action
      if (app.pageName == 'whitepage') {
        $('.button--favHeader, button--ctaFav').removeClass('active-fav');
        $('.button--ctaFav').text($('.button--ctaFav').attr('data-fav'));
      }

      // on serp page desktop we want to also update the favorites
      if (app.pageName == 'serp' && domain.device == 'desktop') {
        $('.card__job[data-id=' + jobId + ']').
            find('.button--fav').
            removeClass('active-fav');
        $('.button--fav[data-button-id=' + jobId + ']').
            removeClass('active-fav');
        if ($('#jobPreview').html() != '' &&
            $('.card__job[data-id=' + jobId + ']').
                hasClass('card__job--preview'))
          addToJobIdsSessionStorage(jobId, $('#jobPreview').html());
      }
      var location = '';
      if (app.pageName == 'serp') {
        location = $('#nv-l').val();
      }
      //We remove the jobid from the job_favorite history
      var data = {};
      data.jobid = jobId;
      data.searchLocation = location;
      userEventTracket('job_favorite', data, 'delete');

    } else {

      //We add the active-fav class to update visuals and flag the clicked elemt
      $(event.target).addClass('active-fav');

      // some buttons need to updates the text from "add to favorites"
      // to "remove to favorites"
      $(event.target).text($(event.target).attr('data-rem'));

      // On white page we want to update all the fav call to action
      if (app.pageName == 'whitepage') {
        $('.button--favHeader, button--ctaFav').addClass('active-fav');
        $('.button--ctaFav').text($('.button--ctaFav').attr('data-rem'));
      }

      if (app.pageName == 'serp' && domain.device == 'desktop') {
        $('.card__job[data-id=' + jobId + ']').
            find('.button--fav').
            addClass('active-fav');
        $('.button--fav[data-button-id=' + jobId + ']').addClass('active-fav');
        if ($('#jobPreview').html() != '' &&
            $('.card__job[data-id=' + jobId + ']').
                hasClass('card__job--preview'))
          addToJobIdsSessionStorage(jobId, $('#jobPreview').html()`clear`);
      }

      //We add the jobid from the job_favorite history
      var data = {};
      data.jobid = jobId;
      userEventTracket('job_favorite', data);
    }

  }
}

/**
 * This function will insert and event in UET with the given eventName, and the data from the eventDataObject where its
 * key are the key of the array and the value the value of the array
 * @param eventName String  Name of the event to be inserted in UET
 * @param eventDataObject Object Complementary data for the event to be inserted where the key is the array name,
 * and the value is the array value Ex: Object.key = 'value'
 */

function sendEventToUET(eventName, eventDataObject){

  var params = {};
  params.eventName = eventName;
  params.eventData = eventDataObject;

  if(appStorage.firstEvent === "true"){
    params.isFirstEvent = "true";
    appStorage.firstEvent  = "false";
  }

  var where = "/ajax/send-event-to-UET.php";

  $.post(where,params,function (response){});

}

/**
 * Editable global object to store global variables can be use in all the other
 * js scripts if the common.js is include
 * @type {{}} const Object
 */
const appStorage = {};
appStorage.jobSeekerContext;
appStorage.firstEvent = "true";
/**
 * Initial function for all the pages on the public site.
 * Keep it at the end of the file -att: William
 */
$(document).ready(function() {
  checkFavoritesOnJobListing();
  preferredLanguageCookieSetup();
  //SSO landing logic
  easySignIn();

  // Function to display a popup when a user comes from the home page
  // (www.talent.com), to suggest the creation of an account
  // Commented by Ben
  // showCreatePopupFromHomeRedirect();

  // Function to redirect the user to my notifications page if they come from emails
  userNotificationRedirect();

  // Function to trigger the confirmation process when the link is used
  userSuccessConfirmationPopup();
  //This will call jquery.mask.js
  callMaskJS();
  // getCookiesTosBanner();
  if (document.documentMode || /Edge/.test(navigator.userAgent)) {
    cssVars();
  }
});