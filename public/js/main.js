$(function() {
  let numSlots = 3;
  let skin = 'mario';
  const userId = parseInt($('#userId').val());

  let slotMachine1 = new SlotMachine(userId, numSlots, skin);

  $('#play').on('click', function() {
    slotMachine1.start();
  });

  $('.trigger-modal').on('click', function() {
    if ($(this).data('target') === 'skin') {
      $('.skin').addClass('open');
    } else {
      $('.bet').addClass('open');
    }
  });

  $('.settings').on('click', function() {
    if ($(this).data('skin')) {
      skin = $(this).data('skin');
      slotMachine1.reload(skin, numSlots);
      $('.skin').removeClass('open');
    } else {
      numSlots = parseInt($(this).data('level'));
      slotMachine1.reload(skin, numSlots);
      slotMachine1._setLevel();
      $('.bet').removeClass('open');
    }
  });

  $('.close').on('click', function() {
    $('.modal').removeClass('open');
  });

  $('#win').on('click', function() {
    slotMachine1.forceWin();
  });

  window.forceWin = function() {
    $('#win').show();
  };
});
