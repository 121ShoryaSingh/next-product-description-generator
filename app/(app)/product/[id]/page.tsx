import axios from 'axios';

// app/products/[slug]/page.tsx
const API_BASE_URL =
  process.env.NEXTAUTH_URL || process.env.BASE_URL || 'http://localhost:3000';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <div>No slug provided</div>;
  }

  // Extract ID from slug
  const parts = id.split('-');
  const extractedId = parts[parts.length - 1];

  if (!extractedId || extractedId === 'undefined') {
    return <div className="pt-28">Invalid product ID extracted from slug</div>;
  }

  let product;
  try {
    const response = await axios(
      `${API_BASE_URL}/api/getDetails/${extractedId}`
    );

    if (!response) {
      throw new Error(`API call failed`);
    }

    const result = await response.data;
    product = result.data || result;
  } catch (error) {
    console.error('API Error:', error);
    product = null;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-2">
            Product with ID: {extractedId} could not be loaded
          </p>
          <a
            href="/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // ✅ Success case - render product
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">
          {product.seoTitle || product.title}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-2xl font-bold text-green-600 mb-4">
              ${product.price}
            </p>
            <p className="text-gray-700 mb-6">{product.description}</p>

            {product.details && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Details:</h3>
                <p className="text-gray-700">{product.details}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {product.captions && product.captions.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Captions:</h3>
                <ul className="space-y-2">
                  {product.captions.map((caption: string, index: number) => (
                    <li
                      key={index}
                      className="bg-gray-50 p-3 rounded-lg"
                    >
                      {caption}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.hashtags && product.hashtags.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.hashtags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500">
          <p>
            <strong>Product ID:</strong> {extractedId}
          </p>
          <p>
            <strong>URL Slug:</strong> {id}
          </p>
        </div>
      </div>
    </div>
  );
}
