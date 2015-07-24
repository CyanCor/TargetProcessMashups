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
		    // Constant values
		    _allProjectsTitle : '- All Projects -',

            // Initial settings - feel free to edit these
		    _invisibleZeros : true,
		    
		    // Private fields
		    _projects : {},
		    _selectedProject : null,
		    
			Initialize : function()
			{
			    this.RenderFilterBar();
				this.Update();
				this.AttachControls();
				this.AttachObserver();
			},
			
			AttachObserver: function()
			{
        		var $target = $('#ctl00_mainArea_pnlUpd');
        		if (!$target.length)
        		{
        			return;
        		}
        		if (MutationObserver)
        		{
        		    var self = this;
        			var observer = new MutationObserver(function() { self.Update.call(self); });
        			observer.observe($target[0], { childList: true });
        		}
			},
			
			UpdateProjects: function()
			{
			    var projects = {};
			    projects[this._allProjectsTitle] = 1;
			    $('.generalTable .dataRow > td:first-of-type').each(function()
			    {
			        var name = $(this).text().trim();
			        if (name)
			        {
			            projects[name] = 1;
			        }
			    });
			    this._projects = projects;
			    this.RenderProjectSelector();
			    if (this._projects[this._selectedProject])
			    {
			        this.FilterProject(this._selectedProject);
			    }
			},
			
			Update: function()
			{
				this.UpdateProjects();
				this.UpdateAllInputs();
			},
			
			UpdateAllInputs: function()
			{
				$('td .tC input[value!=0]').css('color', '#000');
				$('td .tC input[value=0]').css('color', '#FFF');
			},

			RenderProjectSelector: function()
			{
			    var selector = $('#ProjectSelector'), option;
			    selector.empty();
			    for (var project in this._projects)
			    {
			        option = $('<option></option>');
			        option.val(project);
			        option.text(project);
			        if (project == this._selectedProject)
			        {
			            option.prop('selected', 'selected');
			        }
			        selector.append(option);
			    }
			},
			
			FilterProject: function(projectName)
			{
			    this._selectedProject = projectName;
			    
			    var self = this;
			    $('.generalTable .dataRow').each(function()
			    {
			        var row = $(this);
			        var project = row.find('td:first-of-type').text().trim();

			        project == projectName || projectName == self._allProjectsTitle
			            ? row.show()
			            : row.hide();
			    });
			},
			
			RenderFilterBar: function()
			{
			    var self = this;
        		var topBar = $('<tr id="FilterBar"></tr>');
        		var projectSelector = $('<select id="ProjectSelector"></select>');
        		projectSelector.change(function()
        		    {
        		        self.FilterProject.call(self, projectSelector.find(':selected').val());
        		    });
        		var cell = $('<td colspan="4" id="FilterBarContent"></td>');
        		cell.append(projectSelector);
        		topBar.append(cell);
        		$('#timeOptions > tbody').prepend(topBar);
			},
			
			AttachControls: function()
			{
        		var updateButton = $('<input type="button" value="Update" />');
        		updateButton.click(this.UpdateAllInputs.bind(this));
        		$('#FilterBarContent').append(updateButton);
			}
		};
		  
		var timeSheetFilters = Object.create(TimeSheetFilters);
		timeSheetFilters.Initialize();
	});
});