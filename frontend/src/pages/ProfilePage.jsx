import { cn } from "@/lib/utils";

import React, { useEffect, useState } from "react";
import { DrawerDialog } from "../components/EditProfile";
import { Button } from "@/components/ui/button";
import { Camera, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useAuthStore } from "@/stores/useAuthStore";
import imageCompression from "browser-image-compression";
import StreakCalender from "@/components/streak/StreakCalender";
import { useContributionStore } from "@/stores/useContributionStore";

const ProfilePage = () => {
  const { authUser, uploadUserAvatar } = useAuthStore();
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const option = {
      maxSizeMB: 0.2,
      maxWidthOrheight: 1920,
      useWebWorker: true,
    };
    try {
      // Show a preview while compressing the image
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);

      // Compressing the image
      const compressedFile = await imageCompression(file, option);

      // Converting to base64 string
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = async () => {
        const imageBase64 = reader.result;
        await uploadUserAvatar({ imageBase64 });
      };
    } catch (error) {
      console.error("Error compressing or uploading avatar:\n", error);
    } finally {
      e.target.value = null;
    }
  };

  return (
    <div className="p-4 overflow-auto">
      <Card className="max-w-screen-md mx-auto overflow-hidden">
        <div className="h-48 overflow-hidden bg-muted/50 relative">
          <Avatar>
            <AvatarImage
              className="w-full h-full object-cover"
              src={authUser?.coverUrl}
            />
            <AvatarFallback>
              <img
                className="object-cover w-full h-full dark:brightness-[0.2]"
                src="https://ui.shadcn.com/placeholder.svg"
                alt=""
              />
            </AvatarFallback>
          </Avatar>
        </div>
        <CardContent>
          <div className="mb-8 flex items-center space-x-4">
            <Avatar className="relative shadow-md size-48 shrink-0 border-8 border-background -mt-14 rounded-full">
              <AvatarImage
                className="w-full h-full object-cover rounded-full bg-background"
                src={previewUrl || authUser?.avatarUrl}
                alt={authUser?.fullName || "user profile"}
              />
              <AvatarFallback className="text-4xl">
                <img
                  className="w-full h-full object-cover dark:brightness-[0.2]"
                  src="/avatar.png"
                  alt="shadcn"
                />
              </AvatarFallback>
              <Button
                variant="secondary"
                size="icon"
                className="p-0 absolute bottom-2 right-2 z-10 pointer"
              >
                <label
                  htmlFor="upload-photo"
                  className="p-4 flex items-center space-x-2 cursor-pointer"
                >
                  <Camera />
                  <input
                    type="file"
                    hidden
                    id="upload-photo"
                    accept="image/*"
                    onChange={handleUploadAvatar}
                  />
                </label>
              </Button>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{authUser?.fullName}</h2>
              <p className="text-gray-500">@{authUser?.userName}</p>
            </div>
          </div>

          <div className="space-y-4">
            <StreakCalender />
            <div>
              <Label className="text-zinc-500 mb-2 inline-block">
                Username
              </Label>
              <div className="relative overflow-hidden rounded-lg select-none flex bg-sidebar border border-sidebar-border justify-between items-center px-4 py-3">
                {authUser?.userName}
                <DrawerDialog
                  triggerButton={
                    <Button
                      className="border-l absolute h-full rounded-none top-0 right-0"
                      variant="ghost"
                    >
                      <Pencil />
                    </Button>
                  }
                >
                  <ProfileForm
                    apiEndPoint="user/update-username"
                    dataKey="userName"
                    field="Username"
                    defaultValue={authUser?.userName}
                  />
                </DrawerDialog>
              </div>
            </div>

            <div>
              <Label className="text-zinc-500 mb-2 inline-block">
                Full Name
              </Label>
              <div className="relative overflow-hidden rounded-lg select-none bg-sidebar border border-sidebar-border flex justify-between items-center px-4 py-3">
                {authUser?.fullName}
                <DrawerDialog
                  triggerButton={
                    <Button
                      className="border-l absolute h-full rounded-none top-0 right-0"
                      variant="ghost"
                    >
                      <Pencil />
                    </Button>
                  }
                >
                  <ProfileForm
                    apiEndPoint="user/update-fullname"
                    dataKey="fullName"
                    field="Full Name"
                    defaultValue={authUser?.fullName}
                  />
                </DrawerDialog>
              </div>
            </div>

            <div>
              <Label className="text-zinc-500 mb-2 inline-block">Email</Label>
              <div className="relative overflow-hidden rounded-lg select-none bg-sidebar border border-sidebar-border flex justify-between items-center px-4 py-3">
                {authUser?.email}
                <DrawerDialog
                  triggerButton={
                    <Button
                      className="border-l absolute h-full rounded-none top-0 right-0"
                      variant="ghost"
                    >
                      <Pencil />
                    </Button>
                  }
                >
                  <ProfileForm
                    apiEndPoint="email/update"
                    dataKey="newEmail"
                    field="Email"
                    defaultValue={authUser?.email}
                  />
                </DrawerDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function ProfileForm({ className, field, defaultValue, apiEndPoint, dataKey }) {
  const [value, setValue] = useState(defaultValue);
  const { updateUserField } = useAuthStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { [dataKey]: value };
    await updateUserField(apiEndPoint, data);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid items-start gap-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor={field}>{field}</Label>
        <Input
          type="text"
          id={field}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );
}

export default ProfilePage;
