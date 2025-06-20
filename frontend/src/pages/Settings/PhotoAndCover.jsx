import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Loader2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import imageCompression from "browser-image-compression";

const PhotoAndCover = () => {
  const {
    authUser,
    uploadUserAvatar,
    removeUserAvatar,
    isUploadingAvatar,
    isRemovingAvatar,
    isUploadingCover,
    isRemovingCover,
    uploadUserCover,
    removeUserCover,
  } = useAuthStore();

  const [previewavatar, setPreviewavatar] = useState(null);
  const [previewCoverUrl, setPreviewCoverUrl] = useState(null);

  const handleUploadImage = async (e, setPreview, onUpload) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Set image preview (optional)
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);

      let finalFile = file;

      // 🗜️ Compress only if size > 1MB
      if (file.size > 1024 * 1024) {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        finalFile = await imageCompression(file, options);
      }
      await onUpload(finalFile);
    } catch (error) {
      console.error("Error compressing or uploading:\n", error);
    } finally {
      e.target.value = null; // Reset file input
    }
  };

  const handleRemoveAvatar = async (setPreview, onRemove) => {
    const result = await onRemove();
    if (result) {
      setPreview(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent className="space-y-10">
        <div className="space-y-4">
          <Label className="text-base">Your Photo</Label>
          <div className="flex gap-8 items-center">
            <Avatar className="relative aspect-square shadow-md size-44 shrink-0 border-background rounded-full">
              <AvatarImage
                className="w-full h-full object-cover rounded-full bg-background"
                src={previewavatar || authUser?.avatar}
                alt={authUser?.fullName || "user profile"}
              />
              <AvatarFallback className="text-4xl">
                <img
                  className="w-full h-full object-cover dark:brightness-[0.2]"
                  src="/avatar.png"
                  alt="shadcn"
                />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="font-semibold text-sm">
                  File smaller than 10MB and at least 400px by 400px
                </p>
                <p className="text-muted-foreground text-sm">
                  This image will be shwon in your profile page if you choose to
                  share it with other memeber it will also help us recognize you
                </p>
              </div>

              <div className="flex gap-2">
                <Label htmlFor="profile-photo">
                  <input
                    type="file"
                    id="profile-photo"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingAvatar}
                    onChange={(e) =>
                      handleUploadImage(
                        e,
                        setPreviewavatar,
                        uploadUserAvatar
                      )
                    }
                  />
                  <div
                    className={`button w-32 cursor-pointer ${
                      isUploadingAvatar && "disabled"
                    }`}
                  >
                    {isUploadingAvatar ? (
                      <span className="flex items-center gap-1">
                        Uploading... <Loader2 className="animate-spin" />
                      </span>
                    ) : (
                      "Upload Photo"
                    )}
                  </div>
                </Label>

                <Button
                  onClick={() =>
                    handleRemoveAvatar(
                      setPreviewavatar,
                      removeUserAvatar
                    )
                  }
                  size="icon"
                  disabled={isRemovingAvatar || !authUser?.avatar}
                  variant="secondary"
                  className="relative overflow-hidden"
                >
                  {isRemovingAvatar ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Trash2 />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base">Profile Page Cover</Label>
          <div className="flex gap-8 items-center">
            <Avatar className="relative aspect-square shadow-md size-44 shrink-0 rounded-xl overflow-hidden border-background">
              <AvatarImage
                className="w-full h-full object-cover bg-background"
                src={previewCoverUrl || authUser?.cover}
                alt={"background-cover-image"}
              />
              <AvatarFallback className="text-4xl">
                <img
                  className="w-full h-full object-cover dark:brightness-[0.2]"
                  src="/profile-cover.svg"
                  alt="profile-cover-fallback"
                />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="font-semibold text-sm">
                  File smaller than 10MB and at least 1200px by 300px
                </p>
                <p className="text-muted-foreground text-sm">
                  This image will be shown as background banner in your profile
                  page if you choose to share it with other members.
                </p>
              </div>

              <div className="flex gap-2">
                <Label htmlFor="profile-cover">
                  <input
                    type="file"
                    id="profile-cover"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingCover}
                    onChange={(e) =>
                      handleUploadImage(e, setPreviewCoverUrl, uploadUserCover)
                    }
                  />
                  <div
                    className={`button w-32 cursor-pointer ${
                      isUploadingCover && "disabled"
                    }`}
                  >
                    {isUploadingCover ? (
                      <span className="flex items-center gap-1">
                        Uploading... <Loader2 className="animate-spin" />
                      </span>
                    ) : (
                      "Upload Photo"
                    )}
                  </div>
                </Label>

                <Button
                  onClick={() =>
                    handleRemoveAvatar(setPreviewCoverUrl, removeUserCover)
                  }
                  size="icon"
                  disabled={isRemovingCover || !authUser?.cover}
                  variant="secondary"
                  className="relative overflow-hidden"
                >
                  {isRemovingCover ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Trash2 />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoAndCover;
