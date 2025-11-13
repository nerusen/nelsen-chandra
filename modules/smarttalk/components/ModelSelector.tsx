"use client";

import { useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const models = [
  { id: "minimax/minimax-m2:free", name: "MiniMax M2" },
  { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B" },
  { id: "qwen/qwen3-coder:free", name: "Qwen3 Coder" },
  { id: "qwen/qwen3-235b-a22b:free", name: "Qwen3 235B" },
  { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash" },
  { id: "google/gemma-3-27b-it:free", name: "Gemma 3 27B" },
  { id: "openai/gpt-oss-20b:free", name: "ChatGPT 20B" },
  { id: "moonshotai/kimi-dev-72b:free", name: "Kimi Dev 72B" },
  { id: "deepseek/deepseek-chat-v3-0324:free", name: "DeepSeek V3" },
  { id: "deepseek/deepseek-chat-v3.1:free", name: "DeepSeek V3.1" },
  { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1" },
  { id: "tngtech/deepseek-r1t2-chimera:free", name: "DeepSeek R1 T2 Chimera" },
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
