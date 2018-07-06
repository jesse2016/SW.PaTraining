function falseInfo(a) {
    this.show = function () {
        document.getElementById(a).style.display = "";
    };
    this.hide = function () {
        document.getElementById(a).style.display = "none";
    }
}
var _falseInfo = new falseInfo("false");
_falseInfo.hide();

document.getElementById("user").onfocus = function () {
    _falseInfo.show();
}