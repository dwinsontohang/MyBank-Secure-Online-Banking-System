"use client";
import dynamic from 'next/dynamic';

const EmployeeLoginComponent = dynamic(
  () => import('./EmployeeLoginComponent'),
  { ssr: false }
);

export default function EmployeeLoginPage() {
  return <EmployeeLoginComponent />;
}

