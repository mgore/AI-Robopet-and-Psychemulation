import React from "react";
import { EquipmentComponentSearch } from "./EquipmentComponentSearch";
import { HardwareComponent } from "../types";

interface SourcingAndNeuralSearchProps {
  onAddComponent?: (item: unknown) => void;
  onAddContingency?: (item: unknown) => void;
  catalog?: HardwareComponent[];
  getComponentThumbnail?: (item: HardwareComponent) => string;
}

export const SourcingAndNeuralSearch: React.FC<SourcingAndNeuralSearchProps> = (props) => {
  return <EquipmentComponentSearch {...props} />;
};
