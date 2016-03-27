

$(function () {
    
    // Set up the UI elements
    $('#app-state').buttonset();
    $('#code-view').tabs();
    
    $('#sim-view').addClass('hidden');
    
    // Set up toggles
    $('#select-code-mode').click(function () {
        $('#code-view').removeClass('hidden');
        $('#sim-view').addClass('hidden');
    });
    
    $('#select-sim-mode').click(function () {
        $('#code-view').addClass('hidden');
        $('#sim-view').removeClass('hidden');
    });
});