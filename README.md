# Online Casino

A web app to play a fun slot machine online.

Technologies

**Front-end:**

Js, Css, Ejs

**Back-end:**

Express + Node.js, Postgres + Sequelize

The project will try to mimic a real "slot machine", so users will "win" or "lose" credits.

Users have to create an account which then will give them access to the casino.

Each "new account" will provide 100 free credits and they can get more by buying them via online payment (credit card).

Whenever a new user is created, his data will be stored in a database table **User:**

- Name (string)
- Lastname (string)
- Email (string)
- Password (string)
- Credits (integer, 100 by default)

When the user clicks on "play", an ajax request will update the credits (reducing them by 5)

if the user wins, a second ajax request will grant the user 50 more credits

In order to render the images that will spin, a json with images will be loaded and a js will take care of the "spining animation"

## Timeline

**Login / sign up - 0.5 day**
