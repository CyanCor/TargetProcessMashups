// Author: Thomas Riedl - CyanCor GmbH - https://cyancor.com/
tau.mashups
  .addDependency('libs/jquery/jquery')
  .addMashup(function($, config) {
	  
    var TimeSheetFilters = 
	{
		Initialize : function()
		{
			this.UpdateAllInputs();
		},
		
		UpdateAllInputs : function()
		{
			$('td .tC input[value!=0]').css('color', '#000');
			$('td .tC input[value=0]').css('color', '#FFF');
		}
	};
	  
    function updateInput()
    {
        var element = $(this);
        var value = element.val();
        element.css('color', value && value != '0' ? '#000' : '#FFF');
    }
     
    var timeSheetFilters = Object.create(TimeSheetFilters);
    timeSheetFilters.Initialize();
	
    var topBar = $('<tr></tr>');
    var cell = $('<td colspan="4" align="right"></td>');
    var updateButton = $('<input type="button" value="Update" />');
    updateButton.click(timeSheetFilters.UpdateAllInputs);
    cell.append(updateButton);
    topBar.append(cell);
    $('#timeOptions > tbody').prepend(topBar);
  });