/*
 * -------------------------------------------
 *	$_Randomizer Function
 * -------------------------------------------
 */

function pickRandomProperty(obj) {
	return obj[Math.floor(Math.random() * obj.length)]
}







/*
 * -------------------------------------------
 *	$_Hero/Banner Interaction
 * -------------------------------------------
 */

// Hero Text Data
var heroText = [
	{
		h1: "UX Design Is Distinctly Human",
		p: "Have you ever watched a robot try to make wireframes? It's pretty awful."
	},{
		h1: "Makin' Websites Since the 90's",
		p: "First rule of web design fight club? Don't talk about tables."
	}, {
		h1: "Will Work for Bitcoins",
		p: "AKA: best retirement plan?"
	}, {
		h1: "I'm a UX Designer",
		p: "..but only because all the astronaut jobs were taken."
	}
];

var heroRandom = pickRandomProperty(heroText);
$('.mainHero h1').html(heroRandom.h1);
$('.mainHero p').html(heroRandom.p);

// Jumbotron Image Randomizer
$(function() {
    var images = ['hero_face1.jpg', 'hero_face2.jpg', 'hero_face3.jpg', 'hero_face4.jpg'];
    $('header').css({'background-image': 'url(img/' + images[Math.floor(Math.random() * images.length)] + ')'});
});







/*
 * -------------------------------------------
 *	$_Application Interactions
 * -------------------------------------------
 */

// TODO This disables the application menu.
$('section.navBlocks, .backToMain').hide();