/**
 * Switches tabs
 * @param e
 */

function hyper_switch_tab(e,selectedTab){
    // remove the 'selected' class from the [button]
    $(e).closest(".tab-holder").find(".choice").removeClass("selected");

    // remove the 'selected' class from the [div-content]
    $(e).closest(".tab-holder").find(".tab-content").removeClass("selected");

    $(e).addClass("selected");
    $(e).parents(".tab-holder").find("#"+selectedTab).addClass("selected");

    // redraw all datatables
    //$.fn.dataTable.tables( { visible: true, api: true } ).responsive.recalc();
}


/**
 * Makes an Ajax call to the url and append the result to the body
 * of the file
 */

function hyper_call(url){
    $.get(url,function(data){
        $("body").append(data);
    })
}

/**
 * Submits a form asynchro
 *
 */

function hyper_submit_ajax(e){
    $(".fieldSubmit",e).prop( "disabled", true );
    $(".fieldResponse",e).html("...");
    $.post($(e).attr("action"),$(e).serialize(), function(data){
        // Don't forget to hide the loading indicator!
        $(".fieldSubmit",e).prop("disabled", false );

        // Display the response in the fieldResponse
        $(".fieldResponse",e).html(data);
    });


}

var activeAjaxCall = 0;


/**
 * Looks for all "ajax" div and calls the content
 */
function hyper_call_ajax(){


    /* Look for all divs with ajax attribute */
    $("[ajax]").each(function(){


        if (activeAjaxCall >= 64) { return false; }

        /* call that endpoing end and fill in the info */
        var url = $(this).attr("ajax");
        var e   = $(this);

        /* change the attribute name to ajaxCalled to prevent refiring */
        e.attr({ajaxCalled:e.attr("ajax")})
        e.removeAttr("ajax");

        activeAjaxCall++;
        /* make the get ajax call */
        $.get(url,function(data){
            activeAjaxCall--;
            e.html(data);
        })
    })
}


/**
 *  Allow to submit forms with AJAX
 *  Returns the painted result in the appropriate htmlTargetID
 */
function submitFormAjax(e,resetPagination="yes", callback = ""){

    // Reset Pagination most of the time
    if(resetPagination=="yes"){
         $(e).parent().find("input[name='page']").val(1);
    }

    var ej = e;
    var formURL  = $(e).attr("action");


    if(window.hyperFormSubmitStatus===undefined){
        window.hyperFormSubmitStatus = [];
    }

    // return false if the form is already loading
    if(window.hyperFormSubmitStatus[formURL] === 1){
        console.log("waiting...");
        return false;
    }

    window.hyperFormSubmitStatus[formURL] = 1;


    // Fade out the body and wait for response, gives visual cue to the user its loading
    $(ej).find(".tableHTML").fadeTo(0,.5);

    $.get($(e).attr("action"),$(e).serialize(),function(data){

        window.hyperFormSubmitStatus[formURL] = 0;

        hyperApp = JSON.parse(data);
        // Append the HTML table
        $(ej).find(".tableHTML").html(hyperApp.html);
        $(ej).find(".tableHTML").fadeTo(300,1);

        // Append the pagination HTML
        $(ej).find(".tablePageSelector").html(hyperApp.pagination);
        // Append the meta information
        $(ej).find(".tablePageHits").html(hyperApp.hits);
        // Append the meta information
        $(ej).find(".tablePageShow").html(hyperApp.show);
        // Append the Facets table
        $(ej).find(".tableFacets").html(hyperApp.facets);


        $(ej).fadeIn(100);

        // Update ordering
        hyper_update_order_column(ej);

        // Refresh ajax calls if necessary
        //hyper_call_ajax();

        // Adding callback function to retrieve
        // more info from advanced table file
        if(callback) {
            callback(hyperApp);
        }

    })
}

/**
 * Function to use the reset button
 * @param formId example (#form1)
 */
function resetFormAjax(formId, removeGetVariable = "") {

    if(removeGetVariable === "yes") {
        window.location.replace(location.pathname);
    }

    var form = $(formId)[0];
    // Reset form
    form.reset();
    // Submit form after resetting
    submitFormAjax(form,resetPagination="yes");

}


/**
 * Manage Hyper Pagination
 */

function hyper_next_page(e){
    // add 1 to the page
    var currentPage = $(e).parent().find("input[name='page']").val()*1;
    var newPage = currentPage + 1;
    $(e).parent().find("input[name='page']").val(newPage);

    //Submit the form
    var parentForm = $(e).closest("form");
    submitFormAjax( parentForm,"no");
}

function hyper_previous_page(e){
    // remove 1 to the page
    var currentPage = $(e).parent().find("input[name='page']").val()*1;
    var newPage = currentPage - 1;
    newPage = Math.max(newPage,1);
    $(e).parent().find("input[name='page']").val(newPage);

    // Submit the Form
    var parentForm = $(e).closest("form");
    submitFormAjax(parentForm,"no");

}

function hyper_goto_page(e, page){
    // remove 1 to the page
    var newPage = page;
    newPage = Math.max(newPage, 1);
    $(e).parent().parent().find("input[name='page']").val(newPage);

    // Submit the Form
    var parentForm = $(e).closest("form");
    submitFormAjax(parentForm, "no");
}

/**
 * Manage Hyper Table Column Ordering
 */
function hyper_order_column(e) {
    
    var colum       = $(e).attr("aria-label") ? $(e).attr("aria-label") : $(e).text();
    var newOrder    = "asc";
    var orderClass  = "order_asc";
    
    if ($(e).attr("aria-sort") == "asc") {
        newOrder = "desc";
        orderClass = "order_desc";
    }
    
    hyper_clean_order_column($(e).parent(), e);

    $(e).attr("aria-sort", newOrder);
    $(e).addClass(orderClass);

    // move from table > thead > td
    $(e).parents("form").find("input[name='order_by']").val(colum);
    $(e).parents("form").find("input[name='order']").val(newOrder);

    // Submit the Form
    var parentForm = $(e).closest("form");
    submitFormAjax(parentForm, "no");

}

function hyper_clean_order_column(columnsParent, actualColumn) {
    // iterate over all header cleaning order params
    /* $(columnsParent).find("th").each(function(i, value){
        if (!$(value).is(actualColumn)) $(value).attr("aria-sort","");
        $(value).removeClass("order_asc order_desc");
    }); */

    $(columnsParent).find("th").each(function(i, value){
        if ($(value).is(actualColumn)){ 
            $(value).attr("aria-sort","");
            $(value).removeClass("order_asc order_desc");
            $(value).removeClass("order_def");
        }
    });
}

function hyper_update_order_column(e) {
    var column = $(e).find("input[name='order_by']").val();
    var order = $(e).find("input[name='order']").val();
    var orderClass = "order_desc";

    if (order == "asc") {orderClass = "order_asc";}

    if (column) {
        var ej = $(e).find(`.tableHTML table tr th[aria-label='${column}']`);
        ej.addClass(orderClass);
        ej.attr("aria-sort", order);
        ej.removeClass("order_def");
    }
}

function hyperGetFacet(selection) {
    submitFormAjax("form.autoSubmit");
    return false;
}


function hyper_toggleMobileNavigation(e){
    //$(e).closest(".hyper-nav").toggleClass("hyper-nav--active");
    $("body").toggleClass("hyper-nav--active");
}

/**
 * toggleElement
 * @param elementClick
 * @param elementToDisplay
 */
function toggleActionMenu(elementClick, elementToDisplay) {
    // get element that trigger the dropdown menu
    var container = $(elementClick),
        dropdown = $('#' + elementToDisplay),
        viewportWidth = $(window).width();    // viewport width;
    // detach from container so avoid the overflow hidden
    dropdown.detach();
    $('body').append(dropdown);
    // grab the menu container position
    var containerPos = container.offset();
    var elemTopCord  = containerPos.top + Math.round(container.outerHeight());
    var elemLeftCord = containerPos.left;
    // check if the element if the tool so we use a different height
    if(dropdown.hasClass("hyper__tooltip")) {
        elemTopCord  = containerPos.top  - dropdown.height() - 50;
        elemLeftCord = containerPos.left - dropdown.width() + 165;
    }
    // place the dropdown in the correct position relevant to the container
    dropdown.css({
        top: elemTopCord,
        left: elemLeftCord,
    });
    // if the viewport Width minus the left position of the element
    // is less that the necessary space of the list that we want to show
    // we want the list to be in the very right of the site
    if ((viewportWidth - elemLeftCord) < dropdown.width()) {
        $(dropdown).css('right', '3px');
        $(dropdown).css('left', 'initial');
    } else {
        // if the list have the necessary space we just move the list
        // to be on the left coordinate of the element
        $(dropdown).css('left', elemLeftCord);
        $(dropdown).css('right', 'initial');
    }
    $(dropdown).toggle();
    // call function that close the dropdown when is not click
    closeActionMenu(elementClick, elementToDisplay);
}

/**
 * toggleActionMenu
 * @param elementClick
 * @param elementToDisplay
 */
function closeActionMenu(elementClick, elementToDisplay) {
    $(document).mouseup(function(e) {
        var eClick = $(elementClick);
        var eDisplay = $('#' + elementToDisplay);
        // if the target of the click isn't the eClick nor a descendant of the eClick
        if (!eDisplay.is(e.target) && eDisplay.has(e.target).length === 0 && !eClick.is(e.target) && eClick.has(e.target).length === 0) {
            eDisplay.hide();
        }
    });
}

/**
 * allowBodyScroll
 * Remove the class no scroll after the modal is closed
 */
function allowBodyScroll() {
    $('body').removeClass('no-scroll');
}

/**
 * preventBodyScroll
 * Add the class no scroll after the modal is called
 */
function preventBodyScroll() {
    $('body').addClass('no-scroll');
}

/**
 * Close Modal
 * Function that can be use when modal includes yes/no question
 */
function closeModal() {
    $('body').removeClass('no-scroll');
    $('.modal').remove()
}

/**
 * Custom Select (dropdown)
 * @param id
 * @param idUl
 */
function customSelect(id, idUl) {
    // Cache the number of options
    var $this = $('#' + id),
        numberOfOptions = $('#' + id).children('option').length;
    // Get the option selected in hidden select
    var selected = $($this).children('option:selected').val();
    // Hides the select element
    $this.addClass('hyper-select--hidden');
    // Wrap the select element in a div
    $this.wrap('<div class="hyper-custom-select__holder"></div>');
    // Insert a styled div to sit over the top of the hidden select element
    $this.after('<div class="hyper-select__table-filter" onclick="toggleActionMenu(this,' + `'${idUl}'` + ')"></div>');
    // Cache the styled div
    var $styledSelect = $this.next('div.hyper-select__table-filter');
    // Show the first select option in the styled div
    $styledSelect.text($this.children('option').eq(0).text());
    // Insert an unordered list after the styled div and also cache the list
    var $list = $('<ul />', {
        class: 'hyper-actions__dropdown',
        id: idUl
    }).insertAfter($styledSelect);
    // Insert a list item into the unordered list for each select option
    for (var i = 0; i < numberOfOptions; i++) {
        $('<li />', {
            text: $this.children('option').eq(i).text(),
            rel: $this.children('option').eq(i).val(),
            class: 'hyper-actions__option',
            title: $this.children('option').eq(i).text(),
        }).appendTo($list);
    }
    // Cache the list items
    var $listItems = $list.children('li');
    // Show the unordered list when the styled div is clicked (also hides it if the div is clicked again)
    $styledSelect.click(function(e) {
        e.stopPropagation();
        $('div.styledSelect.active').each(function() {
            $(this).removeClass('active').next('ul.hyper-select__options').hide();
        });
        $(this).toggleClass('active').next('ul.hyper-select__options').toggle();
    });
    // Hides the unordered list when a list item is clicked and updates the styled div to show the selected list item
    // Updates the select element to have the value of the equivalent option
    $listItems.click(function(e) {
        e.stopPropagation();
        $styledSelect.text($(this).text()).removeClass('active');
        $this.val($(this).attr('rel'));
        $list.hide();
        $this.trigger('change');
    });
    if (selected !== '') {
        $($listItems).each(function() {
            if (selected === $(this).attr('rel')) {
                $this.val($(this).attr('rel'));
                $this.val($(this).addClass('selected'));
                $styledSelect.text($(this).text()).removeClass('active');
            }
        });
    }
}

/**
 *
 * @param idSP
 * @param idSS
 * @param idDivU
 * @param idU
 * @param selected
 */
function iconsSelect(idSP, idSS, idDivU, idU, selected) {

    //test for iterating over child elements
    var dataArr = [];
    var valueSelected  = 0;

    $('#'+idSP).children("option").each(function(index) {

        var img = $(this).attr("data-thumbnail");
        var text = this.innerText;
        var value = $(this).val();
        var item = '<li class="hyper-actions__optionIcons"><img class="hyper-actions__value" src="'+img+'" value="'+value+'"/><span class="hyper-actions__text">'+text+'</span></li>';

        if (img === undefined) {
            item = '<li class="hyper-actions__optionIcons"><span class="hyper-actions__value" value="'+value+'"<span/><span class="hyper-actions__text">'+text+'</span></li>';
        }

        if (value === selected) valueSelected = index;
        dataArr.push(item);
    });

    $('#'+idU).html(dataArr);
    $('#'+idSS).html(dataArr[valueSelected]);
    $('#'+idSS).attr('value', selected);

    // Change button stuff on click
    $('#'+idU).children("li").click(function() {
        var img = $(this).find('img').attr("src");
        var value = $(this).find('.hyper-actions__value').attr('value');
        var text = this.innerText;
        var item = '<li><img class="hyper-actions__value" src="' + img + '" value="' + value + '" /><span class="hyper-actions__text">'+text+'</span></li>';
        if (img === undefined) {
            item = '<li><span class="hyper-actions__value" value="' + value + '" </span><span class="hyper-actions__text">'+text+'</span></li>';
        }
        $('#'+idSP).val(value).trigger('change');
        $('#'+idSS).html(item);
        $('#'+idSS).attr('value', value);
        $("#"+idDivU).toggle();
        if ($("#"+idDivU).attr("style").includes("none")) {
            $("#"+idSS).removeClass("active");
        }
    });

    $("#"+idSS).click(function() {
        // Using toggle action menu to avoid collision of UI
        toggleActionMenu(this, idDivU);

        if ($("#"+idDivU).attr("style").includes("block")) {
            $("#"+idSS).addClass("active");
        } else if ($("#"+idDivU).attr("style").includes("none")) {
            $("#"+idSS).removeClass("active");
        }
    });
}

/**
 * return an array with all the $_GET variables
 * Used for User Pages using hyper
 * @returns {{}}
 */
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value.split("#").shift();
    });
    return vars;
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
 * Copy Table clipboard
 * function that copy the content of the table
 * @param e
 */
function copyTableClipBoard(e) {
    var range, selection;
    var element = $(e).closest('.card').find('.hyperTable')[0];
    var copy_element = $(element).clone();
    $(element).find('td span').removeAttr('class');
    $(element).find('td div').removeAttr('class');
    $(element).find('td div').removeAttr('class');
    $(element).find('th').css({'background-color': 'white', 'color': 'black'});
    $(element).find('tr').css({'background-color': 'white', 'color': 'black'});
    if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    try {
        document.execCommand('copy');
        $(element).replaceWith(copy_element);
        $.toast({
            text: 'Document copied',
            loaderBg: '#F6F7FA',
            hideAfter: 1500,
            allowToastClose: false,
            loader: false,
        });
    } catch (err) {
        alert('unable to copy text');
    }
}

/**
 * Search in table
 */
function searchInTable(e) {

    // Selectors
    var table = $(e).closest('.card').find('.hyperTable')[0];
    var tr, td, cell, i;
    var filter = e.value.toUpperCase();

    // Find in table
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        // Hide the row initially.
        tr[i].style.display = "none";
        td = tr[i].getElementsByTagName("td");
        for (var j = 0; j < td.length; j++) {
            cell = tr[i].getElementsByTagName("td")[j];
            if (cell) {
                if (cell.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}


/**
 * Dashboard mode
 * @param element
 */
function dashboardTVMode(element) {
    var url = window.location.href;
    var re = new RegExp("([?&])" + "tv_mode" + "=.*?(&|$)", "i");
    var separator = url.indexOf('?') !== -1 ? "&" : "?";
    var newUrl;
    var tv_mode;

    if ($(element).prop('checked')) {
        tv_mode = "yes";
    } else {
        tv_mode = "no";
    }

    if (url.match(re)) {
        newUrl = url.replace(re, '$1' + "tv_mode" + "=" + tv_mode + '$2');
    } else {
        newUrl=  url + separator + "tv_mode" + "=" + tv_mode;
    }

    window.history.replaceState(null, null, newUrl);
    location.reload();
}

/**
 * Change Theme
 * @param element
 */
function changeTheme(element) {
    if ($(element).prop('checked')) {
        setCookie("hyper_theme", "dark", 0.0138);
    } else {
        setCookie("hyper_theme", "light", 0.0138);
    }
    location.reload();
}

/**
 * Hide Navigation Menu
 * @param element
 */
function hideMenu(element) {
    var url = window.location.href;
    var re = new RegExp("([?&])" + "hidden_nav" + "=.*?(&|$)", "i");
    var separator = url.indexOf('?') !== -1 ? "&" : "?";
    var newUrl;
    var hidden_nav;

    if ($(element).prop('checked')) {
        hidden_nav = "yes";
    } else {
        hidden_nav = "no";
    }

    if (url.match(re)) {
        newUrl = url.replace(re, '$1' + "hidden_nav" + "=" + hidden_nav + '$2');
    } else {
        newUrl =  url + separator + "hidden_nav" + "=" + hidden_nav;
    }

    window.history.replaceState(null, null, newUrl);
    location.reload();
}

/* When the document is ready.. */
$(document).ready(function() {
    // every second... call hyper ajax
    hyper_call_ajax();
    window.setInterval(function() {
        hyper_call_ajax();
    }, 1000);
    // submits ajax forms
    $('.autoSubmit').submit();
});


