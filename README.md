🔥 ViralityTest
---

A game that tests your ability to estimate how viral a Reddit post was.

Players are shown a Reddit post’s title (and optionally its thumbnail or subreddit) and must guess how many upvotes it received. After submitting a guess, the game reveals the real score and awards points based on accuracy.

🎮 Gameplay

A random post is fetched from Reddit (via Reddit’s API).

The player is shown the post title (and optionally subreddit / thumbnail depending on difficulty).

The player makes a guess at how many upvotes it received.

The true score is revealed.

Points are awarded based on closeness of the guess.

The game starts by:
1. User selects either a popular subreddit on the home page (put three top ones) or types a custom one.
2. Five posts are shown, user types or selects an option of how many upvotes it has.
3. Result is immediately shown with an animation
4. At the end of the five questions, the user's overall score is shown with the option to return to home page or do another test from that subreddit


⚖️ Scoring System

Reddit post scores follow a power-law distribution (most posts get few upvotes, some get hundreds of thousands). To make scoring fair, we normalize guesses:

Logarithmic Scoring

Upvotes are converted to log10(upvotes) before comparing.

Example:

100 upvotes → log10 = 2

10,000 upvotes → log10 = 4

Points = max_points - (|log10(actual) - log10(guess)| * scale_factor).

This means guessing 1,000 when the actual is 10,000 feels “close,” but guessing 10 when it’s 10,000 feels way off.





### Based on Devvit React Starter

A starter to build web applications on Reddit's developer platform

- [Devvit](https://developers.reddit.com/): A way to build and deploy immersive games on Reddit
- [Vite](https://vite.dev/): For compiling the webView
- [React](https://react.dev/): For UI
- [Express](https://expressjs.com/): For backend logic
- [Tailwind](https://tailwindcss.com/): For styles
- [Typescript](https://www.typescriptlang.org/): For type safety

## Getting Started

> Make sure you have Node 22 downloaded on your machine before running!

1. Run `npm create devvit@latest --template=react`
2. Go through the installation wizard. You will need to create a Reddit account and connect it to Reddit developers
3. Copy the command on the success page into your terminal

## Commands

- `npm run dev`: Starts a development server where you can develop your application live on Reddit.
- `npm run build`: Builds your client and server projects
- `npm run deploy`: Uploads a new version of your app
- `npm run launch`: Publishes your app for review
- `npm run login`: Logs your CLI into Reddit
- `npm run check`: Type checks, lints, and prettifies your app

## Cursor Integration

This template comes with a pre-configured cursor environment. To get started, [download cursor](https://www.cursor.com/downloads) and enable the `devvit-mcp` when prompted.
