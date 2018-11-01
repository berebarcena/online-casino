$(function() {
  let numSlots = 3;
  let skin = 'mario';
  const userId = parseInt($('#userId').val());

  let slotMachine1 = new SlotMachine(userId, numSlots, skin);

  $('#play').on('click', function() {
    slotMachine1.start();
  });
  $('#test').on('click', function() {
    numSlots = 4;
    slotMachine1.reload(skin, numSlots);
    slotMachine1._setLevel();
  });
});
