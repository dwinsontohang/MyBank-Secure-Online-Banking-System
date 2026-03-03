"use client";

import dynamic from 'next/dynamic';

const AdminLoginComponent = dynamic(
  () => import('./AdminLoginComponent'),
  { ssr: false }
);

export default function AdminLoginPage() {
  return <AdminLoginComponent />;
}

