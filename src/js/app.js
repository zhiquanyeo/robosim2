

$(function () {

    // Set up the UI elements
    $('#app-state').buttonset();
    $('#code-view').tabs({
        heightStyle: 'fill',
        activate: function (evt, ui) {
            if (ui.newPanel.attr('id') === 'code-view-blocks') {
                console.log("blocks");
            }
            else if (ui.newPanel.attr('id') === 'code-view-editor') {
                console.log("editor");
            }
        }
    });
    
    $('#sim-view').addClass('hidden');
    
    // Set up behaviors
    $('#select-code-mode').click(function () {
        $('#code-view').removeClass('hidden');
        $('#sim-view').addClass('hidden');
    });
    
    $('#select-sim-mode').click(function () {
        $('#code-view').addClass('hidden');
        $('#sim-view').removeClass('hidden');
    });

    // Set up Editor and Blockly
    var editor = ace.edit('code-view-editor');
    editor.setTheme('ace/theme/chrome');
    editor.getSession().setMode("ace/mode/javascript");

    // Set up Blockly
    var blocklyContainer = document.getElementById('code-view-blocks');
    var blocklyCanvas = document.getElementById('blockly-canvas');
    var workspace = Blockly.inject(blocklyCanvas,
        {toolbox: document.getElementById('toolbox')});

});