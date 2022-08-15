// priority: 0

console.info('Thanks for playing The Desolute Delusion!')

onEvent('item.registry', event => {
  event
    .create('bilibili_television')
    .rarity('epic')
})
