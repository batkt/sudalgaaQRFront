"use client";

import { memo } from "react";
import { DatePicker, Select } from "antd";
import moment from "moment";

const AnalyticsFilters = memo(
  ({
    ognoo,
    onChangeOgnoo,
    zardalGaralt,
    selectedZardal,
    setSelectedZardal,
    setZardalKhuudaslalt,
    ajiltanGaralt,
    selectedDepartments,
    setSelectedDepartments,
    departmentLevels,
    getAvailableOptionsForLevel,
    handleDepartmentSelect,
    maxLevel,
  }) => {
    return (
      <div className="flex flex-col lg:flex-row justify-between w-90vw lg:w-full gap-4 [@media(min-width:1024px)_and_(max-width:1280px)]:justify-center">
        <div className="flex flex-col gap-2 lg:flex lg:flex-row lg:items-center lg:justify-start lg:overflow-x-auto [@media(min-width:1024px)_and_(max-width:1280px)]:justify-center">
          <div className="w-full lg:min-w-fit lg:w-auto">
            <DatePicker.RangePicker
              size="middle"
              className="w-full lg:w-[236px]"
              placeholder={["Эхлэх огноо", "Дуусах огноо"]}
              format={"YYYY-MM-DD"}
              value={ognoo ? [moment(ognoo[0]), moment(ognoo[1])] : null}
              onChange={onChangeOgnoo}
              allowClear={true}
              showToday={true}
              disabledDate={(current) => {
                // Disable dates more than 1 year in the future
                return current && current > moment().add(1, "year");
              }}
            />
          </div>

          <div className="grid w-full grid-cols-2 gap-2 lg:contents">


            <div className="lg:min-w-fit lg:w-auto">
              <Select
                showSearch
                className="w-full lg:min-w-fit"
                allowClear
                placeholder="Бүлэг"
                size="middle"
                onSearch={(search) =>
                  setZardalKhuudaslalt((v) => ({ ...v, search }))
                }
                onChange={(value) => {
                  const selected = zardalGaralt?.jagsaalt?.find(
                    (z) => z.ner === value
                  );
                  setSelectedZardal(selected);
                }}
                onClear={() => {
                  setSelectedZardal(null);
                }}
              >
                {zardalGaralt?.jagsaalt?.map((zardal) => (
                  <Select.Option key={zardal?._id} value={zardal?.ner}>
                    {zardal?.ner}
                    {zardal?.dedKhesguud && zardal.dedKhesguud.length > 0 && (
                      <span className="ml-2 text-xs text-gray-400">
                        ({zardal.dedKhesguud.length})
                      </span>
                    )}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {/* Hierarchical Department Selection */}
            {selectedZardal &&
              maxLevel >= 0 &&
              Array.from({ length: maxLevel + 1 }, (_, level) => {
                const options = getAvailableOptionsForLevel(level);
                const hasParentSelected =
                  level === 0 || selectedDepartments[level - 1];

                if (!hasParentSelected && level > 0) return null;

                const levelNames = [
                  "Үндсэн дэд бүлэг",
                  "Дэд дэд бүлэг",
                  "3-р түвшин",
                  "4-р түвшин",
                  "5-р түвшин",
                ];
                const placeholder =
                  levelNames[level] || `${level + 1}-р түвшин`;

                return (
                  <div key={level} className="lg:min-w-fit lg:w-auto">
                    <Select
                      showSearch
                      className="w-full lg:min-w-fit"
                      allowClear
                      placeholder={placeholder}
                      size="middle"
                      value={selectedDepartments[level]}
                      onChange={(value) => handleDepartmentSelect(level, value)}
                      onClear={() => {
                        const newSelections = {};
                        for (let i = 0; i < level; i++) {
                          newSelections[i] = selectedDepartments[i];
                        }
                        setSelectedDepartments(newSelections);
                      }}
                      disabled={!hasParentSelected}
                    >
                      {options.map((dept) => (
                        <Select.Option key={dept._id} value={dept.ner}>
                          {dept.ner}
                          {dept.dedKhesguud && dept.dedKhesguud.length > 0 && (
                            <span className="ml-2 text-xs text-gray-400">
                              ({dept.dedKhesguud.length})
                            </span>
                          )}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                );
              })}

            <div className="lg:min-w-fit lg:w-auto">
              <Select
                showSearch
                className="w-full lg:min-w-fit"
                allowClear
                placeholder="Ажилтан"
                size="middle"
                onSearch={(search) =>
                  ajiltanGaralt.setKhuudaslalt((v) => ({ ...v, search }))
                }
              >
                {ajiltanGaralt?.jagsaalt?.map((ajiltan) => (
                  <Select.Option key={ajiltan?._id} value={ajiltan?.ner}>
                    {ajiltan?.ovog && ajiltan?.ovog[0] + "."}
                    {ajiltan?.ner}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AnalyticsFilters.displayName = "AnalyticsFilters";

export default AnalyticsFilters;
