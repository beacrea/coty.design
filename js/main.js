// Jumbotron Image Randomizer
$(function() {
    var images = ['hero_face1.jpg', 'hero_face2.jpg'];
    $('header').css({'background-image': 'url(img/' + images[Math.floor(Math.random() * images.length)] + ')'});
});