"use client";
import dynamic from 'next/dynamic';

// Import the component with SSR disabled
const CustomerLoginComponent = dynamic(
  () => import('./CustomerLoginComponent'),
  { ssr: false }
);

export default function CustomerLoginPage() {
  return <CustomerLoginComponent />;
}

