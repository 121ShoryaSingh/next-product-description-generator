import { GoogleGenAI } from '@google/genai';
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
    const blob = new Blob([arrayBuffer], { type: file.type });

    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.error('Api key is not present');
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });
    const uploadResult = await ai.files.upload({
      file: blob as unknown as globalThis.Blob,
      config: { mimeType: file.type },
    });
    console.log(uploadResult);

    const contents = [
      {
        role: 'user',
        parts: [
          {
            fileData: {
              fileUri: uploadResult.uri,
              mimeType: uploadResult.mimeType,
            },
          },
          {
            text: `You are an expert e-commerce copywriter and SEO strategist.

                    Task:
                    Generate content for an online store product listing.

                    Input:
                    Product Details: ${product}

                    Output format (strictly follow this structure):
                    title: [An attention-grabbing, keyword-rich SEO title for the product]
                    description: [A persuasive SEO-friendly product description, 80–120 words, highlighting key features, benefits, and target audience]
                    captions: [3 short, engaging marketing captions for social media, each under 15 words]
                    hashtags: [10–15 relevant SEO-friendly hashtags without numbering, separated by spaces, focusing on the product type, features, and target market]

                    Guidelines:
                    - Use natural language that attracts both customers and search engines.
                    - Include relevant keywords that improve discoverability.
                    - Keep tone persuasive, clear, and consumer-focused.
                    - Avoid generic filler phrases and overuse of exclamation marks.
                    - Do not include quotation marks in the output.
                    - Do not add any extra text outside the requested format.
                    `,
          },
        ],
      },
    ];
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents,
    });
    const text = result.text;

    return NextResponse.json({ output: text });
  } catch (error) {
    console.error('Error generating data: ', error);
    return NextResponse.json({ error: 'failed to generate' }, { status: 500 });
  }
}
