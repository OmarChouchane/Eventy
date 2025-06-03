'use client';

import { usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { deleteResource } from '@/lib/actions/resource.actions';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { buttonVariants } from '@/components/ui/button';
import { FaTrash } from 'react-icons/fa';


export const DeleteResource = ({
  resourceId,
  onDeleteSuccess,
}: {
  resourceId: string;
  onDeleteSuccess: () => void;
}) => {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <FaTrash className="text-red-500 hover:text-red-700 cursor-pointer" />
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            This will permanently delete the resource.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={() =>
              startTransition(async () => {
                await deleteResource({ resourceId, path: pathname });
                onDeleteSuccess(); // call the callback after deletion
              })
            }
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
