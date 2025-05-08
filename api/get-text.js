const samples = {
  'random-words': {
    easy: 'apple banana orange grape lemon Garvit Karan',
    medium: 'pineapple strawberry blueberry watermelon mango peach Garvit Karan typing test',
    hard: 'pomegranate persimmon nectarine clementine tangerine cranberry asynchronous programming Garvit Karan',
  },
  sentences: {
    easy: 'The quick brown fox jumps over the lazy dog. Garvit and Karan are typing.',
    medium: 'Typing tests help improve your speed and accuracy over time. Garvit and Karan practice daily.',
    hard: 'Asynchronous JavaScript and event-driven programming can be challenging concepts to master. Garvit and Karan are experts.',
  },
  'code-snippets': {
    easy: `function greet() {
  console.log("Hello, world!");
}`,
    medium: `const add = (a, b) => {
  return a + b;
};`,
    hard: `<html>
  <head>
    <title>Sample HTML</title>
  </head>
  <body>
    <h1>Hello from Garvit and Karan</h1>
    <p>This is a sample HTML snippet for typing practice.</p>
  </body>
</html>`,
  },
};

export default function handler(req, res) {
  const { mode, difficulty } = req.query;
  if (!mode || !difficulty) {
    res.status(400).json({ error: 'Mode and difficulty required' });
    return;
  }
  const modeSamples = samples[mode];
  if (!modeSamples) {
    res.status(400).json({ error: 'Invalid mode' });
    return;
  }
  const text = modeSamples[difficulty];
  if (!text) {
    res.status(400).json({ error: 'Invalid difficulty' });
    return;
  }
  res.status(200).json({ text });
}
