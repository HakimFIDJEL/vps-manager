import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link } from '@inertiajs/react';
import { Fragment } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItemType[] }) {
    return (
        <nav>
            {breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <AnimatePresence mode={"wait"} initial={true}>
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1  }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                                    </motion.div>
                                            </AnimatePresence>
                                        ) : (
                                            
                                            item.link ? (
                                                <BreadcrumbLink asChild>
                                                    <Link href={item.href ?? "#"}>{item.title}</Link>
                                                </BreadcrumbLink>
                                            ) : (
                                                <BreadcrumbPage className="text-muted-foreground">
                                                    {item.title}
                                                </BreadcrumbPage>
                                            )
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </nav>
    );
}
