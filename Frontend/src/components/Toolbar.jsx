import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  RotateCcw, 
  Download, 
  Users, 
  Settings, 
  Minus, 
  Plus, 
  Circle,
  Brush,
  Undo2,
  Redo2,
  Save,
  Share2,
  Eye,
  EyeOff,
  ChevronDown
} from 'lucide-react';

const Toolbar = ({ 
  // Drawing state
  color, 
  setColor,
  strokeWidth, 
  setStrokeWidth,
  currentTool,
  setCurrentTool,
  
  // Actions
  onClear,
  onDownload,
  onUndo,
  onRedo,
  onSave,
  onShare,
  
  // State indicators
  canUndo = false,
  canRedo = false,
  isConnected = false,
  activeUsers = 1,
  
  // UI state
  isMinimized = false,
  onToggleMinimize 
}) => {
  const [showControls, setShowControls] = useState(true);
  const [activeTab, setActiveTab] = useState('tools');

  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
    '#f97316', '#6366f1', '#14b8a6', '#eab308'
  ];

  const handleClearWithConfirm = () => {
    if (window.confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
      onClear?.();
    }
  };

  // Minimized state - compact status bar
  if (isMinimized) {
    return (
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-4 right-4 z-30"
      >
        <div className="flex items-center justify-center">
          {/* Status indicator */}
          

          {/* Current tool info */}
          <motion.button
            onClick={onToggleMinimize}
            className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg border border-white/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm font-medium text-gray-700">{strokeWidth}px</span>
              <Eye className="w-4 h-4 text-gray-500" />
            </div>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed top-4 left-4 right-4 z-30"
    >
      <div className="flex items-start justify-center gap-4">

        {/* Main Control Panel */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden max-w-sm"
            >
              {/* Header with tabs */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex gap-1">
                  {[
                    { id: 'tools', label: 'Tools', icon: Brush },
                    { id: 'colors', label: 'Colors', icon: Palette }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'tools' && (
                  <motion.div
                    key="tools"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 space-y-4"
                  >
                    {/* Tool Selection */}
                    <div className="flex gap-2">
                      {[
                        { id: 'brush', icon: Circle, label: 'Brush' },
                      ].map((tool) => (
                        <motion.button
                          key={tool.id}
                          onClick={() => setCurrentTool(tool.id)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl transition-all text-sm font-medium ${
                            currentTool === tool.id
                              ? 'bg-blue-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <tool.icon className="w-4 h-4" />
                          {tool.label}
                        </motion.button>
                      ))}
                    </div>

                    {/* Brush Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size: {strokeWidth}px
                      </label>
                      <div className="flex items-center gap-3">
                        <motion.button
                          onClick={() => setStrokeWidth(Math.max(1, strokeWidth - 1))}
                          className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg"
                          whileTap={{ scale: 0.9 }}
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        <input
                          type="range"
                          min="1"
                          max="50"
                          value={strokeWidth}
                          onChange={(e) => setStrokeWidth(Number(e.target.value))}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <motion.button
                          onClick={() => setStrokeWidth(Math.min(50, strokeWidth + 1))}
                          className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg"
                          whileTap={{ scale: 0.9 }}
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <motion.button
                        onClick={onUndo}
                        disabled={!canUndo}
                        className={`p-2 rounded-lg ${canUndo ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300'}`}
                        whileHover={canUndo ? { scale: 1.05 } : {}}
                        whileTap={canUndo ? { scale: 0.95 } : {}}
                      >
                        <Undo2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={onRedo}
                        disabled={!canRedo}
                        className={`p-2 rounded-lg ${canRedo ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300'}`}
                        whileHover={canRedo ? { scale: 1.05 } : {}}
                        whileTap={canRedo ? { scale: 0.95 } : {}}
                      >
                        <Redo2 className="w-4 h-4" />
                      </motion.button>
                      <div className="flex-1" />
                      <motion.button
                        onClick={onDownload}
                        className="p-2 rounded-lg text-green-600 hover:bg-green-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={handleClearWithConfirm}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'colors' && (
                  <motion.div
                    key="colors"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 space-y-4"
                  >
                    {/* Current Color */}
                    <div className="text-center">
                      <motion.div
                        className="w-12 h-12 rounded-2xl shadow-lg border-4 border-white mx-auto mb-2"
                        style={{ backgroundColor: color }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      />
                      <p className="text-xs text-gray-500 uppercase font-mono">{color}</p>
                    </div>

                    {/* Color Grid */}
                    <div className="grid grid-cols-4 gap-2">
                      {colors.map((clr) => (
                        <motion.button
                          key={clr}
                          onClick={() => setColor(clr)}
                          className={`w-full aspect-square rounded-lg border-2 ${
                            color === clr ? 'border-gray-400 scale-110' : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: clr }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        />
                      ))}
                    </div>

                    {/* Custom Color */}
                    <div className="pt-2 border-t border-gray-100">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.button
          onClick={() => setShowControls(!showControls)}
          className="bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showControls ? <EyeOff className="w-5 h-5 text-gray-600" /> : <Settings className="w-5 h-5 text-gray-600" />}
        </motion.button>

      
      </div>
    </motion.div>
  );
};

export default Toolbar;