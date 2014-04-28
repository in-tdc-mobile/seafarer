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
    var page,
        hash = window.location.hash.split('/')[0];

   /* $('#bg').css('background-image', 'none');
    $('#bg').css('background', 'black');
*/
    if (hash === "#plan") {
        show_plan_details();
    } else if (hash === "#training") {
        hide_all();
        show_training_details();
    } else if (hash === "#flight") {
        hide_all();
        show_flight_details()
    } else if (hash === "#allotment") {
        hide_all();
        allotment_details();
    } else if (hash === "#correspondance") {
        hide_all();
        correspondance();
    } else if (hash === "#openpositions") {
        hide_all();
        openpositions();
    } else if (hash === "#updatecontact") {
        hide_all();
        update_profile_page();
    } else if (hash === "#doa") {
        hide_all();
        doadetails();
    }
    else {
        // page = show_owners();
    }
    // slider.slidePage($(page));
    
    // $('#bg').css('background-image', 'none');
    // $('#bg').css('background', 'lightblue');
    
    // $('#content').css('background-image', 'none');
    // $('#content').css('background', 'lightblue');
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

var menuBtn;
var container;
var slidemenu;
var content;
var contentlayer;

window.addEventListener('load', function () {
    FastClick.attach(document.body);
}, false);

$(document).ready(function() {
    
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
    catch(err){    
        alert(err);
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
    openpositions();
    // show_flight_details();
    // allotment_details();
    // correspondance();
    
}

function showSidemenu () {
    container.classList.toggle('opened');
    slidemenu.classList.toggle('sidemenu--opened');
    contentlayer.classList.toggle('contentlayer-opened');
    content.style.height = "auto";
    $('#container').resize();
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
    results_array.push('<div id="plan_details_header"  class="head_common">');
    results_array.push('<div class="header_white"></div>');
    results_array.push('<span class="header_text" class="header">Please update Email & Phone Number</span>');
    results_array.push('</div>');
    results_array.push('<div class = "hambrgrdetails">');
    results_array.push('<form onsubmit="return update_profile()" ><input type="text" placeholder="Email" id="prof_email" class="biginput topcoat-text-input">');
    results_array.push('<input type="text" id="prof_phone" placeholder="Phone" class="biginput topcoat-text-input">');
    results_array.push('<input type="submit" value="Update" style="color:#00303f;font:bold 12px verdana; padding:5px;"></form>');
    results_array.push('</div>');   
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
    hide_all();
    var cscemail=null;
    $('#index_content').show();
    $('#tile_icons').show();
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

                //flickercall(flickerplace, $('#bg'));
                cscemail = data['csc_email'];
                results_array.push('<div id="plan_details_header"  class="head_common">');
                results_array.push('<div class="header_white"></div>');
                results_array.push('<span class="header_text" class="header"><span class="icon-boat"></span> ' + data['vessel_name'] + '(' + data['flag_name'] + ')</span>');
                // results_array.push('<div id="plan_details_header_menu"><span id="hamburger-btn" class="hamburger icon-list"></span></div>')
                results_array.push('</div>');
                results_array.push('<div>');
                results_array.push("<img src='img/container_ship_demo.jpg' style='width:100%; height:150px;'>");
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
                //data['phone1'];
                //data['phone2'];

            }
            $('#show_plan_details').html(results_array.join(""));
            if(cscemail != null) {
                document.getElementById("cscemail").href="mailto:"+cscemail;
            }
            hide_spinner();

            menuBtn = document.querySelector('#hamburger-btn');
            container = document.querySelector('#container');
            slidemenu = document.querySelector('#sidemenu');
            content = document.querySelector('#content');
            contentlayer = document.querySelector('#contentLayer');
            menuBtn.addEventListener('click', showSidemenu, false);
            contentlayer.addEventListener('click', showSidemenu, false);
        }
    });
}

var data_traing_temp;
var training_res_array = new Array(); 
function show_training_details() {
   var url = prefilurl+"get_sf_training_details.php?empid="+$.jStorage.get("empid");
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
        for (var i = 0; i < 1; i++) {
            if(data[i] != null) {
                data_traing_temp=data;
                var training_array = new Array(); 
                nextTr_i=0;
                training_array.push("<span> Course : "+data[i]['course']+"</span>");
                training_array.push("<br/><span> Status : "+data[i]['status']+"</span>");
                training_array.push("<br/><span> Duration Date From: "+new String(data[i]['from_date']).split("T")[0]+"&nbsp;&nbsp;&nbsp;&nbsp;To: "+new String(data[i]['to_date']).split("T")[0]+"</span>");
                training_array.push("<br/><span> Venue : "+data[i]['institution']+"</span>");
                $(".arrow_div_training").show();
            } else {
                $(".arrow_div_training").hide();
                training_res_array.push("<span> No data training details updated </span><br/>");
                hide_spinner();
            }
        }
        training_res_array.push(training_array);
        hide_spinner();
        $('#foot_training').html(training_res_array.join(""));

    },
    error: function (request, status, error) {
        training_res_array.push("<span> No data to display </span><br/>");
        $('#show_training_details').html(training_res_array.join(""));
        hide_spinner();
    }

    });
}
var nextTr_i;
function nextTraining() {
    if(nextTr_i<data_traing_temp.length-1) {
        nextTr_i = nextTr_i+1;
        var training_array = new Array(); 
        training_array.push("<span> Course : "+data_traing_temp[nextTr_i]['course']+"</span>");
        training_array.push("<br/><span> Status : "+data_traing_temp[nextTr_i]['status']+"</span>");
        training_array.push("<br/><span> Duration Date From: "+new String(data_traing_temp[nextTr_i]['from_date']).split("T")[0]+"&nbsp;&nbsp;&nbsp;&nbsp;To: "+new String(data_traing_temp[nextTr_i]['to_date']).split("T")[0]+"</span>");
        training_array.push("<br/><span> Venue : "+data_traing_temp[nextTr_i]['institution']+"</span><br/>");
        var training_res_array = new Array(); 
        training_res_array.push(training_array);
        $('#foot_training').html(training_res_array.join(""));
    }
   
    
}

function prevTraining() {
    if(nextTr_i>=1) {
        nextTr_i = nextTr_i-1;
        var training_array = new Array(); 
        training_array.push("<span> Course : "+data_traing_temp[nextTr_i]['course']+"</span>");
        training_array.push("<br/><span> Status : "+data_traing_temp[nextTr_i]['status']+"</span>");
        training_array.push("<br/><span> Duration Date From: "+new String(data_traing_temp[nextTr_i]['from_date']).split("T")[0]+"&nbsp;&nbsp;&nbsp;&nbsp;To: "+new String(data_traing_temp[nextTr_i]['to_date']).split("T")[0]+"</span>");
        training_array.push("<br/><span> Venue : "+data_traing_temp[nextTr_i]['institution']+"</span><br/>");
        var training_res_array = new Array(); 
        training_res_array.push(training_array);
        $('#foot_training').html(training_res_array.join(""));
    }
}
var temp;
var data_opening_temp;
var opening_res_array = new Array(); 
function openpositions(){
    var url = prefilurl+"get_sf_open_positions.php?empid="+$.jStorage.get("empid");
    
    console.log(url);
    var req = $.ajax({
    url: url,
    datatype: 'text',
    beforeSend: function() {
        show_spinner();
    },

    success : function(data) { 
        var d = new Date();
        if(data[0] != null) {
            data_opening_temp = data;
            nextOpn_i=0;
            var results_array = new Array(); 
            results_array.push("<span> Vessel : "+data[0]['vessel_name']+"("+data[0]['flag_name']+")</span>");
            if(data[0]['vessel_type']!=null)
                results_array.push("<br/><span> Vessel Type : "+data[0]['vessel_type']+"</span>");
            if(data[0]['from_date']!=null)
                results_array.push("<br/> <span> Date : "+new String(data[0]['from_date']).split("T")[0]+"</span>");
            if(data[0]['rank_name']!=null)
                results_array.push("<br/><span> Rank : "+data[0]['rank_name']+"</span>");
            if(data[0]['sdc']!=null)
                results_array.push("<br/><span> Manager : "+data[0]['sdc']+"</span><br/>");
        } else {
            opening_res_array.push("<span> No Open positions available </span><br/>");
        }
        opening_res_array.push(results_array);
        hide_spinner();
        $('#foot_opening').html(opening_res_array.join(""));

    },
    error: function (request, status, error) {
        opening_res_array.push("<span> No data to display </span><br/>");
        $('#foot_opening').html(opening_res_array.join(""));
        hide_spinner();
    }

    });
}

var nextOpn_i;
function nextOpnining() {
    if(nextOpn_i<data_opening_temp.length-1) {
        var data = data_opening_temp;
        nextOpn_i = nextOpn_i+1;
        var opening_array = new Array(); 
        if(data[nextOpn_i]['vessel_name']!=null)
            opening_array.push("<span> Vessel : "+data[nextOpn_i]['vessel_name']+"("+data[nextOpn_i]['flag_name']+")</span>");
        if(data[nextOpn_i]['vessel_type']!=null)
            opening_array.push("<br/><span> Vessel Type : "+data[nextOpn_i]['vessel_type']+"</span>");
        if(data[nextOpn_i]['from_date']!=null)
            opening_array.push("<br/><span> Date : "+new String(data[nextOpn_i]['from_date']).split("T")[0]+"</span>");
        if(data[nextOpn_i]['rank_name']!=null)
            opening_array.push("<br/><span> Rank : "+data[nextOpn_i]['rank_name']+"</span>");
        if(data[nextOpn_i]['sdc']!=null)
            opening_array.push("<br/><span> Manager : "+data[nextOpn_i]['sdc']+"</span>");
        var opening_res_array = new Array(); 
        opening_res_array.push(opening_array);
        $('#foot_opening').html(opening_res_array.join(""));
    }
   
    
}

function prevOpnining() {
    if(nextOpn_i>=1) {
        var data = data_opening_temp;
        nextOpn_i = nextOpn_i-1;
        var opening_array = new Array(); 
        if(data[nextOpn_i]['vessel_name']!=null)
            opening_array.push("<span> Vessel : "+data[nextOpn_i]['vessel_name']+"("+data[nextOpn_i]['flag_name']+")</span>");
        if(data[nextOpn_i]['vessel_type']!=null)
            opening_array.push("<br/><span> Vessel Type : "+data[nextOpn_i]['vessel_type']+"</span>");
        if(data[nextOpn_i]['from_date']!=null)
            opening_array.push("<br/><span> Date : "+new String(data[nextOpn_i]['from_date']).split("T")[0]+"</span>");
        if(data[nextOpn_i]['rank_name']!=null)
            opening_array.push("<br/><span> Rank : "+data[nextOpn_i]['rank_name']+"</span>");
        if(data[nextOpn_i]['sdc']!=null)
            opening_array.push("<br/><span> Manager : "+data[nextOpn_i]['sdc']+"</span>");
        var opening_res_array = new Array(); 
        opening_res_array.push(opening_array);
        $('#foot_opening').html(opening_res_array.join(""));
    }
}


function show_flight_details() {
    $("#index_content").hide();
    $('#tile_icons').hide();
    $('#show_flight_details').show(); 
    var url = prefilurl+"get_sf_flight_details.php?empid="+$.jStorage.get("empid");
    var results_array = new Array(); 
    results_array.push('<div id="plan_details_header"  class="head_common">');
    results_array.push('<div class="header_white"></div>');
    results_array.push('<span class="header_text" class="header">Flight Details</span>');
    results_array.push('</div>');
    results_array.push('<div class = "hambrgrdetails">');
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
                
                for (var i = 0; i < data.length; i++) {
                    results_array.push("<span> Departure : "+data[i]['departure']+"</span><br/>");
                    results_array.push("<span> Departure Date :  "+new String(data[i]['departure_date']).split("T")[0]+"</span><br/>");
                    results_array.push("<span> Arrival : "+data[i]['arrival']+"</span><br/>");
                    results_array.push("<span> Arrival Date : "+new String(data[i]['arrival_date']).split("T")[0]+"</span><br/>");
                    results_array.push("<span> Travel Route : "+data[i]['travel_route']+"</span><br/>");
                    results_array.push("<span> Remarks : "+data[i]['remarks']+"</span><br/>");
                    hide_spinner();
                }
                results_array.push('</div>');
                $('#show_flight_details').html(results_array.join(""));
            } else {
                $('#show_flight_details').show();
                results_array.push("<span> No details updated. </span><br/>");
                results_array.push('</div>');
                $('#show_flight_details').html(results_array.join(""));
                hide_spinner();
            }
        },
        error: function (request, status, error) {
            $('#show_flight_details').show();
            results_array.push("<span> No data avilable. </span><br/>");
            results_array.push('</div>');
            $('#show_flight_details').html(results_array.join(""));
            hide_spinner();
        }

    });
}

function allotment_details() {
    $("#index_content").hide();
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
           results_array.push('<div id="plan_details_header"  class="head_common">');
           results_array.push('<div class="header_white"></div>');
           results_array.push('<span class="header_text" class="header">Allotment Details</span>');
           results_array.push('</div>');
           results_array.push('<div class = "hambrgrdetails">');
           results_array.push("<span> Last Processed : "+new String(data[0]['processed_on']).split("T")[0]+"</span><br/>");
           for (var i = 0; i < data.length; i++) {
            results_array.push("<span>"+data[i]['name']+" : "+data[i]['bf_bal_sf_cur']+"</span><br/>");
            hide_spinner();
        }
        results_array.push('</div>');
        $('#allotment_details').html(results_array.join(""));
    },
    error: function (request, status, error) {
       results_array.push("<span> No data to display </span><br/>");
       $('#allotment_details').html(results_array.join(""));
       hide_spinner();
   }

    });
}

function correspondance(){
    $("#index_content").hide();
    $('#correspondance_content').show(); 
    var results_array = new Array(); 
    results_array.push('<div id="plan_details_header"  class="head_common">');
    results_array.push('<div class="header_white"></div>');
    results_array.push('<span class="header_text" class="header">Correspondance</span>');
    results_array.push('</div>');
    results_array.push('<div class = "hambrgrdetails">');
    results_array.push('<form onsubmit="return correspondancesend()" >');
    results_array.push('<textarea class="topcoat-text-input--large" id="message"></textarea></br>');
    results_array.push('<input type="submit" value="Send" style="color:#00303f;font:bold 12px verdana; padding:5px;"></form>');
    results_array.push('</div>');
    $('#correspondance_content').html(results_array.join(""));
}

function doadetails(){
    $("#index_content").hide();
    $('#tile_icons').hide();
    $('#adddoa').hide();
    $('#doa_content').show(); 
    var url = prefilurl+"get_sf_doa_details.php?empid="+$.jStorage.get("empid");
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
        $('#doa_content').show();

        // results_array.push('<div class="dashboard_tiles">');
        results_array.push('<div id="plan_details_header"  class="head_common">');
        results_array.push('<div class="header_white"></div>');
        results_array.push('<span class="header_text" class="header">DoA Details</span>');
        results_array.push('</div>');
        results_array.push('<div class = "hambrgrdetails">');
        for (var i = 0; i < data.length; i++) {
            results_array.push("<span> DOA : "+new String(data[i]['doa']).split("T")[0]+"</span><br/>");
            if(data[i]['remarks'] != null)
                results_array.push("<span> Remark : "+data[i]['remarks']+"</span><br/>");
            results_array.push("<button onclick='doaAdd()' style='color:#00303f;font:bold 12px verdana; padding:5px;'>Add DoA</button>");
            hide_spinner();
        }
        results_array.push('</div>');
        $('#doa_content').html(results_array.join(""));
    },
    error: function (request, status, error) {
        results_array.push("<span> No DOA Added </span><br/>");
        results_array.push("<button onclick='doaAdd()' style='color:#00303f;font:bold 12px verdana; padding:5px;'>Add DOA</button>");
        $('#doa_content').html(results_array.join(""));
        hide_spinner();
    }


    });
}

function doaAdd() {
    var doa_array = new Array(); 
    $('#adddoa').show();

    doa_array.push('<div class="adddoa">');
    doa_array.push('<div id="plan_details_header"  class="head_common">');
    doa_array.push('<div class="header_white"></div>');
    doa_array.push('<span class="header_text" class="header">DoA Details</span>');
    doa_array.push('</div>');
    doa_array.push('<div class = "hambrgrdetails">');
    doa_array.push('<form onsubmit="savedoa(); return false;" >');
    doa_array.push('<span>Date:</span><br><input class="topcoat-date-picker" type="date" id="doadate">');
    doa_array.push('<br><span>Remark:</span><br><textarea class="topcoat-text-input--large" id="coaremark"></textarea></br>');
    doa_array.push('<input type="submit" value="Save DoA" style="color:#00303f;font:bold 12px verdana; padding:5px;"></form>');
    doa_array.push('</form>');
    doa_array.push('</div>');
    doa_array.push('</div>');
    $('#doa_content').html(doa_array.join(""));
}

function savedoa() {
    var results_array = new Array(); 
    var url = prefilurl+"sf_save_doa.php?";
    var remark = $("#coaremark").val();
    var doadate = $("#doadate").val();
    var emp_id = $.jStorage.get("empid");alert(doadate);
    var form_data= {
        'empid': emp_id,
        'remark': remark,
        'doadate': doadate
    };
    var req = $.ajax({
        url: url,
        type: "post",
        data: form_data,
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) {
            if(data == 'Sucess') {
                showdashbord();
                $('#doa_content').hide();
            } else {
                alert("Issue in adding doa, please try again");
            }
            
            hide_spinner();
        },
        error: function (request, status, error) {
            alert("error:"+error);
            alert("status:"+status);
            alert("request:"+request);
        }
    });
}

function showdashbord() {
    $("#index_content").show();
    /*    $('#show_plan_details').show();
    $('#show_training_details').show();   
    $('#show_flight_details').show();*/
    show_plan_details();
    //show_training_details();
    $("#index_content").show();
    $('#tile_icons').show();
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
            if(data == 'Sucess') {
                $('#correspondance_content').hide();
                showdashbord();
                hide_spinner();
            } else {
                hide_spinner();
                alert("Issue in sending Correspondance, please try again");
            }
        },
        error: function (request, status, error) {
            alert("error:"+error);
            alert("status:"+status);
            alert("request:"+status);
     }
 });
    
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
    $('#tile_icons').show();
    results_array.push('<hr>');
    results_array.push('<div id="tile_icons">');
    results_array.push('<div class="footer-button" onclick="show_flight_details()">');
    results_array.push('<span class="icon-airplane button-icon"></span>');
    results_array.push('</div>');
    results_array.push('<div class="footer-button" onclick="correspondance()">');
    results_array.push('<span class="icon-chat button-icon"></span>');
    results_array.push('</div>');
    results_array.push('<div class="footer-button">');
    results_array.push('<a id="cscemail" href="http://www.bs-shipmanagement.com"><span class="icon-email2 button-icon"></span></a>');
    results_array.push('</div>');
    results_array.push('<div class="footer-button">');
    results_array.push('<span class="icon-phone button-icon"></span>');
    results_array.push('</div>');
}

function hide_all() {
    // if($("#contentLayer:visible").length>0){
    //     $('#contentLayer').trigger('click');
    // }
    if($("#container").hasClass( "opened" )){
        var container = document.querySelector('#container');
        var slidemenu = document.querySelector('#sidemenu');
        var content = document.querySelector('#content');
        var contentlayer = document.querySelector('#contentLayer');

        container.classList.toggle('opened');
        slidemenu.classList.toggle('sidemenu--opened');
        content.style.height = "auto";
        contentlayer.classList.toggle('contentlayer-opened');
    }

    $('#btnBack').hide();
    // $('#navbar').hide();
    hide_spinner();
    $('#index_content').hide();
    $('#correspondance_content').hide();
    $('#ajax_error').hide();
    $('#view_title').hide();
    //$('#show_plan_details').hide();
    //$('#show_training_details').hide();   
    $('#show_flight_details').hide();
    $('#update_profile').hide();
    /*$('#tile_icons').hide();*/
    //$('#allotment_details').hide();
    // $('#openpositions_content').hide();
    $('#doa_content').hide();
    $('body').scrollTop(0);
}

window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}