appConfigProjectMSF.controller('missionController', ["$scope", '$filter', "commonvariable", "OrgUnit", "OrgUnitGroupsOrgUnit", "DataSets", "OrgUnitChildren", "FilterResource", "AddDataSetsToOrgUnit","$modal", function ($scope, $filter, commonvariable, OrgUnit, OrgUnitGroupsOrgUnit, DataSets, OrgUnitChildren, FilterResource, AddDataSetsToOrgUnit,$modal) {
    var $translate = $filter('translate');
    //Load Data of OU selected
    $scope.prevOu = "";
    $scope.showbutton = true;
    $scope.CreateDatasetVaccination = true;

    $scope.initValue = function () {
        $scope.vaccinationName = commonvariable.OrganisationUnit.name;
        $scope.vaccinationCode = commonvariable.OrganisationUnit.shortName;
        $scope.preName = commonvariable.prefixVaccination.vaccinationName;
        $scope.preCode = commonvariable.prefixVaccination.vaccinationCode;

        ///OrgunitGroupSet 
        $scope.projectTypeId = commonvariable.ouGroupsetId.ProjectType;
        $scope.populationTypeId = commonvariable.ouGroupsetId.PopulationType;
        $scope.typeManagementID = commonvariable.ouGroupsetId.TypeManagement;
        $scope.gsEventID = commonvariable.ouGroupsetId.Event;
        $scope.gsContextID = commonvariable.ouGroupsetId.Context;
    }
    $scope.initValue();
    ///get if there exist a Dataset for this Mission.
    $scope.getDataset = function () {
        $scope.initValue();
        DataSets.Get({ filter: "name:eq:" + $scope.preName + $scope.vaccinationName, fields: 'id,name,code,description,periodType,dataElements' })
               .$promise.then(function (data) {
                   if (data.dataSets.length> 0) {
                        $scope.CreateDatasetVaccination = false;
                        $scope.VaccinationDataset = data.dataSets[0];
                        commonvariable.VaccinationDatasetSelected = $scope.VaccinationDataset;
                        $scope.vaccinationName = commonvariable.OrganisationUnit.name;
                        $scope.vaccinationCode = commonvariable.OrganisationUnit.shortName;
                        $scope.PeriodSelected = $scope.VaccinationDataset.periodType;
                        $scope.dataSetDescription = $scope.VaccinationDataset.description;
                        $scope.dataSetid = $scope.VaccinationDataset.id;
                   }
                   else
                       $scope.CreateDatasetVaccination = true;
               });
    }

    // if there exist Vaccination DataSet   then show the DataElements  
    $scope.showDataSetforEdit = function () {
        $scope.showForm(2);
    }
    //set message variable
	$scope.closeAlertMessage = function(index) {
       $scope.messages.splice(index, 1);
  	};
	
	$scope.messages=[];
	
	
	
	$scope.showfields=false;


    

	///Save project
	$scope.projectsave=function(){


		var newOu={//payload
				name:commonvariable.ouDirective,
				level:(commonvariable.OrganisationUnit.level+1),
				code:commonvariable.ouDirectiveCode,
	            shortName:commonvariable.ouDirective,
	           	openingDate:$scope.propendate,
	           	parent: commonvariable.OrganisationUnitParentConf
				};

		OrgUnit.POST({},newOu)
		.$promise.then(function(data){
    		  console.log(data);
    		  if (data.status == "SUCCESS") { ///verificar que en la versi�n 2.19 y 2.20 sea data.response.status
    		  	  commonvariable.RefreshTreeOU=true;
				  newOu.id=data.lastImported;
				  commonvariable.NewOrganisationUnit=newOu;
				 
				  if (commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType] != undefined)
				      OrgUnitGroupsOrgUnit.POST({uidgroup:commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.ProjectType].id, uidorgunit:newOu.id});
				  if (commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType] != undefined)
				      OrgUnitGroupsOrgUnit.POST({ uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.PopulationType].id, uidorgunit: newOu.id });
				  if (commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement] != undefined)
				      OrgUnitGroupsOrgUnit.POST({ uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.TypeManagement].id, uidorgunit: newOu.id });
				  if (commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Event] != undefined)
				      OrgUnitGroupsOrgUnit.POST({ uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Event].id, uidorgunit: newOu.id });
				  if (commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Context] != undefined)
				      OrgUnitGroupsOrgUnit.POST({ uidgroup: commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.Context].id, uidorgunit: newOu.id });
				  

				  FilterResource.GET({resource:'dataSets', filter:'code:eq:'+"DS_VST_3"}).$promise
				  		.then(function(response){
				  			
				  			if (response.dataSets.length>0) {
				  				
				  				var dataSet = response.dataSets[0];
				  				AddDataSetsToOrgUnit.POST({uidorgunit:newOu.id, uiddataset:dataSet.id});
				  			}
				  							  			
				  		});
				  
				  
				  
				 //set message variable
				  $scope.messages.push({ type: "success", text: $translate('PROJECT_SAVED') });
				  $scope.hideForm();
				//clear txtbox
				$scope.projectName="";

			}
			else{
    		      $scope.messages.push({ type: "danger", text: $translate('PROJECT_NOSAVED') });
			}
    	 });
				
	};
	
	
	$scope.showForm = function (frm) {
	    $scope.showbutton = false;
		if(frm==1){
			$scope.frmVaccination=false;
			$scope.frmProject=true;
		}
		else{
			$scope.frmVaccination=true;
			$scope.frmProject=false;
		}

	};
	$scope.hideForm=function(){
		$scope.projectName="";
		$scope.today();
		$scope.showfields=false;
		$scope.frmVaccination=false;
		$scope.frmProject = false;
		$scope.showbutton = true;

		$scope.getChildrenByOUID(commonvariable.OrganisationUnit.id);
		$scope.getDataset();
		$scope.vaccinationName="";
		$scope.vaccinationCode="";
	    $scope.dataSetDescription=""
	    commonvariable.PeriodSelected=[];
	    commonvariable.DataElementSelected = [];
	};

    // Date datepicker
	  $scope.today = function() {
	    datetoday = new Date();
	    $scope.propendate=datetoday.getFullYear()+"-"+((datetoday.getMonth()+1)<=9?"0"+(datetoday.getMonth()+1):(datetoday.getMonth()+1))+"-"+(datetoday.getDate()<=9?"0"+datetoday.getDate():datetoday.getDate());
	  };
	  
	  $scope.today();

	  $scope.clear = function () {
	    $scope.propendate = null;
	  };

	   $scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;
	  };
    /////////////////////////////////////////

	   $scope.saveDatasetVaccination = function () {
	       var newDataSet = {
	           name: $scope.preName + $scope.vaccinationName,
	           code: $scope.preCode + $scope.vaccinationCode,
	           shortName: $scope.preCode + $scope.vaccinationCode,
	           description: $scope.dataSetDescription,
	           periodType: commonvariable.PeriodSelected.code,
	           dataElements: commonvariable.DataElementSelected,
	           organisationUnits: [{ id: commonvariable.OrganisationUnit.id }]
	       };
	       console.log(newDataSet);
	       DataSets.Post({}, newDataSet)
	        .$promise.then(function (data) {
	            if (data.response.status == "SUCCESS") {
	                $scope.messages.push({ type: "success", text: $translate('VACCINATION_DATASET_SAVED') });
	                $scope.hideForm();
	            }
	            else {
	                $scope.messages.push({ type: "danger", text: $translate('VACCINATION_DATASET_NOSAVED') });
	            }
	        });
	   };

	   $scope.updateDatasetVaccination = function () {
	      var newDataSet = {
	           name: $scope.preName + $scope.vaccinationName,
	           code: $scope.preCode + $scope.vaccinationCode,
	           shortName: $scope.preCode + $scope.vaccinationCode,
	           description: $scope.dataSetDescription,
	           periodType: commonvariable.PeriodSelected.code,
	           dataElements: commonvariable.DataElementSelected,
	           organisationUnits: [{ id: commonvariable.OrganisationUnit.id }]
	       };
	       DataSets.Put({ uid: $scope.dataSetid }, newDataSet)
	        .$promise.then(function (data) {
	            if (data.response.status == "SUCCESS") {
	                $scope.messages.push({ type: "success", text: $translate('VACCINATION_DATASET_SAVED') });
	                scope.hideForm();
	            }
	            else {
	                $scope.messages.push({ type: "danger", text: $translate('VACCINATION_DATASET_NOSAVED') });
	            }
	        });
	   };

	   $scope.getChildrenByOUID = function (uidSelected) {
	       OrgUnitChildren.get({ uid :uidSelected})
           .$promise.then(function (dataChild){
               $scope.ListChildren = dataChild.children;
	        });
	   }
    ///
	   $scope.$watch(function () {
	       if (commonvariable.OrganisationUnit && commonvariable.OrganisationUnit.id != $scope.prevOu) {
	           try {

	               $scope.missionname = commonvariable.OrganisationUnit.name;
	               $scope.missioncreated = commonvariable.OrganisationUnit.openingDate;
	               $scope.prevOu = commonvariable.OrganisationUnit.id;
	               $scope.getDataset();
	               $scope.hideForm();
	               //get Children for OU selected

	               $scope.getChildrenByOUID(commonvariable.OrganisationUnit.id);
	           } catch (err) {
	               console.log("Error, Organisation Unnit doesn't selected");
	           };
	       }
	   });
    
    ////////////////////////For Edit //////////////////////////////////////////

    ///enable textBox
	   $scope.operation = 'show';
	   $scope.enableforEdit = function () {
	       $scope.operation = 'edit';
	   }
	   $scope.enableforshow = function () {
	       $scope.operation = 'show';
	   }

    ////Edit mission
	   $scope.EditMission = function () {

	       var newOu = {//payload
	           name: commonvariable.ouDirective,
	           level: commonvariable.OrganisationUnit.level,
	           shortName: commonvariable.ouDirective,
	           openingDate: $scope.mdopendate,
	           parent: commonvariable.OrganisationUnitParentConf
	       };

	       ///
	       $scope.messages.push({ type: "success", text: $translate('MISSION_UPDATED') });


	   }




    ///Delete mission
	   $scope.DeleteMission = function () {


	       ///
	       $scope.messages.push({ type: "success", text: $translate('MISSION_DELETED') });

	   }



    /////modal for delete message

	   $scope.modalDelete = function (size) {

	       var modalInstance = $modal.open({
	           templateUrl: 'modalDeleted.html',
	           controller: 'ModalDeleted',
	           size: size,
	           resolve: {
	               items: function () {
	                   return $scope.items;
	               }
	           }
	       });

	       modalInstance.result.then(function (option) {
	           if (option) {
                   //method for delete mission
	               $scope.DeleteMission();
	           }
	       }, function () {
	           console.log('Modal dismissed at: ' + new Date());
	       });
	   };

	
  
}]);


appConfigProjectMSF.controller('ModalDeleted', function ($scope, $modalInstance) {


    $scope.ok = function () {
        $modalInstance.close(true);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


