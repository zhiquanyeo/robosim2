

$(function () {

    // Set up the UI elements
    $('#app-state').buttonset();
    $('#code-view').tabs({heightStyle: 'fill'});
    
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

    var editor = ace.edit('code-view-editor');
    editor.setTheme('ace/theme/chrome');
    editor.getSession().setMode("ace/mode/javascript");

    // Set up Blockly
    var blocklyContainer = document.getElementById('code-view-blocks');
    var blocklyCanvas = document.getElementById('blockly-canvas');
    var workspace = Blockly.inject(blocklyCanvas,
        {toolbox: document.getElementById('toolbox')});

});