let tl = anime.timeline({
  easing: "easeOutExpo",
  duration: 550,
});

tl.add({
  targets: "section div",
  scaleX: "1",
  backgroundColor: "rgb(0, 0, 0)",
  delay: anime.stagger(100),
})
  .add({
    targets: "section div",
    scaleX: ".975",
    backgroundColor: "rgb(180 , 214, 239)",
    delay: anime.stagger(100),
  })
  .add({
    targets: "section div",
    scaleX: ".90",
    backgroundColor: "rgb(159, 171, 181)",
  })
  .add(
    {
      targets: "h1",
      translateY: "-50%",
      opacity: 1,
      duration: 5000,
    },
    "-=1000"
  )
  .add(
    {
      targets: "a",
      translateY: "550%",
      opacity: 1,
      duration: 5000,
    },
    "-=4000"
  );

const button = document.querySelector("a");
button.focus();
const winner = localStorage.getItem("winner");
if (winner === null) {
  document.querySelector("h1").innerHTML = `You didn't finish the game`;
  button.innerHTML = `Start again`;
} else {
  document.querySelector("h1").innerHTML = `The winner is ${winner}`;
}
