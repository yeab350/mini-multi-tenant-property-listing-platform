import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";

export default function TenantNotFound() {
  return (
    <main>
      <Container className="py-16">
        <Card>
          <CardContent>
            <h1 className="text-2xl font-semibold text-zinc-900">Tenant not found</h1>
            <p className="mt-2 text-zinc-600">
              The tenant you requested doesn’t exist in this frontend mock.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="btn-primary inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium"
              >
                Back to tenant picker
              </Link>
            </div>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
