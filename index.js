import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors());

let users = [];
let tweets = [
  {
    username: 'elonmusk',
    avatar:
      'https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2021/11/elon-musk.jpg?w=1200&h=1200&crop=1',
    tweet: 'I just bought Twitter',
  },
  {
    username: 'gokunervoso',
    avatar:
      'https://i.kym-cdn.com/entries/icons/original/000/039/928/sketch-1648013553113.png',
    tweet: 'Freeza, pq você matou o Kuririn? Eu estou nervoso, Freezaaaaaaaaaa',
  },
  {
    username: 'harryporra',
    avatar: 'https://i.ytimg.com/vi/0i5EdFHDlHo/hqdefault.jpg',
    tweet: 'Fumei a Pedra Filosofal :X',
  },
  {
    username: 'diegopinho',
    avatar:
      'https://www.diegopinho.com.br/assets/images/uploads/avatar/avatar-195x195.png',
    tweet: 'Já compraram meu livro?',
  },
];

app.post('/sign-up', (req, res) => {
  if (req.body.username && req.body.avatar) {
    const userRegister = users.find(
      (user) => user.username === req.body.username
    );
    if (userRegister) {
      res.status(400).send('User already exists');
    } else {
      users.push(req.body);
      console.log(chalk.bold.yellow(`User ${req.body.username} registered`));
      res.status(201).send('OK');
    }
  } else {
    res.status(400).send('Missing username or avatar');
  }
});

app.get('/tweets', (req, res) => {
  const page = parseInt(req.query.page);

  if (!page || page <= 0) {
    res.status(400).send('Informe uma página válida!');
  } else {
    const limit = 10;
    const searchTweet = tweets.length - page * limit;
    const firstTweet = (page - 1) * limit;

    let initialValue;
    if (tweets.length <= limit) {
      initialValue = 0;
    } else {
      if (searchTweet < 0) {
        initialValue = 0;
      } else {
        initialValue = searchTweet;
      }
    }

    let finalValue;
    if (firstTweet > tweets.length) {
      finalValue = 0;
    } else {
      if (initialValue === 0) {
        finalValue = tweets.length - firstTweet;
      } else {
        finalValue = initialValue + limit;
      }
    }
    res.send(tweets.slice(initialValue, finalValue).reverse());
  }
});

app.get('/tweets/:username', (req, res) => {
  const { username } = req.params;
  const user = users.find((user) => user.username === username);
  if (user) {
    const tweetsUser = tweets.filter((tweet) => tweet.username === username);
    res.status(200).send(tweetsUser);
  } else {
    res.status(404).send('User not found');
  }
});

app.post('/tweets', (req, res) => {
  const tweetMessage = req.body.tweet;
  const { user } = req.headers;
  if (tweetMessage && user) {
    let tweet = {
      username: user,
      tweet: tweetMessage,
    };
    const userTweet = users.find((user) => user.username === tweet.username);
    tweet = { ...tweet, avatar: userTweet.avatar };
    tweets.push(tweet);
    res.status(201).send('OK');
  } else {
    res.status(400).send('Missing username or tweet');
  }
});

app.listen(PORT, () => {
  console.log(chalk.bold.green('Server is running on port 5000'));
});
