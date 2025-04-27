import StreakCalender from "@/components/streak/StreakCalender";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/stores/useAuthStore";
import { Label } from "@radix-ui/react-dropdown-menu";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserPage = () => {
  const { getUser, isGettingUser } = useAuthStore();
  const { username } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser(username);
        setUser(user);
      } catch (error) {
        console.error(error);
        setUser(null);
      }
    };

    const fetchUserContribution = async () => {
      try {
        
      } catch (error) {
      } finally {
      }
    };
    fetchUserData();
  }, [username]);
  return (
    <div className="p-4 overflow-auto">
      <Card className="max-w-screen-md mx-auto overflow-hidden">
        <div className="h-48 overflow-hidden bg-secondary relative">
          {
            (user?.coverUrl)?
            <img src={user?.coverUrl} alt="cover-photo" />
            :
            <img 
              className="object-cover w-full h-full dark:brightness-[0.2]"
              src="https://ui.shadcn.com/placeholder.svg" 
              alt="cover-photo" 
            />
          }
        </div>
        <CardContent>
          <div className="mb-8 flex items-center space-x-4">
            <Avatar className="relative shadow-md size-48 shrink-0 border-8 border-background -mt-14 rounded-full">
              <AvatarImage
                className="w-full h-full object-cover rounded-full bg-background"
                src={user?.avatarUrl}
                alt={user?.fullName || "user profile"}
              />
              <AvatarFallback className="text-4xl">
                <img
                  className="w-full h-full object-cover dark:brightness-[0.2]"
                  src="/avatar.png"
                  alt="shadcn"
                />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user?.fullName}</h2>
              <p className="text-gray-500">@{user?.userName}</p>
            </div>
          </div>

          <div className="space-y-4">
            <StreakCalender />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPage;
