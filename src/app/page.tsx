import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="min-h-screen bg-sea-salt text-deep-slate p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-ocean-blue mb-4">
            Decentralizing Blue Carbon for a Greener Planet
          </h1>
          <p className="text-lg text-deep-slate max-w-2xl mx-auto">
            Samudra Chain is a blockchain-based Blue Carbon Credit (BCC) registry that enables transparent and secure trading of carbon credits.
          </p>
        </header>

        {/* Button Variants Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button intent="primary">Primary Button</Button>
            <Button intent="secondary">Secondary Button</Button>
            <Button intent="outline">Outline Button</Button>
            <Button intent="ghost">Ghost Button</Button>
            
            <Button intent="primary" size="sm">Small Primary</Button>
            <Button intent="primary" size="default">Default Primary</Button>
            <Button intent="primary" size="lg">Large Primary</Button>
          </div>
        </section>

        {/* Card Component Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Project Card</h2>
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Mangrove Restoration Project</CardTitle>
              <CardDescription>
                Coastal mangrove restoration in the Sundarbans, India
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-deep-slate">
                This project aims to restore 500 hectares of mangrove forests, 
                sequestering an estimated 50,000 tons of CO2 over 20 years.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button intent="outline" size="sm">Learn More</Button>
              <Button intent="primary" size="sm">Invest</Button>
            </CardFooter>
          </Card>
        </section>

        {/* Input Component Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Form Input</h2>
          <div className="max-w-md">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input 
              type="email" 
              id="email" 
              placeholder="Enter your email" 
              className="mb-4"
            />
            
            <label htmlFor="amount" className="block text-sm font-medium mb-2">
              Investment Amount (USD)
            </label>
            <Input 
              type="number" 
              id="amount" 
              placeholder="Enter amount" 
            />
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Join the Blue Carbon Revolution</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Be part of the solution. Invest in blue carbon projects and help combat climate change.
          </p>
          <div className="flex justify-center gap-4">
            <Button intent="primary" size="lg">Get Started</Button>
            <Button intent="outline" size="lg">Learn More</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
