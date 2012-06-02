var gravity;
var rowLength;
var numBoxes;
var label;
var color;
var hoverColor;
var boxID;

var errorElement = "#error";

function displayError(description) {
    // TODO move this function
    var message = "<div class=\"alert-message error\">"
            +  "<p><strong>Uh oh!</strong> " + description + "</p></div>";
    $(errorElement).html(message).show("fast");
}

function initUI() {
    // TODO move this function 
    $(errorElement).hide();
    $("#colorpicker").farbtastic("#boxmkr_form_color");
    $("#hovercolorpicker").farbtastic("#boxmkr_form_color_hover");
    $('#colorpicker').hide();
    $('#hovercolorpicker').hide();
}

var bcm;

$(document).ready(function() {

    initUI(); // TODO move this.
    window.bcm = new BCM();
    window.bcm.init();
});

function BCM() {
    /* *
    /* Main controller for all things Box Chart Maker
    /* Instantiate other objects here
     */

    this.input = new Input();
    this.output = new Output();
}

BCM.prototype.init = function() {
    /* *
    /* Initialize here instead of in BCM() so that we can reference the `bcm`
    /* instance.
     */

     this.input.render();
     this.output.showHtml();
}

function updatePreview() {
    var html = drawGraphic();
    writeGraphic(html);
    initBoxMkrHovers();
}

function addVisualization() {
    captureInput();
    visualizationHtml += drawGraphic();
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

function Chart() {
    this.activeInput = false;
    this.type = "box";
    this.title = "Data title";
    this.color = "#A77EE4";
    this.rowLength = 10;
    this.numItems = 36;
    this.element = $("#chart");
    this.items = [];
    return this;
}

Chart.prototype.setOption = function(option, value) {
    this[option] = value;
    return this;
}

Chart.prototype.render = function() {
    $(this.element).append("<h3 class=\"chartTitle\">" + this.title + "</h3>\n");
    this.items = [];
    for (var i = 0; i < this.numItems; i++) {
        this.items[i] = new Box();
    }
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (i % this.rowLength === 0) {
            $(this.element).append("<div class=\"box\""
                    + " style=\"background-color:" + item.color 
                    + ";clear:both;\"></div>\n");
        } else {
            $(this.element).append("<div class=\"box\""
                    + " style=\"background-color:" + item.color 
                    + ";\"></div>\n");
        }
    }
    return this;
}

function Input() {
    this.chart = new Array(new Chart());
    this.chart[0].activeInput = true;
    this.valid = true;
    var that = this;
    $('#boxmkr_form_submit').click(function() {
         if (that.validateInput()) {
             that.setActiveChartOptions();
             that.render();
         } else {
             displayError("There is a problem with your input.");
         }
        return false;
    });
    $('#boxmkr_form_add').click(function() {
        if (performValidations()) {
            addVisualization();
        }
        return false;
    });
    $('#boxmkr_form_export').click(function() {
        if (performValidations()) {
            exportJSON();
        }
        return false;
    });
    $('#boxmkr_toggle_advanced_options').click(function() {
        if ($('#advanced_options').is(':visible')) { //TODO change these to jQuery toggles
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
    return this;
}

Input.prototype.render = function() {
    $(this.chart[0].element).empty(); //TODO make element a part of Input
    for (var i = 0; i < this.chart.length; i++) {
        this.chart[i].render();
    }
    return this;
}

Input.prototype.setActiveChartOptions = function() {
    var activeChart;
    for (var i = 0; i < this.chart.length; i++) {
        if (this.chart[i].activeInput) {
            activeChart = this.chart[i];
        }
    }
    activeChart.setOption("numItems", $("#boxmkr_form_numBoxes").val());
    activeChart.setOption("rowLength", $("#boxmkr_form_rowLength").val());
    activeChart.setOption("title", $("#boxmkr_form_label").val());
    activeChart.setOption("gravity", $("#boxmkr_form_gravity").val());
    activeChart.setOption("color", $("#boxmkr_form_color").val());
    return this;
}

Input.prototype.validateInput = function() {
    // TODO
    this.valid = true;
    return this;
}

Input.prototype.initEventListeners = function() {
     $('#boxmkr_form_submit').click(function() {
         if (input.validateChartOptions()) {
             console.log("valid");
             this.render();
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
        // Return false to override default submit behavior
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
        // Return false to override default submit behavior
        return false;
    });
    
    $('#boxmkr_form_color').click(function() {
        $('#colorpicker').toggle('slow');
    });
    $('#boxmkr_form_color_hover').click(function() {
        $('#hovercolorpicker').toggle('slow');
    });
    return this;
}



function Output() {
    this.element = $("#output");
    return this;
}

Output.prototype.showHtml = function() {
    // TODO don't use input globally here
    $(this.element).html("<pre>" + $("<div/>").text($(window.bcm.input.chart[0].element).html()).html() + "</pre>");
    return this;
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
