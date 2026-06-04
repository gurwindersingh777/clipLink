'use client'
import { Link } from '@prisma/client'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { useDeleteLink } from '@/hooks/useDeleteLink';
import { useState } from 'react';

export default function DeleteLink({ link }: { link: Link }) {

  const { mutate: deleteLink } = useDeleteLink()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> Delete link?</AlertDialogTitle>

          <AlertDialogDescription>This action cannot be undone. The link and its analytics data will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={deletingId === link.id}
            onClick={() => {

              setDeletingId(link.id)
              deleteLink(link.id, {
                onSettled: () => setDeletingId(null)
              })
            }
            }
          >
            {deletingId === link.id ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
