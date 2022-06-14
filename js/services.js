function getStatus() {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            srvObj = JSON.parse(this.responseText);

            var orgArray = ["hkfl-1", "shd-1", "shd-2"];
            
            // HKFL
            var array0 = [srvObj.hkfl.Status, srvObj.hkfl.inetSocket]
            
            // SHD1
            var array1 = [srvObj.shd1.Status, srvObj.shd1.inetSocket]

            // SHD2
            var array2 = [srvObj.shd2.Status, srvObj.shd2.inetSocket]

            let arrayMain = [];
            arrayMain.push(array0);
            arrayMain.push(array1);
            arrayMain.push(array2);

            for(i = 0; i < arrayMain.length; i++) {
                let statusLabel = orgArray[i];
                let linkLabel = orgArray[i] + "-socket";
                let sList = document.getElementById(statusLabel).classList;

                if(!arrayMain[i][0]) {
                    document.getElementById(statusLabel).innerHTML = "Not Operational 出現故障";
                    sList.remove("label-default");
                    sList.add("label-danger");
                } else {
                    document.getElementById(statusLabel).innerHTML = "Operational 運作正常";
                    sList.remove("label-default");
                    sList.add("label-success");
                }

                document.getElementById(linkLabel).title = arrayMain[i][1];
                document.getElementById(linkLabel).target = "_blank";

                if(arrayMain[i][1].split(":")[1] == 443) {
                    document.getElementById(linkLabel).href = "https://" + arrayMain[i][1].split(":")[0];
                } else if(arrayMain[i][1].split(":")[1] == 80) {
                    document.getElementById(linkLabel).href = "http://" + arrayMain[i][1].split(":")[0];
                } else {
                    document.getElementById(linkLabel).href = "#";
                }
                
            }

            checkOperational();
        }
    };
    xmlhttp.open("GET", "https://partner-status-api.hypernology.com/", true);
    xmlhttp.send();
}

function checkOperational() {
    var groups = [["hkfl-1"], ["shd-1", "shd-2"]];
    var currentdate = new Date(); 

    for(i = 0; i < groups.length; i++) {
        var objectLen = groups[i].length;
        var orgName = groups[i][0].split("-")[0];
        let status = true;

        var statusClass = document.getElementById(orgName).classList;

        for(j = 0; j < objectLen; j++) {
            if(document.getElementById(orgName + "-" + (j + 1)).innerHTML == "Not Operational 出現故障") {
                status = false;
                break;
            }
        }

        statusClass.remove("panel-info");
        (status) ? statusClass.add("panel-success") : statusClass.add("panel-danger");
        (status) ? document.getElementById(orgName + "-status").innerHTML = "所有檢測服務運作正常" : document.getElementById(orgName + "-status").innerHTML = "部分服務出現故障";

        document.getElementById(orgName + "-refresh").innerHTML = currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/" 
        + currentdate.getFullYear() + " @ "  
        + currentdate.getHours() + ":"  
        + currentdate.getMinutes() + ":" 
        + currentdate.getSeconds();
    }
}

setInterval(30, getStatus());