"use client";

import SignIn from "@/components/auth/SignIn";
import { onSignInWithCredentials } from "@/server/actions/auth/handleSignIn";
import handleOauthSignIn from "@/server/actions/auth/handleOauthSignIn";
import Notification from "@/components/ui/Notification";
import { REDIRECT_URL_KEY } from "@/constants/app.constant";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import toast from "@/components/ui/toast";
import type {
  OnSignInPayload,
  OnOauthSignInPayload,
} from "@/components/auth/SignIn";

const SignInClient = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get(REDIRECT_URL_KEY);

  const handleSignIn = useCallback(
    ({ values, setSubmitting, setMessage }: OnSignInPayload) => {
      setSubmitting(true);

      onSignInWithCredentials(values, callbackUrl || "")
        .then((data) => {
          if (data?.error) {
            setMessage(data.error as string);
            toast.push(
              <Notification type="danger">{data.error}</Notification>,
              {
                placement: "top-center",
              }
            );
            setSubmitting(false);
          } else {
            // Mark in sessionStorage that login was successful
            // This will trigger toast display on home page
            if (typeof window !== "undefined") {
              sessionStorage.setItem("loginSuccess", "true");
            }
            // Let NextAuth do the redirect
            // Toast will be shown on the next page
          }
        })
        .catch((error) => {
          // NEXT_REDIRECT is expected behavior on successful login
          // It's thrown by NextAuth to trigger automatic redirect
          if (error?.message === "NEXT_REDIRECT") {
            console.log("[handleSignIn] Redirecting after successful login");
            if (typeof window !== "undefined") {
              sessionStorage.setItem("loginSuccess", "true");
            }
            return; // Silently ignore - redirect is happening
          }

          const errorMessage = error?.message || "Terjadi kesalahan saat login";
          setMessage(errorMessage);
          toast.push(
            <Notification type="danger">{errorMessage}</Notification>,
            {
              placement: "top-center",
            }
          );
          setSubmitting(false);
        });
    },
    [callbackUrl]
  );

  const handleOAuthSignIn = async ({ type }: OnOauthSignInPayload) => {
    try {
      if (type === "google") {
        await handleOauthSignIn("google");
      }
      if (type === "github") {
        await handleOauthSignIn("github");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "OAuth login failed";
      toast.push(<Notification type="danger">{errorMessage}</Notification>, {
        placement: "top-center",
      });
    }
  };

  return <SignIn onSignIn={handleSignIn} onOauthSignIn={handleOAuthSignIn} />;
};

export default SignInClient;
