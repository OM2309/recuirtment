"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchEmailDetails } from "@/actions";
import { EmailItem, EmailListProps } from "@/types/type";
import EmailDetails from "./email-details";

const EmailList = ({ contacts }: EmailListProps) => {
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);

  const handleClick = async (emailId: string) => {
    try {
      const fetchDetails = await fetchEmailDetails(emailId);
      console.log("Fetched email details:", fetchDetails);
      setSelectedEmail(fetchDetails);
    } catch (err: any) {
      console.error("Error fetching email details:", err);
    }
  };

  return (
    <div className="flex w-full max-w-7xl mx-auto p-4 gap-4">
      {/* Email List */}
      <div className="w-full max-w-xs">
        <Card className="border-0 shadow-sm bg-white dark:bg-[#1f1f1f]">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search emails"
                className="pl-10 bg-gray-50 dark:bg-[#272727] border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 max-h-[calc(100vh-12rem)] overflow-y-auto">
            <div className="space-y-0">
              {contacts.map((emailItem: EmailItem) => (
                <div
                  key={emailItem.id}
                  onClick={() => handleClick(emailItem.id)}
                  className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={emailItem.avatar || "/placeholder.svg"}
                        alt={emailItem.senderProfile?.name || "Unknown"}
                      />
                      <AvatarFallback className="bg-[#272727] text-white text-sm">
                        {emailItem.senderProfile?.name &&
                        emailItem.senderProfile.name.trim()
                          ? emailItem.senderProfile.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : emailItem.senderProfile?.email
                            ? emailItem.senderProfile.email
                                .charAt(0)
                                .toUpperCase()
                            : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {emailItem.senderProfile?.name || "Unknown"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {emailItem.senderProfile?.email || "No email"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Details */}
      <EmailDetails selectedEmail={selectedEmail} />
    </div>
  );
};

export default EmailList;
