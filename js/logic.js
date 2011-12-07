var gravity;
var rowLength;
var numBoxes;
var label;
var color;
var hoverColor;

$(document).ready(function() {
    updatePreview();
    $('#boxmkr_form_submit').click(updatePreview);
});

function updatePreview() {
    captureInput();
    writeCSS();
    writeJS();
    drawGraphic();
    initBoxMkrHovers();
    // Return false to override default submit behavior
    return false;
}

function captureInput() {
    numBoxes = $('#boxmkr_form_numBoxes').val();
    rowLength = $('#boxmkr_form_rowLength').val();
    label = $('#boxmkr_form_label').val();
    gravity = $('#boxmkr_form_gravity').val();
    color = $('#boxmkr_form_color').val();
    hoverColor = $('#boxmkr_form_color_hover').val();
    boxDimensions = $('#boxmkr_form_box_dimensions').val();
    boxMargin = $('#boxmkr_form_box_margin').val();
}

function writeCSS() {
    var html = '';
    html += '<style type="text/css">\n';
    html += '.boxmkr_box { \n';
    html += '\t' + 'float: left;\n';
    html += '\t' + 'background-color: ' + color + ';\n';
    html += '\t' + 'height: ' + boxDimensions + 'px;\n';
    html += '\t' + 'width: ' + boxDimensions + 'px;\n';
    html += '\t' + 'margin-left: ' + boxMargin + 'px;\n';
    html += '\t' + 'margin-bottom: ' + boxMargin + 'px;\n';
    html += '}\n';
    html += '.boxmkr_box.boxmkr_hover { \n';
    html += '\t' + 'background-color: ' + hoverColor + ';\n';
    html += '}\n';
    html += '.boxmkr_box.boxmkr_beginner { \n';
    html += '\t' + 'clear:both;\n';
    html += '}\n';
    html += '.boxmkr_label { \n';
    html += '\t' + 'clear: both;\n';
    html += '\t' + 'font-family: arial,sans-serif;\n';
    html += '\t' + 'font-size: 13px;\n';
    html += '\t' + 'font-weight: bold;\n';
    html += '\t' + 'text-align: center;\n';
    html += '}\n';
    html += '.boxmkr_wrapper { \n';
    html += '\t' + 'width: ' + parseInt(rowLength) * (parseInt(boxDimensions) + parseInt(boxMargin)) + 'px;\n';
    html += '}\n';
    html += '</style>\n';
    console.log(html);
    $('#boxmkr_css').html(html);
    $('#boxmkr_embed').html('<pre>' + $('<div/>').text(html).html() + '</pre>');
}

function writeJS() {
    var html = '';
    html = '<script type="text/javascript">\n';
    html += '$(document).ready(function() {\n';
    html += '\t' + 'initBoxMkrHovers();\n';
    html += '});\n';
    html += initBoxMkrHovers;
    html += '\n' + '</script>';
    console.log(html);
    $('#boxmkr_embed').append('<pre>' + $('<div/>').text(html).html() + '</pre>');
}

function drawGraphic() {
    var html = '';
    html += '<div class="boxmkr_wrapper">\n';
    var boxesLeft = numBoxes;
    var numRows = Math.floor(numBoxes / rowLength);
    var numStragglers = numBoxes % rowLength;
    
    if (gravity == 'upper-left') {
        html += writeFullRows(numRows, rowLength);
        html += writeStragglers(numStragglers);
    } else if (gravity == 'lower-left') {
        html += writeStragglers(numStragglers);
        html += writeFullRows(numRows, rowLength);
    }
    
    html += '\t<div class="boxmkr_label">' + label + '</div>\n';
    html += '</div>'; // closes .boxmkr_wrapper
    $('#boxmkr_target').html(html);
    $('#boxmkr_embed').append('<pre>' + $('<div/>').text(html).html() + '</pre>');
}

function writeFullRows(numRows, rowLength) {
    var html = '';
    if (numRows > 0) {
        for (var i = 0; i < numRows; i++) {
            // Write the leading box
            html += '\t<div class="boxmkr_box boxmkr_beginner"></div>\n';
            // Since we wrote the leading box, skip one
            for (var j = 0; j < rowLength - 1; j++) {
                html += '\t<div class="boxmkr_box"></div>\n';
            }
        }
    }
    return html;
}

function writeStragglers(numStragglers) {
    var html = '';
    if (numStragglers > 0) {
        var html = '';
        html += '\t<div class="boxmkr_box boxmkr_beginner"></div>\n';
        for (var i = 0; i < numStragglers - 1; i++) {
            html += '\t<div class="boxmkr_box"></div>\n';
        }
    }
    return html;
}

function initBoxMkrHovers() {
    $('.boxmkr_box').hover(
     function() {
            $(this).addClass('boxmkr_hover');
        },
        function() {
            $(this).removeClass('boxmkr_hover');
        }
    );
}