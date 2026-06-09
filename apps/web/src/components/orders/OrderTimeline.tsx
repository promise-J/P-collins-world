import { CheckCircle, Clock, Package, Truck, Home } from 'lucide-react';

interface OrderTimelineProps {
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

const timelineSteps = [
  { key: 'PENDING', label: 'Order Placed', icon: Clock },
  { key: 'PAID', label: 'Payment Confirmed', icon: CheckCircle },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: Home },
];

export function OrderTimeline({ status }: OrderTimelineProps) {
  const getCurrentStepIndex = () => {
    const index = timelineSteps.findIndex(step => step.key === status);
    return index === -1 ? 0 : index;
  };

  const currentStep = getCurrentStepIndex();

  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium">Order Cancelled</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {timelineSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.key} className="flex-1 relative">
              <div className="flex flex-col items-center">
                {/* Connector Line */}
                {index < timelineSteps.length - 1 && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-0.5 -translate-y-1/2
                      ${isCompleted ? 'bg-[var(--color-brand-primary)]' : 'bg-gray-200'}
                    `}
                    style={{ width: 'calc(100% - 2rem)', left: 'calc(50% + 1rem)' }}
                  />
                )}
                
                {/* Icon Circle */}
                <div
                  className={`
                    relative z-10 w-8 h-8 rounded-full flex items-center justify-center
                    ${isCompleted 
                      ? 'bg-[var(--color-brand-primary)] text-white' 
                      : 'bg-gray-200 text-gray-400'
                    }
                    ${isCurrent ? 'ring-4 ring-[var(--color-brand-primary)]/20' : ''}
                  `}
                >
                  <Icon size={16} />
                </div>
                
                {/* Label */}
                <p className={`text-xs mt-2 font-medium ${isCompleted ? 'text-[var(--color-brand-text)]' : 'text-gray-400'}`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}