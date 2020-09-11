let tl = anime.timeline({
    easing: 'easeOutExpo',
    duration: 550
});

tl.add({
    targets: 'section div',
    width: '100%',
    backgroundColor: 'rgb(0, 0, 0)',
    delay: anime.stagger(100) // increase delay by 100ms for each elements.
})
    .add({
        targets: 'section div',
        width: '90%',
        backgroundColor: 'rgb(159, 171, 181)'
    })
    .add({
        targets: 'h1',
        top: '20%',
        opacity: 1,
        duration: 5000,
    }, '-=1000')
    .add({
        targets: 'a',
        top: '50%',
        opacity: 1,
        duration: 5000,
    }, '-=4000')

const winner = localStorage.getItem('winner')
document.querySelector('h1').innerHTML = `The winner is ${winner}`;


