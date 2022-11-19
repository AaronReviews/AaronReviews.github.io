gsap.registerPlugin(ScrollTrigger);
let el1 = $('blockquote');

function scrollingContent() {
    let tl = gsap.timeline();
    tl.to(el1, {
        scrollTrigger: {
            trigger: el1,
            scrub: 1
        },
        duration: 3,
        opacity: 0
    });
}

export { scrollingContent };