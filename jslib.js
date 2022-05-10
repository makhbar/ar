g$server = "https://waseemssaeed.pythonanywhere.com/toures"


function _$(elID){
    return document.getElementById(elID)
}
function _v$(elID){
    console.log(elID)
    return document.getElementById(elID).value
}
function _i$(elID){
    return document.getElementById(elID).innerHTML
}

function httpgo(server, req, procedure){
    var httpGetJSON = new XMLHttpRequest;
    if (httpGetJSON.readyState == 4 || httpGetJSON.readyState == 0){
        httpGetJSON.open("GET", server + req, true);
        httpGetJSON.onreadystatechange = function(){
            if (httpGetJSON.readyState == 4)
            {
                if (httpGetJSON.status == 200)
                {
                    console.log("resultx: " + httpGetJSON.responseText);
                    procedure(httpGetJSON.responseText, {occure: false, content: "success"});
                } else {
                    procedure("error", {occure: true, content: "200"});
                }
            }  else {
                procedure("error",{occure: true, content: "4"} );
            }
        };
        httpGetJSON.send(null);
    } else {
        procedure("error", {occure: true, content: "connection"});
    }
}

function isLoggedIn(call){
    //todo: getCookie
    if(isCookieSet("oeip_sessionIDx") && getCookie("oeip_sessionIDx") != "del"){
        httpgo(g$server + "/checksession/", getCookie("oeip_sessionIDx"), (result, error)=>{
            if(result != "null" && !error.occure){
                //feedback = result.split("_ok-")[1];
                feedback = result;
                feedback = JSON.parse(feedback);
                call({"status": true, "feedback": feedback});
            } else {
                call({"status": false, "feedback": error.content});
            }
        });
    } else {
        call({"status": false, "feedback": false});
    }
}

function login(phone,key, call){
    //$useremail = "w.waseemsalem@gmail.com";
    //$userpassword = "w1996";
    $useremail = phone
    $userpassword = key
    httpgo(g$server , "/registersession/"+ $useremail+"/"+$userpassword+"/-/-", (result, error)=>{
        if(result != "null" && !error.occure && result.split("_ok-").length >> 0 ){
            feedback = result.split("_ok-")[1];
            feedback = JSON.parse(feedback);
            call({"status": true, "feedback": feedback, "cookie": /*getCookie("oeip_sessionIDx")*/""});
        return {"status": true, "feedback": feedback, "cookie": /*getCookie("oeip_sessionIDx")*/""};
        } else {
            call({"status": false, "error": error.occure, "feedback": error.content});
            return {"status": false, "error": error.occure, "feedback": error.content};
        }
    });
}