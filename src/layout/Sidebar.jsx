"use client";

import React, { useEffect, useState } from "react";
import { Divider } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import "./Sidebar.css";
import { sidebarElements } from "../constants/Sidebar";
import { useNavigate, Link } from "react-router-dom";

const Sidebar = () => {
  const pathname = useNavigate();
  const [open, setOpen] = useState({});
  const [filteredSidebar, setFilteredSidebar] = useState([]);

  useEffect(() => {
    // const userPermissions =
    //   JSON.parse(localStorage.getItem("permissions")) || [];

    // const user = JSON.parse(localStorage.getItem("user"));

    let filtered = sidebarElements;

    setFilteredSidebar(filtered);

    const activeHeader = filtered.find((item) =>
      item.children?.some((child) => child.path === pathname)
    );

    setOpen(
      activeHeader
        ? {
            index: filtered.indexOf(activeHeader),
            header: activeHeader.text,
          }
        : {}
    );
  }, [pathname]);

  const handleClick = (item, index) => {
    setOpen((prev) =>
      prev?.header === item.text ? {} : { index, header: item.text }
    );
  };

  const renderSidebarItems = (elements) => {
    return (
      <div className="sidebarItemsContainer">
        {elements.map((item, index) => {
          const isChildSelected =
            item.children &&
            item.children.some((child) => pathname === child.path);

          return (
            <div key={`item-${index}`}>
              <a
                href={item.path || "#"}
                onClick={(e) => {
                  if (item.children) {
                    e.preventDefault();
                    handleClick(item, index);
                  }
                }}
                className={`sidebarItemLink ${
                  pathname === item.path || isChildSelected
                    ? "sidebarItemLinkActive"
                    : "sidebarItemLinkInactive"
                }`}
              >
                <span className="sidebarItemText">{item.text}</span>
                {item.children && (
                  <span className="expandIcon">
                    {open?.header === item.text ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </span>
                )}
              </a>
              {item.children && open?.header === item.text && (
                <div className="submenuContainer">
                  {item.children.map((child, childIndex) => (
                    <Link
                      key={`child-${childIndex}`}
                      href={child.path}
                      className={`submenuItemLink ${
                        pathname === child.path
                          ? "submenuItemLinkActive"
                          : "submenuItemLinkInactive"
                      }`}
                    >
                      <span className="submenuItemText">{child.text}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="sidebarContainer">
      <div>{/* <Image src={logo} alt="Nirantara Logo" priority /> */}</div>
      <Divider />
      {renderSidebarItems(filteredSidebar)}
    </div>
  );
};

export default Sidebar;
