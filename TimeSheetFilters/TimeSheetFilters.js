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
		    
		    // Internal constants
			_settingsKeyInvisibleZeros : 'CyanCor_TimeSheetFilter_InvisibleZeros',
			_settingsKeyHideEmptyRows : 'CyanCor_TimeSheetFilter_HideEmptyRows',
			_settingsKeySelectedProject : 'CyanCor_TimeSheetFilter_SelectedProject',
		    _observerPanelSelector : '#ctl00_mainArea_pnlUpd',
		    
		    // Private fields
		    _projects : {},
		    _selectedProject : null,
		    
			Initialize : function()
			{
				this._invisibleZeros = this.Get(this._settingsKeyInvisibleZeros, this._invisibleZeros, 'boolean');
				this._hideEmptyRows = this.Get(this._settingsKeyHideEmptyRows, this._hideEmptyRows, 'boolean');
				this._selectedProject = this.Get(this._settingsKeySelectedProject, this._allProjectsTitle, 'string');
				
			    this.RenderFilterBar();
				this.Update();
				this.AttachControls();
				this.AttachObserver();
				
				this.FilterProject();
			},
			
			Get: function(identifier, defaultValue, type)
			{
				if (!identifier) { return defaultValue; }
                var value = decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(identifier).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || defaultValue;
				
				switch (type)
				{
				    case 'boolean':
				        return !value
					        ? defaultValue
					        : value == 'true';
					case 'string':
					    return value || defaultValue;
					default:
					    return null;
				}
			},
			
			Set: function(identifier, value, type)
			{
			    var content = encodeURIComponent(identifier) + '=';
			    switch (type)
			    {
			        case 'boolean':
			            content += value ? 'true' : 'false';
			            break;
			        case 'string':
			            content += encodeURIComponent(value);
			            break;
			    }
				document.cookie = content + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
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
        			observer.observe($target[0], { subtree: true, childList: true, attribute: false, characterData: true });
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
				if (projectName != this._selectedProject)
				{
			        this._selectedProject = projectName;
			        this.Set(this._settingsKeySelectedProject, this._selectedProject, 'string');
				}
			    
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
			},			
			
			InvisibleZerosCheckboxChanged : function(element)
			{
				this._invisibleZeros = element.checked;
				this.Set(this._settingsKeyInvisibleZeros, this._invisibleZeros, 'boolean');
				this.UpdateAllInputs();
			},
			
			HideEmptyRowsCheckboxChanged : function(element)
			{
				this._hideEmptyRows = element.checked;
				this.Set(this._settingsKeyHideEmptyRows, this._hideEmptyRows, 'boolean');
				this.FilterProject();
			}
		};
		  
		var timeSheetFilters = Object.create(TimeSheetFilters);
		timeSheetFilters.Initialize();
	});
});