"use client";

// Necessary imports
import React, { useState } from "react";

// Shadcn Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { Widget } from "@workspace/ui/components/widget";

// Icons
import {
  Activity,
  Calendar,
  Clock,
  Loader2,
  Trash2,
  UserCircle,
  UserCog,
} from "lucide-react";
import { useConfirm } from "@omit/react-confirm-dialog";

interface DeleteConfirmContentProps {
  onValueChange: (disabled: boolean) => void;
}

export function AccountStats() {
  const [isDeleting, setIsDeleting] = useState(false);
  const confirm = useConfirm();

  // Example data - replace with actual data from your application
  const accountData = {
    lastLogin: "2025-03-20T14:30:00",
    creationDate: "2024-08-15T09:45:00",
    role: "admin", // admin, viewer, editor
    totalLogins: 42,
    USER_NAME: "Hakim-Fidjel",
  };

  const DeleteConfirmContent: React.FC<DeleteConfirmContentProps> = ({
    onValueChange,
  }) => {
    const [value, setValue] = React.useState("");

    React.useEffect(() => {
      onValueChange(value !== accountData.USER_NAME);
    }, [value, onValueChange]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">
          To confirm, type &quot;{accountData.USER_NAME}&quot; in the box below
        </p>
        <Input
          value={value}
          onChange={handleInputChange}
          placeholder="Enter your name"
          autoComplete="off"
          autoFocus={true}
        />
      </div>
    );
  };

  const getConfirmationConfig = (
    onValueChange: (disabled: boolean) => void
  ) => ({
    icon: <Trash2 className="size-4 text-destructive" />,
    title: "Delete Account",
    alertDialogTitle: {
      className: "flex items-center gap-2",
    },
    description: (
      <span>
        This action is irreversible. All your data will be permanently deleted.
      </span>
    ),
    contentSlot: <DeleteConfirmContent onValueChange={onValueChange} />,
    confirmText: "Delete account",
    cancelText: "Cancel",
    confirmButton: {
      variant: "destructive" as const,
      className: "w-full sm:w-auto",
    },
    cancelButton: {
      variant: "outline" as const,
      className: "w-full sm:w-auto",
    },
    alertDialogContent: {
      className: "max-w-xl",
    },
  });

  const handleDelete = async () => {
    const confirmConfig = getConfirmationConfig((disabled) => {
      confirm.updateConfig((prev) => ({
        ...prev,
        confirmButton: { ...prev.confirmButton, disabled },
      }));
    });

    const isConfirmed = await confirm(confirmConfig);

    if (isConfirmed) {
      setIsDeleting(true);

      setTimeout(() => {
        setIsDeleting(false);
      }, 2000);

      console.log("Account deleted successfully");
    } else {
      console.log("Deletion canceled");
    }
  };

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Account stats
        </CardTitle>
        <CardDescription>Have a look at your account stats</CardDescription>
      </CardHeader>

      <Separator className="md:mb-6 mb-2" />

      <CardContent className="grid gap-2">
        {/* Stats widgets grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Widget
            icon={<Clock />}
            title="Dernière connexion"
            description={formatDate(accountData.lastLogin)}
          />

          <Widget
            icon={<Calendar />}
            title="Date de création"
            description={formatDate(accountData.creationDate)}
          />

          <Widget
            icon={<UserCog />}
            title="Rôle utilisateur"
            description="Administrateur"
          />

          <Widget
            icon={<UserCircle />}
            title="Connexions totales"
            description={accountData.totalLogins.toString()}
          />
        </div>

        {/* Account deletion section */}
        <Separator className="my-6 border-red-200 dark:border-red-800" />
        <div className="">
          <div className="rounded-lg border border-destructive/40 p-4 bg-destructive/10 dark:bg-muted/50">
            <h3 className="text-lg font-semibold text-destructive mb-2 flex items-center gap-2 ">
              <Trash2 className="h-5 w-5" />
              <p className="dark:text-foreground">Delete my account</p>
            </h3>
            <p className="text-sm text-destructive mb-4 dark:text-foreground">
              This action is irreversible. All your data will be permanently
              deleted.
            </p>

            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  Deleting <Loader2 className="animate-spin ml-2" />
                </>
              ) : (
                <>Delete account</>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
