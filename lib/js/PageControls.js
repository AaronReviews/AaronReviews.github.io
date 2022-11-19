import * as SCENE from 'addons/SceneRender.js';
import * as CONTENT from 'addons/Content.js';
import * as SCROLL from 'addons/ScrollTrigger.js';

const content = $('.content');
const title = $('.title');
const header = $('.header');
const details = $('.details');
const mainBox = $('.pageText');
const reviewText = $('blockquote');

var rpos = 0;

function loadPage() {
    SCENE.init();
    SCENE.animate();
    setTimeout(start, 5000);
}

function start() {
    document.body.appendChild(SCENE.container);

    content.show();
    mainBox.hide();
    $("#loader").hide(500);

    let tlstart = gsap.timeline();
    tlstart.to([SCENE.renderer.domElement, SCENE.container], { duration: 1.5, opacity: 1 });
    tlstart.from([SCENE.rearLight, SCENE.sideLight, SCENE.frontLight, SCENE.distLight, SCENE.spotLight, SCENE.backLight], { duration: 2, power: 0, stagger: 0.3, delay: -1.5 });
    tlstart.from([title, mainBox], { duration: 1.5, opacity: 0, y: "-50", ease: 'back', stagger: 0.3, delay: -1 });
    tlstart.to(header, { duration: 1.5, letterSpacing: -4, ease: 'back', autoRound: false });
    tlstart.to(title, { duration: 1, x: -225, delay: -1.2 });
    tlstart.to(details, { duration: 1, display: 'inline-block', opacity: 1, x: 5, delay: -0.5 });

    showReviews();
    setInterval(showReviews, 7000);
}

function onWindowResize() {
    SCENE.camera.aspect = window.innerWidth / window.innerHeight;
    SCENE.camera.updateProjectionMatrix();
    SCENE.renderer.setSize(window.innerWidth, window.innerHeight);
}

function showReviews() {
    reviewText.html(CONTENT.reviews[rpos]["comment"]);
    mainBox.fadeIn("slow");
    setTimeout(() => { mainBox.fadeOut("slow"); }, 6000);

    rpos += 1;
    if (rpos >= CONTENT.reviews.length) {
        rpos = 0;
    }
}

jQuery.fx.speeds["slow"] = 600;
gsap.to("#loader", { duration: 1, opacity: 1 });
window.addEventListener('resize', onWindowResize);
document.onLoad = loadPage();