import { useState } from "react";

export const useAnalyticsModals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedZardal, setSelectedZardal] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState({});
  const [departmentLevels, setDepartmentLevels] = useState({});
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState([]);
  const [dialogTitle, setDialogTitle] = useState("");
  const [attentionModalOpen, setAttentionModalOpen] = useState(false);
  const [attentionComments, setAttentionComments] = useState([]);
  const [commentFilter, setCommentFilter] = useState("all");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showEmployeeDialog = (type, apiChartData) => {
    if (type === "least") {
      setSelectedEmployeeData(apiChartData.ajiltanSanal || []);
      setDialogTitle("Бага саналтай албан хаагчид");
    } else if (type === "most") {
      setSelectedEmployeeData(apiChartData.ajiltanSanalHighest || []);
      setDialogTitle("Их саналтай албан хаагчид");
    }
    setEmployeeDialogOpen(true);
  };

  const showAttentionModal = () => {
    setAttentionModalOpen(true);
  };

  const handleEmployeeDialogCancel = () => {
    setEmployeeDialogOpen(false);
    setSelectedEmployeeData([]);
    setDialogTitle("");
  };

  const handleAttentionModalCancel = () => {
    setAttentionModalOpen(false);
    setAttentionComments([]);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return {
    isModalOpen,
    sidebarOpen,
    selectedZardal,
    setSelectedZardal,
    selectedDepartments,
    setSelectedDepartments,
    departmentLevels,
    setDepartmentLevels,
    employeeDialogOpen,
    selectedEmployeeData,
    dialogTitle,
    attentionModalOpen,
    attentionComments,
    setAttentionComments,
    commentFilter,
    setCommentFilter,
    showModal,
    handleOk,
    handleCancel,
    showEmployeeDialog,
    showAttentionModal,
    handleEmployeeDialogCancel,
    handleAttentionModalCancel,
    toggleSidebar,
  };
};
