import { Outlet } from 'react-router-dom';
import PartnerNavbar from './PartnerNavbar';
import PartnerSidebar from './PartnerSidebar';

const PartnerLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <PartnerSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <PartnerNavbar />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PartnerLayout; 