import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterPanelProps {
  onSearchChange: (value: string) => void;
  onStatusFilter: (value: string) => void;
  onBrandingFilter: (value: string) => void;
}

export function FilterPanel({ onSearchChange, onStatusFilter, onBrandingFilter }: FilterPanelProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by Rake ID..."
          className="pl-9"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Select onValueChange={onStatusFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Service Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="ready">Ready</SelectItem>
          <SelectItem value="suboptimal">Suboptimal</SelectItem>
          <SelectItem value="blocked">Blocked</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={onBrandingFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Branding" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Brands</SelectItem>
          <SelectItem value="KMRL">KMRL</SelectItem>
          <SelectItem value="Brand-Partner-A">Brand Partner A</SelectItem>
          <SelectItem value="Brand-Partner-B">Brand Partner B</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon">
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
}
