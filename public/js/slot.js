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
      $('.messages')
        .html(`<p>Awww you lost</p> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 470.333 470.333" width="50">
      <path d="M235.167 470.333c129.767 0 235.167-105.4 235.167-235.167S364.933 0 235.167 0 0 105.4 0 235.167s105.4 235.166 235.167 235.166zm0-436.333c110.783 0 201.167 90.383 201.167 201.167S345.95 436.333 235.167 436.333 34 345.95 34 235.167 124.383 34 235.167 34z"/>
      <path d="M164.333 196.633c7.083 0 13.883-2.833 18.983-7.933 10.483-10.483 10.483-27.483 0-37.967-5.1-5.1-11.9-7.933-18.983-7.933s-13.883 2.833-18.983 7.933c-10.483 10.483-10.483 27.483 0 37.967 5.1 5.1 11.9 7.933 18.983 7.933zM299.2 196.633c7.083 0 13.883-2.833 18.983-7.933 10.483-10.483 10.483-27.483 0-37.967-5.1-5.1-11.9-7.933-18.983-7.933s-13.883 2.833-18.983 7.933c-10.483 10.483-10.483 27.483 0 37.967 5.1 5.1 11.616 7.933 18.983 7.933zM157.25 328.667c.567-1.7 11.617-38.25 73.667-38.25 64.033 0 82.167 38.817 82.733 40.233 2.833 6.517 9.067 10.483 15.583 10.483 2.267 0 4.25-.283 6.517-1.417 8.783-3.683 12.75-13.6 9.067-22.1-1.133-2.55-26.35-61.2-114.183-61.2-89.533 0-105.967 61.2-106.533 63.75l16.433 4.25 16.716 4.251z"/>
    </svg>`);
    }
  }

  _notifyUserWon() {
    $('.messages')
      .html(`<p>Wuuuuu you won!!!</p><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 295.996 295.996" width="50">
    <path d="M147.998 0C66.392 0 0 66.392 0 147.998s66.392 147.998 147.998 147.998 147.998-66.392 147.998-147.998S229.605 0 147.998 0zm0 279.996c-36.256 0-69.143-14.696-93.022-38.44-9.536-9.482-17.631-20.41-23.934-32.42C21.442 190.847 16 170.047 16 147.998 16 75.214 75.214 16 147.998 16c34.523 0 65.987 13.328 89.533 35.102 12.208 11.288 22.289 24.844 29.558 39.996 8.27 17.239 12.907 36.538 12.907 56.9 0 72.784-59.214 131.998-131.998 131.998z"/>
    <circle cx="99.666" cy="114.998" r="16"/>
    <circle cx="198.666" cy="114.998" r="16"/>
    <path d="M147.715 229.995c30.954 0 60.619-15.83 77.604-42.113l-13.439-8.684c-15.597 24.135-44.126 37.604-72.693 34.308-22.262-2.567-42.849-15.393-55.072-34.308l-13.438 8.684c14.79 22.889 39.716 38.409 66.676 41.519 3.461.399 6.917.594 10.362.594z"/>
  </svg>`);
    $('.confetti').addClass('show');
    setTimeout(function() {
      $('.confetti').removeClass('show');
    }, 5000);
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
      '<p>Not enough credits to play. Buy more</p> <a href="/credits/buy">here</a>'
    );
  }

  //call this method whenever the user clicks on "start"
  start(win = false) {
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
            s.spin(win);
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

  forceWin() {
    this.start(true);
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
    const newArr = arr.slice(0);
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }

  //here I'm storing all my possible skins that user can change
  getItems(forceWin = false) {
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
    const items = this._shuffle(skins[this.skin]);

    if (forceWin) {
      items.push(skins[this.skin][0]);
    }

    return items;
  }

  //render a single slot
  getSlotMarkup(forceWin = false) {
    //this.slotIcons now gets the randomized images, this way whenever the user first "starts playing", each slot
    //will show a different image
    this.slotIcons = this.getItems(forceWin);

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
  spin(forceWin = false) {
    // repeat the getSlotMarkup, so on each spin the items are re - randomized and re-rendered
    this.getSlotMarkup(forceWin);
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
