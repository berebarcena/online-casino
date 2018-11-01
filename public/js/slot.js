//unique value across the implementations
const SPIN_DURATION = 2000;
const TIME_TO_STOP = 1000;

class SlotMachine {
  constructor(userId, numSlots = 3, skin) {
    this.userId = userId;
    this.spinResults = [];
    this.skin = skin;
    this.numSlots = numSlots;

    //my class is going to be initialized with this methods
    this._setLevel();
    this._createSlots();
    this._render();
  }

  _setLevel() {
    this.creditsToCharge = 5;
    this.creditsToPay = 20;
    if (this.numSlots === 4) {
      this.creditsToCharge = 10;
      this.creditsToPay = 50;
    } else if (this.numSlots === 5) {
      this.creditsToCharge = 20;
      this.creditsToPay = 100;
    }
  }

  _createSlots() {
    //slot speed is assign according to it's index position
    const slotSpeeds = [0.35, 0.55, 0.7, 0.8, 0.9];
    //since my machine has variable num of slots, I create new instances of the Slot dinamically
    this.slots = [];
    for (let i = 0; i < this.numSlots; i++) {
      this.slots.push(new Slot(i, slotSpeeds[i], this.skin));
    }
  }

  reload(skin, numSlots) {
    this.skin = skin;
    this.numSlots = numSlots;
    this._createSlots();
    this._render();
  }

  //now that I have my slots, I can actually render them
  _render() {
    //whatever is inside slotmachine is gonna be erased first and then replaced by empty slots-container
    //to ensure that the images are always re-rendered (otherwise, the user will see the same images as result)
    $('#slotmachine')
      .html('')
      .html('<div class="slots-container">');
    //then, for each of my slots, get the markup
    this.slots.forEach(slot => slot.getSlotMarkup());
  }

  _validateCredits() {
    // ajax call to check if user has enough credits.
    return fetch('/api/credits/charge', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.userId,
        credits: this.creditsToCharge,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        return res;
      });
  }

  _checkIfUserWon() {
    const allFinalValues = this.slots.map(slot => {
      return slot.getFinalValue();
    });
    if (allFinalValues.every((val, i, arr) => val == arr[0])) {
      this._notifyUserWon();
      this._payUserWhoWon();
    } else {
      $('.messages').html('Boo you whore');
    }
  }

  _notifyUserWon() {
    $('.messages').html('Wuuuuu you won!!');
  }

  _payUserWhoWon() {
    return fetch('/api/credits/pay', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.userId,
        credits: this.creditsToPay,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        $('.current-credits').html(res.credits);
      });
  }

  _notifyNotEnoughCredits() {
    $('.messages').html(
      'Not enough credits to play :( Buy more <a href="/credits/buy">here</a>'
    );
  }

  //call this method whenever the user clicks on "start"
  start() {
    //first check if user has enough money to be able to play
    this._validateCredits()
      .then(res => {
        if (res.error) {
          this._notifyNotEnoughCredits();
        } else {
          $('.messages').html('');
          $('.current-credits').html(res.credits);
          $('.slots-container').html('');
          let slotsThatFinished = 0;

          this.slots.forEach(s => {
            s.spin();
            setTimeout(() => {
              s.stop();
              slotsThatFinished += 1;

              if (slotsThatFinished === this.slots.length) {
                setTimeout(() => {
                  this._checkIfUserWon();
                }, TIME_TO_STOP);
              }
            }, SPIN_DURATION);
          });
        }
      })
      .catch(err => console.log);
  }
}

//each column in my slot machine
class Slot {
  constructor(idx, speed = 0.7, skin) {
    this.idx = idx;
    this.skin = skin;
    this.slotIcons = this.getItems();
    this.tl = null;
    this.speed = speed;
    this.started = false;
    this.distanceToScroll = 0;
  }

  //helper method to shuffle arrays
  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  //here I'm storing all my possible skins that user can change
  getItems(skin) {
    const skins = {
      mario: ['star', 'mario', 'flower', 'coin', 'redToad', 'greenToad'],
      pokemon: [
        'bulbasaur',
        'charmander',
        'jigglypuff',
        'pikachu',
        'pokeball',
        'squirtle',
      ],
      pusheen: ['donut', 'sherlock', 'wave', 'ramen', 'exercise', 'ride'],
    };
    //shuffling the images
    return this._shuffle(skins[this.skin]);
  }

  //render a single slot
  getSlotMarkup() {
    //this.slotIcons now gets the randomized images, this way whenever the user first "starts playing", each slot
    //will show a different image
    this.slotIcons = this.getItems();

    // ---------Hack to ensure we win for testing------------//
    //this.slotIcons.push('mario');

    //create each slot with the images in slotIcons
    const singleSlot = `<div class="slot ${this.skin}">
    <div class="slot-wrapper slot-wrapper-${this.idx}">
    ${this.slotIcons
      .map(el => `<img src="/images/${this.skin}/${el}.jpg" class="item"/>`)
      .join('')}
      </div>
    </div>`;
    //add each slot wrapper + its elements at the end of whatever exist in .slot-container
    $('.slots-container').append(singleSlot);
  }

  //each slot has its own "spin animation"
  spin() {
    // repeat the getSlotMarkup, so on each spin the items are re - randomized and re-rendered
    this.getSlotMarkup();
    //specifics for the timeline to work:
    //each wrapper is identified with its index, otherwise the animation goes crazy if the same timeline is used in
    //several items
    const $wrapper = $(`.slot-wrapper-${this.idx}`);
    const oneSlot = $(`.slot-wrapper-${this.idx} > img`)[0];
    const itemHeight = $(oneSlot).height();
    this.distanceToScroll = $wrapper.height() - itemHeight;
    this.tl = new TimelineMax({ repeat: -1 });

    this.tl
      .to(`.slot-wrapper-${this.idx}`, this.speed, {
        y: -this.distanceToScroll,
        ease: Linear.easeNone,
      })
      .set(`.slot-wrapper-${this.idx}`, { y: 0 });
  }

  //stop the spinning
  stop() {
    this.tl.kill();
    TweenLite.to(`.slot-wrapper-${this.idx}`, TIME_TO_STOP / 1000, {
      y: -this.distanceToScroll,
      ease: Linear.easeNone,
    });
    this.tl = null;
  }

  getFinalValue() {
    //check if the user won or not, in this case the final value will always be the last item in the array
    return this.slotIcons[this.slotIcons.length - 1];
  }
}
