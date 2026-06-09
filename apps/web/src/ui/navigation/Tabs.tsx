interface Tab {
    label: string;
    value: string;
  }
  
  interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (
      value: string
    ) => void;
  }
  
  export function Tabs({
    tabs,
    activeTab,
    onChange
  }: TabsProps) {
    return (
      <div
        className="
          flex
          border-b
          gap-4
        "
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() =>
              onChange(tab.value)
            }
            className={`
              pb-2
  
              ${
                activeTab === tab.value
                  ? "border-b-2 border-slate-900"
                  : ""
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }