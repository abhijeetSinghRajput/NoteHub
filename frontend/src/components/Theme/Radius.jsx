import { Label } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { Button } from "../ui/button";

const Radius = () => {
  const radius = [0, 0.3, 0.5, 0.75, 1.0];
  
  function setProperty(property, value) {
    console.log(property, value);
    value = value.startsWith("#") ? hexToHSL(value) : value;
    document.documentElement.style.setProperty(property, value);
  }

  return (
    <div className="space-y-1.5">
      <Label>Radius</Label>
      <div className="flex gap-2 flex-wrap">
        {radius.map((r) => (
          <Button
            variant="outline"
            key={r}
            onClick={() => setProperty("--radius", `${r}rem`)}
          >
            <span
              className="size-4 sm:size-6 border-t-2 border-l-2 bg-primary/20 border-primary/70 grayscale"
              style={{ borderTopLeftRadius: `${r}rem` }}
            />
            {r}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Radius;
