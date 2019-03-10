"use strict";
addEventListener("DOMContentLoaded", function () {
    var images = document.querySelectorAll(".option-button");
    images.forEach(function (image) {
        image.ondragstart = function () { return false; };
    });
});
