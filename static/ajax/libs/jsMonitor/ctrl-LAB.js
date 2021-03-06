app.controller('ctrl-thomson-LAB',function($scope, $http, $timeout, $window, $interval) {
    // body...
    $scope.host = "thomson-lab";
    $scope.isRealTime = false;
    $scope.isJob = false;
    $scope.node_id = 0;
    $scope.nodeDetail = 0;
    var tickNode = false;
    var tickAllLog = false;
    var tickCountJob = false;
    var tickDetail = false;
    var tickLogJob = false;

    $scope.reloadNodes = function(){
        tickNode = false;
        $scope.$broadcast('loadNode-HCM');
        $http({
            method:"GET",
            url:"/system/api/"+$scope.host+"/nstatus/",
            timeout:2000,
        }).then(function(response){
            if(response.status == 200 && response.data.length){
                $scope.lstNodes = response.data;
                tickNode = true;
            }else tickNode = true;
            $scope.$broadcast('uloadNode-HCM');
        }, function(response){tickNode = true; if (response.status == 401) {$window.location.href= '/accounts/login/';}});
    };
    //reload nodes
    $timeout(function() {$interval(function() {
        if(tickNode){$scope.reloadNodes();}
    }, 3000);}, 100);
    //load count job
    $scope.reloadJobs = function(){
        tickCountJob = false;
        $http({
            method:'GET',
            url:"/job/api/"+$scope.host+"/count-job/",
            timeout:2000,
        }).then(function(response){
            if (response.status == 200 && response.data[0]['total']) {
                $scope.Jobs=response.data;
                tickCountJob = true;

            }else{
                $timeout(function(){ $scope.reloadJobs();}, 1000);
            }
        });
    };
    //reload count job
    $interval(function(){if (tickCountJob) {$scope.reloadJobs();}},10000);
    
    $scope.reloadDevice = function(){
        $http({
            method:"GET",
            url:"/system/api/"+$scope.host+"/status/",
            timeout:3000,}).then(function(response){
            if(response.status == 200){
                $scope.PCStatus = response.data[0];
                $timeout(function() {
                $scope.reloadDevice();}, 3000);}
        }, function(){$timeout(function(){$scope.reloadDevice();}, 3000);});
    };
    $scope.show_detail = function(node_id) {
        // $window.location.href = '/system/detail-node/'+node_id+'/'
        $scope.lstLogJob = '';
        $scope.isRealTime = false;
        $scope.isJob = true;
        $scope.$broadcast('loadJob-HCM');
        $http({
            method:'GET',
            url:'/system/api/'+$scope.host+'/'+node_id+'/',
        }).then(function(response){
            if($scope.nodeDetail == node_id){
                $scope.node = response.data[0];
                $scope.job_list = response.data[0].job_list;
                $scope.$broadcast('uloadJob-HCM');
            }
            // console.log($scope.job_list);
        });
        if ($scope.isJob && $scope.nodeDetail == node_id){
            $scope.reload_detail(node_id);
        }
        // console.log($scope.nodeDetail);
    };
    $scope.reload_detail = function(node_id){
        tickDetail = false;
        $scope.$broadcast('loadJob-HCM');
        $http({
            method:'GET',
            url:'/system/api/'+$scope.host+'/'+node_id+'/',
            timeout:10000,
        }).then(function(response){
            if($scope.nodeDetail == node_id && response.status == 200 && response.data.length){
                $scope.node = response.data[0];
                // console.log(response.data);
                $scope.$broadcast('uloadJob-HCM');
                tickDetail = true;
                // $scope.job_list = response.data[0].job_list;
            }else{tickDetail = true;}
        }, function(response){tickDetail = true;});
    };
    // reload detail node
    $interval(function(){if(tickDetail && $scope.nodeDetail){$scope.reload_detail($scope.nodeDetail);}}, 3000);

    $scope.set_nodedatil = function(node_id){
        $scope.nodeDetail = node_id;
    };
    $scope.restartJob = function(job_id, node_id){
        if (angular.element(document.getElementById('cpt-value-widgetRestart1')).val()===""){
            alert("Please resolve the captcha and submit!");}
        else{            
            $scope.$emit('loadMain-HCM');
            // console.log("restart");
            $http({
            method: 'PUT',
            url: '/job/api/' + $scope.host + '/' + job_id + '/restart/',
            }).then(function(response){
                if (response.status == 202) {
                    setAlert("Success !", response.data.message, "alert-success");
                    $('#modal-alert').modal('show');
                    // $window.alert(response.data.message);
                    // console.log(response.data);
                    $scope.show_detail(node_id);
                    $scope.$emit('uloadMain-HCM');
                }
                else{
                    $scope.$emit('uloadMain-HCM');}
        }, function(response){
            setAlert("Error!",'Can not start job.', "alert-danger");
            $('#modal-alert').modal('show');
            $scope.$emit('uloadMain-HCM');
        });}
    };
    $scope.stopJob = function(job_id, node_id){
        if (angular.element(document.getElementById('cpt-value-widgetStop1')).val()===""){ 
        //get val byid
            alert("Please resolve the captcha and submit!");
        }else{
            $scope.$emit('loadMain-HCM');
            $http({
            method: 'PUT',
            url: '/job/api/'+ $scope.host + '/'+job_id + '/abort/',
            }).then(function(response){
                if (response.status == 202) {
                    setAlert("Success !", response.data.message, "alert-success");
                    $('#modal-alert').modal('show');
                // $window.alert(response.data.message);
                $scope.show_detail(node_id);
                $scope.$emit('uloadMain-HCM');
                }
                else{$scope.emit('uloadMain-HCM');}
                }, function(response){
                    setAlert("Error!",'Can not start job.', "alert-danger");
                    $('#modal-alert').modal('show');
                    $scope.$emit('uloadMain-HCM');
                });
        }
    };
    $scope.showLog = function(job_id, job_name){
        $scope.job_name = job_name;
        $scope.isRealTime = true;
        $scope.job_id = job_id;
        $scope.$broadcast('loadLog-HCM');
        $http({
            method: 'GET',
            url: '/log/api/'+ $scope.host +'/'+ job_id +'/',
        }).then(function(response){
            if (response.status == 200 ){
                $scope.lstLogJob = response.data;
                // console.log(response.data);
                $scope.$broadcast('uloadLog-HCM');
            }else{
                // console.log("Error");
                $scope.$broadcast('loadLog-HCM');
            }
        });
        if ($scope.isRealTime && $scope.job_id == job_id){
            $scope.reload_log(job_id, job_name);
        }
    };
    $scope.reload_log = function(job_id, job_name){
        $scope.job_name = job_name;
        tickLogJob = false;
        $scope.$broadcast('loadLog-HCM');
        $http({
            method: 'GET',
            url: '/log/api/'+ $scope.host +'/'+ job_id +'/',
            timeout: 5000,
        }).then(function(response){
           if (response.status == 200 && $scope.job_id == job_id && response.data.length){
                $scope.lstLogJob = response.data;
                // console.log(response.data);
                $scope.$broadcast('uloadLog-HCM');
                tickLogJob = true;
            }else{
                // console.log("Error");
                $scope.$broadcast('loadLog-HCM');
                tickLogJob = true;
            } 
        }, function(response){tickLogJob = true;});
    };
    // reload log Job
    $interval(function(){if (tickLogJob && $scope.isRealTime) {$scope.reload_log($scope.job_id, $scope.job_name);}}, 10000);
    $scope.loadAllLog = function(){
        tickAllLog = false;
        $scope.nowDate = +new Date();
        $scope.nowDate = ($scope.nowDate - $scope.nowDate%1000)/1000;
        $scope.$broadcast('loadRealtime-HCM');
        $http({
            method: 'GET',
            url: '/log/api/'+$scope.host+'/log/',
            timeout:2000,
        }).then(function (response){
           if (response.status == 200 && response.data.length) {
            // console.log(response.data);
            tickAllLog = true;
            $scope.log_list = response.data;
            $scope.$broadcast('uloadRealtime-HCM');}
            else {tickAllLog = true;}
        }, function(response){tickAllLog = true;});
    };
    // reload All Log
    $timeout(function(){$interval(function(){if(tickAllLog && !$scope.isRealTime){$scope.loadAllLog();}},10000)}, 5000);
    $scope.checkBackup = function(job_id, node_id){
        // console.log('restart');
        $scope.job_id = job_id;
        $scope.node_id = node_id;
        $scope.txtHeader='Restart Job:&nbsp;'+job_id;
        $http({
            method: 'GET',
            url: '/job/api/' + $scope.host + '/' + job_id + '/check-backup/',
        }).then(function(response){
            if(response.status ==202){
                if(response.data[0]['backup'] === 'true'){
                    var tmp= "glyphicon glyphicon-ok";
                }else{ var tmp = "glyphicon glyphicon-remove";}
                var strbackup="<p>Define backup input:&nbsp;<i class=\""+tmp+"\"></i></p></br>";
                var strip = "<p>IP address:&nbsp;"+response.data[0]['ip']+"</p>";
                $scope.txtBody = strbackup+ strip;
            }
        });
    };
    $scope.dataModal = function(job_id, node_id){
        $scope.job_id = job_id;
        $scope.node_id = node_id;
        $scope.txtHeader = 'Stop Job:&nbsp;'+job_id;
        $http({
            method: 'GET',
            url: '/job/api/' + $scope.host + '/' + job_id + '/check-backup/',
        }).then(function(response){
            if(response.status ==202){
                if( response.data[0]['backup']){
                    var tmp= "glyphicon glyphicon-ok";
                }else{ var tmp = "glyphicon glyphicon-remove";}
                var strbackup="<p>Define backup input:&nbsp;<i class=\""+tmp+"\"></i></p></br>";
                var strip = "<p>IP address:&nbsp;"+response.data[0]['ip']+"</p>";
                $scope.txtBody = strbackup+ strip;
            }
        });
    };
    $scope.reverseSort = false;
    $scope.reloadDevice();
    $scope.reloadNodes();
    $scope.loadAllLog();
    $scope.reloadJobs();
    });
$('#frm-modal-stop-thomson-lab').submit(function() {
    if($('#cpt-value-widgetStop1').val()===""){
        $('#modal-stop-thomson-lab').modal('show');
    }else{
        $('#modal-stop-thomson-lab').modal('hide');
    }
    // console.log("####close###");
});
$('#frm-modal-restart-thomson-lab').submit(function() {
    if($('#cpt-value-widgetRestart1').val()===""){
        $('#modal-restart-thomson-lab').modal('show');
    }else{
        $('#modal-restart-thomson-lab').modal('hide');
    }
});