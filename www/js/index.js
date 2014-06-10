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

var app = {
    // Application Constructor
    myLog: document.getElementById("log"),
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //alert("onDeviceReady");
        //app.register();
       /* document.addEventListener('push-notification', function(event) {
            console.log('RECEIVED NOTIFICATION! Push-notification! ' + event);
            app.myLog.value+=JSON.stringify(['\nPush notification received!', event]);
            // Could pop an alert here if app is open and you still wanted to see your alert
            //navigator.notification.alert("Received notification - fired Push Event " + JSON.stringify(['push-//notification!', event]));
        });
        */
        hide_all();
        $('#hamburger-btn').hide();
        $('#top_icons').hide(); 
        $('#alert-btn').hide(); 
        $('#alert_count_btn').hide(); 
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
            alert("Error in document ready:"+err);
        }
        //document.removeEventListener('deviceready', this.deviceready, false);
    },
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
    }   
};

var iosPush = {
    register: function() {
        var pushNotification = window.plugins.pushNotification;
        try{
           pushNotification.register(
            iosPush.tokenHandler,
            errorHandler,
            {
                "badge":"true",
                "sound":"true",
                "alert":"true",
                "ecb":"iosPush.onNotificationAPN"
            });
        } catch(err) {
            alert("reg err:"+err);
        }

        alert("register 2");
    },
    tokenHandler: function (result) {
        alert('device token = ' + result);
    },

    onNotificationAPN: function(event) {
        alert("event:"+event);
        if ( event.alert )
        {
            navigator.notification.alert(event.alert);
        }

        if ( event.sound )
        {
            var snd = new Media(event.sound);
            snd.play();
        }

        if ( event.badge )
        {
            pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
        }
    }
}



function register_push_service() {
    var pushNotification = window.plugins.pushNotification;
    pushNotification.register(successHandler, errorHandler,{"senderID":"1075090837516","ecb":"onNotificationGCM"});

}

function successHandler (result) {
    alert('Callback Success! Result = '+result);

}

// result contains any error description text returned from the plugin call
function errorHandler (error) {
    alert("register_push_service errorHandler:"+error);
}

function onNotificationGCM (e) {
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                //console.log("Regid " + e.regid);
                alert('registration id = '+e.regid);
                write_reg_id_to_aws(e.regid);
            }
        break;

        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
           alert('this one message = '+e.message+' msgcnt = '+e.msgcnt);
            index_page_call();
            if(e.message.toUpperCase().indexOf('PLAN') > -1) {
                show_plan_details();
            }
            if(e.message.toUpperCase().indexOf('TRAINING') > -1) {
                show_training_details();
            }
            if(e.message.toUpperCase().indexOf('FLIGHT') > -1) {
                show_flight_details();
            }
            if(e.message.toUpperCase().indexOf('ALLOTMENT') > -1) {
                allotment_details();
            }
        break;

        case 'error':
          alert('GCM error = '+e.msg);
        break;

        default:
          alert('An unknown GCM event has occurred');
          break;
    }
}

function write_reg_id_to_aws(push_reg_id) {

    var empid = $.jStorage.get("empid");
    var form_data= {
      'empid': empid,
      'gcm_registry_id': push_reg_id,
    };
    req = $.ajax({
      url: prefilurl+"sf_register_push_device.php",
      type: "post",
      data: form_data,

      success : function(response) {
        $.jStorage.set("push_registered", true);
      }
      
    });
}

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
    } else if (hash === "#expirydocs") {
        hide_all();
        documentdetails();
    } else if (hash === "#alert") {
        hide_all();
        alerts();
    } else if (hash === "#logout") {
        hide_all();
        logout();
    } else {
        // page = show_owners();
    }
    // slider.slidePage($(page));
    
    // $('#bg').css('background-image', 'none');
    // $('#bg').css('background', 'lightblue');
    
    // $('#content').css('background-image', 'none');
    // $('#content').css('background', 'lightblue');
}

var step_back = function() {};



var menuBtn;
var containr;
var slidemenu;
var contnt;
var contentlayer;

window.addEventListener('load', function () {
    FastClick.attach(document.body);
}, false);

$(document).ready(function() {
    
    hide_all();
    $('#hamburger-btn').hide();
    $('#top_icons').hide(); 
    $('#alert-btn').hide(); 
    $('#alert_count_btn').hide(); 
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
        alert("document ready:"+err);
    }
});

var prefilurl = "https://getVesselTracker.com/seafarer_dev/";
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
    $('#index_content').css('display','block');
    $('#alert_content').css('display','block');
    $(".login").hide();
    $('#hamburger-btn').show();
    $('#top_icons').show(); 
    $('#alert-btn').show(); 
    $('#alert_count_btn').show(); 
    $('#index_content').show();
    $('#sea').hide();
    $('#shore').show();
    $('#you').hide();
    show_plan_details();
    alerts();
}

function showSidemenu () {
    containr.classList.toggle('opened');
    slidemenu.classList.toggle('sidemenu--opened');
    contentlayer.classList.toggle('contentlayer-opened');
    contnt.style.height = "auto";
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
    index_page_call();
    $('#index_content').show();
    $('#update_profile').show(); 
    var results_array = new Array(); 
    setheadername(results_array, '<span class="icon-pencil2 pagename-icon"></span>  Update Contact Details', "name");
    results_array.push('<div class = "hambrgrdetails">');
    results_array.push('<form onsubmit="return update_profile()" ><input type="text" placeholder="Email" id="prof_email" class="biginput topcoat-text-input">');
    results_array.push('<input type="text" id="prof_phone" placeholder="Phone" class="biginput topcoat-text-input">');
    results_array.push('<input type="submit" value="Update" style="color:#00303f;font:bold 12px verdana; padding:5px;"></form>');
    results_array.push('</div>');   
    $('#update_profile').html(results_array.join(""));
}

function update_profile() {
    var results_array = new Array(); 
    setheadername(results_array, '<span class="icon-pencil2"></span>  Update Contact Details', "name");
    results_array.push('<div class = "hambrgrdetails">');
    var url = prefilurl+"insert_emp_profile.php?";
    //console.log(url);
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
            results_array.push('</span> Profile Updated...</span>');  
            results_array.push('</div>');
            $('#update_profile').html(results_array.join(""));
            hide_spinner();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            results_array.push('</span> Issue in Profile Updation...</span>');  
            results_array.push('</div>');
            $('#update_profile').html(results_array.join(""));
            //alert("error in update");
            hide_spinner();
        }
    });
    //$('#update_profile').hide();
    //$('#tile_icons').show();
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
    index_page_call();
    iosPush.register();
    //register_push_service();
    hide_all();
    var cscemail="https://www.bs-shipmanagement.com";
    $('#index_content').show();
    $('#show_plan_details').show();
    var results_array = new Array(); 
    var url = prefilurl+"get_sf_plan_details.php?empid="+$.jStorage.get("empid");
    //console.log(url);
    var req = $.ajax({
        url: url,
        datatype: 'text',
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) {
            
            
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
                    port = "Not Yet Allotted";                        
                } else {
                    flickerplace = data['port'];
                    port = data['port'];
                }
                
                if( data['csc_email']!=null &&  data['csc_email']!='' )
                    cscemail = "mailto:"+data['csc_email'];

                $.jStorage.set("cscemail", cscemail)
                setheadername(results_array, '<span class="icon-briefcase pagename-icon"></span><span class="icon-boat"></span>  '+data['vessel_name'] + '(' + data['flag_name'] + ')', "pic");
                
                results_array.push('<div class="ship_image">');
                results_array.push("<img src="+vessel_type+" class='dip_img'>");
                results_array.push('</div>');

                results_array.push('<div class="footer">');
                // results_array.push("<span> Vessel : "+data['vessel_name']+"</span><br/>");
                // results_array.push("<span> Flag : "++"</span><br/>");
                results_array.push('<div style="margin-left:5px">');
                results_array.push("<span><b> Vessel Type :</b> "+data['vessel_type']+"</span><br/>");
                results_array.push("<span><b> Manager :</b> "+data['emp_sdc_name']+"</span><br/>");
                results_array.push("<span><b> Exp. Join Date :</b> "+dateformat(data['from_date'], "dd-mon-yyyy")+"</span><br/>");
                results_array.push("<span><b> Exp. Join Port :</b> "+port+"</span><br/>");
                results_array.push('</div>');
                bottm_buttons("P" ,results_array, cscemail);
                
                //data['phone1'];
                //data['phone2'];
                

            } else {
                setheadername(results_array, '<span class="icon-briefcase pagename-icon"></span>  Plan Details', "pic");
                results_array.push('<div style="margin-top: 100px;font-size: large;">No Plan Available for You.. Please Swipe screen for more details</div>')
            }
            $('#show_plan_details').html(results_array.join(""));
           /* if(cscemail != null) {
                document.getElementById("cscemail").href="mailto:"+cscemail;
            }*/
            hide_spinner();

            menuBtn = document.querySelector('#hamburger-btn');
            containr = document.querySelector('#container');
            slidemenu = document.querySelector('#sidemenu');
            contnt = document.querySelector('#content');
            contentlayer = document.querySelector('#contentLayer');
            menuBtn.addEventListener('click', showSidemenu, false);
            contentlayer.addEventListener('click', showSidemenu, false);
        },
        error: function (request, status, error) {
        results_array.push("<span> No plan to display"+error+"</span><br/>");
        $('#show_plan_details').html(results_array.join(""));
        hide_spinner();
    }
        
    });
    

}


function show_training_details() {
    index_page_call();
    hide_all();
    $('#index_content').show();
    $('#show_training_details').show();
    var url = prefilurl+"get_sf_training_details.php?empid="+$.jStorage.get("empid");
    var training_res_array = new Array(); 
    setheadername(training_res_array, '   Training', "pic");
    training_res_array.push("<div class='training_image'> <img src='img/simulator.jpg' class='dip_img'> </div>");
    //console.log(url);
    var req = $.ajax({
    url: url,
    datatype: 'text',
    beforeSend: function() {
        show_spinner();
    },
    
    success : function(data) { 
        
        var d = new Date();
        training_res_array.push('<div class="footer">');
        training_res_array.push("<ul class='topcoat-list__container' id='listview'>");
        for (var i = 0; i < data.length; i++) {
            if(data[i] != null) {
                if(i>0) {
                    // training_res_array.push("<hr class='style-one'>");
                }
                training_res_array.push("<li class='topcoat-list__item'>");                
                training_res_array.push("<span><b>Course :</b> "+data[i]['course']+"</span>");
                training_res_array.push("<br/><span><b>Status :</b> "+data[i]['status']+"</span>");
                training_res_array.push("<br/><span><b>From :</b> "+dateformat(data[i]['from_date'], "dd-mon-yyyy")+"</span>");
                training_res_array.push("<br/><span><b>To :</b> "+dateformat(data[i]['to_date'], "dd-mon-yyyy")+"</span>");
                training_res_array.push("<br/><span><b>Venue :</b> "+data[i]['institution']+"</span>");
                training_res_array.push("</li>");
            } else {
                training_res_array.push("<span> No training details updated </span><br/>");
                hide_spinner();
            }
        }
        training_res_array.push(training_res_array);
        hide_spinner();
        training_res_array.push("</ul>");
        training_res_array.push('</div>');
        //$('#foot_training').html(training_res_array.join(""));
        $('#show_training_details').html(training_res_array.join(""));
    },
    error: function (request, status, error) {
        training_res_array.push("</div>");
        training_res_array.push("<span> No data to display </span><br/>");
        $('#show_training_details').html(training_res_array.join(""));
        hide_spinner();
    }

    });
}


function openpositions() {
    index_page_call();
    hide_all()
    $('#index_content').show();
    $('#openpositions_content').show();
    var url = prefilurl+"get_sf_open_positions.php?empid="+$.jStorage.get("empid");

    var opening_res_array = new Array(); 
    setheadername(opening_res_array, '<span class="icon-megaphone2 pagename-icon"></span>  Open Positions', "pic");
    opening_res_array.push("<div class='opn_pos_img'><img src='img/openpositions.jpg' class='dip_img'></div>");
    // opening_res_array.push("<div class='footer'>");
    
    // opening_res_array.push("<ul class='topcoat-list__container'>");

    //console.log(url);
    var req = $.ajax({
    url: url,
    datatype: 'text',
    beforeSend: function() {
        show_spinner();
    },

    success : function(data) {
        var d = new Date();
        if(data[0] != null) {
            for(var i=0; i<data.length; i++) {
                if(i>0)  {
                    // opening_res_array.push("<hr class='style-one'>");
                }
                var vessel_type = data[i]['vessel_type'];
                // opening_res_array.push("<li class='topcoat-list__item'>");
                opening_res_array.push("<div class='footer'>");
                opening_res_array.push("<div class='openpositionbox'>");
                opening_res_array.push("<div class='openpositionchild1'>");
                opening_res_array.push("<img src="+vessel_type_pic(vessel_type)+" style='width:85px; height:80px;'>");
                opening_res_array.push("</div>");
                opening_res_array.push("<div>");
                opening_res_array.push("<span>"+data[i]['vessel_name']+"("+data[i]['flag_name']+")</span>");
                if(data[i]['vessel_type']!=null)
                    opening_res_array.push("<br/><span>"+vessel_type+"</span>");
                if(data[i]['from_date']!=null)
                    opening_res_array.push("<br/> <span>"+dateformat(data[i]['from_date'], "dd-mon-yyyy")+"</span>");
                if(data[i]['rank_name']!=null)
                    opening_res_array.push("<br/><span>"+data[i]['rank_name']+"</span>");
                if(data[i]['sdc']!=null)
                    opening_res_array.push("<br/><span>"+data[i]['sdc']+"</span><br/>");
                opening_res_array.push("</div>");
                opening_res_array.push("</div>");
                opening_res_array.push("</div>");
                // opening_res_array.push("</li>");                
            }
        } else {
            opening_res_array.push("<span> No Open positions available </span><br/>");
        }
        hide_spinner();
        // opening_res_array.push("</ul>");
        // opening_res_array.push("</div>");
        $('#openpositions_content').html(opening_res_array.join(""));
    },
    error: function (request, status, error) {
        opening_res_array.push("<span> No data to display </span><br/>");
        opening_res_array.push("</div>");
        $('#openpositions_content').html(opening_res_array.join(""));
        hide_spinner();
    }

    });
}

function show_flight_details() {
    index_page_call();
    hide_all();
    $("#index_content").show();
    $('#show_flight_details').show(); 
    var url = prefilurl+"get_sf_flight_details.php?empid="+$.jStorage.get("empid");
    var results_array = new Array(); 
    setheadername(results_array, '<span class="icon-airplane2  pagename-icon"></span>  Flight Details', "pic");
    results_array.push("<div> <img src='img/flight.jpg' class='dip_img'> </div>");
    //results_array.push('<button onclick="shoreback()" class="back-btn"><img src="img/arrow-back.png"></button>');

    results_array.push('<div class = "footer" style="margin-top: 0px;">');
    //console.log(url);
    var req = $.ajax({
        url: url,
        datatype: 'text',
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) {
            if (data != null && data != "") {    
                var d = new Date();
                
                for (var i = 0; i < data.length; i++) {
                    results_array.push("<span> Departure : "+data[i]['departure']+"</span><br/>");
                    results_array.push("<span> Departure Date :  "+dateformat(data[i]['departure_date'], "dd-mon-yyyy")+"</span><br/>");
                    results_array.push("<span> Arrival : "+data[i]['arrival']+"</span><br/>");
                    results_array.push("<span> Arrival Date : "+dateformat(data[i]['arrival_date'], "dd-mon-yyyy")+"</span><br/>");
                    results_array.push("<span> Travel Route : "+nullcheck(data[i]['travel_route'])+"</span><br/>");
                    results_array.push("<span> Remarks : "+nullcheck(data[i]['remarks'])+"</span><br/>");
                    hide_spinner();
                }                
     
        } else {
                results_array.push("<span> No details updated. </span><br/>");
                hide_spinner();
            }
            results_array.push('</div>');
            $('#show_flight_details').html(results_array.join(""));
        },
        error: function (request, status, error) {
            results_array.push("<span> No data avilable. </span><br/>");
            results_array.push('</div>');
            $('#show_flight_details').html(results_array.join(""));
            hide_spinner();
        }

    });
}

function allotment_details() {
    index_page_call();
    hide_all();
    $("#index_content").show();
    $('#allotment_details').show();
    var url = prefilurl+"get_sf_allotment_details.php?empid="+$.jStorage.get("empid");
    var results_array = new Array(); 
    setheadername(results_array, '<span class="icon-banknote pagename-icon"></span>  Allotment Details', "pic");
    results_array.push("<div> <img src='img/money.jpg' class='dip_img'> </div>");
    //console.log(url);
    var req = $.ajax({
        url: url,
        datatype: 'text',
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) {
            var d = new Date();
            var period=0;
            results_array.push('<div class = "footer" style="margin-top: 0px;">');
            if(data[0] != null) {
                var pro_date = new Date(data[0]['processed_on']);
                results_array.push("<span> Amount is Processed on "+getMonthName(pro_date.getMonth()) +", "+pro_date.getFullYear() +"</span><br/>");
                results_array.push("Balance Amount is ");
                var balamnt=0;
                if(data[0] != null) {
                    for (var i = 0; i < data.length; i++) {
                        //console.log(data[i]['bf_bal_sf_cur']);
                        balamnt=parseFloat(balamnt)+parseFloat(data[i]['bf_bal_sf_cur']);
                        //results_array.push("&nbsp;&nbsp;<span><b>"+data[i]['name']+" :</b> "+data[i]['bf_bal_sf_cur']+"</span><br/>");
                        period = data[i]['max_period'];
                        hide_spinner();
                    }
                }
                results_array.push(prsflt(balamnt));
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
    //console.log(url);
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
                        results_array.push("<br> Amount Allotted to ");
                    }
                    results_array.push("<br>&nbsp;&nbsp;"+data[i]['beneficiary_name']+": "+data[i]['amount']+"("+data[i]['currency']+")");
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
    index_page_call();
    hide_all();
    $("#index_content").show();
    $('#correspondance_content').show(); 
    var results_array = new Array(); 
    //results_array.push('<button onclick="youback()" class="back-btn"><img src="img/arrow-back.png"></button>');
    setheadername(results_array, '<span class="icon-bubbles  pagename-icon"></span>  Correspondance', "name");
    results_array.push('<div class = "hambrgrdetails">');
    results_array.push('<form onsubmit=correspondancesend(); return false; >');
    results_array.push('<textarea class="topcoat-text-input--large" id="message" style="width: 100%; height: 250px;line-height: 1.5rem;"></textarea></br>');
    results_array.push('<span id="error_corrspondance" style="color:red"></span><br>');
    results_array.push('<input type="submit" value="Send" style="color:#00303f;font:bold 12px verdana; padding:5px;"></form>');
    bottm_buttons("C" ,results_array, $.jStorage.get("cscemail"));
    results_array.push('</div>');
    $('#correspondance_content').html(results_array.join(""));
}

function correspondancesend() {
    var message = $("#message").val();
    if(message == null || message == '') {
        $('#error_corrspondance').html("Please enter text and continue..");
    } else {
        var results_array = new Array(); 
        setheadername(results_array, '<span class="icon-bubbles  pagename-icon"></span>  Correspondance', "name");
        results_array.push('<div class = "hambrgrdetails">');
        results_array.push('<img src = "img/email-send.png">');
        var url = prefilurl+"sf_insert_correspondance.php?";
        //console.log(url);
        var emp_id = $.jStorage.get("empid");
        var form_data= {
            'empid': emp_id,
            'managerid': -1,
            'message': message,
            'subject':''
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
                    //$('#correspondance_content').hide();
                    //showdashbord();
                    hide_spinner();
                    results_array.push('</span> Correspondance send...</span>');
                    results_array.push("</div>");
                    $('#correspondance_content').html(results_array.join(""));
                    
                } else {
                    hide_spinner();
                    results_array.push("Issue in sending Correspondance, please try again");
                    results_array.push("</div>");
                    $('#correspondance_content').html(results_array.join(""));
                }
            },
            error: function (request, status, error) {
                results_array.push("Issue in sending Correspondance, please try again:"+error);
                results_array.push("</div>");
                $('#correspondance_content').html(results_array.join(""));
            }
         
        });
    }
}

function doadetails(){
    index_page_call();
    hide_all();
    /*$("#index_content").hide();
    $('#tile_icons').hide();*/
    $('#adddoa').hide();
    $('#index_content').show(); 
    $('#doa_content').show(); 
    var url = prefilurl+"get_sf_doa_details.php?empid="+$.jStorage.get("empid");
    var results_array = new Array(); 
    //console.log(url);
    var req = $.ajax({
        url: url,
        datatype: 'text',
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) { 
            var d = new Date();
            $('#doa_content').show();
            var add = 'adddoa';
            var cancel = 'canceldoa';
            // results_array.push('<div class="dashboard_tiles">');
            setheadername(results_array, '<span class="icon-calendar4 pagename-icon"></span>  DoA Details', "name");
            results_array.push('<div class = "footer">');
            results_array.push("<div style='margin-top:30px;'>");            
            if(data[0] != null) {
                for (var i = 0; i < data.length; i++) {
                    results_array.push("<span><b>DoA :</b> "+dateformat(data[i]['doa'], "dd-mon-yyyy")+"</span><br/>");
                    if(data[i]['remarks'] != null)
                        results_array.push("<span><b>Remark :</b> "+data[i]['remarks']+"</span><br/>");
                }
            
            } else {
                results_array.push('<span>No DoA Available, please Give DoA</span><br>');
            }
            results_array.push("</div>");
            hide_spinner();
            results_array.push("<div style='margin-top:40px;margin-bottom:15px;'>");
            results_array.push("<button onclick=\"doaAdd('"+add+"')\" style='color:#00303f;font:bold 12px verdana; padding:5px;'>Give DoA</button>");
            results_array.push("<button onclick=\"doaAdd('"+cancel+"')\" style='color:#00303f;font:bold 12px verdana; padding:5px;'>Cancel DoA</button>");
            results_array.push("</div>");
            results_array.push('</div>');
            $('#doa_content').html(results_array.join(""));
        },
        error: function (request, status, error) {
            results_array.push("<span> No DOA Given </span><br/>");
            results_array.push("<button onclick=\"doaAdd('"+add+"')\" style='color:#00303f;font:bold 12px verdana; padding:5px;'>Give DOA</button>");
            results_array.push("<button onclick=\"doaAdd('"+cancel+"')\" style='color:#00303f;font:bold 12px verdana; padding:5px;'>Cancel DoA</button>");
            $('#doa_content').html(results_array.join(""));
            hide_spinner();
        }
    });
}

function doaAdd(status) {
    if(status.indexOf('adddoa')>-1) {
        var doa_array = new Array(); 
        $('#adddoa').show();

        //doa_array.push('<button onclick="doadetails()" class="back-btn"><img src="img/arrow-back.png"></button>');
        doa_array.push('<div class="adddoa">');
        setheadername(doa_array, '<span class="icon-calendar4 pagename-icon"></span>  DoA Details', "name");
        doa_array.push('<div class = "hambrgrdetails">');
        doa_array.push("<form onsubmit=savedoa(); return false; >");
        doa_array.push('<span>Date:</span><br><input class="topcoat-text-input" type="date" value='+new Date()+' id="doadate">');
        doa_array.push('<br><span>Remark:</span><br><textarea class="topcoat-text-input--large" id="coaremark"></textarea></br>');
        doa_array.push('<span id="error_doa" style="color:red"></span><br>');
        doa_array.push('<input type="submit" value="Save DoA" style="color:#00303f;font:bold 12px verdana; padding:5px;">');
        doa_array.push('<input type="button" onclick="doadetails()" value="back" style="color: #00303f;font: bold 12px verdana;padding: 5px;">');
        doa_array.push('</form>');
        doa_array.push('</div>');
        doa_array.push('</div>');
        $('#doa_content').html(doa_array.join(""));
    } else {
        canceldoa();
    }
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
        'doadate': doadate,
        'operation': 'A'
    };
    if(doadate == null || doadate == '' || (Date.parse(doadate) < Date.parse(new Date()))) {
        $('#error_doa').html("Please enter a valid future date and continue..");
    } else {
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
                 doadetails();
                 hide_spinner();
                /*alert("error:"+error);
                alert("status:"+status);
                alert("request:"+request);*/
            }
        });
    }
}

function canceldoa() {
    var results_array = new Array(); 
    var url = prefilurl+"sf_save_doa.php?";
    var remark = $("#coaremark").val();
    var doadate = $("#doadate").val();
    var emp_id = $.jStorage.get("empid");
    var form_data= {
        'empid': emp_id,
        'remark': remark,
        'doadate': doadate,
        'operation': 'C'
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

function documentdetails(){
    index_page_call();
    hide_all();
    $("#index_content").show();
    $('#document_details').show(); 
    var url = prefilurl+"get_sf_expiry_docs.php?empid="+$.jStorage.get("empid");
    var results_array = new Array(); 
    //console.log(url);
    var doc_type='doc_type';
    var req = $.ajax({
        url: url,
        datatype: 'text',
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) { 
            var d = new Date();
            //results_array.push('<button onclick="youback()" class="back-btn"><img src="img/arrow-back.png"></button>');
            /*results_array.push('<div id="plan_details_header"  class="head_common">');
            results_array.push('<div class="header_white"></div>');
            results_array.push('<span class="header_text" class="header">Expiry Documents</span>');
            results_array.push('</div>');*/
            setheadername(results_array, '<span class="icon-file pagename-icon"></span>My Documents');
            results_array.push('<div class = "hambrgrdetails">');
            if(data[0] != null) {
                for (var i = 0; i < data.length; i++) {                    
                    if(data[i]['doc_type'] != doc_type){
                        if ( i!=0 ) {
                            results_array.push('</div>'); 
                            results_array.push("</ul>");
                        }
                        results_array.push('<div class = "footer">');
                        doc_type = data[i]['doc_type'];
                        results_array.push("<b><div class='header_text'>"+toTitleCase(doc_type.slice(1))+"</div></b><br>");                        
                        results_array.push("<ul class='topcoat-list__container'>");
                    }
                    if((Date.parse(data[i]['expiry_date'])) < Date.parse(new Date())) {
                        results_array.push("<li class='topcoat-list__item'>");
                        results_array.push("<span style='color:red'>"+toTitleCase(data[i]['name'])+" <b>("+dateformat(data[i]['expiry_date'], "dd-mon-yyyy")+") </b></span><br/>");
                        results_array.push("</li>");                        
                    } else if((((Date.parse(data[i]['expiry_date']))-20) < Date.parse(new Date())) && (Date.parse(new Date()<(Date.parse(data[i]['expiry_date']))))) {
                        results_array.push("<li class='topcoat-list__item'>");
                        results_array.push("<span style='color:green'>"+toTitleCase(data[i]['name'])+" <b>("+dateformat(data[i]['expiry_date'], "dd-mon-yyyy")+") </b></span><br/>");
                        results_array.push("</li>");                        
                    } else {
                        results_array.push("<li class='topcoat-list__item'>");
                        results_array.push("<span>"+toTitleCase(data[i]['name'])+" <b>("+dateformat(data[i]['expiry_date'], "dd-mon-yyyy")+") </b></span><br/>");
                        results_array.push("</li>");                        
                    }
                }
                results_array.push('</div>'); 
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

function show_spinner() {
    $(".spinner_index").css('display','inline');
    $(".spinner_index").center();
}

function hide_spinner() {
    $(".spinner_index").hide();
}

function dateformat(dat, format) { 
    if(dat != null && dat != '') {
        var d = new Date(dat);
        //console.log(dat);
        //console.log(d.getDate()+"-"+d.getMonth()+"-"+d.getYear());
        if(format == "dd-mon-yyyy")
            dat = ("0" + d.getDate()).slice(-2)+"-"+getMonthName(d.getMonth())+"-"+d.getFullYear();
    } else {
        dat = '';
    }
    return dat
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
    //console.log(url);
    $.getJSON(url, function(data){

        var curphoto = data.photos.photo[Math.round(Math.random()*10)];
        var basePhotoURL = 'http://farm' + curphoto.farm + '.static.flickr.com/'
        + curphoto.server + '/' + curphoto.id + '_' + curphoto.secret + '.jpg';            
        //console.log(basePhotoURL);
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
function alerts_btn_call() {
    if($("#alert_content").css("z-index") == 1) {
        $("#index_content").addClass('rightsmooth');
        $("#alert_content").removeClass('leftsmooth');
        $("#alert_content").css('z-index', 2);
        $("#index_content").css('z-index', 1);
    } else {
        $("#alert_content").addClass('leftsmooth');
        $("#index_content").removeClass('rightsmooth');
        $("#index_content").css('z-index', 2);
        $("#alert_content").css('z-index', 1);
    }
}

function alerts() {
    var url = prefilurl+"get_sf_alerts.php?empid="+$.jStorage.get("empid");
    var alerts_array = new Array(); 
    setheadername(alerts_array, '<span class="icon-bell2 pagename-icon"></span>  Alerts');
    var alertcount = 0;
    //console.log(url);
    var req = $.ajax({
        url: url,
        datatype: 'text',
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) {
            var d = new Date();
            alerts_array.push('<div class = "hambrgrdetails">');
            alerts_array.push('<ul class="topcoat-list__container">');
            if(data[0] != null) {
                for (var i = 0; i < data.length; i++) {
                    
                        alertcount++;
                        
                        
                        if(data[i]['alert_name'] == "FLIGHT") {
                            // $('#h_flight').html('<img src="img/tick.png">');
                            alerts_array.push('<li class="topcoat-list__item">');
                            alerts_array.push('<span class="icon-airplane2 pagename-icon"></span>  ');
                            alerts_array.push("<a class='btns' href='#flight'>");
                        }
                        if(data[i]['alert_name'] == "TRAINING") {
                            // $('#h_training').html('<img src="img/tick.png">');
                            alerts_array.push('<li class="topcoat-list__item">');
                            alerts_array.push('<span class="icon-users pagename-icon"></span>  ');
                            alerts_array.push("<a class='btns' href='#training'>");
                        }
                        if(data[i]['alert_name'] == "ALLOTMENT") {
                            // $('#h_allotment').html('<img src="img/tick.png">');
                            alerts_array.push('<li class="topcoat-list__item">');
                            alerts_array.push('<span class="icon-banknote pagename-icon"></span>  ');
                            alerts_array.push("<a class='btns' href='#allotment'>");
                        }
                        if(data[i]['alert_name'] == "PLAN") {
                            // $('#h_plan').html('<img src="img/tick.png">');
                            alerts_array.push('<li class="topcoat-list__item">');
                            alerts_array.push('<span class="icon-briefcase pagename-icon"></span>  ');
                            alerts_array.push("<a class='btns' href='#plan'>");
                        }
                        if(data[i]['alert_name'] == "OPEN_POSITION") {
                            // $('#h_plan').html('<img src="img/tick.png">');
                            alerts_array.push('<li class="topcoat-list__item">');
                            alerts_array.push('<span class="icon-megaphone2 pagename-icon"></span>  ');
                            alerts_array.push("<a class='btns' href='#openpositions'>");
                            alerts_array.push(data[i]['status']+" "+toTitleCase(data[i]['message']));
                        } else {
                            alerts_array.push(toTitleCase(data[i]['message']));
                        }
                        
                        
                        alerts_array.push("</a>");
                        alerts_array.push("</li>");
                        // alerts_array.push("<hr  class='style-one'>")
                }
                hide_spinner();
                alerts_array.push('</ul></div>');
                $('#alert_count').html(alertcount);
                $('#alert_content').html(alerts_array.join(""));
            }
        },
        error: function (request, status, error) {
            hide_spinner();
        }
    });
}

function bottm_buttons(page, results_array, cscemail) {
    // <span class="icon-boat"></span>
    $('#tile_icons').show();
    results_array.push("<hr>");
    results_array.push('<div id="tile_icons">');
    if(page == "P") {
        results_array.push('<a class="footer-button" href="#flight">');
        results_array.push('<span class="icon-airplane2 button-icon"></span>');
        results_array.push('</a>');
    }
    if(page == "P") {
        results_array.push('<a class="footer-button" href="#correspondance">');
        results_array.push('<span class="icon-bubbles button-icon"></span>');
        results_array.push('</a>');
    }
    if(page == "P" || page == "C") {
        if(page == "C")
            results_array.push('<div style="float: left; padding-top: 15px;">Contact CSC </div>');
        results_array.push('<a class="footer-button" id="cscemail" href=\"'+cscemail+'\">');
        results_array.push('<span class="icon-mail button-icon"></span>');
        results_array.push('</a>');
    }
    if(page == "P" || page == "C") {
        results_array.push('<a class="footer-button">');
        results_array.push('<span class="icon-phone button-icon"></span>');
        results_array.push('</a>');
    }
    results_array.push('</div>');
}

function hide_all() {
    // if($("#contentLayer:visible").length>0){
    //     $('#contentLayer').trigger('click');
    // }
    if($("#container").hasClass( "opened" )) {
        var containr = document.querySelector('#container');
        var slidemenu = document.querySelector('#sidemenu');
        var contnt = document.querySelector('#content');
        var contentlayer = document.querySelector('#contentLayer');

        containr.classList.toggle('opened');
        slidemenu.classList.toggle('sidemenu--opened');
        contnt.style.height = "auto";
        contentlayer.classList.toggle('contentlayer-opened');
    }

    $('#btnBack').hide();
    // $('#navbar').hide(); 
    hide_spinner();
    //$('#index_content').hide();
    $('#correspondance_content').hide();
    $('#ajax_error').hide();
    $('#view_title').hide();
    $('#show_plan_details').hide();
    $('#show_training_details').hide();   
    $('#show_flight_details').hide();
    $('#update_profile').hide();
    //$("#alert_content").hide();
    /*$('#tile_icons').hide();*/
    $('#allotment_details').hide();
    $('#openpositions_content').hide();
    $('#doa_content').hide();
    $('#document_details').hide(); 

    $('body').scrollTop(0);

}

/*window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}*/

function logout() {
    $.jStorage.flush();
    hide_all();
    $('.login').show();
    $('#hamburger-btn').hide();
    $('#top_icons').hide(); 
    $('#alert-btn').hide(); 
    $('#alert_count_btn').hide(); 
    $('#index_content').css('display','none');
    $('#alert_content').css('display','none');
}

function setheadername(results_array, name, head_pic_name) { 
    /*if(head_pic_name.indexOf("pic")>-1)
        results_array.push('<div id="plan_details_header"  class="head_common_pic">');//head_common_pic
    else*/
    //results_array.push('<div id="header_bar"></div>');//head_common
    //results_array.push('<div id="plan_details_header"  class="head_common_pic">');//head_common
    //results_array.push('<div class="header_white"></div>');
    results_array.push('<div class="topcoat-navigation-bar on-top header">');
    results_array.push('<div class="topcoat-navigation-bar__item left quarter">');
      // results_array.push('<a id="btnBack" class="topcoat-icon-button--quiet back-button" href="javascript:step_back()">');
      //   results_array.push('<span class="topcoat-icon topcoat-icon--back"></span>');
      // results_array.push('</a>');
    results_array.push('</div>');
    results_array.push('<div class="topcoat-navigation-bar__item center half">');
    results_array.push('<h1 class="topcoat-navigation-bar__title">')
    results_array.push('<img src="img/bsm_logo_glow.png" style="height: 19px; padding-top:13px; padding-right: 5px;">MyBSM');
    results_array.push('</h1></div>');
    // results_array.push('<hr class="style-four" style="margin-top: 10px;">');
    results_array.push('</div>');
    results_array.push('<div class="header_text" class="header"> ' + name + '</div>');
    //results_array.push('<div id="plan_details_header_menu"><span id="hamburger-btn" class="hamburger icon-list"></span></div>')
    //results_array.push('</div>');
}

function index_page_call() {
    $("#alert_content").addClass('leftsmooth');
    $("#index_content").removeClass('rightsmooth');
    $("#index_content").css('z-index', 2);
    $("#alert_content").css('z-index', 1);
}

function getMonthName(month) {
    var mname = "Jan"
    if(month == 2)
        mname = "Feb";
    if(month == 3)
        mname = "Mar";
    if(month == 4)
        mname = "Apr";
    if(month == 5)
        mname = "May";
    if(month == 6)
        mname = "Jun";
    if(month == 7)
        mname = "July";
    if(month == 8)
        mname = "Aug";
    if(month == 9)
        mname = "Sep";
    if(month == 10)
        mname = "Oct";
    if(month == 11)
        mname = "Nov";
    if(month == 12)
        mname = "Dec";
    return mname;
}

function prsflt(e){
  return parseFloat(e).toFixed(2);
}

function nullcheck(data) {
    if(data == null)
        data = '';
    return data;
}
