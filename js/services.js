function getStatus() {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            srvObj = JSON.parse(this.responseText);

            let arrayMain = [];

            var orgArray = ["hkfl-1", "shd-1", "shd-2", "shd-3", "fcts-1", "fcts-2", "hcn-1", "hcn-2", "mcmango-1", "mcmango-2"];
            
            // HKFL
            arrayMain[0] = [srvObj.hkfl.Status, srvObj.hkfl.inetSocket, srvObj.hkfl.Latency];
            
            // SHD
            arrayMain[1] = [srvObj.shd1.Status, srvObj.shd1.inetSocket, srvObj.shd1.Latency]
            arrayMain[2] = [srvObj.shd2.Status, srvObj.shd2.inetSocket, srvObj.shd2.Latency]
            arrayMain[3] = [srvObj.shd3.Status, srvObj.shd3.inetSocket, srvObj.shd3.Latency]

            // FCTS
            arrayMain[4] = [srvObj.fcts1.Status, srvObj.fcts1.inetSocket, srvObj.fcts1.Latency]
            arrayMain[5] = [srvObj.fcts2.Status, srvObj.fcts2.inetSocket, srvObj.fcts2.Latency]
            
            // HCN
            arrayMain[6] = [srvObj.hcn1.Status, srvObj.hcn1.inetSocket, srvObj.hcn1.Latency]
            arrayMain[7] = [srvObj.hcn2.Status, srvObj.hcn2.inetSocket, srvObj.hcn2.Latency]

            // MCMANGO
            arrayMain[8] = [srvObj.mcmango1.Status, srvObj.mcmango1.inetSocket, srvObj.mcmango1.Latency]
            arrayMain[9] = [srvObj.mcmango2.Status, srvObj.mcmango2.inetSocket, srvObj.mcmango2.Latency]

            for(i = 0; i < arrayMain.length; i++) {
                let statusLabel = orgArray[i];
                let linkLabel = orgArray[i] + "-socket";
                let sList = document.getElementById(statusLabel).classList;

                if(!arrayMain[i][0]) {
                    document.getElementById(statusLabel).innerHTML = "Not Operational 出現故障";
                    sList.remove("label-default");
                    sList.add("label-danger");
                } else {
                    document.getElementById(statusLabel).innerHTML = "Operational 運作正常" + "（連線延遲: " + arrayMain[i][2] + " ms）";
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
    var groups = [["hkfl-1"], ["shd-1", "shd-2", "shd-3"], ["fcts-1", "fcts-2"], ["hcn-1", "hcn-2"], ["mcmango-1", "mcmango-2"]];
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
