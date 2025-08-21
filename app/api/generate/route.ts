import { verifyToken } from '@/lib/auth';
import { dbConnect } from '@/lib/mongoDb';
import { uploadToR2 } from '@/lib/r2';
import Product from '@/models/Product';
import User from '@/models/User';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    //Awaiting DB Connection
    await dbConnect();
    //Taking token and getting id
    const token = req.cookies.get('token')?.value;
    if (!token)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decode = verifyToken(token) as { id: string; email: string };

    // Extracting form data.
    const formData = await req.formData();
    const product = JSON.parse(formData.get('product') as string);
    const file = formData.get('image') as File;
    if (!file) {
      return NextResponse.json({ error: 'Missing image' }, { status: 400 });
    }

    // Converting file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const blob = Buffer.from(arrayBuffer);

    // Sending the content gemini Api
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
                    "description": "A persuasive SEO-friendly product description, 300–320 words, highlighting key features, benefits, and target audience",
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
    // Storing the image in to R2 storage
    const r2Url = await uploadToR2({
      body: blob,
      key: decode.id,
      contentType: file.type,
    });
    parsedOutput = JSON.parse(text);

    // Storing the image and product detail to backend
    const newProduct = await Product.create({
      userId: decode.id,
      name: parsedOutput.title,
      description: parsedOutput.description,
      price: parsedOutput.price || 0,
      baseDetails: product,
      processedImage: r2Url,
      captions: parsedOutput.captions,
    });

    await User.findByIdAndUpdate(decode.id, {
      $push: { product: newProduct._id },
    });

    // returing data
    return NextResponse.json(
      { message: 'Product generated & saved' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error generating data: ', error);
    return NextResponse.json({ error: 'failed to generate' }, { status: 500 });
  }
}
