// priority: 0

console.info("The Desolate Delusion: Client scripts loading!");

onEvent("jei.hide.items", (event) => {
  event.hide("farmersdelight:wheat_dough");
  event.hide("pneumaticcraft:wheat_flour");
});
