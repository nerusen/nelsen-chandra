"use client";

import { useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const models = [
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
  { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "meta-llama/llama-3.1-8b-instruct", name: "Llama 3.1 8B" },
  { id: "google/gemini-flash-1.5", name: "Gemini Flash 1.5" },
  { id: "microsoft/wizardlm-2-8x22b", name: "WizardLM 2 8x22B" },
  { id: "mistralai/mistral-7b-instruct", name: "Mistral 7B" },
  { id: "cohere/command-r-plus", name: "Command R+" },
  { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku" },
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
