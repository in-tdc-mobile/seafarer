 /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 "use strict";
 var vessel_markers_with_imo = new Array();
 var vessel_markers = new Array();
 var markerCluster;
 var open_info_window;
var mcOptions = {minimumClusterSize: 3,gridSize: 75, maxZoom:15, minZoom:2};//gridSize: 600, maxZoom:15, minimumClusterSize: 10};
var infowindow;
var marker, i,position;
var sdc_settings = '["1","2","3","4","5","6","8","10","11"]';


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.onBackKeyDown, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        navigator.splashscreen.show();
        // if (parseFloat(window.device.version) === 7.0) {
        //   document.body.style.marginTop = "20px";
        // }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentyearent = document.getyearentById(id);
        // var listeningyearent = parentyearent.querySelector('.listening');
        // var receivedyearent = parentyearent.querySelector('.received');

        // listeningyearent.setAttribute('style', 'display:none;');
        // receivedyearent.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
    }
};

// Handle the back button
//
function onBackKeyDown() {
    alert('hi');
    step_back();
}


function toTitleCase(str)
{ if(str)
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
        $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
        $(window).scrollLeft()) + "px");
    return this;
};

Number.prototype.formatMoney = function(c, d, t){
    var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};



// var slider = new PageSlider($("#container"));
$(window).on('hashchange', route);
$(window).on('load', route_to_dashboard);

function route_to_dashboard (event) {
    window.location.replace("#");
}

// Basic page routing
function route(event) {
    /*var page,
        hash = window.location.hash.split('/')[0];

    if (hash === "#pms") {
        show_pms();
    } else if (hash === "#crew") {
        show_crew_list();
    } else if (hash === "#crew_cv") {
        show_crew_cv(window.location.hash.split('/')[1]);
    } else if (hash === "#back_crewcv") {
        hide_all();
        $('#crew').show();
        // $('html, body').animate({scrollTop: $('#crew_tile').position().top-50}, 'slow');
        $('body').scrollTop(0);
    }
    else {
        page = show_owners();
    }*/
    // slider.slidePage($(page));

}

var step_back = function() {};

var current_step = function() {};

var temp;
var pal_user_id;
var cwa_app_id;
var pal_user_name;
var owners_array;
var owner_vessels;
var owner_crew;
var dashboard_settings;
var user_rights_settings;
var selected_owner_id;
var selected_vessel_id;
var vessel_location;
var show_vessel_tracker;

window.addEventListener('load', function () {
    FastClick.attach(document.body);
}, false);

$(document).ready(function() {
    var menuBtn = document.querySelector('#hamburger-btn');
    var container = document.querySelector('#container');
    var slidemenu = document.querySelector('#sidemenu');
    var content = document.querySelector('#content');
    var contentlayer = document.querySelector('#contentLayer');
    hide_all();
    try{
        var login_empid = $.jStorage.get("empid");
        // $.jStorage.set("pal_user_email", '');
        if (login_empid == null) {
          hide_all();
          $('.login').show();
      } else {
        $('.login').hide();
        login_success();
    }
}
catch(err){    alert(err);
}

});

var prefilurl = 'https://getVesselTracker.com/seafarer_dev/';
/*$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
    options.url = 'https://getVesselTracker.com/seafarer_dev/'+ options.url ;//+ options.url + "&pal_user_email=" + $.jStorage.get("pal_user_name");
});
 */
$('#login_form').submit(function(){
    var username = $('#login_emp').val();
    var password = $('#login_password').val();

    $.jStorage.set("empid", username);
    var form_data= {
        'username': username,
        'password': password
    };
    /*var req = $.ajax({
        url: 'ldap_test_cwa.php?a=1',
        type: "post",
        data: form_data,
        beforeSend: function() {
            show_spinner();
        },

        success : function(response) {
            
        }
    });*/

 login_success();

 $('#login_password').blur();
 $('#login_emp').blur();
 return false;
});

function login_success() {
    $(".login").hide();
    $('#index_content').show();
    show_plan_details();
    show_training_details();
    show_flight_details();
    allotment_details();
    correspondance();
    $('#tile_icons').show();
}

function login_failure() {
    $(".spinner").css('visible','none');
    $("#ajax_error").show();
    $("#ajax_error").html('Wrong Email or Password. Please try again.');
    $("#ajax_error").attr('style','display:block; text-align:center;');
}
var d;

function update_profile_page() {
    $('#index_content').hide();
    $('#tile_icons').hide();
    $('#update_profile').show(); 
    var results_array = new Array(); 
    results_array.push("&nbsp; Please update Email & Phone Number<br/>");
    results_array.push('<form onsubmit="return update_profile()" ><input type="text" placeholder="Email" id="prof_email" class="biginput topcoat-text-input">');
    results_array.push('<input type="text" id="prof_phone" placeholder="Phone" class="biginput topcoat-text-input">');
    results_array.push('<input type="submit" value="Update" style="color:#00303f;font:bold 12px verdana; padding:5px;"></form>');
    $('#update_profile').html(results_array.join(""));
}

function update_profile() {
    var url = prefilurl+"insert_emp_profile.php?";
    console.log(url);
    var email = $("#prof_email").val();
    var phone = $("#prof_phone").val();
    var emp_id = $.jStorage.get("empid");
    var form_data= {
        'email': email,
        'phone': phone,
        'emp_id': emp_id
    };
    var req = $.ajax({
        url: url,
        type: "post",
        data: form_data,
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) {
            hide_spinner();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("error in update");
            hide_spinner();
        }
    });

    $('#update_profile').hide();
    show_plan_details();
    
    $('#tile_icons').show();
}

function show_plan_details() {
    var url = prefilurl+"get_sf_plan_details.php?empid="+$.jStorage.get("empid");
    console.log(url);
    var req = $.ajax({
        url: url,
        datatype: 'text',
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) {
            $('#show_plan_details').show();
            var results_array = new Array(); 
            if(data != null) {
                var flickerplace="";
                var port="";
                if(data['port'] == null) {
                    if(data['flag_name'] == null) {
                        flickerplace = data['vessel_type']+',ship,vessel,sea';
                        
                    } else {
                        flickerplace = data['flag_name']+',flag';
                    }
                    // alert(flickerplace);
                    port = "not yet allotted";                        
                } else {
                    flickerplace = data['port'];
                    port = data['port'];
                }

                flickercall(flickerplace, $('#bg'));
                results_array.push('<div id="plan_details_header">');
                results_array.push('<div id="plan_details_header_white"></div>');
                results_array.push('<span id="plan_details_header_text" class="header"><span class="icon-boat"></span> ' + data['vessel_name'] + '(' + data['flag_name'] + ')</span>');
                results_array.push('<div id="plan_details_header_menu"><span class="hamburger icon-list"></span></div>')
                results_array.push('</div>');
                results_array.push('<div class="footer">');
                // results_array.push("<span> Vessel : "+data['vessel_name']+"</span><br/>");
                // results_array.push("<span> Flag : "++"</span><br/>");
                results_array.push('<div style="margin-left:5px">')
                results_array.push("<span> Vessel Type : "+data['vessel_type']+"</span><br/>");
                results_array.push("<span> Manager : "+data['emp_sdc_name']+"</span><br/>");
                results_array.push("<span> Exp. Join Date : "+new String(data['from_date']).split("T")[0]+"</span><br/>");
                results_array.push("<span> Exp. Join Port : "+port+"</span><br/>");
                results_array.push('</div>')                
                bottm_buttons(results_array);
                results_array.push('</div>'); 
                
            }
            $('#show_plan_details').html(results_array.join(""));
            hide_spinner();
        }
    });
}

function show_training_details() {
   // $("#index_content").hide();
   $('#tile_icons').hide();
   $('#show_training_details').show(); 
   var url = prefilurl+"get_sf_training_details.php?empid="+$.jStorage.get("empid");
   var results_array = new Array(); 
   console.log(url);
   var req = $.ajax({
    url: url,
    datatype: 'text',
    beforeSend: function() {
        show_spinner();
    },

    success : function(data) { d=data;
       var d = new Date();
       $('#show_training_details').show();

       results_array.push('<div class="dashboard_tiles">');
       results_array.push('<span class="header">Training Details</span><br/>');
       results_array.push('</div>');
       for (var i = 0; i < data.length; i++) {
        var venue =data[i]['institution'];
        flickercall(venue, $('#content'));
        results_array.push('<div class="footer dashboard_tiles">');
        if(i>0) {
            results_array.push("<hr>");
        }

        results_array.push("<span> Course : "+data[i]['course']+"</span><br/>");
        results_array.push("<span> Status : "+data[i]['status']+"</span><br/>");
        results_array.push("<span> Duration Date From: "+new String(data[i]['from_date']).split("T")[0]+"&nbsp;&nbsp;&nbsp;&nbsp;To: "+new String(data[i]['to_date']).split("T")[0]+"</span><br/>");
        results_array.push("<span> Venue : "+venue+"</span><br/>");
        results_array.push("<span> Prerequisites : </span><br/>");
        results_array.push("<span> Remark : </span><br/>");
        results_array.push("</div>");
        $('#show_training_details').html(results_array.join(""));
        hide_spinner();
    }
    },
    error: function (request, status, error) {
        results_array.push("<span> No data to display </span><br/>");
        $('#show_training_details').html(results_array.join(""));
        hide_spinner();
    }

    });
}

function show_flight_details() {
    // $("#index_content").hide();
    $('#tile_icons').hide();
    $('#show_flight_details').show(); 
    var url = prefilurl+"get_sf_flight_details.php?empid="+$.jStorage.get("empid");
    var results_array = new Array(); 
    console.log(url);
    var req = $.ajax({
        url: url,
        datatype: 'text',
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) {
            if (data != null && data != "") {    
                var d = new Date();
                $('#show_flight_details').show();
                
                results_array.push("<h3>Flight Details</h3><br/>");
                for (var i = 0; i < data.length; i++) {
                    results_array.push("<span> Departure : "+data[i]['departure']+"</span><br/>");
                    results_array.push("<span> Departure Date :  "+new String(data[i]['departure_date']).split("T")[0]+"</span><br/>");
                    results_array.push("<span> Arrival : "+data[i]['arrival']+"</span><br/>");
                    results_array.push("<span> Arrival Date : "+new String(data[i]['arrival_date']).split("T")[0]+"</span><br/>");
                    results_array.push("<span> Travel Route : "+data[i]['travel_route']+"</span><br/>");
                    results_array.push("<span> Remarks : "+data[i]['remarks']+"</span><br/>");
                    $('#show_flight_details').html(results_array.join(""));
                    hide_spinner();
                }
            } else {
                results_array.push("<span> No data avilable. </span><br/>");
                $('#show_training_details').html(results_array.join(""));
            }
        },
        error: function (request, status, error) {
            results_array.push("<span> No data to display </span><br/>");
            $('#show_training_details').html(results_array.join(""));
            hide_spinner();
        }

    });
}

function allotment_details() {
    // $("#index_content").hide();
    $('#tile_icons').hide();
    $('#allotment_details').show(); 
    var url = prefilurl+"get_sf_allotment_details.php?empid="+$.jStorage.get("empid");
    var results_array = new Array(); 
    console.log(url);
    var req = $.ajax({
        url: url,
        datatype: 'text',
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) {
           var d = new Date();
           results_array.push("<h3>Allotment Details</h3><br/>");
           results_array.push("<span> Last Processed : "+new String(data[0]['processed_on']).split("T")[0]+"</span><br/>");
           for (var i = 0; i < data.length; i++) {
            results_array.push("<span>"+data[i]['name']+" : "+data[i]['bf_bal_sf_cur']+"</span><br/>");
            $('#allotment_details').html(results_array.join(""));
            hide_spinner();
        }
    },
    error: function (request, status, error) {
       results_array.push("<span> No data to display </span><br/>");
       $('#allotment_details').html(results_array.join(""));
       hide_spinner();
   }

    });
}

function correspondance(){
    // $("#index_content").hide();
    $('#correspondance_content').show(); 
    var results_array = new Array(); 
    results_array.push("<h3>Correspondance</h3>");
    results_array.push('<form onsubmit="return correspondancesend()" >');
    results_array.push('<textarea class="topcoat-text-input--large" id="message"></textarea></br>');
    results_array.push('<input type="submit" value="Send" style="color:#00303f;font:bold 12px verdana; padding:5px;"></form>');
    $('#correspondance_content').html(results_array.join(""));
}

function correspondancesend() {
    var results_array = new Array(); 
    var url = prefilurl+"sf_insert_correspondance.php?";
    console.log(url);
    var message = $("#message").val();
    var emp_id = $.jStorage.get("empid");
    var form_data= {
        'empid': emp_id,
        'managerid': -1,
        'message': message
    };
    var req = $.ajax({
        url: url,
        type: "post",
        data: form_data,
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) {
            hide_spinner();
        },
        error: function (request, status, error) {
         alert("error:"+error);
         alert("status:"+status);
         alert("request:"+status);
     }
 });
    $('#correspondance_content').hide();
    showdashbord();
}

function showdashbord() {
    $("#index_content").show();
    /*    $('#show_plan_details').show();
    $('#show_training_details').show();   
    $('#show_flight_details').show();*/
    show_plan_details();
    show_training_details();
    $("#index_content").show();
    $('#tile_icons').show();
}

function show_spinner() {
    $(".spinner_index").css('display','inline');
    $(".spinner_index").center();
}

function hide_spinner() {
    $(".spinner_index").hide();
}

function dateformat(dat) { 
    var d = new Date(dat);
    console.log(dat);
    console.log(d.getDate()+"-"+d.getMonth()+"-"+d.getYear());
    return d.getDate()+"-"+d.getMonth()+"-"+d.getYear();
}

function flickercall(tagparam, bgshow) {
    var apiKey = 'e480c5cc1cd5c146cff2fa3257e35f77';
    var perPage = '15';
    var showOnPage = '6';
    var sort = 'interestingness-desc';
    var privacy_filter = '1';
    var safe_search = '1';
    var tag = tagparam + ',landscape';
    var url = 'https://api.flickr.com/services/rest/?format=json&method='+
    'flickr.photos.search&api_key=' + apiKey + 
    '&tags=' + tag + '&per_page='+ perPage + '&sort='+ sort + '&privacy_filter='+ privacy_filter +
    '&safe_search='+ safe_search + '&jsoncallback=?';
    console.log(url);
    $.getJSON(url, function(data){

        var curphoto = data.photos.photo[Math.round(Math.random()*10)];
        var basePhotoURL = 'http://farm' + curphoto.farm + '.static.flickr.com/'
        + curphoto.server + '/' + curphoto.id + '_' + curphoto.secret + '.jpg';            
        console.log(basePhotoURL);
            bgshow.css("background", "url("+basePhotoURL+")");//no-repeat
            bgshow.css("background-size", "150% 150%");//no-repeat
            bgshow.css("background-positon", "center center");//no-repeat

            // bgshow.css("background-size", "80%");//no-repeat
        // $.each(curphoto, function(i, rPhoto){
        //     temp = rPhoto;
        //   var basePhotoURL = 'http://farm' + rPhoto.farm + '.static.flickr.com/'
        //     + rPhoto.server + '/' + rPhoto.id + '_' + rPhoto.secret + '.jpg';            
        //     console.log(basePhotoURL);
        //     bgshow.css("background", "url("+basePhotoURL+") ");//no-repeat
        //     // bgshow.css("background-size", "100% 100% ");//no-repeat

        // });
});

}
function bottm_buttons(results_array) {

    // <span class="icon-boat"></span>
    results_array.push('<hr>');
    results_array.push('<div id="tile_icons">');
    results_array.push('<div class="footer-button" onclick="show_flight_details()">');
    results_array.push('<span class="icon-airplane button-icon"></span>');
    results_array.push('</div>');
    results_array.push('<div class="footer-button" onclick="correspondance()">');
    results_array.push('<span class="icon-chat button-icon"></span>');
    results_array.push('</div>');
    results_array.push('<div class="footer-button" onclick="correspondance()">');
    results_array.push('<span class="icon-email2 button-icon"></span>');
    results_array.push('</div>');
    results_array.push('<div class="footer-button" onclick="update_profile_page()">');
    results_array.push('<span class="icon-phone button-icon"></span>');
    results_array.push('</div>');
}

function hide_all() {
    // if($("#contentLayer:visible").length>0){
    //     $('#contentLayer').trigger('click');
    // }
    /*if($("#container").hasClass( "opened" )){
        var container = document.querySelector('#container');
        var slidemenu = document.querySelector('#sidemenu');
        var content = document.querySelector('#content');
        var contentlayer = document.querySelector('#contentLayer');

        container.classList.toggle('opened');
        slidemenu.classList.toggle('sidemenu--opened');
        content.style.height = "auto";
        contentlayer.classList.toggle('contentlayer-opened');
    }*/

    $('#btnBack').hide();
    // $('#navbar').hide();
    hide_spinner();
    $('#index_content').hide();
    $('#correspondance_content').hide();
    $('#ajax_error').hide();
    $('#view_title').hide();
    $('#show_plan_details').hide();
    $('#show_training_details').hide();   
    $('#show_flight_details').hide();
    $('#update_profile').hide();
    $('#tile_icons').hide();
    $('#allotment_details').hide();
    $('body').scrollTop(0);
}