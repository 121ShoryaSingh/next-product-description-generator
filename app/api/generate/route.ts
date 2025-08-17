import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { Blob } from 'buffer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const product = JSON.parse(formData.get('product') as string);

    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'Missing image' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const blob = Buffer.from(arrayBuffer);

    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.error('Api key is not present');
    }

    const ai = new GoogleGenerativeAI(apiKey!);
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const fileManager = new GoogleAIFileManager(apiKey!);
    const uploadResult = await fileManager.uploadFile(blob, {
      displayName: 'upload-image',
      mimeType: file.type,
    });
    console.log(uploadResult);

    const contents = [
      {
        role: 'user',
        parts: [
          {
            fileData: {
              fileUri: uploadResult.file.uri,
              mimeType: uploadResult.file.mimeType,
            },
          },
          {
            text: `You are an expert e-commerce copywriter and SEO strategist.

                  Task:
                  Generate content for an online store product listing.

                  Input:
                  Product Details: ${product}

                  Output:
                  Return the response in valid JSON only, following this exact structure:
                  {
                    "title": "An attention-grabbing, keyword-rich SEO title for the product",
                    "description": "A persuasive SEO-friendly product description, 80–120 words, highlighting key features, benefits, and target audience",
                    "captions": [
                      "3 short, engaging marketing captions for social media, each under 15 words"
                    ],
                    "hashtags": [
                      "10–15 relevant SEO-friendly hashtags without numbering, each as a string, focusing on the product type, features, and target market"
                    ]
                  }

                  Guidelines:
                  - Use natural language that attracts both customers and search engines.
                  - Include relevant keywords that improve discoverability.
                  - Keep tone persuasive, clear, and consumer-focused.
                  - Avoid generic filler phrases and overuse of exclamation marks.
                  - Do not include quotation marks inside the values unless grammatically necessary.
                  - Do not add any explanation or extra text outside the JSON object.

                    `,
          },
        ],
      },
    ];

    const result = await model.generateContent({
      contents,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            title: { type: 'STRING' },
            description: { type: 'STRING' },
            captions: {
              type: 'ARRAY',
              items: { type: 'STRING' },
            },
            hashtags: {
              type: 'ARRAY',
              items: { type: 'STRING' },
            },
          },
          required: ['title', 'description', 'captions', 'hashtags'],
        },
      },
    } as any);
    const text = result.response!.text();
    let parsedOutput;
    try {
      parsedOutput = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', text);
      return NextResponse.json(
        { error: 'Invalid JSON response from AI' },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedOutput);
  } catch (error) {
    console.error('Error generating data: ', error);
    return NextResponse.json({ error: 'failed to generate' }, { status: 500 });
  }
}
