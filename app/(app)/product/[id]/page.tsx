import axios from 'axios';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function getDetailsById(id: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/getProduct/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(
      'Error fetching product:',
      error.response?.status,
      error.message
    );
    return null;
  }
}

// ✅ SSR Page Component - Runs on every request
export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  // Validate slug parameter
  if (!params.slug) {
    return <div>No slug provided</div>;
  }

  // Extract ID from slug
  const parts = params.slug.split('-');
  const extractedId = parts[parts.length - 1];

  if (!extractedId || extractedId === 'undefined') {
    return <div>Invalid product ID extracted from slug</div>;
  }

  console.log('URL slug:', params.slug);
  console.log('Extracted ID:', extractedId);

  // Check authentication first
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return (
      <div>
        <h2>Authentication Required</h2>
        <p>Please log in to view this product</p>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  // Fetch product data with authentication
  const product = await getDetailsById(extractedId);

  if (!product) {
    return (
      <div>
        <h2>Product Not Found</h2>
        <p>Product with ID: {extractedId} could not be loaded</p>
        <p>This might be due to:</p>
        <ul>
          <li>Invalid product ID</li>
          <li>Product not accessible to your account</li>
          <li>Server connectivity issues</li>
        </ul>
      </div>
    );
  }

  // ✅ ADDED: Missing return statement for successful case
  return (
    <div>
      <h1>{product.seoTitle || product.title}</h1>
      <p>
        <strong>Price:</strong> ${product.price}
      </p>
      <p>
        <strong>Description:</strong> {product.description}
      </p>
      {product.details && (
        <div>
          <h3>Details:</h3>
          <p>{product.details}</p>
        </div>
      )}

      {/* Display captions if available */}
      {product.captions && product.captions.length > 0 && (
        <div>
          <h3>Captions:</h3>
          <ul>
            {product.captions.map((caption: string, index: number) => (
              <li key={index}>{caption}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display hashtags if available */}
      {product.hashtags && product.hashtags.length > 0 && (
        <div>
          <h3>Tags:</h3>
          <div>
            {product.hashtags.map((tag: string, index: number) => (
              <span
                key={index}
                style={{
                  marginRight: '8px',
                  background: '#f0f0f0',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <p>
        <strong>Product ID:</strong> {extractedId}
      </p>
      <p>
        <strong>URL Slug:</strong> {params.slug}
      </p>
    </div>
  );
}
