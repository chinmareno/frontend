"use client";

import { getUser } from "@/app/actions/user/getUser";
import LogoutButton from "@/components/LogOutButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { User } from "@/types/User";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../../supabase/client";
import { toast } from "sonner";
import { changeUserProfile } from "@/app/actions/user/changeUserProfile";
import { getSession } from "@/app/actions/auth/getSession";
import UpdatePasswordForm from "@/components/UpdatePasswordForm";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const initialCheck = async () => {
      const session = await getSession();
      if (!session) return router.replace("/login");
      const user = await getUser();
      if (!user) return router.replace("/login");
      if (user.role === "ADMIN") return router.replace("/admin");
      if (user.role !== "CUSTOMER") return router.replace("/organizer");

      setUserProfile(user);
      setIsLoading(false);
    };
    initialCheck();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  const handleChangePicture = async () => {
    const imageFile = files?.[0];
    if (!imageFile) return toast.error("Please upload a payment proof image.");

    setIsUploading(true);
    const user = await getUser();
    if (!user) return router.replace("/login");

    const { error, data: imageData } = await supabase.storage
      .from("profile_picture")
      .upload(user.id + new Date(), imageFile, { upsert: true });
    if (error || !imageData) {
      setIsUploading(false);
      return toast.error("Please upload a valid image file.");
    }

    const { data: urlData } = supabase.storage
      .from("profile_picture")
      .getPublicUrl(imageData.path);
    const updatedUser = await changeUserProfile(urlData.publicUrl);
    setUserProfile(updatedUser);
    setIsUploading(false);
    setIsOpenProfile(false);
  };

  return (
    <div className="ml-4">
      <div>
        <LogoutButton />
        <p> User id : {userProfile?.id}</p>
        <p> Username : {userProfile?.username}</p>
        <p> Role : {userProfile?.role}</p>
        <p>Your Referral Code : {userProfile?.referral_code}</p>

        <div className="my-2" />

        <button
          className="cursor-pointer rounded-full w-fit"
          onClick={() => setIsOpenProfile(true)}
        >
          {userProfile?.profile_picture_url ? (
            <img
              src={userProfile.profile_picture_url}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
              <span>No image</span>
            </div>
          )}
        </button>

        <div className="my-4" />

        <Button onClick={() => setIsOpenChangePassword(true)}>
          Change Password
        </Button>

        <Dialog
          open={isOpenChangePassword}
          onOpenChange={setIsOpenChangePassword}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {userProfile?.username}'s Change Password
              </DialogTitle>
            </DialogHeader>
            <UpdatePasswordForm />
          </DialogContent>
        </Dialog>
        <Dialog open={isOpenProfile} onOpenChange={setIsOpenProfile}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {userProfile?.username}'s Profile Picture
              </DialogTitle>
            </DialogHeader>

            <Input onChange={(e) => setFiles(e.target.files)} type="file" />
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setIsOpenProfile(false)}
              >
                Close
              </Button>
              <Button disabled={isUploading} onClick={handleChangePicture}>
                {isUploading ? "Uploading..." : "Change Picture"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {children}
    </div>
  );
};

export default Layout;
