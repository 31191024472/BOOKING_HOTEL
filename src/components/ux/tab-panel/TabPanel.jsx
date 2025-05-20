import React from 'react';

/**
 * Component TabPanel
 * Component con của Tabs, hiển thị nội dung của một tab.
 *
 * @param {Object} props - Props của component.
 * @param {React.ReactNode} props.children - Nội dung của tab.
 * @returns {JSX.Element} Component TabPanel
 */
const TabPanel = ({ children }) => {
  return <div>{children}</div>;
};

export default TabPanel;
