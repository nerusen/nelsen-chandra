"use client";

import { useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const models = [
  { id: "minimax/minimax-01", name: "MiniMax M2" },
  { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B Instruct" },
  { id: "qwen/qwen2.5-coder-32b-instruct:free", name: "Qwen2.5 Coder 32B" },
  { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash Exp" },
  { id: "moonshotai/moonlight-16b-a3b-instruct:free", name: "Moonlight 16B A3B" },
  { id: "deepseek/deepseek-chat:free", name: "DeepSeek V3" },
  { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1" },
  { id: "tng/deepseek-r1-t2-chimera:free", name: "DeepSeek R1 T2 Chimera" },
];

const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentModel = models.find((m) => m.id === selectedModel) || models[0];

  const handleSelect = (modelId: string) => {
    onModelChange(modelId);
    setIsOpen(false);
  };

  return (
    <div className="relative mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-sm text-neutral-200 hover:bg-neutral-700 transition-colors"
      >
        <span className="truncate">{currentModel.name}</span>
        {isOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-neutral-800/95 backdrop-blur-md border border-neutral-600 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => handleSelect(model.id)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-emerald-600/20 transition-colors ${
                  selectedModel === model.id
                    ? "bg-emerald-600/30 text-emerald-300"
                    : "text-neutral-200"
                }`}
              >
                {model.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ModelSelector;
