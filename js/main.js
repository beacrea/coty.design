// Randomizer Function
function pickRandomProperty(obj) {
	return obj[Math.floor(Math.random() * obj.length)]
}

// Hero Text Data
var heroText = [
	{ 
		h1: "UX Design Is Distinctly Human",
		p: "Have you ever watched a robot try to use photoshop? It's pretty awful."
	}, {
		h1: "Did You Refresh the Page?",
		p: "Don't be a weirdo. Shouldn't you be working anyway?"
	}, {
		h1: "Life Should Be Fun, Right?",
		p: "If you answered yes, we totally just became besties."
	}, {
		h1: "I Totally Should A/B Test This",
		p: "Future-Me and Science thank you for participating in this refreshing header."
	}, {
		h1: "Makin' Websites Since the 90's",
		p: "First rule of web design fight club? Don't talk about tables."
	}, {
		h1: "Will Work for Bitcoins",
		p: "Likely the world's worst retirement plan."
	}, {
		h1: "I'm a UX Designer",
		p: "..because all the astronaut jobs were taken."
	}
];

// Hero Image Data
var heroImgs = ['hero_face1.jpg', 'hero_face2.jpg'];

// Hero Random Content Write
var heroRandom = pickRandomProperty(heroText);
$('.mainHero h1').html(heroRandom.h1);
$('.mainHero p').html(heroRandom.p);
$('header').css({'background-image': 'url(img/' + pickRandomProperty(heroImgs) + ')'});
