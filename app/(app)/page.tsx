import { Button } from '@/components/ui/button';
import { Wrapper } from '@/components/Wrapper';
import {
  ArrowRight,
  BrainCircuit,
  Crop,
  LayoutDashboard,
  Package,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="pt-32 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Wrapper className="flex-col">
        <div className="container text-center flex items-center justify-center flex-col mb-16">
          <h1 className="flex items-center justify-center mb-16 gap-5">
            <div className="h-12 w-12 bg-blue-600 rounded-lg flex justify-center items-center">
              <Package className="h-8 w-8 text-white " />
            </div>
            <p className="text-3xl font-bold text-gray-900">ProductAI</p>
          </h1>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Product
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Listing Generator
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Transform your product images into professional listings with
            AI-generated descriptions, captions, and hashtags. Perfect for
            e-commerce businesses.
          </p>
          <Button
            size="lg"
            asChild
            className="gap-2"
          >
            <Link href="/dashboard">
              Get Started <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BrainCircuit className="h-6 w-6 rounded-md text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Generated Content</h3>
            <p className="text-gray-600">
              Automatically generated compelling product description, captions,
              and hashtags.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Crop className="h-6 w-6 rounded-md text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Image Processing</h3>
            <p className="text-gray-600">
              Advanced image analysis to extract key features and create
              optimized variants.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="h-6 w-6 rounded-md text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Dashboard Management</h3>
            <p className="text-gray-600">
              Organize, edit, and manage all your product listings from one
              central dashboard.
            </p>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
