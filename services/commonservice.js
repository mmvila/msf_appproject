/* 
   Copyright (c) 2016.
 
   This file is part of Project Configuration for MSF.
 
   Project Configuration is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.
 
   Project Configuration is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
 
   You should have received a copy of the GNU General Public License
   along with Project Configuration.  If not, see <http://www.gnu.org/licenses/>. */

Dhis2Api.service('commonService', ['$q', 'commonvariable', 'OrgUnitGroupByOrgUnit', 'OrgUnitGroupSet', 'OrgUnitOrgUnitGroups',
                                   function ($q, commonvariable, OrgUnitGroupByOrgUnit, OrgUnitGroupSet, OrgUnitOrgUnitGroups) {
	

	this.getServiceSuffix = function(healthserviceSuffix) {
		
		var services = healthserviceSuffix.service;
		
		var serviceResult = {};
		
		for (var i=0; i<services.length; i++) {
			
			if (services[i].code==commonvariable.orgUnitGroupSet[commonvariable.ouGroupsetId.HealthService].code) {
				serviceResult = services[i];
				break;
			}
			
		}		
		return serviceResult;
		
	};
	
	this.deleteOrgUnitGroup = function (uidOrgUnit, uidOrgUnitGroupSet) {
		
		OrgUnitGroupByOrgUnit.get({uid:uidOrgUnit}).$promise.then(function(data) {
			
			ouOrgUnitGroups=data.organisationUnitGroups;
			
			OrgUnitGroupSet.get({uid:uidOrgUnitGroupSet}).$promise.then(function(data) {
								
				ougsOrgUnitGroups=data.organisationUnitGroups;
				
			    try {
			    	
			    	var find = false;
			    	
			        for (var i = 0; i < ouOrgUnitGroups.length; i++) {
			        
			        	if (find == true) break;
			        
			            for (var j = 0; j < ougsOrgUnitGroups.length; j++) {
			                if (ouOrgUnitGroups[i].id == ougsOrgUnitGroups[j].id) {
			                	find = true;
			      			  	OrgUnitOrgUnitGroups.DELETE({uidorgunit: uidOrgUnit, uidgroup: ouOrgUnitGroups[i].id});

			                    break;
			                }
			            }
			            
			        }
			    } catch (err) { };
			    
			});
			
		});
		
	
	}
	
	this.sortByKey = function (array, key) {
	    return array.sort(function(a, b) {
	        var x = a[key]; var y = b[key];
	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	    });
	}



}]);