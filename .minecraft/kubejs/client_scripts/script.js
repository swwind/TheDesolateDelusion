// priority: 0

console.info("The Desolate Delusion: Client scripts loading!");

onEvent("jei.hide.items", (event) => {
  // Hide items in JEI here
  // event.hide('minecraft:cobblestone')

  event.hide("farmersdelight:wheat_dough");
});
