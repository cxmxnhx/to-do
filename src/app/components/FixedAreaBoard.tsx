"use client";
import React from "react";

interface Card {
  id: number;
  name: string;
}

interface FixedAreaBoardProps {
  cards: Card[];
  removeCard?: (id: number) => void;
}

const FixedAreaBoard: React.FC<FixedAreaBoardProps> = ({ cards, removeCard }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 border border-gray-300 rounded-lg bg-gray-100">
      <h2 className="text-xl font-bold mb-4 text-center">Modo Padrão</h2>
      <div className="grid grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white p-4 rounded shadow text-black flex justify-between items-center"
          >
            <span>{card.name}</span>
            {removeCard && (
              <button
                onClick={() => removeCard(card.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                X
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FixedAreaBoard;
