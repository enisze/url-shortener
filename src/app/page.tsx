"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { shortenUrl } from "../lib/actions";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const [result, setResult] = useState<{ url?: string; error?: string }>({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: "" },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    setResult({});
    setCopied(false);

    const response = await shortenUrl(data.url);

    if (response.success && response.hash) {
      setResult({ url: `${window.location.origin}/r/${response.hash}` });
    } else {
      setResult({ error: response.error || "Failed to shorten URL" });
    }

    setLoading(false);
  }

  async function copyToClipboard() {
    if (result.url) {
      try {
        await navigator.clipboard.writeText(result.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">URL Shortener</h1>
        <p className="text-gray-600">
          Transform long URLs into short, shareable links
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shorten Your URL</CardTitle>
          <CardDescription>
            Enter a URL below to get a shortened version
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/very/long/url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Shortening..." : "Shorten URL"}
              </Button>
            </form>
          </Form>

          {result.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{result.error}</p>
            </div>
          )}

          {result.url && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md space-y-3">
              <h3 className="font-semibold text-green-800">Shortened URL:</h3>
              <div className="flex gap-2">
                <Input
                  value={result.url}
                  readOnly
                  className="bg-white font-mono text-sm"
                />
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </Button>
              </div>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm inline-block"
              >
                Click to test the link →
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
