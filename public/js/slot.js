// class MyClass {
//   constructor(...) {
//     // ...
//   }
//   method1(...) {}
//   method2(...) {}
//   get something(...) {}
//   set something(...) {}
//   static staticMethod(..) {}
//   // ...
// }

class SlotMachine {
  constructor(userId, credits, skin = 'mario', numSlots) {
    this.userId = userId;
    this.credits = credits;
    this.skin = skin;
    const slotSpeeds = [2, 3, 7, 5, 9];

    this.slots = [];
    for (let i = 0; i < numSlots; i++) {
      this.slots.push(new Slot(slotSpeeds[i]));
    }

    this._render();
  }

  //private method
  _render() {
    // render the slot machine
    const slotMachineMarkup = `<div id="slot-machine">${this.slots.map(slot =>
      slot.render()
    )}</div>`;
  }
  _validateCredits() {
    // ajax call to check if user has enough credits.
    // if yes, return true
    // if not, notify the user (render some text on the dom)
    // and return false
  }

  start() {
    if (this._validateCredits()) {
      this.slots.forEach(slot => {
        slot.spin();
      });
    }
  }
}

class Slot {
  constructor(speed) {
    this.speed = speed;
  }

  render() {
    // render an individual slot
  }

  spin() {
    // spin an individual slot
  }
}
