import React from "react";
import { Menu, Checkbox, Popover, Button } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";

const BaganiinSongolt = ({
  columns,
  shineBagana,
  setShineBagana,
  className,
}) => {
  React.useEffect(() => {
    const baganuud = localStorage.getItem("bagana-" + window.location.href);
    if (!!baganuud)
      setShineBagana(
        columns.filter((a) => {
          let parsedBaganuud = JSON.parse(baganuud);
          return parsedBaganuud.find((b) => b === a.dataIndex);
        })
      );
  }, []);

  function baganaNemekh(e, mur) {
    var jagsaalt = shineBagana;
    if (e.target.checked === true) {
      var nemekhBagana = {
        ellipsis: true,
        showSorterTooltip: false,
        sorter: () => 0,
        ...mur,
      };
      jagsaalt.push(nemekhBagana);
    } else
      jagsaalt = shineBagana.filter(function (item) {
        return item.dataIndex !== mur.dataIndex;
      });

    localStorage.setItem(
      "bagana-" + window.location.href,
      JSON.stringify(jagsaalt.map((a) => a.dataIndex))
    );
    setShineBagana([...jagsaalt]);
  }

  return (
    <div className={className}>
      <Popover
        content={() => (
          <div className="contents w-32 flex-col">
            <Menu className="contents self-center">
              {columns.map((mur, i) => (
                <Menu.Item key={"bagana-" + i}>
                  <Checkbox
                    checked={
                      !!shineBagana.find((a) => a.dataIndex === mur.dataIndex)
                    }
                    onClick={(e) => baganaNemekh(e, mur)}
                  >
                    <div className="dark:text-white">{mur.title}</div>
                  </Checkbox>
                </Menu.Item>
              ))}
            </Menu>
          </div>
        )}
        style={{ padding: 0 }}
        placement="bottom"
        trigger="click"
      >
        <Button className="w-40 h-10 flex justify-between items-center px-4 py-2 text-sm bg-white border rounded-lg">
          <UnorderedListOutlined className="text-sm" />
          <span>Багана</span>
        </Button>
      </Popover>
    </div>
  );
};
export default BaganiinSongolt;
