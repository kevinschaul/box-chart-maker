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
    this.element = $("body");
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
