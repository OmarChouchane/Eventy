'use client';

import React from 'react'
import ResourceCatalog from '@/components/shared/ResourceCatalog'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useUser } from '@clerk/nextjs';

const page = () => {

  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // wait until user is loaded

    // Check if user is signed in and is admin
    if (!isSignedIn || user?.publicMetadata.role !== 'admin') {
      alert('Access denied. Admins only.');
      router.push('/');
    }
  }, [isLoaded, isSignedIn, user, router]);

  if (!isLoaded || !isSignedIn || user?.publicMetadata.role !== 'admin') {
    return <div>Loading or Access Denied...</div>;
  }

  return (
    <div>
      <ResourceCatalog />
    </div>
  )
}

export default page
