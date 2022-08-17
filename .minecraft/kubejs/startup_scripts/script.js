// priority: 0

console.info("Thanks for playing The Desolute Delusion!");

onEvent("item.registry", (event) => {
  // Register new items here
  // event.create('example_item').displayName('Example Item')

  event.create("bilibili_television").rarity("epic");

  event.create("pyro_crystal").rarity("uncommon");
  event.create("hydro_crystal").rarity("uncommon");
  event.create("electro_crystal").rarity("uncommon");
  event.create("cryo_crystal").rarity("uncommon");
  event.create("dendro_crystal").rarity("uncommon");
  event.create("anemo_crystal").rarity("uncommon");
  event.create("geo_crystal").rarity("uncommon");

  event.create("primogem").rarity("rare");
  event.create("intertwined_fate").rarity("rare");
});

onEvent("block.registry", (event) => {
  // Register new blocks here
  // event.create('example_block').material('wood').hardness(1.0).displayName('Example Block')
});
