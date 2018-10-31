$(function() {
  const marioMachine = new SlotMachine(2, 3, 'mario');

  $('#play').on('click', function() {
    marioMachine.start();
    // if (!this.started) {
    //   this.started = true;
    //   $(this).html('stop');

    // } else {
    //   this.started = false;
    //   $(this).text('spin');
    // }
  });
});
