// priority: 0

console.info("Thanks for playing The Desolute Delusion!");

onEvent("item.registry", (event) => {
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

onEvent("block.modification", (event) => {
  const antiWither = (block) => block.explosionResistance = 2000;

  event.modify("pneumaticcraft:pressure_chamber_glass", antiWither);
  event.modify("pneumaticcraft:pressure_chamber_wall", antiWither);
  event.modify("pneumaticcraft:pressure_chamber_valve", antiWither);
  event.modify("pneumaticcraft:pressure_chamber_interface", antiWither);
});
