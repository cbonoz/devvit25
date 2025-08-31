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


## Inspiration
ViralityTest was inspired by the viral nature of Reddit posts and the curiosity around what makes content popular. We wanted to create a fun, interactive way for users to test their intuition about Reddit upvotes and learn more about virality trends.

## What it does
ViralityTest is a quiz game where users are shown real Reddit posts and must guess how many upvotes each post received. After each guess, users get instant feedback, a score based on the accuracy of their guess (using a logarithmic scoring system), and a summary of their performance at the end, including links to the original posts.

## How we built it
The app is built with React and TypeScript, using Vite for fast development and build tooling. The client fetches real Reddit post data from a custom Express server endpoint. The UI is styled with Tailwind CSS and features dynamic feedback, loading states, and a modular component structure. The app is designed to run as a Devvit web app, following Reddit's guidelines for webview games.

## Challenges we ran into
- Handling Devvit's sandboxed iframe environment, which restricts popups and new tab links
- Ensuring the UI is responsive and visually appealing across devices
- Implementing a fair and engaging scoring system that rewards close guesses
- Managing async data fetching and loading states for a smooth user experience
- Refactoring code for maintainability and modularity as the app grew

## Accomplishments that we're proud of
- Successfully integrating real Reddit data into the quiz flow
- Creating a log-based scoring system that feels fair and fun
- Providing instant, nuanced feedback and a detailed final score summary
- Achieving a clean, modern UI with good UX and accessibility
- Refactoring the codebase into reusable components and utilities

## What we learned
- The importance of considering platform limitations (like sandboxed iframes) early in the design
- How to structure a React app for maintainability and scalability
- Techniques for providing engaging feedback and keeping users motivated
- Best practices for integrating third-party APIs and handling async data

## What's next for ViralityTest
- Add more quiz modes (e.g., by subreddit, by time period, or by post type)
- Implement leaderboards or social sharing features
- Add user accounts or persistent score tracking
- Improve mobile experience and accessibility
- Explore more advanced analytics or feedback based on user performance


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
