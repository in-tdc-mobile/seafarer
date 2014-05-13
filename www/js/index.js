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
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var prefilurl = "http://getVesselTracker.com/seafarer_dev/";

function show_plan_details() {alert("show_plan_details");
    var cscemail=null;
    var results_array = new Array(); 
    var url = prefilurl+"get_sf_plan_details.php?empid=610788";//+$.jStorage.get("empid");
    console.log(url);
    var req = $.ajax({
        url: url,
        datatype: 'text',
        beforeSend: function() {
        },

        success : function(data) { alert("1");
            $('#show_plan_details').show();
            
            if(data != null) {
                var flickerplace="";
                var port="";
                var vessel_type = data['vessel_type'];
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

              
                results_array.push('<div class="footer">');
                // results_array.push("<span> Vessel : "+data['vessel_name']+"</span><br/>");
                // results_array.push("<span> Flag : "++"</span><br/>");
                results_array.push('<div style="margin-left:5px">')
                results_array.push("<span> Vessel Type : "+data['vessel_type']+"</span><br/>");
                results_array.push("<span> Manager : "+data['emp_sdc_name']+"</span><br/>");
                results_array.push("<span> Exp. Join Date : "+new String(data['from_date']).split("T")[0]+"</span><br/>");
                results_array.push("<span> Exp. Join Port : "+port+"</span><br/>");
                results_array.push('</div>')                
                results_array.push('</div>');
                //data['phone1'];
                //data['phone2'];
                

            } else {
                results_array.push('<div style="margin-top: 100px;font-size: large;">No Plan Available for You.. Please Swipe screen for more details</div>')
            }
            $('#show_plan_details').html(results_array.join(""));
          

           /* menuBtn = document.querySelector('#hamburger-btn');
            container = document.querySelector('#container');
            slidemenu = document.querySelector('#sidemenu');
            content = document.querySelector('#content');
            contentlayer = document.querySelector('#contentLayer');
            menuBtn.addEventListener('click', showSidemenu, false);
            contentlayer.addEventListener('click', showSidemenu, false);*/
        },
        error: function (request, status, error) {
            alert("error:"+error);
            alert("status:"+status);
            alert("request:"+request);
        results_array.push("<span> No plan to display"+error+"</span><br/>");
        $('#show_training_details').html(results_array.join(""));
        hide_spinner();
    }
        
    });

}