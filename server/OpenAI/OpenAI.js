import axios from 'axios'
import * as cheerio from 'cheerio'

export const cleanText = (text) => {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  };


export const extractMainContent = ($) => {
  const contentSelectors = [
    'article',
    '[role="main"]',
    '.post-content',
    '.article-content',
    '.entry-content',
    'main',
    '#content',
  ];

  let content = '';

  for (const selector of contentSelectors) {
    const element = $(selector).first();
    if (element.length) {
      element.find('script, style, nav, header, footer, .ad').remove();
      content = element.text();
      if (content.length > 100) break;
    }
  }

  if (!content) {
    content = $('p').map((_, el) => $(el).text()).get().join('\n');
  }

  return cleanText(content);
};

export const parseUrl = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    const $ = cheerio.load(response.data);
    const content = extractMainContent($);

    if (content.length < 100) {
      throw new Error('Could not extract meaningful content from the URL');
    }

    return content;
  } catch (error) {
    console.error('URL parsing error:', error);
    throw new Error(`Failed to parse URL: ${error.message}`);
  }
};

export const processWithGPT = async (content, numberOfDays) => {
  const apiKey = process.env.OPENAI_API_KEY; // Adjusted for server-side usage
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Based on this article content: "${content}", please create a ${numberOfDays}-day itinerary. Format the response as a JSON object with this structure:
            {
              "tripName": "string",
              "itinerary": [
                {
                  "day": "number",
                  "location": "string",
                  "description": "string with newline characters (\\n) for formatting"
                }
              ]
            }
            Make sure to spread the activities across exactly ${numberOfDays} days.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.data.choices) {
      throw new Error('No choices returned from OpenAI API');
    }

    const parsedResponse = JSON.parse(response.data.choices[0].message.content);

    return {
      tripName: parsedResponse.tripName,
      itinerary: parsedResponse.itinerary,
    };
  } catch (error) {
    console.error('GPT processing error:', error);
    throw new Error('Failed to process with GPT: ' + error.message);
  }
};

export const processArticleUrl = async (url, numberOfDays) => {
    try {
      const content = await parseUrl(url);
      const itinerary = await processWithGPT(content, numberOfDays);
      return itinerary;
    } catch (error) {
      console.error('Article processing error:', error);
      throw new Error(`Error processing article: ${error.message}`);
    }
  };
  