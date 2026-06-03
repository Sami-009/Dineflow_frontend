// OrderStatusStepper.jsx
import React from 'react';
import { ClipboardList, ChefHat, CheckCircle2 } from 'lucide-react';

export const OrderStatusStepper = ({ status }) => {
  const steps = [
    { label: 'Pending', icon: ClipboardList, val: 'Pending' },
    { label: 'Preparing', icon: ChefHat, val: 'Preparing' },
    { label: 'Completed', icon: CheckCircle2, val: 'Completed' },
  ];

  const getStepIndex = (s) => {
    if (s === 'Pending') return 0;
    if (s === 'Preparing') return 1;
    if (s === 'Completed') return 2;
    return 0;
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="w-full py-4">
      {/* Visual Line Progress */}
      <div className="relative flex items-center justify-between">
        {/* Connection Line Backdrop */}
        <div className="absolute left-0 top-1/2 h-1 w-full bg-gray-100 -translate-y-1/2 rounded-full"></div>
        {/* Connection Line Active Overlay */}
        <div
          className="absolute left-0 top-1/2 h-1 bg-orange-500 -translate-y-1/2 rounded-full transition-all duration-700"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isUpcoming = index > currentIndex;

          let circleClass = 'bg-gray-100 text-gray-400 border-gray-100';
          if (isActive) {
            circleClass = 'bg-white text-orange-500 border-orange-500 ring-4 ring-orange-100 scale-110 shadow';
          } else if (isCompleted) {
            circleClass = 'bg-orange-500 text-white border-orange-500';
          }

          return (
            <div key={step.label} className="relative z-10 flex flex-col items-center">
              {/* Icon Circle */}
              <div
                className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${circleClass}`}
              >
                <StepIcon className="h-5 w-5" />
              </div>
              
              {/* Label */}
              <span
                className={`mt-2 text-xs font-bold transition-all duration-300 ${
                  isActive ? 'text-orange-600 font-extrabold scale-105' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusStepper;
