import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LocationService, Location, LGA } from "@/services/location.service";
import { Card, Button, Spinner, Badge, Modal, Input } from "@/ui";
import { ConfirmationModal } from "@/ui/overlays/ConfirmationModal";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  MapPin,
  Upload,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  NIGERIA_LGAS,
  STATE_NAMES,
  statesWithLGAs,
} from "@/data/nigeria-states";

export default function AdminLocations() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<Location | null>(null);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showLGAModal, setShowLGAModal] = useState(false);
  const [editingLGA, setEditingLGA] = useState<{
    state: string;
    lga: LGA;
  } | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [selectedLGA, setSelectedLGA] = useState("");

  // Confirmation modal states
  const [confirmationModal, setConfirmationModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    variant?: "danger" | "warning" | "info";
    onConfirm: () => void;
    loading?: boolean;
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [stateFormData, setStateFormData] = useState({
    state: "",
    deliveryFee: 0,
    estimatedDays: 3,
    isActive: true,
  });

  const [lgaFormData, setLgaFormData] = useState({
    name: "",
    deliveryFee: 0,
    estimatedDays: 3,
    isActive: true,
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-locations"],
    queryFn: () => LocationService.getAllLocations(),
  });

  const locations = data?.data || [];

  // Get all LGAs already added for the selected state
  const existingLGAs = useMemo(() => {
    if (!selectedState) return [];
    return selectedState.lgas.map((l) => l.name);
  }, [selectedState]);

  // Filter available LGAs that haven't been added yet AND are in the selected state
  const filteredAvailableLGAs = useMemo(() => {
    if (!selectedState) return [];

    // Get all LGAs for the selected state from the data
    const stateLGAs = statesWithLGAs[selectedState.state] || [];

    // Filter out LGAs that are already added
    return stateLGAs.filter((lga) => !existingLGAs.includes(lga)).sort();
  }, [selectedState, existingLGAs]);

  // Mutations
  const upsertStateMutation = useMutation({
    mutationFn: (data: any) => LocationService.upsertLocation(data),
    onSuccess: () => {
      toast.success("State saved successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      setShowStateModal(false);
      resetStateForm();
      setSelectedState(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save state");
    },
  });

  const toggleStateMutation = useMutation({
    mutationFn: (state: string) => LocationService.toggleState(state),
    onSuccess: () => {
      toast.success("State toggled successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      setConfirmationModal((prev) => ({ ...prev, open: false }));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to toggle state");
      setConfirmationModal((prev) => ({ ...prev, open: false }));
    },
  });

  const deleteStateMutation = useMutation({
    mutationFn: (state: string) => LocationService.deleteState(state),
    onSuccess: () => {
      toast.success("State deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      setConfirmationModal((prev) => ({ ...prev, open: false }));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete state");
      setConfirmationModal((prev) => ({ ...prev, open: false }));
    },
  });

  const addLGAMutation = useMutation({
    mutationFn: ({ state, data }: { state: string; data: any }) =>
      LocationService.addLGA(state, data),
    onSuccess: () => {
      toast.success("LGA added successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      setShowLGAModal(false);
      resetLGAForm();
      setSelectedLGA("");
      setEditingLGA(null);
      setSelectedState(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add LGA");
    },
  });

  const toggleLGAMutation = useMutation({
    mutationFn: ({ state, lga }: { state: string; lga: string }) =>
      LocationService.toggleLGA(state, lga),
    onSuccess: () => {
      toast.success("LGA toggled successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      setConfirmationModal((prev) => ({ ...prev, open: false }));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to toggle LGA");
      setConfirmationModal((prev) => ({ ...prev, open: false }));
    },
  });

  const updateLGAMutation = useMutation({
    mutationFn: ({
      state,
      lga,
      data,
    }: {
      state: string;
      lga: string;
      data: any;
    }) => LocationService.updateLGA(state, lga, data),
    onSuccess: () => {
      toast.success("LGA updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      setShowLGAModal(false);
      resetLGAForm();
      setEditingLGA(null);
      setSelectedState(null);
      setSelectedLGA("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update LGA");
    },
  });

  const removeLGAMutation = useMutation({
    mutationFn: ({ state, lga }: { state: string; lga: string }) =>
      LocationService.removeLGA(state, lga),
    onSuccess: () => {
      toast.success("LGA removed successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      setConfirmationModal((prev) => ({ ...prev, open: false }));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove LGA");
      setConfirmationModal((prev) => ({ ...prev, open: false }));
    },
  });

  const seedLocationsMutation = useMutation({
    mutationFn: () => LocationService.seedLocations(),
    onSuccess: () => {
      toast.success("Default locations seeded successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      setIsSeeding(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to seed locations");
      setIsSeeding(false);
    },
  });

  const resetStateForm = () => {
    setStateFormData({
      state: "",
      deliveryFee: 0,
      estimatedDays: 3,
      isActive: true,
    });
  };

  const resetLGAForm = () => {
    setLgaFormData({
      name: "",
      deliveryFee: 0,
      estimatedDays: 3,
      isActive: true,
    });
    setSelectedLGA("");
  };

  const handleEditState = (location: Location) => {
    setSelectedState(location);
    setStateFormData({
      state: location.state,
      deliveryFee: location.deliveryFee || 0,
      estimatedDays: location.estimatedDays || 3,
      isActive: location.isActive,
    });
    setShowStateModal(true);
  };

  const handleEditLGA = (state: string, lga: LGA) => {
    // Find the state object from locations
    const stateObj = locations.find((loc: Location) => loc.state === state);
    if (stateObj) {
      setSelectedState(stateObj);
    }
    setEditingLGA({ state, lga });
    setLgaFormData({
      name: lga.name,
      deliveryFee: lga.deliveryFee || 0,
      estimatedDays: lga.estimatedDays || 3,
      isActive: lga.isActive,
    });
    setShowLGAModal(true);
  };

  const handleAddLGA = (state: Location) => {
    setSelectedState(state);
    setSelectedLGA("");
    setEditingLGA(null);
    resetLGAForm();
    setShowLGAModal(true);
  };

  const handleSeedLocations = () => {
    setConfirmationModal({
      open: true,
      title: "Seed Default Locations",
      message:
        "This will add default states and LGAs (Lagos, Abuja, Port Harcourt, etc.). Continue?",
      confirmText: "Seed Locations",
      variant: "info",
      onConfirm: () => {
        setIsSeeding(true);
        seedLocationsMutation.mutate();
      },
    });
  };

  const handleToggleState = (state: string, currentStatus: boolean) => {
    setConfirmationModal({
      open: true,
      title: currentStatus ? "Deactivate State" : "Activate State",
      message: currentStatus
        ? `Are you sure you want to deactivate "${state}"? This will make it unavailable for delivery.`
        : `Are you sure you want to activate "${state}"? This will make it available for delivery.`,
      confirmText: currentStatus ? "Deactivate" : "Activate",
      variant: currentStatus ? "danger" : "warning",
      onConfirm: () => toggleStateMutation.mutate(state),
    });
  };

  const handleDeleteState = (state: string) => {
    setConfirmationModal({
      open: true,
      title: "Delete State",
      message: `Are you sure you want to delete "${state}" and all its LGAs? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
      onConfirm: () => deleteStateMutation.mutate(state),
    });
  };

  const handleToggleLGA = (
    state: string,
    lga: string,
    currentStatus: boolean
  ) => {
    setConfirmationModal({
      open: true,
      title: currentStatus ? "Deactivate LGA" : "Activate LGA",
      message: currentStatus
        ? `Are you sure you want to deactivate "${lga}" in ${state}?`
        : `Are you sure you want to activate "${lga}" in ${state}?`,
      confirmText: currentStatus ? "Deactivate" : "Activate",
      variant: currentStatus ? "danger" : "warning",
      onConfirm: () => toggleLGAMutation.mutate({ state, lga }),
    });
  };

  const handleRemoveLGA = (state: string, lga: string) => {
    setConfirmationModal({
      open: true,
      title: "Remove LGA",
      message: `Are you sure you want to remove "${lga}" from ${state}? This action cannot be undone.`,
      confirmText: "Remove",
      variant: "danger",
      onConfirm: () => removeLGAMutation.mutate({ state, lga }),
    });
  };

  const handleLGAFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingLGA) {
      updateLGAMutation.mutate({
        state: editingLGA.state,
        lga: editingLGA.lga.name,
        data: lgaFormData,
      });
    } else if (selectedState) {
      if (!selectedLGA) {
        toast.error("Please select an LGA");
        return;
      }
      addLGAMutation.mutate({
        state: selectedState.state,
        data: {
          name: selectedLGA,
          deliveryFee: lgaFormData.deliveryFee,
          estimatedDays: lgaFormData.estimatedDays,
          isActive: lgaFormData.isActive,
        },
      });
    }
  };

  const filteredLocations = locations.filter((loc: Location) =>
    loc.state.toLowerCase().includes(search.toLowerCase())
  );

  const totalStates = locations.length;
  const activeStates = locations.filter((loc: Location) => loc.isActive).length;
  const totalLGAs = locations.reduce(
    (acc: number, loc: Location) => acc + loc.lgas.length,
    0
  );
  const activeLGAs = locations.reduce(
    (acc: number, loc: Location) =>
      acc + loc.lgas.filter((l: LGA) => l.isActive).length,
    0
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">
            Delivery Locations
          </h1>
          <p className="text-gray-500 mt-1">
            Manage states and LGAs available for delivery
          </p>
        </div>
        <div className="flex gap-3">
          {locations.length === 0 && (
            <Button
              onClick={handleSeedLocations}
              disabled={isSeeding}
              variant="secondary"
            >
              {isSeeding ? (
                <Spinner size="sm" />
              ) : (
                <Upload size={18} className="mr-2" />
              )}
              Seed Default Locations
            </Button>
          )}
          <Button
            onClick={() => {
              resetStateForm();
              setSelectedState(null);
              setShowStateModal(true);
            }}
          >
            <Plus size={18} className="mr-2" />
            Add State
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total States</p>
          <p className="text-2xl font-bold text-brand-text">
            {totalStates}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Active States</p>
          <p className="text-2xl font-bold text-green-600">{activeStates}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total LGAs</p>
          <p className="text-2xl font-bold text-brand-text">
            {totalLGAs}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Active LGAs</p>
          <p className="text-2xl font-bold text-green-600">{activeLGAs}</p>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search states..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>

      {/* Locations Grid */}
      {filteredLocations.length === 0 ? (
        <Card className="text-center py-12">
          <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-600">
            No Locations Found
          </h3>
          <p className="text-gray-400 mt-1">
            {search
              ? "Try adjusting your search"
              : "Add your first delivery location"}
          </p>
          {!search && (
            <Button
              onClick={() => {
                resetStateForm();
                setSelectedState(null);
                setShowStateModal(true);
              }}
              className="mt-4"
            >
              <Plus size={18} className="mr-2" />
              Add State
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLocations.map((location: Location) => (
            <Card
              key={location._id}
              className="p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-brand-text">
                      {location.state}
                    </h3>
                    {location.isActive ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="danger">Inactive</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>{location.lgas.length} LGAs</span>
                    <span>Fee: ₦{location.deliveryFee || 0}</span>
                    <span>{location.estimatedDays || 3} days</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {location.lgas.slice(0, 3).map((lga) => (
                      <Badge
                        key={lga.name}
                        variant={lga.isActive ? "secondary" : "default"}
                      >
                        {lga.name}
                      </Badge>
                    ))}
                    {location.lgas.length > 3 && (
                      <Badge variant="default">
                        +{location.lgas.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditState(location)}
                    className="p-1.5 rounded hover:bg-gray-100"
                    title="Edit State"
                  >
                    <Edit size={16} className="text-gray-500" />
                  </button>
                  <button
                    onClick={() =>
                      handleToggleState(location.state, location.isActive)
                    }
                    className="p-1.5 rounded hover:bg-gray-100"
                    title="Toggle State"
                  >
                    {location.isActive ? (
                      <XCircle size={16} className="text-red-400" />
                    ) : (
                      <CheckCircle size={16} className="text-green-400" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteState(location.state)}
                    className="p-1.5 rounded hover:bg-red-50"
                    title="Delete State"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>

              {/* LGA Management */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    LGAs ({location.lgas.length})
                  </span>
                  <button
                    onClick={() => handleAddLGA(location)}
                    className="text-xs text-brand-primary hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add LGA
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {location.lgas.map((lga) => (
                    <div
                      key={lga.name}
                      className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            lga.isActive
                              ? "text-gray-700"
                              : "text-gray-400 line-through"
                          }
                        >
                          {lga.name}
                        </span>
                        {lga.isActive ? (
                          <span className="text-xs text-green-600">Active</span>
                        ) : (
                          <span className="text-xs text-red-500">Inactive</span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditLGA(location.state, lga)}
                          className="p-1 rounded hover:bg-gray-200"
                          title="Edit LGA"
                        >
                          <Edit size={14} className="text-gray-500" />
                        </button>
                        <button
                          onClick={() =>
                            handleToggleLGA(
                              location.state,
                              lga.name,
                              lga.isActive
                            )
                          }
                          className="p-1 rounded hover:bg-gray-200"
                          title="Toggle LGA"
                        >
                          {lga.isActive ? (
                            <XCircle size={14} className="text-red-400" />
                          ) : (
                            <CheckCircle size={14} className="text-green-400" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleRemoveLGA(location.state, lga.name)
                          }
                          className="p-1 rounded hover:bg-red-50"
                          title="Remove LGA"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {location.lgas.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-2">
                      No LGAs added yet
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* State Modal */}
      <Modal
        open={showStateModal}
        title={selectedState ? "Edit State" : "Add State"}
        onClose={() => {
          setShowStateModal(false);
          resetStateForm();
          setSelectedState(null);
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            upsertStateMutation.mutate(stateFormData);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={stateFormData.state}
                onChange={(e) =>
                  setStateFormData({ ...stateFormData, state: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none"
                required
              >
                <option value="">Select a state</option>
                {STATE_NAMES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <Input
            label="Default Delivery Fee (₦)"
            type="number"
            value={
              stateFormData.deliveryFee === 0 ? "" : stateFormData.deliveryFee
            }
            onChange={(e) => {
              const value = e.target.value;
              setStateFormData({
                ...stateFormData,
                deliveryFee: value === "" ? 0 : parseFloat(value),
              });
            }}
            placeholder="Enter delivery fee"
          />

          <Input
            label="Estimated Delivery Days"
            type="number"
            value={
              stateFormData.estimatedDays === 0
                ? ""
                : stateFormData.estimatedDays
            }
            onChange={(e) => {
              const value = e.target.value;
              setStateFormData({
                ...stateFormData,
                estimatedDays: value === "" ? 0 : parseInt(value),
              });
            }}
            placeholder="Enter estimated days"
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={stateFormData.isActive}
              onChange={(e) =>
                setStateFormData({
                  ...stateFormData,
                  isActive: e.target.checked,
                })
              }
              className="w-4 h-4 text-brand-primary rounded"
            />
            <span className="text-sm text-gray-700">
              Active (available for delivery)
            </span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowStateModal(false);
                resetStateForm();
                setSelectedState(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={upsertStateMutation.isPending}
              className="flex-1"
            >
              {upsertStateMutation.isPending ? (
                <Spinner size="sm" />
              ) : selectedState ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* LGA Modal */}
      <Modal
        open={showLGAModal}
        title={editingLGA ? "Edit LGA" : "Add LGA"}
        onClose={() => {
          setShowLGAModal(false);
          resetLGAForm();
          setEditingLGA(null);
          setSelectedState(null);
          setSelectedLGA("");
        }}
      >
        <form onSubmit={handleLGAFormSubmit} className="space-y-4">
          <p className="text-sm text-gray-500">
            {editingLGA
              ? `Editing "${editingLGA.lga.name}" in ${editingLGA.state}`
              : `Adding LGA to ${selectedState?.state || ''}`}
          </p>

          {!editingLGA ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select LGA <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedLGA}
                  onChange={(e) => setSelectedLGA(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none"
                  required
                  disabled={
                    !selectedState || filteredAvailableLGAs.length === 0
                  }
                >
                  <option value="">Select an LGA</option>
                  {filteredAvailableLGAs.map((lga) => (
                    <option key={lga} value={lga}>
                      {lga}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              {!selectedState && (
                <p className="text-xs text-yellow-600 mt-1">
                  Please select a state first
                </p>
              )}
              {selectedState && filteredAvailableLGAs.length === 0 && (
                <p className="text-xs text-green-600 mt-1">
                  ✅ All LGAs for this state have been added
                </p>
              )}
            </div>
          ) : (
            <Input label="LGA Name" value={lgaFormData.name} disabled />
          )}

          <Input
            label="Delivery Fee (₦)"
            type="number"
            value={lgaFormData.deliveryFee === 0 ? "" : lgaFormData.deliveryFee}
            onChange={(e) => {
              const value = e.target.value;
              setLgaFormData({
                ...lgaFormData,
                deliveryFee: value === "" ? 0 : parseFloat(value),
              });
            }}
            placeholder="Enter delivery fee"
          />

          <Input
            label="Estimated Delivery Days"
            type="number"
            value={
              lgaFormData.estimatedDays === 0 ? "" : lgaFormData.estimatedDays
            }
            onChange={(e) => {
              const value = e.target.value;
              setLgaFormData({
                ...lgaFormData,
                estimatedDays: value === "" ? 0 : parseInt(value),
              });
            }}
            placeholder="Enter estimated days"
          />    
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={lgaFormData.isActive}
              onChange={(e) =>
                setLgaFormData({ ...lgaFormData, isActive: e.target.checked })
              }
              className="w-4 h-4 text-brand-primary rounded"
            />
            <span className="text-sm text-gray-700">
              Active (available for delivery)
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowLGAModal(false);
                resetLGAForm();
                setEditingLGA(null);
                setSelectedState(null);
                setSelectedLGA("");
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                addLGAMutation.isPending ||
                updateLGAMutation.isPending ||
                (!editingLGA && !selectedLGA)
              }
              className="flex-1"
            >
              {addLGAMutation.isPending || updateLGAMutation.isPending ? (
                <Spinner size="sm" />
              ) : editingLGA ? (
                "Update"
              ) : (
                "Add"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmationModal.open}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText || "Confirm"}
        variant={confirmationModal.variant || "danger"}
        loading={
          toggleStateMutation.isPending ||
          deleteStateMutation.isPending ||
          toggleLGAMutation.isPending ||
          removeLGAMutation.isPending ||
          seedLocationsMutation.isPending
        }
        onConfirm={confirmationModal.onConfirm}
        onCancel={() =>
          setConfirmationModal((prev) => ({ ...prev, open: false }))
        }
      />
    </div>
  );
}