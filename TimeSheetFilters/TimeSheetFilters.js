// Author: Thomas Riedl - CyanCor GmbH - https://cyancor.com/
tau.mashups
.addDependency('libs/jquery/jquery')
.addMashup(function($, config)
{
	'use strict';

	$(document).ready(function()
	{
		var TimeSheetFilters = 
		{
		    _projects : {},
		    
			Initialize : function()
			{
				this.Update();
				this.AttachControls();
				
        		var $target = $('#ctl00_mainArea_pnlUpd');
        		if (!$target.length)
        		{
        			return;
        		}
        		if (window.MutationObserver)
        		{
        		    var self = this;
        			var observer = new MutationObserver(function() { self.Update.call(self); });
        			observer.observe($target[0], { childList: true });
        		}
			},
			
			GetProjects: function()
			{
			    var projects = {};
			    $('.generalTable .dataRow > td:first-of-type').each(function()
			    {
			        var name = $(this).text().trim();
			        if (name)
			        {
			            projects[name] = 1;
			        }
			    });
			    this._projects = projects;
			},
			
			Update: function()
			{
				this.GetProjects();
				this.UpdateAllInputs();
			},
			
			UpdateAllInputs: function()
			{
				$('td .tC input[value!=0]').css('color', '#000');
				$('td .tC input[value=0]').css('color', '#FFF');
			},
			
			AttachControls: function()
			{
        		var topBar = $('<tr></tr>');
        		var cell = $('<td colspan="4" align="right"></td>');
        		var updateButton = $('<input type="button" value="Update" />');
        		updateButton.click(timeSheetFilters.UpdateAllInputs);
        		cell.append(updateButton);
        		topBar.append(cell);
        		$('#timeOptions > tbody').prepend(topBar);
			}
		};
		  
		var timeSheetFilters = Object.create(TimeSheetFilters);
		timeSheetFilters.Initialize();
	});
});