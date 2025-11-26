import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function WhatIfSimulator() {
  const [requiredRakes, setRequiredRakes] = useState([17]);
  const [brandingWeight, setBrandingWeight] = useState([50]);
  const [mileageWeight, setMileageWeight] = useState([50]);

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">What-If Simulation</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-foreground">Required Rakes for Service</Label>
            <Badge variant="secondary">{requiredRakes[0]}</Badge>
          </div>
          <Slider
            value={requiredRakes}
            onValueChange={setRequiredRakes}
            min={15}
            max={20}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-foreground">Branding Priority Weight</Label>
            <Badge variant="secondary">{brandingWeight[0]}%</Badge>
          </div>
          <Slider
            value={brandingWeight}
            onValueChange={setBrandingWeight}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-foreground">Mileage Balance Weight</Label>
            <Badge variant="secondary">{mileageWeight[0]}%</Badge>
          </div>
          <Slider
            value={mileageWeight}
            onValueChange={setMileageWeight}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        <Button className="w-full" variant="default">
          Recalculate Rankings
        </Button>

        <div className="rounded-lg bg-muted/30 p-4">
          <p className="text-sm font-medium text-foreground">Simulation Impact</p>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            <p>• {requiredRakes[0]} rakes will be selected for revenue service</p>
            <p>• Branding SLA weighted at {brandingWeight[0]}%</p>
            <p>• Mileage balancing weighted at {mileageWeight[0]}%</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
