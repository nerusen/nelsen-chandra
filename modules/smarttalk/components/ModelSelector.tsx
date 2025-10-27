"use client";

import { useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const models = [
  { id: "meta-llama/llama-3.1-70b-instruct:free", name: "Llama 3.1 70B (General)" },
  { id: "google/gemini-pro-1.5:free", name: "Gemini Pro 1.5 (Advanced)" },
  { id: "microsoft/wizardlm-2-8x22b:free", name: "WizardLM 2 8x22B (Coding)" },
  { id: "mistralai/mixtral-8x7b-instruct:free", name: "Mixtral 8x7B (Reasoning)" },
  { id: "meta-llama/llama-3.1-8b-instruct:free", name: "Llama 3.1 8B (Fast)" },
  { id: "google/gemini-flash-1.5:free", name: "Gemini Flash 1.5 (Speed)" },
  { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B (Balanced)" },
  { id: "openchat/openchat-7b:free", name: "OpenChat 7B (Conversational)" },
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
