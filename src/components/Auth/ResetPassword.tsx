"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const FormSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email"),
});

interface FormData {
  email: string;
}

const ResetPassword = () => {
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function resetPassword({ email }: FormData) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      toast({
        description: error.message,
        variant: "destructive",
        duration: 4000,
      });
    } else {
      toast({
        description: "Password reset instructions sent.",
        duration: 4000,
      });
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-4xl font-bold">Forgot Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(resetPassword)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="text-start mb-10">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="mail@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Send Instructions
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link">
          <Link href="/sign-in">Remember your password? Sign In.</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResetPassword;
