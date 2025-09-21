import { generateFileName } from '@/lib/generateFileName';
import { uploadToR2 } from '@/lib/r2';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  id: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const formData = await req.formData();
    const { id } = await params;
    const files = formData.getAll('images') as File[];

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const blob = Buffer.from(arrayBuffer);

      return uploadToR2({
        body: blob,
        key: generateFileName(`${id}-${Date.now()}`),
        contentType: file.type,
      });
    });

    const r2Urls = await Promise.all(uploadPromises);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $push: {
          processedImages: { $each: r2Urls },
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Added ${r2Urls.length} images to product`,
      addedImages: r2Urls,
      totalImages: updatedProduct.processedImages.length,
    });
  } catch (error) {
    console.error('Error updating product images:', error);
    return NextResponse.json(
      { error: 'Failed to update images' },
      { status: 500 }
    );
  }
}
