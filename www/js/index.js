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

var menuBtn;
var containr;
var slidemenu;
var contnt;
var contentlayer;

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
            // alert("Error in document ready:"+err);
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

var pushNoteMsg = {

    findPlatform: function() {

        //alert("platform:"+ device.platform);
        try {
            if ( device.platform == 'android' || device.platform == 'Android' ) {
                androidPush.register();
            } else if( device.platform == 'iOS' ||  device.platform == 'ios') {
                iosPush.register();
            }
        } catch(err) {
            //alert("findPlatform:"+err);
        }
    }
}

var iosPush = {
    register: function() {
        var pushNotification = window.plugins.pushNotification;
        try{
            pushNotification.register(
            iosPush.tokenHandler,
            iosPush.errorHandler,
            {
                "badge":"true",
                "sound":"true",
                "alert":"true",
                "ecb":"iosPush.onNotificationAPN"
            });
        } catch(err) {
            //alert("ios reg err:"+err);
        }
    },

    onNotificationAPN: function(event) {
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
            pushNotification.setApplicationIconBadgeNumber(iosPush.successHandler, iosPush.errorHandler, event.badge);
        }


    },

    tokenHandler: function (result) {
        writeRegId(result, 'iOS');
    },
    successHandler: function (result) {
        //alert('successHandler = ' + result);
    },

    errorHandler: function (error) {
       // alert('errorHandler = ' + error);
    }
}

var androidPush = {
    register: function() {
        var pushNotification = window.plugins.pushNotification;
        try {
            pushNotification.register(
            androidPush.successHandler, 
            androidPush.errorHandler,
            {
                "senderID":"1075090837516",
                "ecb":"androidPush.onNotificationGCM"
            });
        } catch(err) {
            //alert("androidPush reg err:"+err);
        }
    },
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    //console.log("Regid " + e.regid);
                    //alert('registration id = '+e.regid);
                    writeRegId(e.regid, 'Android');
                    // alert("writeRegId");
                }
            break;

            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
               //alert('this one message = '+e.message+' msgcnt = '+e.msgcnt);
               // alert('this one message = '+e.message);
                navigateToNitifyPage(e.message);
                
            break;

            case 'error':
              //alert('GCM error = '+e.msg);
            break;

            default:
              //alert('An unknown GCM event has occurred');
              break;
        }
    },
    successHandler: function (result) {
       // alert('successHandler = ' + result);
    },
    errorHandler: function (error) {
       // alert('errorHandler = ' + error);
    }
}

function navigateToNitifyPage(message) {
    if(message.toUpperCase().indexOf('PLAN') > -1) {
        show_plan_details();
    }
    if(message.toUpperCase().indexOf('TRAINING') > -1) {
        show_training_details();
    }
    if(message.toUpperCase().indexOf('FLIGHT') > -1) {
        show_flight_details();
    }
    if(message.toUpperCase().indexOf('ALLOTMENT') > -1) {
        allotment_details();
    }
}

function writeRegId(push_reg_id, platfrm) {
    //alert(push_reg_id);
    var empid = $.jStorage.get("empid");
    var form_data= {
      'empid': empid,
      'gcm_registry_id': push_reg_id,
      'platform': platfrm,
    };
    req = $.ajax({
        url: prefilurl+"sf_register_push_device.php?email="+$.jStorage.get("username")+"",
        type: "post",
        data: form_data,

        success : function(response) {
            $.jStorage.set("push_registered", true);
        },
        error: function (request, status, error) {
            //alert("writeRegId:"+error);
        }
    });
}

// Handle the back button
//
function onBackKeyDown() {
    // alert('hi');
    step_back();
}

function toTitleCase(str){
    if(str)
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
    $('#bg').css('background', 'black');*/

    // if (hash === "#correspondance1") {
    //     return;
    // }
    if (hash === "#signup") {
        hide_all();
        signup();
        return;
    }

    if (hash === "#forgotpass"){
        hide_all();
        show_forgotpass();
        return;
    }

    if (hash === "#signin_check") {
        // hide_all();
        signin_check();
        return;
    }

    if($.jStorage.get("empid") == null){
        window.location.replace("#");
        hide_all();
        $('.login').show();
        return;
    }

    if (hash === "#plan") {
        show_plan_details();
    } else if (hash === "#training") {
        hide_all();
        show_training_details();
    } else if (hash === "#flight") {
        hide_all();
        show_flight_details();
    } else if (hash === "#allotment") {
        hide_all();
        allotment_details();
    } else if (hash === "#correspondance") {
        hide_all();
        show_correspondance(window.location.hash.split('/')[1]);
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
        alllalerts="";
        alerts();
    } else if (hash === "#changepwd"){
        hide_all();
        show_changepwd();
    }else if (hash === "#logout") {
        hide_all();
        logout();
    } else {
        if($.jStorage.get("empid") != null){
            getempdetails($.jStorage.get("empid"), '');
            show_plan_details();
        }
        // page = show_owners();
    }
    // slider.slidePage($(page));
    
    // $('#bg').css('background-image', 'none');
    // $('#bg').css('background', 'lightblue');
    
    // $('#content').css('background-image', 'none');
    // $('#content').css('background', 'lightblue');
}

var step_back = function() {window.history.back();};

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
        // alert("document ready:"+err);
    }
});

var prefilurl = "https://getVesselTracker.com/seafarer_dev/";
/*$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
    options.url = 'https://getVesselTracker.com/seafarer_dev/'+ options.url ;//+ options.url + "&pal_user_email=" + $.jStorage.get("pal_user_name");
});
*/

$('#login_form').submit(function(){
    // var username = $('#login_emp').val();
    // var password = $('#login_password').val();
    
    // if(username != "" && password != "") 
    //     //login_test(username, password);
    //     getempdetails(username, password);
    //     //$('#login_password').blur();
    //     //$('#login_emp').blur();
    
    // /*else{
    //     $.jStorage.set("empid", username);
    //     login_success();
    // }*/

   
   return false;
});


function signin () {
    var username = $('#login_emp').val();
    var password = $('#login_password').val();
    
    if(username != "" && password != "") 
    {
        $.jStorage.set("username", username);
        //login_test(username, password);
        getempdetails(username, password);
        //$('#login_password').blur();
        //$('#login_emp').blur();
    }
    /*else{
        $.jStorage.set("empid", username);
        login_success();
    }*/

   
  //  return false;
}

function signup_nav() {
    window.location.hash = "#signup";
}

function forgot_pass_nav () {
    window.location.hash = "#forgotpass";
}

function show_forgotpass() {
    $("#ajax_error").hide();
    $(".login").hide();
    $('#btnBack').show();
    $('#signup_content').show(); 
    var results_array = new Array(); 
    setheadername(results_array, '<span class="icon-pencil2"></span>  Forgot Password', "name");
    results_array.push('<div class = "hambrgrdetails">');
    results_array.push('<form onsubmit="return false" >');
    results_array.push('<input type="text" placeholder="Email" id="signup_passport" class="biginput topcoat-text-input">');
    results_array.push('<button class="topcoat-button--cta" onclick="forgotpass_submit()">Submit</button></form>');
    results_array.push('</div>');
    $('#signup_content').html(results_array.join(""));
    // new datepickr('dobdate', {
    //     'dateFormat': 'd-M-Y'
    // });
}

function forgotpass_submit(){
    
}

function signup() {
    $("#ajax_error").hide();
    $(".login").hide();
    $('#btnBack').show();
    $('#signup_content').show(); 
    var results_array = new Array(); 
    setheadername(results_array, '<span class="icon-pencil2"></span>  SignUp', "name");
    results_array.push('<div class = "hambrgrdetails">');
    results_array.push('<form onsubmit="return false" >');
    results_array.push('<label>Passport Number</label><input type="text" placeholder="Passport Number" id="signup_passport" class="biginput topcoat-text-input">');
    results_array.push('<label>SeamenBook Number</label><input type="text" placeholder="SeamenBook Number" id="signup_seamennum" class="biginput topcoat-text-input">');
    // results_array.push('<input type="date" size="15" placeholder="DD-MMM-YYYY" id="dobdate" class="topcoat-text-input">');
    results_array.push("<label>D.O.B</label><input id='dobdate' type='date' class='topcoat-text-input' placeholder='DD-MMM-YYYY'/>");
    results_array.push('<button class="topcoat-button--cta" onclick="signin_check_nav()">Register</button></form>');
    results_array.push('</div>');
    $('#signup_content').html(results_array.join(""));
    // new datepickr('dobdate', {
    //     'dateFormat': 'd-M-Y'
    // });
}   

function signin_check_nav(){
    window.location.hash="#signin_check";
}

function signin_check() {
    var results_array = new Array(); 
    setheadername(results_array, '<span class="icon-pencil2"></span>  Update Contact Details', "name");
    results_array.push('<div class = "hambrgrdetails">');
    var url = prefilurl+"get_emp_details_pers_mf.php?email="+$.jStorage.get("username")+"";
    //console.log(url);
    var pass = $("#signup_passport").val();
    var seamen = $("#signup_seamennum").val();
    var dob = $("#dobdate").val();
    var form_data= {
        'pass': pass,
        'seamen': seamen,
        'dob': dob
    };
    var req = $.ajax({
        url: url,
        type: "post",
        data: form_data,
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) {
            if(data[0] != null) {
                var results_array = new Array(); 
                setheadername(results_array, '<span class="icon-pencil2"></span>  SignUp', "name");
                results_array.push('<div class = "hambrgrdetails">');
                results_array.push("<form onsubmit='return false' >");
                results_array.push('Dear '+nullcheck(toTitleCase(data[0]['sur_name']))+" "+nullcheck(toTitleCase(data[0]['first_name']))+", Please update your email id here");
                results_array.push('<input type="text" placeholder="Email-id" id="signup_email" class="topcoat-text-input">');
                results_array.push("<button onclick='signin_mail(\""+data[0]['id']+"\",\""+data[0]['sur_name']+"\",\""+data[0]['first_name']+"\",\""+data[0]['middle_name']+"\",\""+data[0]['passport_no']+"\")' class='topcoat-button--cta'>Update</button></form>");
                results_array.push('<span id="update_email_error" style="display:none">Email already registered</span>')
                results_array.push('</div>');
            } else {
                $("#ajax_error").show();
                $("#ajax_error").html('Wrong data entered or the user already registered...');
                $("#ajax_error").attr('style','display:block; text-align:center;');
                hide_spinner();
            }
            $('#signup_content').html(results_array.join(""));
            hide_spinner();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            hide_spinner();
        }
    });
}

function login_test(user_name, password) {

    var url = prefilurl+"ldap_test.php?email="+$.jStorage.get("username")+"";

    var form_data = {
        'username': user_name,
        'password': password
    };
    var req = $.ajax({
        url: url,
        type: "post",
        data: form_data,
        beforeSend: function() {
            show_spinner();
        },
        success : function(data) {
            var spitdata = data.split(":");
            if(spitdata[0] == 'success') {
                $.jStorage.set("empid", spitdata[1]);
                login_success();
            }
            hide_spinner();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            hide_spinner();
        }
    });
}

function signin_mail(id, sur_name, first_name, middle_name, passport_no) {
    $("#ajax_error").hide();
    var results_array = new Array(); 
    setheadername(results_array, '<span class="icon-pencil2"></span>  Update Contact Details', "name");
    results_array.push('<div class = "hambrgrdetails">');
    var url = prefilurl+"insert_emp_profile.php?email="+$.jStorage.get("username")+"";
    console.log(url);
    var email = $("#signup_email").val();

    var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
    if (filter.test(email)) {

        var form_data= {
            'id': id,
            'sur_name': sur_name,
            'first_name': first_name,
            'middle_name': middle_name,
            'passport_no': passport_no,
            'email': email
        };
        var req = $.ajax({
            url: url,
            type: "post",
            data: form_data,
            beforeSend: function() {
                show_spinner();
            },

            success : function(data) {
                // console.log(data);
                if (data=='Already exist') {
                    $('#update_email_error').show();
                    hide_spinner();
                    return;
                };
                $('#btnBack').hide();
                results_array.push('</span> User Name and Password send to your mail id..</span></br>'); 
                results_array.push('<button class="topcoat-button--cta" onclick="backtologin()">Back to Login</button>') 
                results_array.push('</div>');
                $('#signup_content').html(results_array.join(""));
                hide_spinner();
                $("#ajax_error").hide();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                results_array.push('</span> Issue in Sign Up Process, Please try again...</span>');  
                results_array.push('</div>');
                $('#signup_content').html(results_array.join(""));
                //alert("error in update");
                hide_spinner();
                $("#ajax_error").hide();
            }
        });
    }else {
        $("#ajax_error").show();
        $("#ajax_error").html('Not a Valid Email Id...');
        $("#ajax_error").attr('style','display:block; text-align:center;');
    }
}

function backtologin () {
    window.location.replace("#");
}

function login_success() {
    $('#index_content').css('display','block');
    $('#alert_content').css('display','block');
    $(".login").hide();
    $('#hamburger-btn').show();
    $('#top_icons').show(); 
    $('#alert-btn').show(); 
    $('#alert_count_btn').show(); 
    $('#index_content').show();
    alllalerts = "";
    alerts();
    window.location.hash="#plan";
    // show_plan_details();
    //getempdetails();
}

function showSidemenu () {
    // alert("test");
    containr.toggleClass('opened');
    slidemenu.toggleClass('sidemenu--opened');
    contentlayer.toggleClass('contentlayer-opened');
    // contnt.style.height = "auto";
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
    $('#update_profile').html(""); 
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
    var url = prefilurl+"insert_emp_profile.php?email="+$.jStorage.get("username")+"";
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

var emp_csc_id;
function show_plan_details() {
    index_page_call();
    hide_all();
    $('#index_content').show();
    $('#show_plan_details').html("");
    $('#show_plan_details').show();

    var csc_contact_det;
    var results_array = new Array(); 
    var url = prefilurl+"get_sf_plan_details.php?email="+$.jStorage.get("username")+"&empid="+$.jStorage.get("empid");
    console.log(url);
    var req = $.ajax({
        url: url,
        datatype: 'text',
        beforeSend: function() {
            show_spinner();
        },

        success : function(result) {
            if(result[0] != null) {
                for (var i = 0; i < result.length; i++) {
                    var data = result[i];
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
                    
                    if( data['csc_email']!=null && data['csc_email']!='' )
                        csc_contact_det = "mailto:"+data['csc_email'];

                    if( data['phone1']!=null && data['phone1']!='' )
                        csc_contact_det = csc_contact_det+"&&"+data['phone1'];
                    
                    if( data['phone2']!=null && data['phone2']!='' )
                        csc_contact_det = csc_contact_det+"&&"+data['phone2'];

                    emp_csc_id = data['csc_id'];

                    $.jStorage.set("csc_contact_det", csc_contact_det);
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
                    results_array.push('</div>');
                    results_array.push('&nbsp;');
                    //data['phone1'];
                    //data['phone2'];
                
                }
            } else {
                setheadername(results_array, '<div><div class="png-briefcase png-header pagename-icon"></div>  Plan Details</div>', "pic");
                results_array.push('<div style="margin-top: 100px;font-size: large;">YOU HAVE NOT BEEN PLANNED FOR A VESSEL YET. <br/> PLEASE CLICK ICON ON RIGHT TOP TO OPEN THE MENU.</div>')
                getCurrCompanyDt(results_array);
            }

            bottm_buttons("P" ,results_array);
            $('#show_plan_details').html(results_array.join(""));
           /* if(cscemail != null) {
                document.getElementById("cscemail").href="mailto:"+cscemail;
            }*/
            hide_spinner();
            if(alllalerts.indexOf("PLAN") > -1){
                update_alert_seen("PLAN");
                alllalerts.replace('PLAN','');
            }

            menuBtn = $('#hamburger-btn');
            containr = $('#container');
            slidemenu = $('#sidemenu');
            contnt = $('#content');
            contentlayer = $('#contentLayer');
            // alert('add event');
            menuBtn.unbind();
            contentlayer.unbind();
            menuBtn.click(showSidemenu);
            contentlayer.click(showSidemenu);
        },
        error: function (request, status, error) {
        results_array.push("<span> No plan to display"+error+"</span><br/>");
        $('#show_plan_details').html(results_array.join(""));
        hide_spinner();
    }
        
    });
    //if($.jStorage.get("push_registered") == false)
    pushNoteMsg.findPlatform();
}

var cc;
function getCurrCompanyDt(results_array) {
    var curr_cmp_array = new Array(); 

    var url = prefilurl+"get_sf_emp_curr_company.php?email="+$.jStorage.get("username")+"&empid="+$.jStorage.get("empid");
    var req = $.ajax({
        url: url,
        datatype: 'text',
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) {cc=data;
             var csc_contact_det;
            if(data != null) {
                
                if( data[0]['csc_email']!=null && data[0]['csc_email']!='' )
                    csc_contact_det = "mailto:"+data[0]['csc_email'];

                if( data[0]['phone1']!=null && data[0]['phone1']!='' )
                    csc_contact_det = csc_contact_det+"&&"+data[0]['phone1'];
                
                if( data[0]['phone2']!=null && data[0]['phone2']!='' )
                    csc_contact_det = csc_contact_det+"&&"+data[0]['phone2'];
                
                emp_csc_id = data[0]['csc_id'];

                $.jStorage.set("csc_contact_det", csc_contact_det);
                
            }
        }
    });
   //bottm_buttons("P" ,results_array);
}

function show_training_details() {
    index_page_call();
    hide_all();
    $('#index_content').show();
    $('#show_training_details').html("");
    $('#show_training_details').show();

    var url = prefilurl+"get_sf_training_details.php?email="+$.jStorage.get("username")+"&empid="+$.jStorage.get("empid");
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
        //training_res_array.push("<ul class='topcoat-list__container' id='listview'>");
        for (var i = 0; i < data.length; i++) {
            if(data[i] != null) {
                if(i>0) {
                    // training_res_array.push("<hr class='style-one'>");
                }
                var course = data[i]['course'];
                var status = data[i]['status'];
                var from_date = dateformat(data[i]['from_date'], "dd-mon-yyyy");
                var to_date = dateformat(data[i]['to_date'], "dd-mon-yyyy");
                var institution = data[i]['institution'];

                var tr_content = course+", "+status+", "+from_date+", "+to_date+", "+institution;

                //training_res_array.push("<li class='topcoat-list__item'>");                
                training_res_array.push("<span><b>Course :</b> "+course+"</span>");
                training_res_array.push("<br/><span><b>Status :</b> "+status+"</span>");
                training_res_array.push("<br/><span><b>From :</b> "+from_date+"</span>");
                training_res_array.push("<br/><span><b>To :</b> "+to_date+"</span>");
                training_res_array.push("<br/><span><b>Venue :</b> "+institution+"</span>");
                training_res_array.push("<br/><a class='footer-button' onclick=\"correspondance('"+tr_content+"','TRAINING')\"  style='margin: 3px;'><div class='png-bubbles button-icon'></div></a>");
               // training_res_array.push("</li>");
            } else {
                training_res_array.push("<span> No training details updated </span><br/>");
                hide_spinner();
            }
        }
        training_res_array.push(training_res_array);
        hide_spinner();
        //training_res_array.push("</ul>");
        training_res_array.push('</div>');
        //$('#foot_training').html(training_res_array.join(""));
        $('#show_training_details').html(training_res_array.join(""));
        if(alllalerts.indexOf("TRAINING") > -1){
            update_alert_seen("TRAINING");
            alllalerts.replace('TRAINING','');
        }
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
    hide_all();
    $('#index_content').show();
    $('#openpositions_content').html("");
    $('#openpositions_content').show();

    var url = prefilurl+"get_sf_open_positions.php?email="+$.jStorage.get("username")+"&empid="+$.jStorage.get("empid");

    var opening_res_array = new Array(); 
    setheadername(opening_res_array, '<div><div class="png-megaphone2 png-header pagename-icon"></div>  Open Positions</div>', "pic");
    // setheadername(opening_res_array, '<span class="icon-megaphone2 pagename-icon"></span>  Open Positions', "pic");
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
                var v_name = data[i]['vessel_name'];
                var v_date = dateformat(data[i]['from_date'], "dd-mon-yyyy");
                var v_rank = data[i]['rank_name'];
                var v_sdc = data[i]['sdc'];
                var corr_content = v_name+", "+v_date+", "+v_rank+", "+v_sdc

                opening_res_array.push("<div class='footer' id="+data[i]['vessel_name'].replace(/ +/g, "")+">");
                opening_res_array.push("<div class='openpositionbox'>");
                opening_res_array.push("<div class='openpositionchild1'>");
                opening_res_array.push("<img src="+vessel_type_pic(vessel_type)+" style='width:7rem; height:5.9rem;'>");
                opening_res_array.push("</div>");
                opening_res_array.push("<div id='op_content'>");
                opening_res_array.push("<span id='v_name'>"+v_name+" ("+data[i]['flag_name']+")</span>");
                if(data[i]['vessel_type']!=null)
                    opening_res_array.push("<br/><span id='v_type'>"+vessel_type+"</span>");
                if(data[i]['from_date']!=null)
                    opening_res_array.push("<br/> <span id='v_date'>"+v_date+"</span>");
                if(data[i]['rank_name']!=null)
                    opening_res_array.push("<br/><span id='v_rank'>"+v_rank+"</span>");
                if(data[i]['sdc']!=null)
                    opening_res_array.push("<br/><span id='v_sdc'>"+v_sdc+"</span><br/>");
                opening_res_array.push("</div>");
                opening_res_array.push("<div style='text-align:center'><a class='footer-button' onclick=\"giveDoa('"+corr_content+"')\" style='margin: 1px;'><div class='png-calendar4 button-icon'></div></a>");
                opening_res_array.push("<a class='footer-button' onclick=\"correspondance('"+corr_content+"','OPEN_POSITION')\"  style='margin: 1px;'><div class='png-bubbles button-icon'></div></a></div>");
                opening_res_array.push("</div>");
                opening_res_array.push("</div>");
                // opening_res_array.push("</li>"); 
                if(data.length-1 == i) {
                    if(alllalerts.indexOf("OPEN_POSITION") > -1) {
                        update_alert_seen("OPEN_POSITION");
                        alllalerts.replace('OPEN_POSITION','');
                    }             
                }
            }
        } else {
            opening_res_array.push("<span> No Open positions available </span><br/>");
            //opening_res_array.push("<button onclick='giveDoa()' ><img src='img/arrow-back.png'></button>");
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

function giveDoa(paramid) {
    paramid;
    //index_page_call();
    hide_all();
    $('#index_content').show(); 
    $('#doa_content').show(); 
    doaAdd("adddoa", "OPEN_POSITION", paramid);
}

function show_flight_details() {
    index_page_call();
    hide_all();
    $("#index_content").show();
    $('#show_flight_details').html(""); 
    $('#show_flight_details').show(); 
    var url = prefilurl+"get_sf_flight_details.php?email="+$.jStorage.get("username")+"&empid="+$.jStorage.get("empid");
    var results_array = new Array(); 

    setheadername(results_array, '<div><div class="png-airplane2 png-header pagename-icon"></div>  Flight Details</div>', "pic");
    // setheadername(results_array, '<span class="icon-airplane2  pagename-icon"></span>  Flight Details', "pic");
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
                    var departure = data[i]['departure'];
                    var arrival = data[i]['arrival'];
                    var flight_content = departure+", "+arrival;
                    results_array.push("<span> Departure : "+departure+"</span><br/>");
                    results_array.push("<span> Departure Date :  "+dateformat(data[i]['departure_date'], "dd-mon-yyyy")+"</span><br/>");
                    results_array.push("<span> Arrival : "+arrival+"</span><br/>");
                    results_array.push("<span> Arrival Date : "+dateformat(data[i]['arrival_date'], "dd-mon-yyyy")+"</span><br/>");
                    results_array.push("<span> Travel Route : "+nullcheck(data[i]['travel_route'])+"</span><br/>");
                    results_array.push("<span> Remarks : "+nullcheck(data[i]['remarks'])+"</span><br/>");

                    results_array.push("<a class='footer-button' onclick=\"correspondance('"+flight_content+"','FLIGHT')\"  style='margin: 3px;'><div class='png-bubbles button-icon'></div></a>");
                    hide_spinner();
                }                
     
        } else {
                results_array.push("<span> No details updated. </span><br/>");
                hide_spinner();
            }
            results_array.push('</div>');
            $('#show_flight_details').html(results_array.join(""));

            if(alllalerts.indexOf("FLIGHT") > -1){
                update_alert_seen("FLIGHT");
                alllalerts.replace('FLIGHT','');
            }
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
    $('#allotment_details').html("");
    $('#allotment_details').show();

    var url = prefilurl+"get_sf_allotment_details.php?email="+$.jStorage.get("username")+"&empid="+$.jStorage.get("empid");
    var results_array = new Array(); 
    
    setheadername(results_array, '<div><div class="png-banknote png-header pagename-icon"></div>  My Accounts</div>', "pic");
    // setheadername(results_array, '<span class="icon-banknote pagename-icon"></span>  My Accounts', "pic");
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
            var period_month;
            var period_date;
            results_array.push('<div class = "footer" style="margin-top: 0px;">');
            if(data[0] != null) {
                var pro_date = new Date(data[0]['processed_on']);
                results_array.push("<span> Amount is Processed on <b>"+pro_date.getDate() +", "+getMonthName(pro_date.getMonth()) +", "+pro_date.getFullYear() +"</b></span><br/>");
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
                //period value will be string ie.. "201408"
                //converting string value to number and then to Date .
                period_date=Number(period);
                period_month=Convert_toDate(period_date);
                results_array.push('<b>'+prsflt(balamnt)+'</b>. for the month <b>'+getMonthName(period_month.getMonth()) +', '+period_month.getFullYear()+'</b>');

                if(alllalerts.indexOf("ALLOTMENT") > -1){
                    update_alert_seen("ALLOTMENT");
                    alllalerts.replace('ALLOTMENT','');
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
    var url = prefilurl+"get_sf_allotted_details.php?email="+$.jStorage.get("username")+"&empid="+empid+"&period="+period;
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
                results_array.push("<br>You have not set any allotments.")
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

var corr_content;
function correspondance(content, page){
    corr_content = content;
    window.location.hash="#correspondance/"+page;
}

function show_correspondance (page) {
    // alert(page);

    index_page_call();
    hide_all();
    $("#index_content").show();
    $('#correspondance_content').html(""); 
    $('#correspondance_content').show(); 
    var content = corr_content;
    var results_array = new Array(); 

    setheadername(results_array, '<div><div class="png-bubbles png-header pagename-icon"></div>Correspondence</div>', "name");
    results_array.push('<div class = "hambrgrdetails">');

    results_array.push('<form onsubmit="return false" >');
    if(content != null && content != "")
        results_array.push("<textarea class='topcoat-text-input--large' id='message' style='width: 100%; height: 250px;line-height: 1.5rem;'>Reg:"+content+":-</textarea></br>");
    else
        results_array.push('<textarea class="topcoat-text-input--large" id="message" style="width: 100%; height: 250px;line-height: 1.5rem;"></textarea></br>');
    results_array.push('<span id="error_corrspondance" style="color:red"></span><br>');
    results_array.push('<div>');
    results_array.push('<button class="topcoat-button" onclick="correspondancesend()" ">Send</button>');
    results_array.push("<button class='topcoat-button' onclick=\"correspondanceback('"+page+"')\" >Back</button></form>");
    results_array.push('</div>');
    results_array.push('<div id="corrdet"></div>')
    //bottm_buttons("C" ,results_array);
    results_array.push('</div>');
    $('#correspondance_content').html(results_array.join(""));

    getcorrespondance();
}

function correspondanceback(page) {
    // window.location.hash="";
    // alert(page);

    hide_all();
    $("#index_content").show();
    if(page == "OPEN_POSITION") {
        // $('#openpositions_content').show(); 
         window.location.hash="#openpositions";
    } else if(page == "FLIGHT") {
        // $('#show_flight_details').show(); 
        window.location.hash="#flight";
    } else if(page == "TRAINING") {
        // $('#show_training_details').show(); 
         window.location.hash="#training";
    } else {
        // $('#show_plan_details').show(); 
         window.location.hash="#plan";
    }
}

function getcorrespondance() {
    var empid = $.jStorage.get("empid");
    var results_array = new Array(); 
    var url = prefilurl+"get_sf_correspondance.php?email="+$.jStorage.get("username")+"&empid="+empid;
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
                    if(data[i]['user_type'] == 'MOBUSER')
                        results_array.push("<p class='triangle-right left' style='word-wrap:break-word;'>");
                    else 
                        results_array.push("<p class='triangle-right right' style='word-wrap:break-word;'>");
                    results_array.push(data[i]['message']);
                    if(data[i]['is_read'] == 'Y')
                        results_array.push("<img src = 'img/check-mark-md.png' style='float: right;'>");
                    results_array.push("</p>");

                }
            }
            hide_spinner();
            $('#corrdet').html(results_array.join(""));
        },
    });
}

function correspondancesend() {
    var message = $("#message").val().trim();
    if(message == null || message == '') {
        $('#error_corrspondance').html("Please enter text and continue..");
    } else {
        var results_array = new Array(); 
        setheadername(results_array, '<div class="png-bubbles  pagename-icon"></div>  Correspondence', "name");
        results_array.push('<div class = "hambrgrdetails">');
        results_array.push('<img src = "img/email-send.png">');
        var url = prefilurl+"sf_insert_correspondance.php?email="+$.jStorage.get("username")+"";
        //console.log(url);
        var emp_id = $.jStorage.get("empid");
        var form_data= {
            'empid': emp_id,
            'managerid': emp_csc_id,
            'message': message,
            'subject':'sub'
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
                    results_array.push('</span> Correspondence send...</span>');
                    results_array.push("</div>");
                    $('#correspondance_content').html(results_array.join(""));
                    
                } else {
                    hide_spinner();
                    results_array.push("Issue in sending Correspondence, please try again");
                    results_array.push("</div>");
                    $('#correspondance_content').html(results_array.join(""));
                }
            },
            error: function (request, status, error) {
                results_array.push("Issue in sending Correspondence, please try again:"+error);
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
    $('#doa_content').html(""); 
    $('#doa_content').show(); 

    var url = prefilurl+"get_sf_doa_details.php?email="+$.jStorage.get("username")+"&empid="+$.jStorage.get("empid");
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
            var from_tab = 'DOA';
            // results_array.push('<div class="dashboard_tiles">');

            setheadername(results_array, '<div><div class="png-calendar4 png-header pagename-icon"></div>  DoA Details</div>', "name");
            // setheadername(results_array, '<span class="icon-calendar4 pagename-icon"></span>  DoA Details', "name");
            results_array.push('<div class = "footer">');
            results_array.push("<div style='margin-top:30px;'>");
            var yesDOA = true;
            if(data[0] != null) {
                for (var i = 0; i < data.length; i++) {
                    results_array.push("<span id='showdoa'><b>DoA :</b> "+dateformat(data[i]['doa'], "dd-mon-yyyy")+"</span><br/>");
                    if(data[i]['remarks'] != null)
                        results_array.push("<span><b>Remark :</b> "+data[i]['remarks']+"</span><br/>");
                }
            
            } else {
                results_array.push('<span>No DoA Available, please Give DoA</span><br>');
                yesDOA = false;
            }
            results_array.push("</div>");
            hide_spinner();
            results_array.push("<div style='margin-top:40px;margin-bottom:15px;'>");
            results_array.push("<button class='topcoat-button' onclick=doaAdd(\"'"+add+"'\",'DOA','') '>Give DoA</button>");
            if (yesDOA) {
                results_array.push("<button class='topcoat-button' onclick=doaAdd(\"'"+cancel+"'\",'DOA','') >Cancel DoA</button>");
            }
            results_array.push("</div>");
            results_array.push('</div>');
            $('#doa_content').html(results_array.join(""));
        },
        error: function (request, status, error) {
            results_array.push("<span> No DOA Given </span><br/>");
            results_array.push("<button onclick=doaAdd(\"'"+add+"'\",'DOA','')  style='color:#00303f;font:bold 12px verdana; padding:5px;'>Give DOA</button>");
            results_array.push("<button onclick=doaAdd(\"'"+cancel+"'\",'DOA','') style='color:#00303f;font:bold 12px verdana; padding:5px;'>Cancel DoA</button>");
            $('#doa_content').html(results_array.join(""));
            hide_spinner();
        }
    });
}

function show_changepwd(){
    index_page_call();
    hide_all();
    $('#index_content').show();
    $('#change_password').html("");
    $('#change_password').show();

    var change_pwd_array = new Array(); 

    setheadername(change_pwd_array, '   Change Password', "pic");
    change_pwd_array.push("<div class='training_image'></div>");
    change_pwd_array.push("<input class='topcoat-text-input' type='password' placeholder='Current Password' id='curPwd'>");
    change_pwd_array.push("<input class='topcoat-text-input' type='password' placeholder='New Password' id='newPwd'>");
    change_pwd_array.push("<input class='topcoat-text-input' type='password' placeholder='Confirm Password' id='cnfPwd'>");
    change_pwd_array.push("<button class='topcoat-button--cta' onclick='changepwd()'>Change Password</button> ");

    $('#change_password').html(change_pwd_array.join(""));
    
}

function changepwd () {

    if ($('#curPwd').val().trim() == '') {
        alert("Please enter your current password");
        $('#curPwd').focus();
        return;
    };
    if ($('#newPwd').val().trim() == '') {
        alert("Please enter your new password");
        $('#newPwd').focus();
        return;
    };
    if ($('#cnfPwd').val().trim() != $('#newPwd').val().trim() ) {
        alert("Password mismatch");
        $('#cnfPwd').focus();
        return;
    };

    var url = prefilurl+"change_password.php?email="+$.jStorage.get("username");

    var form_data= {
        'oldPwd': $('#curPwd').val().trim(),
        'newPwd': $('#newPwd').val().trim(),
        'empId': $.jStorage.get("empid"),
        'email':$.jStorage.get("username")
    };
    //+"&empid="+$.jStorage.get("empid")
    $.ajax({
        url: url,
        type: "post",
        data: form_data,
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) {
            hide_spinner();
            if(data == 'sucess') {
                alert("Password has been updated");
            } else {
                alert("Please verify your password");
            }
        },
        error: function (request, status, error) {
            hide_spinner();
        }
    });
}

function doaAdd(status, page, content) {
    if(status.indexOf('adddoa')>-1) {
        var doa_array = new Array(); 
        $('#adddoa').show();
        //doa_array.push('<button onclick="doadetails()" class="back-btn"><img src="img/arrow-back.png"></button>');
        doa_array.push("<div class='adddoa'>");
        setheadername(doa_array, "<div class='png-calendar4 pagename-icon'></div>  DoA Details", "name");
        doa_array.push("<div class = 'hambrgrdetails'>");
        doa_array.push("<form onsubmit='return false'>");
        /*doa_array.push("<span>Date:</span><br><input class='topcoat-text-input' type='date' value="+new Date()+" id='doadate'>");*/
        doa_array.push("<span>Date:</span><br><input size='15' type='date' class='topcoat-text-input' id='doadate'>");
        if(content != null && content != "")
            doa_array.push("<br><span>Remark:</span><br><textarea class='topcoat-text-input--large' id='coaremark' style='width: 100%;height: 250px;line-height: 1.5rem;'>Reg:"+content+":-</textarea></br>");
        else
            doa_array.push("<br><span>Remark:</span><br><textarea class='topcoat-text-input--large' id='coaremark' style='width: 100%;height: 250px;line-height: 1.5rem;'></textarea></br>");
        doa_array.push("<span id='error_doa' style='color:red'></span><br>");
        doa_array.push("<button class='topcoat-button' onclick=\"savedoa('"+page+"')\" >Save DoA</button>");
        doa_array.push("<button class='topcoat-button' onclick=\"backdoa('"+page+"')\" >Back</button>");
        doa_array.push('</form>');
        doa_array.push('</div>');
        doa_array.push('</div>');
        $('#doa_content').html(doa_array.join(""));
        // new datepickr('doadate', {
        //     'dateFormat': 'd-M-Y'
        // });
    } else {
        canceldoa(page);
    }
}

function savedoa(page) {
    var results_array = new Array(); 
    var url = prefilurl+"sf_save_doa.php?email="+$.jStorage.get("username")+"";
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
                    if(page == "DOA")
                        doadetails();
                    else if(page == "OPEN_POSITION") {
                        hide_all();
                        $('#index_content').show(); 
                        $('#openpositions_content').show(); 
                    }
                } else {
                    // alert("Issue in adding doa, please try again");
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
    var url = prefilurl+"sf_save_doa.php?email="+$.jStorage.get("username")+"";
    var remark = $("#coaremark").val();
    var doadate = $("#doadate").val();
    var emp_id = $.jStorage.get("empid");

    if($("#showdoa").val() != null) {
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
                    // alert("Issue in adding doa, please try again");
                }
                
                hide_spinner();
            },
            error: function (request, status, error) {
                // alert("error:"+error);
                // alert("status:"+status);
                // alert("request:"+request);
            }
        });
    }
}

function backdoa(page) {
    if(page == "DOA")
        doadetails();
    else if(page == "OPEN_POSITION"){
        hide_all();
        $('#index_content').show(); 
        $('#openpositions_content').show(); 
    }
}

function documentdetails(){
    index_page_call();
    hide_all();
    $("#index_content").show();
    $('#document_details').html(""); 
    $('#document_details').show(); 

    var url = prefilurl+"get_sf_expiry_docs.php?email="+$.jStorage.get("username")+"&empid="+$.jStorage.get("empid");
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
            var expired_array = new Array();

            // var tep_docname = "new";
            if(data[0] != null) {
                var expired_docs = new Array();
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
                        expired_docs.push(data[i]);
                        continue;
                    }
                    /*if(tep_docname != data[i]['name']) {
                        tep_docname = data[i]['name'];*/
                    results_array.push("<li class='topcoat-list__item'>");

                    if((Date.parse(data[i]['expiry_date'])) < Date.parse(new Date())) {
                        results_array.push("<span style='color:red'>"+toTitleCase(data[i]['name']));
                    } else if((((Date.parse(data[i]['expiry_date']))-20) < Date.parse(new Date())) && (Date.parse(new Date()<(Date.parse(data[i]['expiry_date']))))) {
                        results_array.push("<span style='color:green'>"+toTitleCase(data[i]['name']));
                    } else {
                        results_array.push("<span>"+toTitleCase(data[i]['name']));
                    }

                    if(data[i]['document_no']!=null && data[i]['document_no']!='' ) 
                        results_array.push("("+data[i]['document_no']+")");

                    if(data[i]['expiry_date']!=null && data[i]['expiry_date']!='' ) 
                        results_array.push(" - "+dateformat(data[i]['expiry_date'], "dd-mon-yyyy"));
                    results_array.push("</span><br/>");
                    results_array.push("</li>");
                    results_array.push("</li>");

                }
                results_array.push('</div>'); 

                for (var i = 0; i < expired_docs.length; i++) {
                    if ( i==0 ) {
                        expired_array.push('<div class = "footer">');
                        doc_type = " Expired ("+ expired_docs.length +")";
                        expired_array.push("<b><div class='header_text' style='color:red' onclick='visible_expired_docs()'>"+toTitleCase(doc_type.slice(1))+"</div></b><br>");                                                
                        expired_array.push("<ul class='topcoat-list__container'>");
                        expired_array.push('<div id="exp_docs">'); 
                    }

                    expired_array.push("<li class='topcoat-list__item'>");
                    expired_array.push("<span style='color:red'>"+toTitleCase(expired_docs[i]['name']));
                    if(expired_docs[i]['document_no']!=null && expired_docs[i]['document_no']!='' ) 
                            expired_array.push("("+expired_docs[i]['document_no']+")");
                    if(expired_docs[i]['expiry_date']!=null && expired_docs[i]['expiry_date']!='' ) 
                            expired_array.push(" - "+dateformat(expired_docs[i]['expiry_date'], "dd-mon-yyyy"));
                    expired_array.push("</span><br/>");
                    expired_array.push("</li>");

                    if ( i == expired_docs.length-1) {
                        expired_array.push('</div>'); 
                        expired_array.push('</div>'); 
                        expired_array.push("</ul>");
                        // expired_array.push('</div>'); 
                    }
                }
            } else {
                results_array.push('<span>No Expiry Documents Details Available</span><br>');
            }
            hide_spinner();

            
            var results_array_new = new Array();
            results_array_new.push('<div class = "hambrgrdetails">'); 
            setheadername(results_array_new, '<div><div class="png-file png-header pagename-icon"></div>  My Documents</div>');            
            results_array_new.push(expired_array.join(""))
            results_array_new.push(results_array.join(""));
            results_array_new.push('</div>');

            $('#document_details').html(results_array_new.join(""));
            $("#exp_docs").hide();        
        },
        error: function (request, status, error) {
            results_array.push("<span>No Expiry Documents Details Available</span><br/>");
            $('#document_details').html(results_array.join(""));
            hide_spinner();
        }
    });
}

function visible_expired_docs() {
    if ($("#exp_docs").is(':hidden')==true) {
        $("#exp_docs").show();
    }
    else{
        $("#exp_docs").hide();        
    }
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

function getempdetails(username, password) {
    var emp_det_array = new Array(); 
    var url = prefilurl+"get_sf_emp_details.php?email="+$.jStorage.get("username")+"&email_id="+username+"";
    // console.log(url);
    var pass = $("#signup_passport").val();
    var seamen = $("#signup_seamennum").val();
    var dob = $("#dobdate").val();
    var form_data= {
        'username': username,
        'password': password
    };
    var req = $.ajax({
        url: url,
        type: "post",
        data: form_data,
        beforeSend: function() {
            show_spinner();
        },

        success : function(data) {
            if(data[0] != null) {
                $.jStorage.set("empid", data[0]['id']);
                // alert(username);

                emp_det_array.push(nullcheck(toTitleCase(data[0]['sur_name']))+" "+nullcheck(toTitleCase(data[0]['first_name'])));//+nullcheck(toTitleCase(data[0]['last_name']))+" "
                // emp_det_array.push("<br>"+toTitleCase(data[0]['nationality']));
                emp_det_array.push("<br>"+toTitleCase(data[0]['rank_grp_name']));

                login_success();
                $('#login_password').blur();
                $('#login_emp').blur();
            } else {
               login_failure();
            }
            hide_spinner();
            $('#empprof').html(emp_det_array.join(""));
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            hide_spinner();
        }
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

var alllalerts="";

function alerts() {
    var url = prefilurl+"get_sf_alerts.php?email="+$.jStorage.get("username")+"&empid="+$.jStorage.get("empid");
    var alerts_array = new Array(); 

    setheadername(alerts_array, '<div><div class="png-bell2-black png-header pagename-icon"></div>  Alerts</div>');
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
                        
                        alllalerts = alllalerts+" "+data[i]['alert_name'];
                        if(data[i]['alert_name'] == "FLIGHT") {
                            // $('#h_flight').html('<img src="img/tick.png">');
                            alerts_array.push('<li class="topcoat-list__item">');
                            alerts_array.push('<div class="png-airplane2 png-alerts pagename-icon"></div>  ');
                            alerts_array.push("<a class='btns' href='#flight'>");
                        }
                        if(data[i]['alert_name'] == "TRAINING") {
                            // $('#h_training').html('<img src="img/tick.png">');
                            alerts_array.push('<li class="topcoat-list__item">');
                            alerts_array.push('<div class="png-users png-alerts pagename-icon"></div>  ');
                            alerts_array.push("<a class='btns' href='#training'>");
                            // alert("hi");
                        }
                        if(data[i]['alert_name'] == "ALLOTMENT") {
                            // $('#h_allotment').html('<img src="img/tick.png">');
                            alerts_array.push('<li class="topcoat-list__item">');
                            alerts_array.push('<div class="png-banknote png-alerts pagename-icon"></div>  ');
                            alerts_array.push("<a class='btns' href='#allotment'>");
                        }
                        if(data[i]['alert_name'] == "PLAN") {
                            // $('#h_plan').html('<img src="img/tick.png">');
                            alerts_array.push('<li class="topcoat-list__item">');
                            alerts_array.push('<div class="png-briefcase png-alerts pagename-icon"></div>  ');
                            alerts_array.push("<a class='btns' href='#plan'>");
                        }
                        if(data[i]['alert_name'] == "OPEN_POSITION") {
                            // $('#h_plan').html('<img src="img/tick.png">');

                            // To Check Open Position Status  
                           // if(data[i]['status'] == 0 ){
                                alertcount--;
                                if(alertcount == ''){
                                    alerts_array.push('<li class="topcoat-list__item">');
                                    alerts_array.push("<a>");
                                    alerts_array.push("No Alert");    
                                }
                           /* }else{
                                alerts_array.push('<li class="topcoat-list__item">');                                
                                alerts_array.push('<div class="png-megaphone2 png-alerts pagename-icon"></div>  ');
                                alerts_array.push("<a class='btns' href='#openpositions'>");
                                alerts_array.push(data[i].status+" "+toTitleCase(data[i]['message']));
                            }*/
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
            } else {
                alerts_array.push('<li class="topcoat-list__item">');
                                    alerts_array.push("<a>");
                                    alerts_array.push("No Alert");   
                alerts_array.push('</ul></div>');
                $('#alert_count').html("0");
                $('#alert_content').html(alerts_array.join(""));
            }
        },
        error: function (request, status, error) {
            hide_spinner();
        }
    });
}

function update_alert_seen(page) {
    var url = prefilurl+"sf_update_slert_seen.php?email="+$.jStorage.get("username")+"&empid="+$.jStorage.get("empid")+"&pagename="+page;
    console.log(url);
    var emp_det_array = new Array(); 
    var req = $.ajax({
        url: url,
        datatype: 'text',
        beforeSend: function() {
        },

        success : function(data) {
        }
        
    });
}

function bottm_buttons(page, results_array) {

    // <span class="icon-boat"></span>
    var csc_contact_email_id;
    var csc_contact_Phone1;
    if( $.jStorage.get("csc_contact_det")!=null && $.jStorage.get("csc_contact_det")!='' ) {
        csc_contact_email_id = $.jStorage.get("csc_contact_det").split('&&')[0];
        csc_contact_Phone1 = "tel:"+$.jStorage.get("csc_contact_det").split('&&')[1];
    }

    $('#tile_icons').show();
    results_array.push("<hr>");
    results_array.push('<div style="text-align:center" id="tile_icons">');
    if(page == "P") {
        results_array.push('<a class="footer-button" href="#flight">');
        results_array.push('<div class="png-airplane2 button-icon"></div>');
        results_array.push('</a>');
    }
    if(page == "P") {
        results_array.push("<a class='footer-button' onClick=\"correspondance(\'\',\'plan\')\">");
        results_array.push('<div class="png-bubbles button-icon"></div>');
        results_array.push('</a>');
    }
    if(page == "P" || page == "C") {
        if(page == "C")
            results_array.push('<div style="float: left; padding-top: 15px;">Contact CSC </div>');
        if( csc_contact_Phone1!=null && csc_contact_Phone1!='' )
            results_array.push('<a class="footer-button" id="cscemail" href=\"'+csc_contact_email_id+'\">');
        else 
            results_array.push('<a class="footer-button" id="cscemail">');
        
        results_array.push('<div class="png-mail button-icon"></div>');
        results_array.push('</a>');
    }
    if(page == "P" || page == "C") {

        if( csc_contact_Phone1!=null && csc_contact_Phone1!='' )
            results_array.push('<a class="footer-button"  href=\"'+csc_contact_Phone1+'\">');
        else 
            results_array.push('<a class="footer-button">');
        results_array.push('<div class="png-phone button-icon"></div>');
        results_array.push('</a>');
    }
    results_array.push('</div>');
}

function hide_all() {
    // if($("#contentLayer:visible").length>0){
    //     $('#contentLayer').trigger('click');
    // }
    if($("#container").hasClass( "opened" )) {
        var containr = $('#container');
        var slidemenu = $('#sidemenu');
        var contnt = $('#content');
        var contentlayer = $('#contentLayer');

        containr.toggleClass('opened');
        slidemenu.toggleClass('sidemenu--opened');
        // contnt.style.height = "auto";
        contentlayer.toggleClass('contentlayer-opened');
    }

    $('#btnBack').hide();
    // $('#navbar').hide(); 
    hide_spinner();
    //$('#index_content').hide();
    $('#signup_content').hide();
    $('#correspondance_content').hide();
    $('#ajax_error').hide();
    $('#view_title').hide();
    $('#show_plan_details').hide();
    $('#show_training_details').hide();   
    $('#show_flight_details').hide();
    $('#change_password').hide();
    $('#update_profile').hide();
    //$("#alert_content").hide();
    /*$('#tile_icons').hide();*/
    $('#allotment_details').hide();
    $('#openpositions_content').hide();
    $('#doa_content').hide();
    $('#document_details').hide(); 

    $('body').scrollTop(0);
}

// window.onerror = function(msg, url, linenumber) {
//     alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
//     return true;
// }

function logout() {
    $.jStorage.flush();
    window.location.reload(true);
    hide_all();
    // window.location.replace("#");
    $('.login').show();
    $('#hamburger-btn').hide();
    $('#top_icons').hide(); 
    $('#alert-btn').hide(); 
    $('#alert_count_btn').hide(); 
    $('#index_content').css('display','none');
    $('#alert_content').css('display','none');
}

function setheadername(results_array, name, head_pic_name) { 
    //$('#sef_hed_txt').html(name);
    /*if(head_pic_name.indexOf("pic")>-1)
        results_array.push('<div id="plan_details_header"  class="head_common_pic">');//head_common_pic
    else*/
    //results_array.push('<div id="header_bar"></div>');//head_common
    //results_array.push('<div id="plan_details_header"  class="head_common_pic">');//head_common
    //results_array.push('<div class="header_white"></div>');
    /*results_array.push('<div class="topcoat-navigation-bar on-top header">');
    results_array.push('<div class="topcoat-navigation-bar__item left quarter">');*/
      // results_array.push('<a id="btnBack" class="topcoat-icon-button--quiet back-button" href="javascript:step_back()">');
      //   results_array.push('<span class="topcoat-icon topcoat-icon--back"></span>');
      // results_array.push('</a>');
   /* results_array.push('</div>');
    results_array.push('<div class="topcoat-navigation-bar__item center half">');
    results_array.push('<h1 class="topcoat-navigation-bar__title">')
    results_array.push('<img src="img/bsm_logo_glow.png" style="height: 19px; padding-top:13px; padding-right: 5px;">MyBSM');
    results_array.push('</h1></div>');*/
    // results_array.push('<hr class="style-four" style="margin-top: 10px;">');
    /*results_array.push('</div>');*/
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
    if(month == 1)
        mname = "Feb";
    if(month == 2)
        mname = "Mar";
    if(month == 3)
        mname = "Apr";
    if(month == 4)
        mname = "May";
    if(month == 5)
        mname = "Jun";
    if(month == 6)
        mname = "July";
    if(month == 7)
        mname = "Aug";
    if(month == 8)
        mname = "Sep";
    if(month == 9)
        mname = "Oct";
    if(month == 10)
        mname = "Nov";
    if(month == 11)
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

function Convert_toDate(value)
{
    var result=value-1;
    var text=result.toString();
    var pro_period=text.substring( 0, 4)+'/'+text.substring( 4, 6);
    var period_month = pro_period.split("/");
    var pro_for= new Date(period_month[0],period_month[1]);
    return pro_for;
}