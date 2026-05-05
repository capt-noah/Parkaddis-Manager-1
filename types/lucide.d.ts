// Type augmentation for lucide-react-native
// Adds the `color` and `size` props that exist at runtime but are missing
// from the LucideProps type definitions in v1.x

import { ComponentProps } from 'react';

declare module 'lucide-react-native' {
  interface LucideProps {
    color?: string;
    size?: number | string;
    strokeWidth?: number;
    absoluteStrokeWidth?: boolean;
    className?: string;
  }
}
