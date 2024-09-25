"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const FormSchema = z.object({
  password: z.string().min(1, "Required"),
});

const UpdatePassword = () => {
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
    },
  });

  async function updatePassword({ password }: z.infer<typeof FormSchema>) {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      toast({
        description: error.message,
        variant: "destructive",
        duration: 4000,
      });
    } else {
      // Go to Home page
      router.replace("/");
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-4xl font-bold">Update Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(updatePassword)}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="text-start mb-10">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Update Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UpdatePassword;
