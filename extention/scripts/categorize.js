class WebsiteCategorizer {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey: apiKey });
  }

  async categorizeUrl(url) {
    const prompt = `
      You are a highly intelligent classifier trained to categorize websites into six specific categories based on their URLs. The categories are: Adults, Sports, Shopping, Gambling, News, Social. Given a URL, you should categorize it into one of these categories, ensuring that each website can only belong to a single category.

      Here is the URL that needs to be categorized: ${url}

      Please categorize this URL into the appropriate category.
    `;

    const chatCompletion = await this.openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a highly intelligent classifier trained to categorize websites into six specific categories: Adults, Sports, Shopping, Gambling, News, Social.' },
        { role: 'user', content: `Categorize this URL: ${url}` }
      ],
      model: 'gpt-3.5-turbo-instruct',
    });

    // Assuming the response format includes the category directly as the content of the message
    const category = chatCompletion.choices[0].message.content.trim();
    return category;
  }
}

async function main() {
  // Replace 'your_api_key_here' with your actual OpenAI API key
  const apiKey = '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';
  const categorizer = new WebsiteCategorizer(apiKey);

  // Example URLs for testing
  const urlsToTest = [
    '91v3p.com',
    'X.com',
    '8888poker.com',
    'bodog.com'
  ];

  // Test categorization of each URL
  for (const url of urlsToTest) {
    const category = await categorizer.categorizeUrl(url);
    console.log(`URL: ${url} - Category: ${category}`);
  }
}

main().catch(console.error);
