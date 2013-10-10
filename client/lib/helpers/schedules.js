autolevel = function(data)
{
	/*
	 * in oder to level we need to keep some running tallys
	 * 1) What is the current amount of hours used per day per user
	 * 2) What is the current amount of time scheduled against a features hours
	 * 3) 
	 */
	
	//console.log(data);
	var roundtonearest = 1000;
	var iteration_id = data._id;
	var iterationDays = data.iteration.iterationDays;
	
	//create a totals counter for keeping track of user hours per day
	var userDayTotals = {};
	
	iterationDays.forEach(function(days)
	{
		data.userCounts.forEach(function(user)
		{
		
			var user_day_id = user._id + "_" + days.time;
			
			if(user_day_id in userDayTotals == false) 
			{
				userDayTotals[user_day_id] = 0;
			}
			
		});
		
	});
	
	//create a totals counter for keeping track of user hours per feature
	var featureUserTotals = {};
	
	data.features.forEach(function(feature)
	{
		data.userCounts.forEach(function(user)
		{
		
			var feature_user_id = feature._id + "_" + user._id;
			
			if(feature_user_id in featureUserTotals == false) 
			{
				featureUserTotals[feature_user_id] = 0;
			}
			
		});
		
	});
	
	
	var scheduleData = {};
	var num_days = iterationDays.length;
	var hoursinday = getSetting('hoursperday', 6);
	
	
	scheduleData['data'] = {};
	
	//loop features
	data.features.forEach(function(feature)
	{
		var feature_id = feature._id;
		var featureEst = feature.estimate;
		
		
		if(feature_id in scheduleData['data'] == false){
			scheduleData['data'][feature_id] = {};
		}
		
		//by days in the iteration
		iterationDays.forEach(function(days)
		{
			
			var day_id = days.time;
			
			
			if(day_id in scheduleData['data'][feature_id] == false) 
			{
				scheduleData['data'][feature_id][day_id] = {};
			}
			
			var runningTtl = 0;
			
			data.userCounts.forEach(function(user)
			{
				
				var hoursRequired = hoursinday;
				var user_id = user._id;
				
				var incrementValue = Math.round( (user.count / num_days) * roundtonearest ) / roundtonearest;
				
				//if increment value is more than hoursperday then we use that instead;
				if(incrementValue > hoursRequired)
				{
					hoursRequired = incrementValue;
				}
				
				if(user_id in scheduleData['data'][feature_id][day_id] == false) 
				{
					scheduleData['data'][feature_id][day_id][user_id] = 0;
				}

				//we need to know this user is the one who this feature is asigned
				if( user_id === feature.assign )
				{
					
					//if the hours here are still less than the feature estimate amount then try and add hours
					if( scheduleData['data'][feature_id][day_id][user_id] <  featureEst )
					{
						
						//increment the userDayTotals
						var this_user_day_id = user_id + "_" + day_id;
						var this_feature_user_id = feature_id + "_" + user_id;
						
						//increment the counter
						//console.log( userDayTotals[this_user_day_id] + ' <= ' + hoursRequired );
						
						runningTtl = userDayTotals[this_user_day_id];
						
						console.log( featureEst + ' <= (' + hoursRequired + " - " + runningTtl + " ) " );
						
						//console.log( runningTtl + ' <= (' + hoursRequired + " - " + runningTtl + " ) " );
						
						//we need to make sure that we don't go over the increment value for the day
						if( runningTtl <=  hoursRequired )
						{
							
							var newValue = 0;
							
							//if the estimate is less than the increment value
							if(featureEst <= (hoursRequired - runningTtl) )
							{
								scheduleData['data'][feature_id][day_id][user_id] += Math.round(featureEst * roundtonearest ) / roundtonearest;
								
								userDayTotals[this_user_day_id] += Math.round(featureEst * roundtonearest ) / roundtonearest;
								
								featureUserTotals[this_feature_user_id] += Math.round(featureEst * roundtonearest ) / roundtonearest;
								
							} else {
								
								scheduleData['data'][feature_id][day_id][user_id] += Math.round( (hoursRequired - runningTtl ) * roundtonearest ) / roundtonearest;
								
								userDayTotals[this_user_day_id] += Math.round( (hoursRequired - runningTtl) * roundtonearest ) / roundtonearest;
								
								featureUserTotals[this_feature_user_id] += Math.round( (hoursRequired - runningTtl ) * roundtonearest) / roundtonearest;
								
								newValue = Math.round( (featureEst - (hoursRequired - runningTtl) ) * roundtonearest ) / roundtonearest;

							}
							
							//reduce the feature est by the hours avail
							if( newValue <= 0 )
							{
								featureEst = 0;
							} else {
								featureEst = newValue;
							}
							
						} else {
							
							
							//we can't go over on the amount of hours since we are leveling ?
							alert('shit this isn\'t supposed to happen.');
							
						}
						
						
					}
					
				}
				
			});
			
		});
		
	});
	
	//combine the totals 
	scheduleData['iteration_id'] = iteration_id;
	scheduleData['userdaytotals'] = userDayTotals;
	scheduleData['featureusertotals'] = featureUserTotals;
	scheduleData['hoursinday'] = hoursinday;
	
	//console.log(scheduleData);
	
	//now we can enter the data into the schedules collection for use
	Meteor.call("scheduleRebuild", scheduleData, function(error,result){
	    if(error){
	        console.log(error.reason);
	    }
	    else{
	    	console.log(result);
	    }
	});
	
	
	
}