import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <main>
      <Container size="full" className="py-16">
        <Card>
          <CardContent>
            <h1 className="text-2xl font-semibold text-zinc-900">Page not found</h1>
            <p className="mt-2 text-zinc-600">
              The page you’re looking for doesn’t exist.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="btn-primary inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold"
              >
                Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
