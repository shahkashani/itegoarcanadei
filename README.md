# I Tego Arcana Dei

![Flavortown Fellowship](https://www.itegoarcanadei.com/itegoarcanadei.webp)

Every internet mystery is backed by some (bad) code, and this one here is no exception!

While nothing can ever recapture the experience, perhaps this can act as a keepsake or a jumping-off point for someone.

And don't worry, there's some more documentation coming!

## Dependencies

You'll need to have the following things installed:

- `nvm` or `node` v18 or later
- `redis`
- `yarn`

### `nvm`

If you already have `node` v18 or later installed, feel free to skip this step, but `nvm` (Node Version Manager) is handy because it allows you to easily switch between versions of `node`.

To install (pick one or the other):

1. `nvm` installation guides can be found here: https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating
2. `node` instructions here: https://nodejs.org/en/download

### `redis`

All communication between the cities happens through `redis`, a very simple database.

Installation instructions can be found here: https://redis.io/docs/install/install-redis/

### `yarn`

`yarn` allows us to download all the other utilities used to create this project.

Once you have `nvm` or `node` installed, in the `itegoarcanadei` root folder, run:

- `nvm i` (you can skip this if you're already on node 18 or later)
- `npm install --global yarn`

That's it.

## Setup

To get things up and running, run the following commands in your Terminal:

1. `git clone https://github.com/shahkashani/itegoarcanadei.git`
2. `cd itegoarcanadei`
3. `nvm i` (to switch to the correct version of node)
4. `yarn` (to download dependencies)

## Entering the land

To run all the cities at once:

1. `cd itegoarcanadei`
2. `yarn build-all` (this will take about a lifetime to complete)
3. `yarn start` (this will output the URL for each city)

## Entering individual cities

If you want to run the cities individually:

1. `cd cities/<cityname>` e.g. `cd cities/adelma`
2. `yarn build`
3. `PORT=4000 yarn start` (or whatever port number you prefer)
4. Navigate to `http://localhost:4000` in your browser

### Entering individual cities in development mode

In development mode, every time you change a line of code, the city will recompile and automatically update to show your changes.

1. `cd cities/<cityname>` e.g. `cd cities/adelma`
2. `yarn dev`
3. Navigate to `http://localhost:3000` in your browser

Some notes:

1. By default each city runs on port `3000`, so if you leave this as-is, you'll need to CTRL+C out of the city before running another one
2. Some cities will have various things you can configure, like the passwords to enter them. These variables live in the `.env.local` files in the cities where this is relevant. You can override them by editing this file, or by creating a similar file called `.env.production` with the same variables
