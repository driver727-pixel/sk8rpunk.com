import type { CharacterCard } from "../../game/types";

export interface CardForgeProps {
  onCardCreated: (card: CharacterCard) => void;
}
