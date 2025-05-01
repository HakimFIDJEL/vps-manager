import { AdminLayout } from '@/components/layouts/admin-layout'
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
      title: 'Dashboard',
      href: '/dashboard',
  },
];

export default function Page() {
  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
    </AdminLayout>
  )
}
