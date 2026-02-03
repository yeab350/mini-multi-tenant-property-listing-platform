import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";

export default function PropertyNotFound() {
  return (
    <main>
      <Container className="py-16">
        <Card>
          <CardContent>
            <h1 className="text-2xl font-semibold text-zinc-900">Property not found</h1>
            <p className="mt-2 text-zinc-600">
              This property doesn’t exist (or isn’t published in this demo).
            </p>
            <div className="mt-6">
              <Link href="./" className="font-semibold underline">
                Back to listings
              </Link>
            </div>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
