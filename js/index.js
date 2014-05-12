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
    } else if (hash === "#document_details") {
        hide_all();
        documentdetails();
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
    $('#hamburger-btn').hide();
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
    $('#hamburger-btn').show();
    $('#index_content').show();
    $('#sea').hide();
    $('#shore').show();
    $('#you').hide();
    show_plan_details();
    show_training_details();
    openpositions();
    doadetails();
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
    /*$('#tile_icons').hide();*/
    $('#update_profile').show(); 
    var results_array = new Array(); 
    results_array.push('<button onclick="youback()" class="back-btn"><img src="img/arrow-back.png"></button>');
    results_array.push('<div id="plan_details_header"  class="head_common">');
    results_array.push('<div class="header_white"></div>');
    results_array.push('<span class="header_text" class="header">Update Contact Details</span>');
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
    showdashbord();
    
    $('#tile_icons').show();
}

function vessel_type_pic(vessel_type) {
    var vessel_typ_img = 'img/ships/container.jpg';
    if(vessel_type.toUpperCase().indexOf('OIL') > -1) {
        vessel_typ_img = 'img/ships/oil.jpg';
    } else if(vessel_type.toUpperCase().indexOf('GAS') > -1) {
        vessel_typ_img = 'img/ships/gastak.jpg';
    } else if(vessel_type.toUpperCase().indexOf('BULK') > -1) {
        vessel_typ_img = 'img/ships/bulk.jpg';
    } else if(vessel_type.toUpperCase().indexOf('CHEMICAL') > -1) {
        vessel_typ_img = 'img/ships/chemical.jpg';
    } else if(vessel_type.toUpperCase().indexOf('RO RO') > -1) {
        vessel_typ_img = 'img/ships/roro.jpg';
    } else if(vessel_type.toUpperCase().indexOf('SHORE') > -1) {
        vessel_typ_img = 'img/ships/offshore.jpg';
    }
    return vessel_typ_img;
}

function show_plan_details() {
    hide_all();
    
    var cscemail=null;
    $('#index_content').show();
    $('#tile_icons').show();
    var results_array = new Array(); 
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
            
            if(data != null) {
                var flickerplace="";
                var port="";
                var vessel_type = vessel_type_pic(data['vessel_type']);
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
                
                cscemail = data['csc_email'];
                results_array.push('<div id="plan_details_header"  class="head_common_pic">');
                results_array.push('<div class="header_white"></div>');
                results_array.push('<span class="header_text" class="header"><span class="icon-boat"></span> ' + data['vessel_name'] + '(' + data['flag_name'] + ')</span>');
                // results_array.push('<div id="plan_details_header_menu"><span id="hamburger-btn" class="hamburger icon-list"></span></div>')
                results_array.push('</div>');

                results_array.push('<div class="ship_image">');
                results_array.push("<img src="+vessel_type+" style='width:100%; height:150px;'>");
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
                

            } else {
                results_array.push('<div style="margin-top: 100px;font-size: large;">No Plan Available for You.. Please Swipe screen for more details</div>')
            }
            $('#show_plan_details').html(results_array.join(""));
            if(cscemail != null) {
                document.getElementById("cscemail").href="mailto:"+cscemail;
            }
            hide_spinner();

           /* menuBtn = document.querySelector('#hamburger-btn');
            container = document.querySelector('#container');
            slidemenu = document.querySelector('#sidemenu');
            content = document.querySelector('#content');
            contentlayer = document.querySelector('#contentLayer');
            menuBtn.addEventListener('click', showSidemenu, false);
            contentlayer.addEventListener('click', showSidemenu, false);*/
        }
        
    });

}


function show_training_details() {
   var url = prefilurl+"get_sf_training_details.php?empid="+$.jStorage.get("empid");
   var training_res_array = new Array(); 
   console.log(url);
   var req = $.ajax({
    url: url,
    datatype: 'text',
    beforeSend: function() {
        show_spinner();
    },

    success : function(data) { 
        
        var d = new Date();
        for (var i = 0; i < data.length; i++) {
            if(data[i] != null) {
                if(i>0) {
                    training_res_array.push("<hr>");
                }
                training_res_array.push("<span> Course : "+data[i]['course']+"</span>");
                training_res_array.push("<br/><span> Status : "+data[i]['status']+"</span>");
                training_res_array.push("<br/><span> Duration From: "+new String(data[i]['from_date']).split("T")[0]+"&nbsp;&nbsp;&nbsp;&nbsp;To: "+new String(data[i]['to_date']).split("T")[0]+"</span>");
                training_res_array.push("<br/><span> Venue : "+data[i]['institution']+"</span>");
            } else {
                training_res_array.push("<span> No training details updated </span><br/>");
                hide_spinner();
            }
        }
        training_res_array.push(training_res_array);
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

var temp;

function openpositions(){
    var url = prefilurl+"get_sf_open_positions.php?empid="+$.jStorage.get("empid");
    
    var tr_img_array = new Array(); 
    tr_img_array.push("<img src='img/openpositions.jpg' style='width:100%; height:150px;'>");
    $('.opn_pos_img').html(tr_img_array.join(""));

    var opening_res_array = new Array(); 
    console.log(url);
    var req = $.ajax({
    url: url,
    datatype: 'text',
    beforeSend: function() {
        show_spinner();
    },

    success : function(data) { temp = data;;
        var d = new Date();
        if(data[0] != null) {
            for(var i=0; i<data.length; i++) {
                if(i>0)  {
                    opening_res_array.push("<hr>");
                }
                var vessel_type = data[i]['vessel_type'];
                opening_res_array.push("<div' class='openpositionbox'>");
                opening_res_array.push("<div' class='openpositionchild1'>");
                opening_res_array.push("<img src="+vessel_type_pic(vessel_type)+" style='width:75px; height:75px;'>");
                opening_res_array.push("</div'>");
                opening_res_array.push("<div>");
                opening_res_array.push("<span>"+data[i]['vessel_name']+"("+data[i]['flag_name']+")</span>");
                if(data[i]['vessel_type']!=null)
                    opening_res_array.push("<br/><span>"+vessel_type+"</span>");
                if(data[i]['from_date']!=null)
                    opening_res_array.push("<br/> <span>"+new String(data[i]['from_date']).split("T")[0 ]+"</span>");
                if(data[i]['rank_name']!=null)
                    opening_res_array.push("<br/><span>"+data[i]['rank_name']+"</span>");
                if(data[i]['sdc']!=null)
                    opening_res_array.push("<br/><span>"+data[i]['sdc']+"</span><br/>");
                opening_res_array.push("</div>");
                opening_res_array.push("</div>");
            }
        } else {
            opening_res_array.push("<span> No Open positions available </span><br/>");
        }
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

function show_flight_details() {

    $("#index_content").hide();
    $('#show_flight_details').show(); 
    var url = prefilurl+"get_sf_flight_details.php?empid="+$.jStorage.get("empid");
    var results_array = new Array(); 
    results_array.push('<button onclick="shoreback()" class="back-btn"><img src="img/arrow-back.png"></button>');
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
                    results_array.push("<span> Departure Date :  "+new String(data[i]['departure_date']).split("T")[i]+"</span><br/>");
                    results_array.push("<span> Arrival : "+data[i]['arrival']+"</span><br/>");
                    results_array.push("<span> Arrival Date : "+new String(data[i]['arrival_date']).split("T")[i]+"</span><br/>");
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
    /*$("#index_content").hide();
    $('#tile_icons').hide();*/
    /*$('#allotment_details').show(); */
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
            var period=0;
            results_array.push('<div id="plan_details_header"  class="head_common">');
            results_array.push('<div class="header_white"></div>');
            results_array.push('<span class="header_text" class="header">Allotment Details</span>');
            results_array.push('</div>');
            results_array.push('<div class = "hambrgrdetails">');
            if(data[0] != null) {
                results_array.push("<span> Last Processed : "+new String(data[0]['processed_on']).split("T")[0]+"</span><br/>");
                results_array.push("<br><b>Balance Amount:</b><br>");
                if(data[0] != null) {
                    for (var i = 0; i < data.length; i++) {
                        results_array.push("&nbsp;&nbsp;<span>"+data[i]['name']+" : "+data[i]['bf_bal_sf_cur']+"</span><br/>");
                        period = data[i]['max_period'];
                        hide_spinner();
                    }
                }
            }
            allotted_details(period, results_array);
            
        },
        error: function (request, status, error) {
           results_array.push("<span> No data to display </span><br/>");
           $('#allotment_details').html(results_array.join(""));
           hide_spinner();
       }

    });
}

function allotted_details(period, results_array) {
    var empid = $.jStorage.get("empid");
    /*var empid = 614946;
    period = 201307;*/
    var url = prefilurl+"get_sf_allotted_details.php?empid="+empid+"&period="+period;
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
                for (var i = 0; i < data.length; i++) {
                    if(i == 0){
                        results_array.push("<br><b>Allotted to:</b><br>");
                    }
                    results_array.push("&nbsp;&nbsp;"+data[i]['beneficiary_name']+": "+data[i]['amount']+"("+data[i]['currency']+")");
                }
            } else {
                results_array.push("<br>No Allotments for you.")
            }
            hide_spinner();
            $('#allotment_details').html(results_array.join(""));
            results_array.push('</div>');
        },
        error: function (request, status, error) {
            $('#allotment_details').html(results_array.join(""));
            results_array.push('</div>');
        }
    });
}

function correspondance(){
    $("#index_content").hide();
    $('#correspondance_content').show(); 
    var results_array = new Array(); 
    results_array.push('<button onclick="youback()" class="back-btn"><img src="img/arrow-back.png"></button>');
    results_array.push('<div id="plan_details_header"  class="head_common">');
    results_array.push('<div class="header_white"></div>');
    results_array.push('<span class="header_text" class="header">Correspondance</span>');
    results_array.push('</div>');
    results_array.push('<div class = "hambrgrdetails">');
    results_array.push('<form onsubmit="return correspondancesend()" >');
    results_array.push('<textarea class="topcoat-text-input--large" id="message" style="height: 250px;line-height: 1.5rem;"></textarea></br>');
    results_array.push('<input type="submit" value="Send" style="color:#00303f;font:bold 12px verdana; padding:5px;"></form>');
    results_array.push('</div>');
    $('#correspondance_content').html(results_array.join(""));
}

function doadetails(){
    /*$("#index_content").hide();
    $('#tile_icons').hide();*/
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
            if(data[0] != null) {
                for (var i = 0; i < data.length; i++) {
                    results_array.push("<span> DoA : "+new String(data[i]['doa']).split("T")[0]+"</span><br/>");
                    if(data[i]['remarks'] != null)
                        results_array.push("<span> Remark : "+data[i]['remarks']+"</span><br/>");
                    
                    
                }
            
            } else {
                results_array.push('<span>No DoA Available, please Add DoA</span><br>');
            }
            hide_spinner();
            results_array.push("<button onclick='doaAdd()' style='color:#00303f;font:bold 12px verdana; padding:5px;'>Add DoA</button>");
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

    doa_array.push('<button onclick="doadetails()" class="back-btn"><img src="img/arrow-back.png"></button>');
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
    var emp_id = $.jStorage.get("empid");
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
                //showdashbord();
                doadetails();
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
    /*    $('#show_plan_details').show();
    $('#show_training_details').show();   
    $('#show_flight_details').show();*/

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

function documentdetails(){
    $('#document_details').show(); 
    $("#index_content").hide();
    var url = prefilurl+"get_sf_expiry_docs.php?empid="+$.jStorage.get("empid");
    var results_array = new Array(); 
    console.log(url);
    var doc_type='doc_type';
    var req = $.ajax({
        url: url,
        datatype: 'text',
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) { 
            var d = new Date();
            results_array.push('<button onclick="youback()" class="back-btn"><img src="img/arrow-back.png"></button>');
            results_array.push('<div id="plan_details_header"  class="head_common">');
            results_array.push('<div class="header_white"></div>');
            results_array.push('<span class="header_text" class="header">Expiry Documents</span>');
            results_array.push('</div>');
            results_array.push('<div class = "hambrgrdetails">');
            if(data[0] != null) {
                for (var i = 0; i < data.length; i++) {
                    if(data[i]['doc_type'] != doc_type){
                        doc_type = data[i]['doc_type'];
                        results_array.push("<b>"+doc_type+":</b><br/>");
                    }
                    if((Date.parse(data[i]['expiry_date'])) < Date.parse(new Date())) {
                       results_array.push("<span style='color:red'>"+data[i]['name']+" <b>("+new String(data[i]['expiry_date']).split("T")[0]+") </b></span><br/>");
                    } else if((((Date.parse(data[i]['expiry_date']))-20) < Date.parse(new Date())) && (Date.parse(new Date()<(Date.parse(data[i]['expiry_date']))))){
                        results_array.push("<span style='color:green'>"+data[i]['name']+" <b>("+new String(data[i]['expiry_date']).split("T")[0]+") </b></span><br/>");
                    } else {
                        results_array.push("<span>"+data[i]['name']+" <b>("+new String(data[i]['expiry_date']).split("T")[0]+") </b></span><br/>");
                    }
                }
            
            } else {
                results_array.push('<span>No Expiry Documents Details Available</span><br>');
            }
            hide_spinner();
            results_array.push('</div>');
            $('#document_details').html(results_array.join(""));
        },
        error: function (request, status, error) {
            results_array.push("<span>No Expiry Documents Details Available</span><br/>");
            $('#document_details').html(results_array.join(""));
            hide_spinner();
        }
    });
}

function youback() {
    $('#document_details').hide(); 
    $('#correspondance_content').hide(); 
    $('#update_profile').hide(); 
    $("#index_content").show();
}

function shoreback(){
    $('#show_flight_details').hide(); 
    $("#index_content").show();
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

function alerts() {
    getplanalerts();
    
}

function getplanalerts() {
    var url = prefilurl+"get_sf_alert_plan.php?empid="+$.jStorage.get("empid");
    var alerts_array = new Array(); 
    alerts_array.push('<button onclick="you()" class="back-btn"><img src="img/arrow-back.png"></button>');
    alerts_array.push('<div id="plan_details_header"  class="head_common">');
    alerts_array.push('<div class="header_white"></div>');
    alerts_array.push('<span class="header_text" class="header">Alerts</span>');
    alerts_array.push('</div>');
    var alertcount = 0;
    console.log(url);
    var req = $.ajax({
        url: url,
        datatype: 'text',
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) {
            var d = new Date();
            alerts_array.push('<div class = "hambrgrdetails">');
            if(data[0] != null) {
                for (var i = 0; i < data.length; i++) {
                    alertcount++;
                    if(data[i]['status'] == 'I') {
                        alerts_array.push("<button class='btns' onclick='seeplanalert()'>");
                        alerts_array.push("New Plan is added: "+data[i]['vessel_name']+" ("+new String(data[i]['join_date']).split("T")[0]+") <br>");
                        alerts_array.push("</button>");
                    } else if(data[i]['status'] == 'U'){
                        alerts_array.push("There is a change in Plan, please check your ");
                        if (data[i]['changes'].indexOf('A')>-1){
                            alerts_array.push("Vessel, ");
                        }
                        if (data[i]['changes'].indexOf('B')>-1){
                            alerts_array.push("Vessel Type, ");
                        }
                        if (data[i]['changes'].indexOf('C')>-1){
                            alerts_array.push("Manager, ");
                        }
                        if (data[i]['changes'].indexOf('D')>-1){
                            alerts_array.push("Date, ");
                        }
                        if (data[i]['changes'].indexOf('E')>-1){
                            alerts_array.push("Port, ");
                        }
                        if (data[i]['changes'].indexOf('F')>-1){
                            alerts_array.push("Flag");
                        }
                        
                    }
                    
                }
            }
            getallotmentalerts(alertcount, alerts_array);
        },
        error: function (request, status, error) {
            hide_spinner();
        }
    });
}

function getallotmentalerts(alertcount, alerts_array) {
    var url = prefilurl+"get_sf_alert_allotment.php?empid="+$.jStorage.get("empid");
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
                for (var i = 0; i < data.length; i++) {
                    
                    /*if(data[i]['status'] == 'I') {*/ 
                    if((Date.parse(data[i]['processed'])) > Date.parse(new Date())){
                        alertcount++;
                        alerts_array.push("Allotment Processed on, " +new String(data[i]['processed']).split("T")[0]);
                    }
                    /*} else if(data[i]['status'] == 'U'){
                        alerts_array.push("There is a change in Plan, please check your ");
                        if (data[i]['changes'].indexOf('A')>-1){
                            alerts_array.push("Allotment Processed on, " +new String(data[i]['processed']).split("T")[0]);
                        }
                    }*/
                }
            }
            gettrainingalerts(alertcount, alerts_array)
        },
        error: function (request, status, error) {
            hide_spinner();
        }
    });
}

function gettrainingalerts(alertcount, alerts_array) {
    var url = prefilurl+"get_sf_alert_training.php?empid="+$.jStorage.get("empid");
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
                for (var i = 0; i < data.length; i++) {
                    alertcount++;
                    if(data[i]['status'] == 'I') { 
                        alerts_array.push("<button class='btns' onclick='seetriningalert()'>");
                        alerts_array.push("New Training Added: " +data[i]['institution']+" ("+new String(data[i]['from_date']).split("T")[0]+")");
                        alerts_array.push("</button>");
                    } else if(data[i]['status'] == 'U'){
                        alerts_array.push("<button class='btns' onclick='seeplanalert()'>");
                        alerts_array.push("There is a change in Training, please check your ");
                        if (data[i]['changes'].indexOf('A')>-1){
                            alerts_array.push("Course, ");
                        }
                        if (data[i]['changes'].indexOf('B')>-1){
                            alerts_array.push("From Date, ");
                        }
                        if (data[i]['changes'].indexOf('C')>-1){
                            alerts_array.push("To Date, ");
                        }
                        if (data[i]['changes'].indexOf('D')>-1){
                            alerts_array.push("Institution, ");
                        }
                        if (data[i]['changes'].indexOf('E')>-1){
                            alerts_array.push("Training Status");
                        }
                        alerts_array.push("</button>");
                    }
                }
            }
            getflightalerts(alertcount, alerts_array)
        },
        error: function (request, status, error) {
            hide_spinner();
        }
    });
}

function getflightalerts(alertcount, alerts_array) {
    var url = prefilurl+"get_sf_alert_flight.php?empid="+$.jStorage.get("empid");
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
                for (var i = 0; i < data.length; i++) {
                    alertcount++;
                    if(data[i]['status'] == 'I') { 
                        alerts_array.push("New Flight Detail Added for the date : "+new String(data[i]['arrival_date']).split("T")[0]);
                    } else if(data[i]['status'] == 'U'){
                        alerts_array.push("There is a change in Training, please check your ");
                        if (data[i]['changes'].indexOf('A')>-1){
                            alerts_array.push("Arrival, ");
                        }
                        if (data[i]['changes'].indexOf('B')>-1){
                            alerts_array.push("Departure, ");
                        }
                        if (data[i]['changes'].indexOf('C')>-1){
                            alerts_array.push("Arrival Date, ");
                        }
                        if (data[i]['changes'].indexOf('D')>-1){
                            alerts_array.push("Departure Date");
                        }
                    }
                }
            }
            hide_spinner();
            alerts_array.push('</div>');
            $('#alrtnum').html("("+alertcount+")");
            $('#alert_content').html(alerts_array.join(""));
        },
        error: function (request, status, error) {
            hide_spinner();
        }
    });
}

function alertdetails() {
    $("#alert_content").show();
    $("#index_content").hide();
}

function seeplanalert() {
    shore();
}

function seetriningalert() {
    $('#index_content').show();
    $('#shore').show();
    $('#alert_content').hide();
    $('#sea').hide();
    $('#you').hide();
    $("#seaf1").hide();
    $("#seaf2").show();
    $("#seaf3").hide();
    $("#seaf4").hide();
}

function bottm_buttons(results_array) {
    // <span class="icon-boat"></span>
    $('#tile_icons').show();
    results_array.push('<hr>');
    results_array.push('<div id="tile_icons">');
    results_array.push('<a class="footer-button" href="#flight">');
    results_array.push('<span class="icon-airplane button-icon"></span>');
    results_array.push('</a>');
    results_array.push('<a class="footer-button" href="#correspondance">');
    results_array.push('<span class="icon-chat button-icon"></span>');
    results_array.push('</a>');
    results_array.push('<a id="cscemail" href="http://www.bs-shipmanagement.com">');
    results_array.push('<div class="footer-button"><span class="icon-email2 button-icon"></span></div>');
    results_array.push('</a>');
    results_array.push('<div class="footer-button">');
    results_array.push('<span class="icon-phone button-icon"></span>');
    results_array.push('</div>');

}

function hide_all() {
    // if($("#contentLayer:visible").length>0){
    //     $('#contentLayer').trigger('click');
    // }
/*    if($("#container").hasClass( "opened" )) {
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
    // $('#view_title').hide();
    //$('#show_plan_details').hide();
    //$('#show_training_details').hide();   
    $('#show_flight_details').hide();
    $('#update_profile').hide();
    $("#alert_content").hide();
    /*$('#tile_icons').hide();*/
    //$('#allotment_details').hide();
    // $('#openpositions_content').hide();
    //$('#doa_content').hide();
    $('#document_details').hide(); 
    $('body').scrollTop(0);

}

window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}

function sea() {
    $('#sea').show();
    $('#shore').hide();
    $('#you').hide();
    allotment_details();
}

function shore() {
    $('#index_content').show();
    $('#shore').show();
    $('#alert_content').hide();
    $('#sea').hide();
    $('#you').hide();
    shoreinitial();
}

function you() {
    $('#sea').hide();
    $('#shore').hide();
    $('#index_content').show();
    $('#you').show();
    $('#alert_content').hide();
    alerts();
}

function shoreinitial(){
    $("#seaf1").show();
    $("#seaf2").hide();
    $("#seaf3").hide();
    $("#seaf4").hide();
}

function logout() {
    $.jStorage.flush();
    $('.login').show();
    $('#index_content').hide();
}