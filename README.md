![ViralityTest Logo](https://i.ibb.co/fVNMnMLL/logo.png)

# 🔥 ViralityTest

Everyone wants to go viral online — do you know what separates a viral post from one that gets ignored? ViralityTest was inspired by the idea that you can train your intuition for what makes content blow up. By challenging yourself to guess the upvotes of real Reddit posts, you’ll learn to spot the patterns and ingredients of viral success.

Built as a submission to the <a href="https://redditfunandgames.devpost.com/">Fun and Games with Devvit hackathon</a>.

See the demo video here: https://youtu.be/Dx8eSza9B0Q

Try it out live on reddit: https://www.reddit.com/r/viralitytest_dev/?playtest=viralitytest 

## What it does
ViralityTest is a quiz game that pulls live posts from Reddit and asks you to guess how many upvotes each received. You’ll get instant feedback, see how close your guess was, and build your skills at identifying what makes a post go viral. The better you get, the more you’ll understand the secrets of viral content—and you can use those insights to make your own posts stand out.

## How we built it
We built ViralityTest using React, TypeScript, Devvit, and Tailwind CSS. The app fetches real-time data from Reddit, dynamically generates quiz questions, and provides smooth feedback animations. The UI is designed for both desktop and mobile users. We focused on modular code, modern design, and a fun, intuitive experience.

## Challenges we ran into
Reddit’s post API can sometimes give unexpected post results; and filtering out low-quality or irrelevant posts was tricky. We also had to balance the scoring system to make it fair for posts with very different upvote counts. Ensuring a smooth user experience across devices and handling edge cases (like posts with zero upvotes) required careful attention.

## Accomplishments that we're proud of
We’re proud of creating a game that’s both fun and easy to plan. The app teaches users to recognize viral patterns, provides instant feedback, and makes learning about virality engaging.

## What we learned
We learned a lot about what makes content go viral—and how hard it is to predict! Building the scoring system taught us about power-law distributions and the psychology of guessing. We also deepened our skills in React, TypeScript, and API integration.

## Potential future work
- **Enhanced Features**: Leaderboards, multiplayer challenges, and AI-powered hints to make the experience more competitive and engaging
- **Advanced Analytics**: Deeper insights into what makes posts go viral, including pattern recognition and virality prediction tools
- **Community Features**: User profiles, personal stats tracking, and social sharing capabilities to build a community around viral content predictions


Play it here (public app link): https://www.reddit.com/r/viralitytest_dev/?playtest=viralitytest

Developer app page: https://developers.reddit.com/apps/viralitytest

Demo video: https://youtu.be/Dx8eSza9B0Q

## Screenshots

### Home Page
*Start your quiz by picking a subreddit or entering your own.*

![Home Page](img/home_page.png)

### Questions Dynamically Generated
*Each quiz pulls live posts from Reddit for a fresh experience.*

![Questions Dynamically Generated](img/questions_dynamically_generated.png)

### Feedback After Each Question
*See how close your guess was and get instant feedback.*

![Feedback After Each Question](img/feedback_after_each_question.png)

### Result Page
*Review your final score and see your performance.*

![Result Page](img/result_page.png)

