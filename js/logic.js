var gravity;
var rowLength;
var numBoxes;
var label;
var color;
var hoverColor;
var boxID;

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
    $('#boxmkr_form_add').click(function() {
        if (performValidations()) {
            addVisualization();
        }
        // Return false to override default submit behavior
        return false;
    });
    $('#boxmkr_form_export').click(function() {
        if (performValidations()) {
            exportJSON();
        }
        // Return false to override default submit behavior
        return false;
    });
    $('#boxmkr_toggle_advanced_options').click(function() {
        if ($('#advanced_options').is(':visible')) {
            $('#advanced_options').hide('slow');
            $('#boxmkr_toggle_advanced_options').html('Show advanced options');
        } else {
            $('#advanced_options').show('slow');
            $('#boxmkr_toggle_advanced_options').html('Hide advanced options');
        }
        return false;
    });
    $('#boxmkr_toggle_embed_code').click(function() {
        if ($('#embed_code').is(':visible')) {
            $('#embed_code').hide('slow');
            $('#boxmkr_toggle_embed_code').html('Show embed code');
        } else {
            $('#embed_code').show('slow');
            $('#boxmkr_toggle_embed_code').html('Hide embed code');
        }
        return false;
    });
});

function updatePreview() {
    captureInput();
    writeCSS();
    writeJS();
    var html = drawGraphic();
    writeGraphic(html);
    initBoxMkrHovers();
}

function addVisualization() {
    captureInput();
    visualizationHtml += drawGraphic();
}

function captureInput() {
    jsonInput = $('#boxmkr_form_json_input').val();
    if (jsonInput) {
        parseJSON(jsonInput);
    } else {
        numBoxes = $('#boxmkr_form_numBoxes').val();
        rowLength = $('#boxmkr_form_rowLength').val();
        label = $('#boxmkr_form_label').val();
        gravity = $('#boxmkr_form_gravity').val();
        color = $('#boxmkr_form_color').val();
        hoverColor = $('#boxmkr_form_color_hover').val();
        boxDimensions = $('#boxmkr_form_box_dimensions').val();
        boxMargin = $('#boxmkr_form_box_margin').val();
        boxID = $('#boxmkr_form_box_id').val();
    }
}

function createJSON() {
    var json = [];
    json.push(
        {
            "boxmkr": {
                "numBoxes": numBoxes,
                "rowLength": rowLength,
                "label": label,
                "gravity": gravity,
                "color": color,
                "hoverColor": hoverColor,
                "boxDimensions": boxDimensions,
                "boxMargin": boxMargin,
                "boxID": boxID
            }
        }
    );
    $("#boxmkr_embed_json").html("<pre>" + JSON.stringify(json) + "</pre>");
}

function exportJSON() {
    captureInput();
    createJSON();
}

function parseJSON(jsonInput) {
    var obj = $.parseJSON(jsonInput);
    for (var info in obj) {
        console.log(obj[info]);
        if (obj.hasOwnProperty(info)) {
            boxChart = obj[info];
            numBoxes = boxChart.boxDimensions;
            rowLength = boxChart.rowLength;
            label = boxChart.label;
            gravity = boxChart.gravity;
            color = boxChart.color;
            hoverColor = boxChart.hoverColor;
            boxDimensions = boxChart.boxDimensions;
            boxMargin = boxChart.boxMargin;
            boxID = boxChart.boxID;
        }
    }
}

function writeCSS() {
    var html = '';
    html += '<style type="text/css">\n';
    html += '#boxmkr_' + boxID + ' .boxmkr_box { \n';
    html += '\t' + 'float: left;\n';
    html += '\t' + 'background-color: ' + color + ';\n';
    html += '\t' + 'height: ' + boxDimensions + 'px;\n';
    html += '\t' + 'width: ' + boxDimensions + 'px;\n';
    html += '\t' + 'margin-left: ' + boxMargin + 'px;\n';
    html += '\t' + 'margin-bottom: ' + boxMargin + 'px;\n';
    html += '}\n';
    html += '#boxmkr_' + boxID + ' .boxmkr_box.boxmkr_hover { \n';
    html += '\t' + 'background-color: ' + hoverColor + ';\n';
    html += '}\n';
    html += '#boxmkr_' + boxID + ' .boxmkr_box.boxmkr_beginner { \n';
    html += '\t' + 'clear:both;\n';
    html += '}\n';
    html += '#boxmkr_' + boxID + ' .boxmkr_label { \n';
    html += '\t' + 'clear: both;\n';
    html += '\t' + 'font-family: arial,sans-serif;\n';
    html += '\t' + 'font-size: 13px;\n';
    html += '\t' + 'font-weight: bold;\n';
    html += '\t' + 'text-align: center;\n';
    html += '}\n';
    html += '#boxmkr_' + boxID + ' { \n';
    html += '\t' + 'width: ' + parseInt(rowLength) * (parseInt(boxDimensions) + parseInt(boxMargin)) + 'px;\n';
    html += '}\n';
    html += '</style>\n';
    $('#boxmkr_css').html(html);
    $('#boxmkr_embed_css').html('<pre>' + $('<div/>').text(html).html() + '</pre>');
    return html;
}

function writeJS() {
    var html = '';
    html = '<script type="text/javascript">\n';
    html += '$(document).ready(function() {\n';
    html += '\t' + 'initBoxMkrHovers();\n';
    html += '});\n';
    html += initBoxMkrHovers;
    html += '\n' + '</script>';
    $('#boxmkr_embed_js').html('<pre>' + $('<div/>').text(html).html() + '</pre>');
    return html;
}

function writeGraphic(html) {
    $('#boxmkr_embed_html').html('<pre>' + $('<div/>').text(html).html() + '</pre>');
}

function drawGraphic() {
    var html = '';
    html += '<div class="boxmkr_wrapper" id="' + 'boxmkr_' + boxID + '">\n';
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
    html += '</div>\n'; // closes .boxmkr_wrapper
    $('#boxmkr_target').html(html);
    return html;
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
