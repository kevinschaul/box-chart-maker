var gravity;
var rowLength;
var numBoxes;
var label;
var color;
var hoverColor;

$(document).ready(function() {
    initValidation();
    updatePreview();
    $('#boxmkr_form_submit').click(function() {
        if (performValidations()) {
            updatePreview();
        } else {
            var html = '';
            html += '<div class="alert-message error">\n';
            html += '\t' + '<p><strong>Uh oh!</strong> There is a problem with your input.</p>\n';
            html += '</div>\n';
            $('#boxmkr_preview_message_area').html(html).show('fast');
        }
        // Return false to override default submit behavior
        return false;
    });
});

function updatePreview() {
    captureInput();
    writeCSS();
    writeJS();
    drawGraphic();
    initBoxMkrHovers();
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

function initValidation() {
    $('#boxmkr_form_numBoxes').change(function() {
        clearPreviewMessages();
        validateNum(0, 1000, $('#boxmkr_form_numBoxes').val(), '#boxmkr_form_numBoxes');
    });
    $('#boxmkr_form_rowLength').change(function() {
        clearPreviewMessages();
        validateNum(0, 100, $('#boxmkr_form_rowLength').val(), '#boxmkr_form_rowLength');
    });
    $('#boxmkr_form_label').change(function() {
        clearPreviewMessages();
        validateLabel($('#boxmkr_form_label').val(), '#boxmkr_form_label');
    });
    $('#boxmkr_form_color').change(function() {
        clearPreviewMessages();
        validateHex($('#boxmkr_form_color').val(), '#boxmkr_form_color');
    });
    $('#boxmkr_form_color_hover').change(function() {
        clearPreviewMessages();
        validateHex($('#boxmkr_form_color_hover').val(), '#boxmkr_form_color_hover');
    });
    $('#boxmkr_form_box_dimensions').change(function() {
        clearPreviewMessages();
        validateNum(0, 100, $('#boxmkr_form_box_dimensions').val(), '#boxmkr_form_box_dimensions');
    });
   $('#boxmkr_form_box_margin').change(function() {
       clearPreviewMessages();
        validateNum(0, 25, $('#boxmkr_form_box_margin').val(), '#boxmkr_form_box_margin');
    });
}

function performValidations() {
    valid = true;
    if (valid && !validateNum(0, 1000, $('#boxmkr_form_numBoxes').val(), '#boxmkr_form_numBoxes')) {
        valid = false;
    }
    if (valid && !validateNum(0, 100, $('#boxmkr_form_rowLength').val(), '#boxmkr_form_rowLength')) {
        valid = false;
    }
    if (valid && !validateLabel($('#boxmkr_form_label').val(), '#boxmkr_form_label')) {
        valid = false;
    }
    if (valid && !validateHex($('#boxmkr_form_color').val(), '#boxmkr_form_color')) {
        valid = false;
    }
    if (valid && !validateHex($('#boxmkr_form_color_hover').val(), '#boxmkr_form_color_hover')) {
        valid = false;
    }
    if (valid && !validateHex($('#boxmkr_form_color_hover').val(), '#boxmkr_form_color_hover')) {
        valid = false;
    }
    if (valid && !validateNum(0, 100, $('#boxmkr_form_box_dimensions').val(), '#boxmkr_form_box_dimensions')) {
        valid = false;
    }
    if (valid && !validateNum(0, 25, $('#boxmkr_form_box_margin').val(), '#boxmkr_form_box_margin')) {
        valid = false;
    }
    return valid;
}

function validateNum(min, max, value, selector) {
    clearInputFeedback(selector);
    var re = /^[0-9]+$/;
    if (value >= min && value <= max && re.exec(value)) {
        //addInputFeedback(selector, 'success');
        return true;
    } else {
        addInputFeedback(selector, 'error');
        return false;
    }
}

function validateHex(value, selector) {
    clearInputFeedback(selector);
    var re = /^#([A-Za-z0-9]{6})$/;
    if (re.exec(value)) {
        //addInputFeedback(selector, 'success');
        return true;
    } else {
        addInputFeedback(selector, 'error');
        return false;
    }
}

function validateLabel(value, selector) {
    clearInputFeedback(selector);
    var re = /^[^<>]*$/;
    if (re.exec(value)) {
        //addInputFeedback(selector, 'success');
        return true;
    } else {
        addInputFeedback(selector, 'error');
        return false;
    }
}

function clearInputFeedback(selector) {
    $(selector).parents('.clearfix.boxmkr_input').removeClass('error').removeClass('success');
}

function addInputFeedback(selector, feedback) {
    $(selector).parents('.clearfix.boxmkr_input').addClass(feedback);
}

function clearPreviewMessages() {
    $('#boxmkr_preview_message_area').hide('fast');
}