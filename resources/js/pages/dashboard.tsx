import { AppLayout } from '@/components/layouts/app-layout'
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useAppearance } from '@/hooks/use-appearance';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
      title: 'Dashboard',
      href: route('dashboard'),
  },
];

export default function Page() {
  const { appearance } = useAppearance();

  useEffect(() => {
    console.log('Appearance changed:', appearance);
  }, [appearance]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" statusCode={501} displayButton={false} />
    </AppLayout>
  )
}
