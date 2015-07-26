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
		    // Constants - feel free to edit these
		    _allProjectsTitle : '- All Projects -',

            // Initial settings - feel free to edit these
		    _invisibleZeros : true,
			_hideEmptyRows : false,
		    
		    // Internal constants - do not modify
		    _observerPanelSelector : '#ctl00_mainArea_pnlUpd',
		    
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
        		var $target = $(this._observerPanelSelector);
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
				if (this._invisibleZeros)
				{
					$('td .tC input[value!=0]').css('color', '#000');
					$('td .tC input[value=0]').css('color', 'transparent');
				} else
				{
					$('td .tC input').css('color', '#000');
				}
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
				projectName = projectName || this._selectedProject || this._allProjectsTitle;
			    this._selectedProject = projectName;
			    
			    var self = this;
			    $('.generalTable .dataRow').each(function()
			    {
			        var row = $(this);
			        var project = row.find('td:first-of-type').text().trim();
					var time = row.find('> .timeTotal span').first().text().replace(/0/g, '').trim();

			        ((project == projectName) || (projectName == self._allProjectsTitle))
					&& (!self._hideEmptyRows || time)
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
				var filterBar = $('#FilterBarContent');
				var self = this;
				var checkbox, label;
				
				// Invisible Zeros
        		checkbox = $('<input type="checkbox" value="true" id="InvisibleZerosCheckbox"></input>');
				if (this._invisibleZeros) { checkbox.prop('checked', 'checked'); }
				checkbox.change(function() {self.InvisibleZerosCheckboxChanged.call(self, this)});
				label = $('<label for="InvisibleZerosCheckbox">Invisible Zeros</label>');
				filterBar.append(checkbox);
				filterBar.append(label);
				
				// Hide empty rows
        		checkbox = $('<input type="checkbox" value="true" id="HideEmptyRowsCheckbox"></input>');
				if (this._hideEmptyRows) { checkbox.prop('checked', 'checked'); }
				checkbox.change(function() {self.HideEmptyRowsCheckboxChanged.call(self, this)});
				label = $('<label for="HideEmptyRowsCheckbox">Hide Empty Rows</label>');
				filterBar.append(checkbox);
				filterBar.append(label);

        		var updateButton = $('<input type="button" value="Update" />');
        		updateButton.click(this.UpdateAllInputs.bind(this));
        		filterBar.append(updateButton);
			},			
			
			InvisibleZerosCheckboxChanged : function(element)
			{
				this._invisibleZeros = element.checked;
				this.UpdateAllInputs();
			},
			
			HideEmptyRowsCheckboxChanged : function(element)
			{
				this._hideEmptyRows = element.checked;
				this.FilterProject();
			}
		};
		  
		var timeSheetFilters = Object.create(TimeSheetFilters);
		timeSheetFilters.Initialize();
	});
});