var gravity;
var rowLength;
var numBoxes;
var label;
var color;
var hoverColor;
var boxID;

var errorElement = "#error";

function displayError(description) {
    var message = "<div class=\"alert-message error\">"
            +  "<p><strong>Uh oh!</strong> " + description + "</p></div>";
    $(errorElement).html(message).show("fast");
}

function initUI() {
    $(errorElement).hide();
    $("#colorpicker").farbtastic("#boxmkr_form_color");
    $("#hovercolorpicker").farbtastic("#boxmkr_form_color_hover");
    $('#colorpicker').hide();
    $('#hovercolorpicker').hide();
}

function initEventListeners() {
     $('#boxmkr_form_submit').click(function() {
        if (performValidations()) {
            updatePreview();
        } else {
            displayError("There is a problem with your input.");
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
    
    $('#boxmkr_form_color').click(function() {
        $('#colorpicker').toggle('slow');
    });
    $('#boxmkr_form_color_hover').click(function() {
        $('#hovercolorpicker').toggle('slow');
    });

}

//var input;
//var chart;

$(document).ready(function() {

    initUI();
    var input = new Input();
    var chart = new Chart();
    chart.render();

    initValidation();
    updatePreview();
    initEventListeners();
});

function updatePreview() {
    var html = drawGraphic();
    writeGraphic(html);
    initBoxMkrHovers();
}

function addVisualization() {
    captureInput();
    visualizationHtml += drawGraphic();
}

function Input() {
    return this;
}

Input.prototype.retrieveChartOptions = function() {
    var numBoxes = $('#boxmkr_form_numBoxes').val(); 
    //TODO numBoxes -> numElements everywhere
    var rowLength = $('#boxmkr_form_rowLength').val();
    var label = $('#boxmkr_form_label').val();
    var gravity = $('#boxmkr_form_gravity').val();
    var color = $('#boxmkr_form_color').val();
    //var hoverColor = $('#boxmkr_form_color_hover').val();
    //var boxDimensions = $('#boxmkr_form_box_dimensions').val();
    //var boxMargin = $('#boxmkr_form_box_margin').val();
    //var boxID = $('#boxmkr_form_box_id').val();

    var options = {
        title: label,
        color: color,
        rowLength: rowLength,
        numItems: numBoxes,
    };
    return options;
}

Input.prototype.validateChartOptions = function(options) {
    // TODO
    return options;
}

// TODO make this static (or whatever is proper in javascript)
var num = 0;

function Box() {
    this.num = ++num;
    this.color = "#A77EE4";
    this.data = {
        name: "Kevin Schaul",
        school: "University of Minnesota"
    };
    return this;
}
// TODO are these necessary? if so, add for Chart, too
Box.prototype.color = "Color";
Box.prototype.data = "Data";

Box.prototype.setData = function(dataKey, dataValue) {
    this.data[dataKey] = dataValue;
    return dataValue;
}

Box.prototype.getData = function(dataKey) {
    return this.data[dataKey];
}

function Chart(numItems) {
    this.type = "box";
    this.title = "Title";
    this.color = "#A77EE4";
    this.rowLength = 10;
    this.numItems = numItems;
    this.element = $("#chart");
    this.items = [];
    for (var i = 0; i < this.numItems; i++) {
        this.items[i] = new Box();
    }
    return this;
}

Chart.prototype.render = function() {
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (i % this.rowLength === 0) {
            $(this.element).append("<div class=\"box\" style=\"background-color:" + item.color + ";clear:both;\"></div>");
        } else {
            $(this.element).append("<div class=\"box\" style=\"background-color:" + item.color + ";\"></div>");
        }
    }
    return this;
}


function writeGraphic(html) {
    $('#boxmkr_embed_html').html('<pre>' + $('<div/>').text(html).html()
        + '</pre>');
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
        validateNum(0, 1000, $('#boxmkr_form_numBoxes').val(),
                '#boxmkr_form_numBoxes');
    });
    $('#boxmkr_form_rowLength').change(function() {
        clearPreviewMessages();
        validateNum(0, 100, $('#boxmkr_form_rowLength').val(),
                '#boxmkr_form_rowLength');
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
        validateHex($('#boxmkr_form_color_hover').val(),
                '#boxmkr_form_color_hover');
    });
    $('#boxmkr_form_box_dimensions').change(function() {
        clearPreviewMessages();
        validateNum(0, 100, $('#boxmkr_form_box_dimensions').val(),
                '#boxmkr_form_box_dimensions');
    });
   $('#boxmkr_form_box_margin').change(function() {
       clearPreviewMessages();
        validateNum(0, 25, $('#boxmkr_form_box_margin').val(),
                '#boxmkr_form_box_margin');
    });
}

function performValidations() {
    valid = true;
    if (valid && !validateNum(0, 1000, $('#boxmkr_form_numBoxes').val(),
                '#boxmkr_form_numBoxes')) {
        valid = false;
    }
    if (valid && !validateNum(0, 100, $('#boxmkr_form_rowLength').val(),
                '#boxmkr_form_rowLength')) {
        valid = false;
    }
    if (valid && !validateLabel($('#boxmkr_form_label').val(),
                '#boxmkr_form_label')) {
        valid = false;
    }
    if (valid && !validateHex($('#boxmkr_form_color').val(),
                '#boxmkr_form_color')) {
        valid = false;
    }
    if (valid && !validateHex($('#boxmkr_form_color_hover').val(),
                '#boxmkr_form_color_hover')) {
        valid = false;
    }
    if (valid && !validateHex($('#boxmkr_form_color_hover').val(),
                '#boxmkr_form_color_hover')) {
        valid = false;
    }
    if (valid && !validateNum(0, 100, $('#boxmkr_form_box_dimensions').val(),
                '#boxmkr_form_box_dimensions')) {
        valid = false;
    }
    if (valid && !validateNum(0, 25, $('#boxmkr_form_box_margin').val(),
                '#boxmkr_form_box_margin')) {
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
