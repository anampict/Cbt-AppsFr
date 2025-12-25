"use client";

import SignIn from "@/components/auth/SignIn";
import { onSignInWithCredentials } from "@/server/actions/auth/handleSignIn";
import handleOauthSignIn from "@/server/actions/auth/handleOauthSignIn";
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
              <div className="text-red-600">
                <strong>Login Failed:</strong> {data.error}
              </div>,
              {
                placement: "top-end",
              }
            );
            setSubmitting(false);
          } else {
            // Show success toast
            toast.push(
              <div className="text-green-600">
                <strong>Success!</strong> Login berhasil, redirecting...
              </div>,
              {
                placement: "top-end",
              }
            );
            // No need to setSubmitting(false) - page will redirect
          }
        })
        .catch((error) => {
          // NEXT_REDIRECT is expected behavior on successful login
          // It's thrown by NextAuth to trigger automatic redirect
          if (error?.message === "NEXT_REDIRECT") {
            console.log("[handleSignIn] Redirecting after successful login");
            return; // Silently ignore - redirect is happening
          }

          const errorMessage = error?.message || "Terjadi kesalahan saat login";
          setMessage(errorMessage);
          toast.push(
            <div className="text-red-600">
              <strong>Error:</strong> {errorMessage}
            </div>,
            {
              placement: "top-end",
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
      toast.push(
        <div className="text-red-600">
          <strong>OAuth Error:</strong> {errorMessage}
        </div>,
        {
          placement: "top-end",
        }
      );
    }
  };

  return <SignIn onSignIn={handleSignIn} onOauthSignIn={handleOAuthSignIn} />;
};

export default SignInClient;
