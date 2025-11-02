"use client";

import { changeUserProfile } from "@/app/actions/user/changeUserProfile";
import { getUser } from "@/app/actions/user/getUser";
import LogoutButton from "@/components/LogOutButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../../supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/types/User";
import { getSession } from "@/app/actions/auth/getSession";
import UpdatePasswordForm from "@/components/UpdatePasswordForm";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [openProfile, setOpenProfile] = useState(false);
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
      if (user.role !== "ORGANIZER") return router.replace("/");

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
    setOpenProfile(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mx-10">
        <LogoutButton />
        <div>
          <p> User id : {userProfile?.id}</p>
          <p> Username : {userProfile?.username}</p>
          <p> Role : {userProfile?.role}</p>
          <button
            className="w-fit rounded-full cursor-pointer"
            onClick={() => setOpenProfile(true)}
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
        </div>
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
        <Dialog open={openProfile} onOpenChange={setOpenProfile}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {userProfile?.username}'s Profile Picture
              </DialogTitle>
            </DialogHeader>

            <Input onChange={(e) => setFiles(e.target.files)} type="file" />
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpenProfile(false)}>
                Close
              </Button>
              <Button disabled={isUploading} onClick={handleChangePicture}>
                {isUploading ? "Uploading..." : "Change Picture"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Link href="/organizer/create">Create Event</Link>
        <Link href="/organizer/analytic">Analytic</Link>
      </div>
      {children}
    </div>
  );
};

export default Layout;
